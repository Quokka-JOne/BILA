import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import type { Role } from '@/components/auth/register-types'
import { DEMO_MODE } from './demo'

export const DEMO_COOKIE = 'bila-demo-session'
export type DemoSession = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  organization: string | null
  deviceType: 'pulsera' | 'anillo' | ''
  expires: number
}

function signature(value: string) {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('Configura BETTER_AUTH_SECRET para firmar la sesión de demostración.')
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function encodeDemoSession(session: DemoSession) {
  const value = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${value}.${signature(value)}`
}

export async function getDemoSession(): Promise<DemoSession | null> {
  if (!DEMO_MODE) return null
  const token = (await cookies()).get(DEMO_COOKIE)?.value
  if (!token) return null
  try {
    const [value, signed, extra] = token.split('.')
    if (!value || !signed || extra) return null
    const expected = Buffer.from(signature(value))
    const actual = Buffer.from(signed)
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
    const session = JSON.parse(Buffer.from(value, 'base64url').toString()) as DemoSession
    if (session.expires < Date.now()) return null
    return session
  } catch {
    return null
  }
}
