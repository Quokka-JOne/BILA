import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')
  const role = url.searchParams.get('role') ?? 'coordinador'
  const cookieStore = await cookies()

  if (action === 'logout') {
    cookieStore.delete('bila_session')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Perfiles predeterminados para modo demo
  const demoProfiles: Record<string, {
    userId: string
    email: string
    name: string
    role: 'coordinador' | 'rescatista' | 'persona'
    firstName: string
    lastName: string
    organization: string
    verificationStatus: 'approved' | 'not_required'
  }> = {
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

  const profile = demoProfiles[role] ?? demoProfiles.coordinador

  cookieStore.set('bila_session', JSON.stringify(profile), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  return NextResponse.redirect(new URL('/espacio', request.url))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()

    if (body.action === 'logout') {
      cookieStore.delete('bila_session')
      return NextResponse.json({ ok: true })
    }

    const sessionData = {
      userId: body.userId || `user-${Date.now()}`,
      email: body.email || 'usuario@bila.org',
      name: `${body.firstName || 'Usuario'} ${body.lastName || ''}`.trim(),
      role: body.role || 'persona',
      firstName: body.firstName || 'Usuario',
      lastName: body.lastName || '',
      organization: body.organization || (body.role === 'persona' ? null : 'Organización BILA'),
      verificationStatus: body.role === 'persona' ? 'not_required' : (body.verificationStatus || 'approved'),
    }

    cookieStore.set('bila_session', JSON.stringify(sessionData), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ ok: true, session: sessionData })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 400 })
  }
}
