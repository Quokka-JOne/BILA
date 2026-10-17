const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(value: string): string | undefined {
  const email = value.trim()
  if (!email) return 'Escribe tu correo electrónico.'
  if (!EMAIL_PATTERN.test(email)) {
    return 'Revisa el formato del correo, por ejemplo nombre@dominio.com.'
  }
}

export function validateRequired(value: string, message: string): string | undefined {
  if (!value.trim()) return message
}

export function validatePhone(value: string, message = 'Escribe un teléfono.'): string | undefined {
  if (!value.trim()) return message
  const digits = value.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15 || !/^[+\d\s().-]+$/.test(value)) {
    return 'Revisa el teléfono. Incluye el código de país, por ejemplo +52 55 1234 5678.'
  }
}

export function validateEmailOrPhone(value: string, message: string): string | undefined {
  if (!value.trim()) return message
  const looksLikeEmail = value.includes('@')
  const error = looksLikeEmail ? validateEmail(value) : validatePhone(value)
  if (error) return 'Escribe un correo o un teléfono válido, con código de país si es teléfono.'
}

export const passwordRules = [
  { id: 'length', label: 'Al menos 10 caracteres', test: (value: string) => value.length >= 10 },
  {
    id: 'case',
    label: 'Una mayúscula y una minúscula',
    test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value),
  },
  { id: 'number', label: 'Al menos un número', test: (value: string) => /\d/.test(value) },
] as const

export function passwordMeetsRules(value: string): boolean {
  return passwordRules.every((rule) => rule.test(value))
}
