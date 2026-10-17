import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { DEMO_MODE } from '@/lib/demo'
import { DEMO_COOKIE, encodeDemoSession, getDemoSession, type DemoSession } from '@/lib/demo-session'
import { passwordMeetsRules, validateEmail, validatePhone, validateEmailOrPhone } from '@/lib/validation'

const text = (value: unknown, max = 120) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const invalid = () => NextResponse.json({ error: 'invalid_profile' }, { status: 400 })

// Render termina HTTPS en su proxy; request.url puede usar el puerto interno.
function publicOrigin(request: Request) {
  return new URL(process.env.RENDER_EXTERNAL_URL ?? process.env.BETTER_AUTH_URL ?? request.url).origin
}

export async function POST(request: Request) {
  if (!DEMO_MODE) return new NextResponse(null, { status: 404 })
  if (request.headers.get('origin') !== publicOrigin(request)) {
    return new NextResponse(null, { status: 403 })
  }
  let body
  try { body = await request.json() } catch { return invalid() }
  if (!body || typeof body !== 'object') return invalid()
  const email = text(body.email, 254).toLowerCase()
  if (validateEmail(email) || typeof body.password !== 'string' || !passwordMeetsRules(body.password)) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 400 })
  }
  if (body.action !== 'register' && body.action !== 'login') return invalid()
  const previous = await getDemoSession()
  const profile = body.profile && typeof body.profile === 'object' ? body.profile : {}
  const registering = body.action === 'register'
  if (registering) {
    if (!text(body.firstName) || !text(body.lastName)) return invalid()
    if (!['persona', 'rescatista', 'coordinador'].includes(body.role)) return invalid()
    if (body.role === 'persona') {
      if (!text(profile.birthDate) || validatePhone(text(profile.phone)) || !text(profile.emergencyName) ||
          !text(profile.emergencyRelation) || validatePhone(text(profile.emergencyPhone)) ||
          !['', 'pulsera', 'anillo'].includes(profile.deviceType ?? '')) return invalid()
    } else if (!text(profile.organization) || profile.consent !== true ||
      validateEmailOrPhone(text(body.role === 'rescatista' ? profile.verifier : profile.approver), 'required') ||
      (body.role === 'coordinador' && !text(profile.position))) return invalid()
  }
  const matching = previous?.email === email ? previous : null
  const session: DemoSession = {
    id: matching?.id ?? `demo-${randomUUID()}`,
    email,
    firstName: registering ? text(body.firstName, 80) : matching?.firstName ?? email.split('@')[0],
    lastName: registering ? text(body.lastName) : matching?.lastName ?? '',
    role: registering ? body.role : matching?.role ?? 'persona',
    organization: registering ? text(profile.organization) || null : matching?.organization ?? null,
    deviceType: registering ? (body.role === 'persona' ? profile.deviceType ?? '' : '') : matching?.deviceType ?? '',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }
  const response = NextResponse.json({ ok: true, demo: true })
  response.cookies.set(DEMO_COOKIE, encodeDemoSession(session), {
    httpOnly: true, sameSite: 'lax', secure: publicOrigin(request).startsWith('https://'), path: '/',
    ...(registering || body.remember === true ? { maxAge: 7 * 24 * 60 * 60 } : {}),
  })
  return response
}

export async function DELETE(request: Request) {
  if (!DEMO_MODE) return new NextResponse(null, { status: 404 })
  if (request.headers.get('origin') !== publicOrigin(request)) return new NextResponse(null, { status: 403 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(DEMO_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax' })
  return response
}
