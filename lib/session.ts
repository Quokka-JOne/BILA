import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Role } from '@/components/auth/register-types'
import { DEMO_MODE } from '@/lib/demo'
import { getDemoSession } from '@/lib/demo-session'

export type VerificationStatus = 'not_required' | 'pending' | 'approved' | 'rejected'

export type Profile = {
  role: Role
  firstName: string
  lastName: string
  organization: string | null
  verificationStatus: VerificationStatus
  deviceType?: 'pulsera' | 'anillo' | ''
}

export async function requireUser() {
  if (DEMO_MODE) {
    const session = await getDemoSession()
    if (!session) redirect('/')
    return { id: session.id, email: session.email, name: `${session.firstName} ${session.lastName}`.trim() }
  }
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user) return session.user
  } catch (error) {
    console.warn('[BILA] Error verificando sesión en auth:', error)
  }

  redirect('/')
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (DEMO_MODE) {
    const session = await getDemoSession()
    if (!session || session.id !== userId) return null
    return {
      role: session.role, firstName: session.firstName, lastName: session.lastName,
      organization: session.organization, deviceType: session.deviceType,
      verificationStatus: session.role === 'persona' ? 'not_required' : 'pending',
    }
  }
  try {
    const { pool } = await import('@/lib/db')
    const { rows } = await pool.query(
      `SELECT role, first_name, last_name, organization, verification_status, device_type
         FROM profiles WHERE user_id = $1`,
      [userId],
    )
    const row = rows[0]
    if (row) {
      return {
        role: row.role,
        firstName: row.first_name,
        lastName: row.last_name,
        organization: row.organization,
        verificationStatus: row.verification_status,
        deviceType: row.device_type,
      }
    }
  } catch (error) {
    console.warn('[BILA] No se pudo consultar el perfil:', error)
  }

  return null
}

export async function getLinkedDevices(userId: string): Promise<string[]> {
  if (DEMO_MODE) return []
  try {
    const { pool } = await import('@/lib/db')
    const { rows } = await pool.query(
      'SELECT code FROM devices WHERE user_id = $1 ORDER BY linked_at DESC',
      [userId],
    )
    return rows.map((row) => row.code as string)
  } catch (error) {
    console.warn('[BILA] No se pudieron consultar los dispositivos:', error)
    return []
  }
}
