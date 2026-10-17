import { toNextJsHandler } from 'better-auth/next-js'
import { DEMO_MODE } from '@/lib/demo'

async function handle(request: Request) {
  if (DEMO_MODE) return Response.json({ error: 'demo_mode' }, { status: 404 })
  const { auth } = await import('@/lib/auth')
  const handlers = toNextJsHandler(auth)
  return request.method === 'GET' ? handlers.GET(request) : handlers.POST(request)
}

export { handle as GET, handle as POST }
