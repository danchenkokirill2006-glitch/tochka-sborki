import './ai-chat.css'
import { uiIcon } from './ui-icons'
import { getConsentChoice } from './consent'
type Message = { role: 'user' | 'assistant'; content: string }
const storageKey = 'tochka-ai-chat-v1'
const spark = uiIcon('sparkles')

export function mountAiChat() {
  if (document.querySelector('.ai-chat')) return
  let messages: Message[] = []
  try {
    if (getConsentChoice() === 'accepted') {
      const saved: unknown = JSON.parse(sessionStorage.getItem(storageKey) || '[]')
      if (Array.isArray(saved)) messages = saved.filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').slice(-30).map(m => ({ role: m.role, content: m.content.slice(0, 4000) }))
    }
  } catch { /* Chat works when browser storage is unavailable. */ }
  let busy = false, open = false, remaining: number | null = null, cooldownUntil = 0
  let controller: AbortController | undefined
  const root = document.createElement('div')
  root.className = 'ai-chat'
  root.innerHTML = `<section class="ai-chat-panel" id="ai-chat-panel" role="dialog" aria-label="ИИ-наставник" hidden>
    <header class="ai-chat-head"><span class="ai-chat-mark">${spark}</span><div><strong>ИИ-наставник</strong><span>Помощь с дизайном</span></div><button type="button" data-chat-clear title="Очистить переписку" aria-label="Очистить переписку">${uiIcon('refresh')}</button><button type="button" data-chat-close aria-label="Закрыть чат">${uiIcon('close')}</button></header>
    <div class="ai-chat-scroll"><div class="ai-chat-welcome"><span class="ai-chat-orbit">${spark}</span><h2>Соберём мысль<br>в хорошую идею.</h2><p>Разберём цвет, композицию или следующий шаг в задании.</p><div class="ai-chat-prompts"><button type="button">Как выбрать цвета для афиши?</button><button type="button">Как выделить главное в макете?</button><button type="button">С чего начать задание?</button></div></div><div class="ai-chat-messages" role="log" aria-label="Переписка" aria-live="polite" aria-relevant="additions"></div></div>
    <div class="ai-chat-status" role="status" aria-live="polite"></div>
    <form class="ai-chat-form"><label class="ai-chat-sr" for="ai-chat-input">Ваш вопрос о дизайне</label><div class="ai-chat-compose"><textarea id="ai-chat-input" rows="2" maxlength="800" placeholder="Спросите о дизайне…" aria-describedby="ai-chat-help"></textarea><button type="submit" aria-label="Отправить вопрос">${uiIcon('send')}</button></div><div class="ai-chat-meta"><span data-chat-quota>20 вопросов в день</span><span data-chat-count>0 / 800</span></div><p id="ai-chat-help">Для разбора макета нажмите «Проверить» в редакторе. Вопросы обрабатывает Cloudflare AI.</p></form>
  </section><button class="ai-chat-launcher" type="button" aria-label="Открыть чат с ИИ" aria-expanded="false" aria-controls="ai-chat-panel">${spark}<span>Спросить ИИ</span></button>`
  document.body.append(root)
  const panel = root.querySelector<HTMLElement>('.ai-chat-panel')!
  const launcher = root.querySelector<HTMLButtonElement>('.ai-chat-launcher')!
  const input = root.querySelector<HTMLTextAreaElement>('textarea')!
  const form = root.querySelector<HTMLFormElement>('form')!
  const send = form.querySelector<HTMLButtonElement>('button')!
  const clear = root.querySelector<HTMLButtonElement>('[data-chat-clear]')!
  const log = root.querySelector<HTMLElement>('.ai-chat-messages')!
  const scroll = root.querySelector<HTMLElement>('.ai-chat-scroll')!
  const welcome = root.querySelector<HTMLElement>('.ai-chat-welcome')!
  const status = root.querySelector<HTMLElement>('.ai-chat-status')!
  const quota = root.querySelector<HTMLElement>('[data-chat-quota]')!
  const count = root.querySelector<HTMLElement>('[data-chat-count]')!
  function save() { if (getConsentChoice() !== 'accepted') return; try { sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-30))) } catch { /* Optional persistence. */ } }
  function update() {
    send.disabled = !busy && (!input.value.trim() || remaining === 0 || Date.now() < cooldownUntil)
    send.setAttribute('aria-label', busy ? 'Остановить ответ' : 'Отправить вопрос')
    send.innerHTML = busy ? uiIcon('stop') : uiIcon('send')
    clear.disabled = busy || !messages.length
    count.textContent = `${input.value.length} / 800`
    const seconds = Math.ceil((cooldownUntil - Date.now()) / 1000)
    quota.textContent = seconds > 0 ? `Следующий вопрос через ${seconds} с` : remaining === null ? '20 вопросов в день' : `Сегодня осталось: ${remaining} из 20`
  }
  function addMessage(message: Message) {
    const bubble = document.createElement('div')
    bubble.className = `ai-chat-message is-${message.role}`
    const label = document.createElement('span'); label.className = 'ai-chat-author'; label.textContent = message.role === 'user' ? 'Вы' : 'ИИ-наставник'
    const text = document.createElement('div')
    // Render limited emphasis with DOM nodes: model output never enters innerHTML.
    message.content.split(/(\*\*[^*]+\*\*)/g).forEach(part => {
      if (part.startsWith('**') && part.endsWith('**')) { const bold = document.createElement('strong'); bold.textContent = part.slice(2, -2); text.append(bold) }
      else text.append(document.createTextNode(part))
    })
    bubble.append(label, text); log.append(bubble)
    return bubble
  }
  function renderMessages() { log.replaceChildren(); messages.forEach(addMessage); welcome.hidden = messages.length > 0; update() }
  async function refreshQuota() {
    try {
      const response = await fetch('/api/chat', { signal: AbortSignal.timeout(8000), cache: 'no-store' })
      const data = await response.json()
      if (response.ok && typeof data.remaining?.chat === 'number') { remaining = data.remaining.chat; update() }
    } catch { /* A send attempt gives an actionable error. */ }
  }
  function setOpen(value: boolean) {
    open = value; panel.hidden = !open; launcher.setAttribute('aria-expanded', String(open)); root.classList.toggle('is-open', open)
    launcher.setAttribute('aria-label', open ? 'Свернуть чат с ИИ' : 'Открыть чат с ИИ')
    if (open) { input.focus({ preventScroll: true }); scroll.scrollTop = scroll.scrollHeight; void refreshQuota() }
    else launcher.focus({ preventScroll: true })
  }
  launcher.addEventListener('click', () => setOpen(!open))
  document.addEventListener('click', event => { if ((event.target as HTMLElement).closest('[data-open-ai-chat]')) setOpen(true) })
  root.querySelector('[data-chat-close]')!.addEventListener('click', () => setOpen(false))
  clear.addEventListener('click', () => { if (busy) return; messages = []; save(); status.textContent = ''; renderMessages(); input.focus() })
  root.addEventListener('keydown', event => {
    // Keep editor shortcuts from moving/deleting objects while chatting.
    event.stopPropagation()
    if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false) }
  })
  root.addEventListener('keyup', event => event.stopPropagation())
  input.addEventListener('input', update)
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); if (!busy && !send.disabled) form.requestSubmit() }
  })
  root.querySelectorAll<HTMLButtonElement>('.ai-chat-prompts button').forEach(button => button.addEventListener('click', () => { input.value = button.textContent || ''; update(); input.focus() }))
  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (busy) { controller?.abort(); return }
    const question = input.value.trim()
    if (!question || question.length > 800 || send.disabled) return
    busy = true; status.textContent = 'Думаю над вашим вопросом…'; status.classList.remove('is-error')
    welcome.hidden = true
    const userBubble = addMessage({ role: 'user', content: question })
    input.value = ''; controller = new AbortController(); const timeout = window.setTimeout(() => controller?.abort('timeout'), 50_000)
    cooldownUntil = Date.now() + 15_000; update(); scroll.scrollTop = scroll.scrollHeight
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: question, history: messages.slice(-6) }), signal: controller.signal })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || typeof data.answer !== 'string' || !data.answer.trim()) {
        if (data.error === 'rate_limited') cooldownUntil = Date.now() + Math.min(60, data.retryAfter || 15) * 1000
        if (data.error === 'daily_limit') remaining = 0
        const errors: Record<string, string> = {
          daily_limit: `Сегодня вопросы закончились. Лимит обновится в ${new Date(new Date().setUTCHours(24, 0, 0, 0)).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })} по вашему времени.`,
          rate_limited: 'Небольшая пауза между вопросами. Ваш текст сохранён.',
          provider_limit: 'Общий лимит ИИ пока исчерпан. Продолжайте задания — их проверка работает без ИИ.',
          daily_provider_limit: 'Бесплатный лимит Cloudflare на сегодня исчерпан. ИИ снова заработает после обновления квоты в 07:00 по Барнаулу.',
          provider_busy: 'Сервис ИИ сейчас занят. Попробуйте позже.',
          ai_not_configured: 'ИИ пока не подключён на этом адресе сайта.',
          incomplete_answer: 'Ответ не успел завершиться. Попробуйте задать более короткий вопрос.',
        }
        throw new Error(errors[data.error] || 'Не удалось получить ответ. Вопрос сохранён — попробуйте позже.')
      }
      messages.push({ role: 'user', content: question }, { role: 'assistant', content: data.answer })
      messages = messages.slice(-30); addMessage({ role: 'assistant', content: data.answer }); save()
      remaining = typeof data.remaining === 'number' ? data.remaining : remaining
      status.textContent = ''; scroll.scrollTop = scroll.scrollHeight
    } catch (error) {
      userBubble.remove(); welcome.hidden = messages.length > 0
      if (!input.value) input.value = question
      status.classList.add('is-error')
      status.textContent = controller.signal.aborted ? 'Ответ остановлен. Вопрос сохранён; уже отправленный запрос может учитываться в лимите.' : error instanceof Error ? error.message : 'Нет соединения. Попробуйте позже.'
    } finally {
      window.clearTimeout(timeout); busy = false; controller = undefined; update(); void refreshQuota()
    }
  })
  window.setInterval(() => { if (open) update() }, 1000)
  renderMessages()
}
