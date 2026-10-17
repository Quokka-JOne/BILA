import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const demoProfiles: Record<
  string,
  {
    userId: string
    email: string
    name: string
    role: 'coordinador' | 'rescatista' | 'persona'
    firstName: string
    lastName: string
    organization: string
    verificationStatus: 'approved' | 'not_required'
  }
> = {
  coordinador: {
    userId: 'demo-coordinador-01',
    email: 'coordinador@bila.org',
    name: 'Elena Morales',
    role: 'coordinador',
    firstName: 'Elena',
    lastName: 'Morales',
    organization: 'Centro de Operaciones de Emergencia BILA',
    verificationStatus: 'approved',
  },
  rescatista: {
    userId: 'demo-rescatista-01',
    email: 'rescatista@bila.org',
    name: 'Carlos Méndez',
    role: 'rescatista',
    firstName: 'Carlos',
    lastName: 'Méndez',
    organization: 'Cruz Roja Mexicana / Brigada BILA',
    verificationStatus: 'approved',
  },
  persona: {
    userId: 'demo-persona-01',
    email: 'persona@bila.org',
    name: 'Ana Gómez',
    role: 'persona',
    firstName: 'Ana',
    lastName: 'Gómez',
    organization: 'Comunidad Roma Norte',
    verificationStatus: 'not_required',
  },
}

function getBaseUrl(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host')

  if (host && !host.includes(':10000')) {
    const proto =
      request.headers.get('x-forwarded-proto') ||
      (host.includes('localhost') ? 'http' : 'https')
    return `${proto}://${host}`
  }

  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL
  }

  if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes(':10000')) {
    return process.env.BETTER_AUTH_URL
  }

  const origin = new URL(request.url).origin
  if (origin.includes(':10000')) {
    return 'https://bila-8lja.onrender.com'
  }

  return origin
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')
  const role = url.searchParams.get('role') ?? 'coordinador'

  if (action === 'logout') {
    const cookieStore = await cookies()
    cookieStore.delete('bila_session')
    const res = NextResponse.redirect(new URL('/', getBaseUrl(request)))
    res.cookies.delete('bila_session')
    return res
  }

  const profile = demoProfiles[role] ?? demoProfiles.coordinador

  const redirectUrl = new URL('/espacio', getBaseUrl(request))
  const response = NextResponse.redirect(redirectUrl)

  const cookieValue = JSON.stringify(profile)
  response.cookies.set('bila_session', cookieValue, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })

  // También sincronizar con el cookieStore
  try {
    const cookieStore = await cookies()
    cookieStore.set('bila_session', cookieValue, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch {
    // Si cookies() no está disponible en este contexto, continuar con response.cookies
  }

  return response
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.action === 'logout') {
      const cookieStore = await cookies()
      cookieStore.delete('bila_session')
      const res = NextResponse.json({ ok: true })
      res.cookies.delete('bila_session')
      return res
    }

    const sessionData = {
      userId: body.userId || `user-${Date.now()}`,
      email: body.email || 'usuario@bila.org',
      name: `${body.firstName || 'Usuario'} ${body.lastName || ''}`.trim(),
      role: body.role || 'coordinador',
      firstName: body.firstName || 'Usuario',
      lastName: body.lastName || '',
      organization: body.organization || (body.role === 'persona' ? null : 'Organización BILA'),
      verificationStatus:
        body.role === 'persona' ? 'not_required' : body.verificationStatus || 'approved',
    }

    const response = NextResponse.json({ ok: true, session: sessionData })
    const cookieValue = JSON.stringify(sessionData)

    response.cookies.set('bila_session', cookieValue, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })

    try {
      const cookieStore = await cookies()
      cookieStore.set('bila_session', cookieValue, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      })
    } catch {
      // Ignorar si cookieStore falla
    }

    return response
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 400 })
  }
}
