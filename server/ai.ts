import { createHmac, timingSafeEqual } from 'node:crypto'
export type ApiRequest = { method?: string; body?: unknown; headers: Record<string, string | string[] | undefined> }
export type ApiResponse = { status(code: number): ApiResponse; json(body: unknown): void; setHeader(name: string, value: string): void }
export type Mode = 'chat' | 'review'
export const limits = { chat: 20, review: 8, messageLength: 800, intervalSeconds: 15 }
const env = process.env
const cookieName = '__Host-ts-ai'
type Usage = { day: string; chat: number; review: number; last: number; busy?: boolean }
const visitors = new Map<string, Usage>()
const cache = new Map<string, { expires: number; answer: string }>()
export class AiError extends Error {
  constructor(public code: string, public status = 503, public retryAfter = 30) { super(code) }
}
const header = (req: ApiRequest, name: string) => { const v = req.headers[name]; return Array.isArray(v) ? v[0] : v ?? '' }
const day = () => new Date().toISOString().slice(0, 10)
const reset = () => new Date().setUTCHours(24, 0, 0, 0)
export const configured = () => Boolean(env.CLOUDFLARE_API_TOKEN && /^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID ?? ''))
export function fingerprint(text: string) { return createHmac('sha256', env.CLOUDFLARE_API_TOKEN ?? '').update('tochka-v1:' + text).digest('base64url') }
function readUsage(req: ApiRequest): Usage {
  const empty = { day: day(), chat: 0, review: 0, last: 0 }
  const cookie = header(req, 'cookie').split(';').map(v => v.trim()).find(v => v.startsWith(cookieName + '='))?.slice(cookieName.length + 1)
  if (!cookie || cookie.length > 700) return empty
  try {
    const [data, sig] = cookie.split('.'), expected = fingerprint(data)
    if (!sig || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return empty
    const value = JSON.parse(Buffer.from(data, 'base64url').toString()) as Usage
    if (value.day !== day() || ![value.chat, value.review, value.last].every(n => Number.isSafeInteger(n) && n >= 0)) return empty
    return value
  } catch { return empty }
}
export function remaining(req: ApiRequest) {
  const usage = readUsage(req)
  const ip = header(req, 'x-vercel-forwarded-for') || header(req, 'x-forwarded-for').split(',')[0] || 'unknown'
  const previous = visitors.get(ip)
  if (previous?.day === day()) { usage.chat = Math.max(usage.chat, previous.chat); usage.review = Math.max(usage.review, previous.review) }
  return { chat: Math.max(0, limits.chat - usage.chat), review: Math.max(0, limits.review - usage.review), resetsAt: new Date(reset()).toISOString() }
}
export function guard(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (!configured()) throw new AiError('ai_not_configured')
  if (header(req, 'sec-fetch-site') === 'cross-site') throw new AiError('forbidden', 403)
  const origin = header(req, 'origin')
  if (origin) {
    try { if (new URL(origin).host !== header(req, 'host')) throw new Error() } catch { throw new AiError('forbidden', 403) }
  }
}
export function reserve(req: ApiRequest, res: ApiResponse, mode: Mode) {
  const now = Date.now()
  const ip = header(req, 'x-vercel-forwarded-for') || header(req, 'x-forwarded-for').split(',')[0] || 'unknown'
  for (const [key, value] of visitors) if (value.day !== day()) visitors.delete(key)
  const usage = readUsage(req), previous = visitors.get(ip)
  if (previous) {
    usage.chat = Math.max(usage.chat, previous.chat); usage.review = Math.max(usage.review, previous.review)
    usage.last = Math.max(usage.last, previous.last); usage.busy = previous.busy
  }
  if (usage[mode] >= limits[mode]) throw new AiError('daily_limit', 429, Math.ceil((reset() - now) / 1000))
  if (usage.busy || now - usage.last < 15000) throw new AiError('rate_limited', 429, Math.max(1, Math.ceil((usage.last + 15000 - now) / 1000)))
  if (!previous && visitors.size >= 3000) throw new AiError('busy')
  usage[mode]++; usage.last = now; usage.busy = true; visitors.set(ip, usage)
  const data = Buffer.from(JSON.stringify({ day: usage.day, chat: usage.chat, review: usage.review, last: now })).toString('base64url')
  res.setHeader('Set-Cookie', cookieName + '=' + data + '.' + fingerprint(data) + '; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400')
  return { remaining: limits[mode] - usage[mode], release: () => { usage.busy = false } }
}
export function failure(res: ApiResponse, error: unknown) {
  const safe = error instanceof AiError ? error : new AiError('ai_unavailable')
  if (!(error instanceof AiError)) console.error('[ai] request failed', { name: error instanceof Error ? error.name : 'unknown' })
  res.setHeader('Retry-After', String(safe.retryAfter))
  return res.status(safe.status).json({ error: safe.code, retryAfter: safe.retryAfter, configured: safe.code !== 'ai_not_configured' })
}
export function cached(key: string) {
  const entry = cache.get(key)
  if (entry && entry.expires > Date.now()) return entry.answer
  cache.delete(key); return null
}
export function remember(key: string, answer: string) {
  if (cache.size >= 30) cache.delete(cache.keys().next().value!)
  cache.set(key, { expires: Date.now() + 3600_000, answer })
}
export async function generate(messages: unknown[], maxTokens: number, json = false) {
  const response = await fetch('https://api.cloudflare.com/client/v4/accounts/' + env.CLOUDFLARE_ACCOUNT_ID + '/ai/run/@cf/google/gemma-4-26b-a4b-it', {
    method: 'POST', headers: { Authorization: 'Bearer ' + env.CLOUDFLARE_API_TOKEN, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(45_000),
    body: JSON.stringify({ messages, max_tokens: maxTokens, temperature: 0.3, chat_template_kwargs: { enable_thinking: false }, ...(json ? { response_format: { type: 'json_object' } } : {}) }),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.success === false) {
    const codes = payload?.errors?.map((e: { code?: number }) => e.code) ?? []
    console.error('[ai] provider error', { status: response.status, codes })
    if (response.status === 429 && codes.includes(3036)) throw new AiError('daily_provider_limit', 429, 3600)
    if (response.status === 429 && codes.includes(3040)) throw new AiError('provider_busy', 429, 30)
    if (response.status === 429) throw new AiError('provider_limit', 429, 3600)
    throw new AiError('ai_unavailable')
  }
  const choice = payload?.result?.choices?.[0], answer = choice?.message?.content
  if (typeof answer !== 'string' || !answer.trim()) throw new AiError('empty_answer', 502)
  if (choice.finish_reason === 'length') throw new AiError('incomplete_answer', 502)
  return answer.trim()
}
