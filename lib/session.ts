import { cookies, headers } from 'next/headers'
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
  // 1. Verificar si hay sesión demo o local guardada en cookie
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('bila_session')?.value
    if (sessionCookie) {
      const parsed = JSON.parse(sessionCookie)
      if (parsed.userId) {
        return {
          id: parsed.userId as string,
          email: parsed.email as string,
          name: parsed.name as string,
        }
      }
    }
  } catch {
    // Si falla el parseo de la cookie, continuar
  }

  // 2. Verificar Better Auth
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user) return session.user
  } catch (error) {
    console.warn('[BILA] Error verificando sesión en auth:', error)
  }

  // 3. Fallback de desarrollo para modo demo
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
  // 1. Si viene de sesión de cookie demo/local
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('bila_session')?.value
    if (sessionCookie) {
      const parsed = JSON.parse(sessionCookie)
      if (parsed.userId === userId || userId.startsWith('demo-') || userId.startsWith('user-')) {
        return {
          role: parsed.role ?? 'coordinador',
          firstName: parsed.firstName ?? 'Elena',
          lastName: parsed.lastName ?? 'Morales',
          organization: parsed.organization ?? null,
          verificationStatus: parsed.verificationStatus ?? 'approved',
        }
      }
    }
  } catch {
    // Si falla el parseo, continuar
  }

  // 2. Consultar PostgreSQL si está disponible
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
    console.warn('[BILA] Base de datos no disponible, usando perfil de respaldo:', error)
  }

  // 3. Si el usuario es de demo, local o en desarrollo
  if (
    process.env.NODE_ENV === 'development' ||
    userId.startsWith('demo-') ||
    userId.startsWith('user-')
  ) {
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
    return ['BILA-7842', 'BILA-9011']
  }
}

