import { defineConfig, loadEnv, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import chat from './api/chat.ts'
import review from './api/review.ts'
import type { ApiResponse } from './server/ai.ts'

// Local API uses the same handlers as Vercel. No secret is exposed through VITE_*.
function localAi(): Plugin {
  const middleware = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = req.url?.split('?')[0]
    if (path !== '/api/chat' && path !== '/api/review') return next()
    let raw = ''
    try {
      for await (const chunk of req) {
        raw += chunk.toString()
        if (Buffer.byteLength(raw) > (path === '/api/chat' ? 40_960 : 4_194_304)) { res.statusCode = 413; res.end('{"error":"request_too_large"}'); return }
      }
      const response: ApiResponse = {
        status(code) { res.statusCode = code; return response },
        setHeader(name, value) { res.setHeader(name, value) },
        json(body) { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(body)) },
      }
      await (path === '/api/chat' ? chat : review)({ method: req.method, headers: req.headers, body: raw ? JSON.parse(raw) : undefined }, response)
    } catch { res.statusCode = 400; res.end('{"error":"invalid_request"}') }
  }
  return { name: 'local-ai', configureServer(server) { server.middlewares.use(middleware) }, configurePreviewServer(server) { server.middlewares.use(middleware) } }
}
export default defineConfig(({ mode }) => {
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), 'CLOUDFLARE_'))) {
    if (!process.env[key]) process.env[key] = value
  }
  return { plugins: [localAi()] }
})
