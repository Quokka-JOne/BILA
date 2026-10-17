'use client'

import Link from 'next/link'
import { PasswordField, TextField } from '@/components/bila/fields'
import { useForm } from '@/lib/use-form'
import { passwordMeetsRules, validateEmail, validateRequired } from '@/lib/validation'
import { PasswordRules } from './password-rules'
import { StepActions } from './step-actions'
import { StepHeading } from './step-heading'
import type { AccountValues } from './register-types'

export function StepAccount({
  initial,
  onNext,
}: {
  initial: AccountValues
  onNext: (values: AccountValues) => void
}) {
  const form = useForm<AccountValues>(initial, (values) => ({
    firstName: validateRequired(values.firstName, 'Escribe tu nombre.'),
    lastName: validateRequired(values.lastName, 'Escribe tus apellidos.'),
    email: validateEmail(values.email),
    password: !values.password
      ? 'Crea una contraseña.'
      : passwordMeetsRules(values.password)
        ? undefined
        : 'La contraseña aún no cumple todas las reglas.',
    confirm: !values.confirm
      ? 'Repite tu contraseña.'
      : values.confirm !== values.password
        ? 'Las contraseñas no coinciden.'
        : undefined,
  }))

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (form.validateAll()) onNext(form.values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <StepHeading title="Crea tu cuenta">
        Solo necesitamos lo básico para empezar. Más adelante, y solo si lo necesitas, completarás tu perfil.
      </StepHeading>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Nombre" autoComplete="given-name" {...form.field('firstName')} />
        <TextField label="Apellidos" autoComplete="family-name" {...form.field('lastName')} />
      </div>

      <TextField
        label="Correo electrónico"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="nombre@dominio.com"
        {...form.field('email')}
      />

      <PasswordField
        label="Contraseña"
        autoComplete="new-password"
        {...form.field('password')}
        footer={<PasswordRules value={form.values.password} />}
      />

      <PasswordField
        label="Confirma tu contraseña"
        autoComplete="new-password"
        {...form.field('confirm')}
      />

      <StepActions nextLabel="Continuar" />

      <p className="text-center text-base text-ink-soft">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/" className="bila-link">
          Iniciar sesión
        </Link>
      </p>
    </form>
  )
}
