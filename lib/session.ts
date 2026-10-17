import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import type { Role } from '@/components/auth/register-types'

export type VerificationStatus = 'not_required' | 'pending' | 'approved' | 'rejected'

export type Profile = {
  role: Role
  firstName: string
  lastName: string
  organization: string | null
  verificationStatus: VerificationStatus
}

export async function requireUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user) return session.user
  } catch (error) {
    console.warn('[BILA] Error verificando sesión en auth:', error)
  }

  // En modo desarrollo, si no hay sesión activa o DB no responde, retornar usuario de demo
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'demo-coordinador-01',
      email: 'coordinador@bila.org',
      name: 'Elena Morales',
    }
  }

  redirect('/')
}

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { rows } = await pool.query(
      `SELECT role, first_name, last_name, organization, verification_status
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
      }
    }
  } catch (error) {
    console.warn('[BILA] Base de datos no disponible, usando perfil de respaldo en dev:', error)
  }

  if (process.env.NODE_ENV === 'development') {
    return {
      role: 'coordinador',
      firstName: 'Elena',
      lastName: 'Morales',
      organization: 'Centro de Operaciones de Emergencia BILA',
      verificationStatus: 'approved',
    }
  }

  return null
}

export async function getLinkedDevices(userId: string): Promise<string[]> {
  try {
    const { rows } = await pool.query(
      'SELECT code FROM devices WHERE user_id = $1 ORDER BY linked_at DESC',
      [userId],
    )
    return rows.map((row) => row.code as string)
  } catch (error) {
    console.warn('[BILA] Base de datos no disponible para dispositivos en dev:', error)
    return ['BILA-7842', 'BILA-9011']
  }
}
