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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/')
  return session.user
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { rows } = await pool.query(
    `SELECT role, first_name, last_name, organization, verification_status
       FROM profiles WHERE user_id = $1`,
    [userId],
  )
  const row = rows[0]
  if (!row) return null
  return {
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name,
    organization: row.organization,
    verificationStatus: row.verification_status,
  }
}

export async function getLinkedDevices(userId: string): Promise<string[]> {
  const { rows } = await pool.query(
    'SELECT code FROM devices WHERE user_id = $1 ORDER BY linked_at DESC',
    [userId],
  )
  return rows.map((row) => row.code as string)
}
