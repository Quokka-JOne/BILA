import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'

type Body = {
  role?: unknown
  firstName?: unknown
  lastName?: unknown
  profile?: Record<string, unknown>
}

const text = (value: unknown, max = 200) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return bad('unauthorized', 401)

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return bad('invalid_profile')
  }

  const role = body.role
  if (role !== 'persona' && role !== 'rescatista' && role !== 'coordinador') {
    return bad('invalid_profile')
  }

  const firstName = text(body.firstName, 80)
  const lastName = text(body.lastName, 120)
  const profile = body.profile ?? {}
  if (!firstName || !lastName) return bad('invalid_profile')

  const userId = session.user.id
  let client
  try {
    client = await pool.connect()
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[BILA Dev] DB desconectada en /api/profile, simulando guardado exitoso:', err)
      return NextResponse.json({ ok: true, devMode: true })
    }
    return bad('unknown', 500)
  }

  try {
    await client.query('BEGIN')

    const existing = await client.query('SELECT 1 FROM profiles WHERE user_id = $1', [userId])
    if (existing.rowCount) {
      await client.query('ROLLBACK')
      return NextResponse.json({ ok: true })
    }

    if (role === 'persona') {
      const emergencyName = text(profile.emergencyName)
      const emergencyPhone = text(profile.emergencyPhone, 40)
      if (!emergencyName || !emergencyPhone) {
        await client.query('ROLLBACK')
        return bad('invalid_profile')
      }

      await client.query(
        `INSERT INTO profiles (user_id, role, first_name, last_name, verification_status)
         VALUES ($1, 'persona', $2, $3, 'not_required')`,
        [userId, firstName, lastName],
      )

      const birthDate = text(profile.birthDate, 10)
      await client.query(
        `INSERT INTO persona_details
           (user_id, birth_date, phone, emergency_name, emergency_relation, emergency_phone,
            medical_notes, share_medical, share_location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          userId,
          /^\d{4}-\d{2}-\d{2}$/.test(birthDate) ? birthDate : null,
          text(profile.phone, 40) || null,
          emergencyName,
          text(profile.emergencyRelation, 80),
          emergencyPhone,
          text(profile.medicalNotes, 1000) || null,
          profile.shareMedical === true,
          profile.shareLocation === true,
        ],
      )

      const deviceCode = text(profile.deviceCode, 40).toUpperCase()
      if (deviceCode) {
        await client.query('INSERT INTO devices (code, user_id) VALUES ($1, $2)', [deviceCode, userId])
      }
    } else {
      const organization = text(profile.organization)
      if (!organization || profile.consent !== true) {
        await client.query('ROLLBACK')
        return bad('invalid_profile')
      }

      const isRescuer = role === 'rescatista'
      await client.query(
        `INSERT INTO profiles
           (user_id, role, first_name, last_name, organization, position_title, professional_id, verification_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
        [
          userId,
          role,
          firstName,
          lastName,
          organization,
          isRescuer ? null : text(profile.position) || null,
          isRescuer ? text(profile.professionalId, 80) || null : null,
        ],
      )

      await client.query(
        `INSERT INTO verification_requests (user_id, role, organization, reference)
         VALUES ($1, $2, $3, $4)`,
        [userId, role, organization, text(isRescuer ? profile.verifier : profile.approver) || null],
      )
    }

    await client.query('COMMIT')
    return NextResponse.json({ ok: true })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    if ((error as { code?: string }).code === '23505') return bad('device_taken', 409)
    console.error('[bila] profile save failed', error)
    return bad('unknown', 500)
  } finally {
    client.release()
  }
}
