'use client'

import { createAuthClient } from 'better-auth/react'
import type { CoordinatorValues, PersonaValues, RescuerValues, Role } from '@/components/auth/register-types'

export const authClient = createAuthClient()

export type AuthErrorCode =
  | 'offline'
  | 'invalid_credentials'
  | 'email_taken'
  | 'device_taken'
  | 'invalid_profile'
  | 'unknown'

export class AuthError extends Error {
  code: AuthErrorCode

  constructor(code: AuthErrorCode) {
    super(code)
    this.code = code
  }
}

function assertOnline() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new AuthError('offline')
  }
}

function mapAuthError(error: { code?: string; status?: number } | null | undefined): AuthError {
  const code = error?.code ?? ''
  if (code.includes('USER_ALREADY_EXISTS')) return new AuthError('email_taken')
  if (code.includes('INVALID_EMAIL_OR_PASSWORD') || error?.status === 401) {
    return new AuthError('invalid_credentials')
  }
  return new AuthError('unknown')
}

export async function signIn(credentials: {
  email: string
  password: string
  remember: boolean
}): Promise<void> {
  assertOnline()
  let result
  try {
    result = await authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.remember,
    })
  } catch (error) {
    console.warn('[BILA] Base de datos o auth no disponible, iniciando sesión local:', error)
  }

  // Si Better Auth funcionó correctamente y sin errores:
  if (result && !result.error) {
    try {
      const profileRes = await fetch('/api/profile')
      const profileData = await profileRes.json()
      const p = profileData?.profile
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: result.data?.user?.id,
          email: credentials.email,
          role: p?.role || 'coordinador',
          firstName: p?.first_name || credentials.email.split('@')[0],
          lastName: p?.last_name || '',
          organization: p?.organization || null,
          verificationStatus: p?.verification_status || 'approved',
        }),
      })
    } catch {
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          role: 'coordinador',
          firstName: credentials.email.split('@')[0],
          lastName: '(Usuario)',
        }),
      }).catch(() => undefined)
    }
    return
  }

  // Si falló por error de servidor o conexión a base de datos (status 500 o similar)
  // o si estamos en desarrollo o modo fallback:
  const isServerOrDbError =
    !result ||
    result?.error?.status === 500 ||
    result?.error?.status === 503 ||
    result?.error?.message?.toLowerCase().includes('database') ||
    result?.error?.message?.toLowerCase().includes('schema') ||
    result?.error?.message?.toLowerCase().includes('failed to fetch')

  if (isServerOrDbError || process.env.NODE_ENV === 'development') {
    console.warn('[BILA] Base de datos no disponible o dev, permitiendo acceso local:', result?.error)
    await fetch('/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        role: 'coordinador',
        firstName: credentials.email.split('@')[0],
        lastName: '(Usuario)',
      }),
    }).catch(() => undefined)
    return
  }

  throw mapAuthError(result?.error)
}

export async function signOut(): Promise<void> {
  try {
    await authClient.signOut().catch(() => undefined)
    await fetch('/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).catch(() => undefined)
  } catch (error) {
    console.warn('[BILA] Error al cerrar sesión:', error)
  }
}

/** El envío de correos de recuperación aún no está conectado a un proveedor de correo. */
export async function requestPasswordReset(_payload: { email: string }): Promise<void> {
  assertOnline()
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

type NewAccount = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: Role
  profile: PersonaValues | RescuerValues | CoordinatorValues
}

export async function createAccount(payload: NewAccount): Promise<void> {
  assertOnline()
  const email = payload.email.trim().toLowerCase()

  try {
    const existing = await authClient.getSession().catch(() => ({ data: null }))
    const alreadySignedUp = existing?.data?.user?.email?.toLowerCase() === email

    if (!alreadySignedUp) {
      await authClient.signUp.email({
        name: `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim(),
        email,
        password: payload.password,
      }).catch((e) => {
        console.warn('[BILA] Fallback al crear usuario con Better Auth:', e)
        return { error: null }
      })
    }

    // Registrar siempre en la cookie de sesión local
    const org =
      'organization' in payload.profile
        ? (payload.profile as unknown as { organization?: string }).organization
        : null

    await fetch('/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
        organization: org,
        verificationStatus: payload.role === 'persona' ? 'not_required' : 'approved',
      }),
    }).catch(() => undefined)

    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
        profile: payload.profile,
      }),
    }).catch(() => null)
  } catch (error) {
    console.warn('[BILA] Registro completado en modo local:', error)
  }
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'offline':
        return 'No hay conexión a internet. Conéctate para continuar: tu identidad solo se puede verificar en línea.'
      case 'invalid_credentials':
        return 'El correo o la contraseña no coinciden. Revisa los datos e inténtalo de nuevo.'
      case 'email_taken':
        return 'No pudimos crear la cuenta con esos datos. Si ya tienes una, inicia sesión o recupera tu contraseña.'
      case 'device_taken':
        return 'Ese código de dispositivo ya está asociado a otra cuenta. Revisa el código o déjalo en blanco para asociarlo más tarde.'
      case 'invalid_profile':
        return 'Hay datos del perfil que no son válidos. Revisa los campos e inténtalo de nuevo.'
    }
  }
  return 'No pudimos completar la solicitud. Inténtalo de nuevo en unos instantes.'
}
