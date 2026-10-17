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
    if (process.env.NODE_ENV === 'development') {
      console.warn('[BILA Dev] Base de datos no disponible, iniciando sesión en modo demo:', error)
      return
    }
    throw new AuthError(navigator.onLine ? 'unknown' : 'offline')
  }
  if (result?.error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[BILA Dev] Error dev en auth, permitiendo acceso:', result.error)
      return
    }
    throw mapAuthError(result.error)
  }
}

export async function signOut(): Promise<void> {
  try {
    await authClient.signOut()
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
      const result = await authClient.signUp.email({
        name: `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim(),
        email,
        password: payload.password,
      }).catch((e) => {
        if (process.env.NODE_ENV === 'development') {
          return { error: null }
        }
        throw e
      })
      if (result?.error && process.env.NODE_ENV !== 'development') {
        throw mapAuthError(result.error)
      }
    }

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName,
        profile: payload.profile,
      }),
    }).catch(() => null)

    if (response && !response.ok) {
      if (process.env.NODE_ENV === 'development') return
      const body = (await response.json().catch(() => ({}))) as { error?: string }
      if (body.error === 'device_taken') throw new AuthError('device_taken')
      if (body.error === 'invalid_profile') throw new AuthError('invalid_profile')
      throw new AuthError('unknown')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[BILA Dev] Registro completado en modo demo local:', error)
      return
    }
    if (error instanceof AuthError) throw error
    throw new AuthError(navigator.onLine ? 'unknown' : 'offline')
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
