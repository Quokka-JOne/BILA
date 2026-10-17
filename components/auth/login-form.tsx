'use client'

import { CircleCheck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Alert } from '@/components/bila/alert'
import { Button, ButtonLink } from '@/components/bila/button'
import { CheckboxField, PasswordField, TextField } from '@/components/bila/fields'
import { authErrorMessage, signIn } from '@/lib/auth-client'
import { useForm } from '@/lib/use-form'
import { validateEmail, validateRequired } from '@/lib/validation'
import { StepHeading } from './step-heading'

type Status = 'idle' | 'loading' | 'success'

export function LoginForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [formError, setFormError] = useState('')
  const successRef = useRef<HTMLDivElement>(null)

  const form = useForm({ email: '', password: '', remember: false }, (values) => ({
    email: validateEmail(values.email),
    password: validateRequired(values.password, 'Escribe tu contraseña.'),
  }))

  useEffect(() => {
    if (status === 'success') {
      successRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus()
      const timer = setTimeout(() => {
        window.location.href = '/espacio'
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [status])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (status === 'loading' || !form.validateAll()) return
    setFormError('')
    setStatus('loading')
    try {
      await signIn({
        email: form.values.email.trim(),
        password: form.values.password,
        remember: form.values.remember,
      })
      setStatus('success')
    } catch (error) {
      setFormError(authErrorMessage(error))
      setStatus('idle')
    }
  }

  async function handleDemoCoordinator() {
    if (status === 'loading') return
    setStatus('loading')
    try {
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'coordinador',
          email: 'coordinador@bila.org',
          firstName: 'Elena',
          lastName: 'Morales',
          organization: 'Centro de Operaciones de Emergencia BILA',
          verificationStatus: 'approved',
        }),
      })
      setStatus('success')
    } catch {
      window.location.href = '/espacio'
    }
  }

  if (status === 'success') {
    return (
      <div ref={successRef} className="space-y-6" role="status">
        <span className="grid size-14 place-items-center rounded-2xl bg-success-soft text-success">
          <CircleCheck aria-hidden="true" className="size-8" />
        </span>
        <StepHeading title="Sesión iniciada">
          Entrando a tu espacio seguro de BILA.
        </StepHeading>
        <ButtonLink href="/espacio" className="w-full">
          Continuar a mi espacio
        </ButtonLink>
      </div>
    )
  }

  const email = form.field('email')
  const password = form.field('password')
  const remember = form.check('remember')

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-harbor lg:hidden">
          La esperanza de volver a encontrar
        </p>
        <StepHeading title="Bienvenido de nuevo">Accede a tu espacio seguro de BILA.</StepHeading>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <Alert tone="error" title="No pudimos iniciar tu sesión">{formError}</Alert>}

        <TextField
          label="Correo electrónico"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@dominio.com"
          {...email}
        />

        <PasswordField
          label="Contraseña"
          autoComplete="current-password"
          {...password}
          footer={
            <p className="mt-3 text-right text-sm">
              <Link href="/recuperar" className="bila-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          }
        />

        <CheckboxField
          label="Mantener sesión iniciada"
          description="Úsalo solo en dispositivos personales."
          {...remember}
        />

        <div className="space-y-3 pt-2">
          <Button type="submit" loading={status === 'loading'} loadingLabel="Verificando…" className="w-full">
            Iniciar sesión
          </Button>

          <Button
            type="button"
            variant="secondary"
            loading={status === 'loading'}
            loadingLabel="Entrando como coordinador…"
            onClick={handleDemoCoordinator}
            className="w-full"
          >
            Entrar como Coordinador (Modo Demo)
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-4" role="separator">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-soft">o</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <p className="text-center text-base text-ink-soft">
        ¿Todavía no tienes una cuenta?{' '}
        <Link href="/registro" className="bila-link">
          Crear cuenta
        </Link>
      </p>
    </div>
  )
}
