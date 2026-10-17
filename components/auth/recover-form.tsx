'use client'

import { ArrowLeft, MailCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Alert } from '@/components/bila/alert'
import { Button, ButtonLink } from '@/components/bila/button'
import { TextField } from '@/components/bila/fields'
import { authErrorMessage, requestPasswordReset } from '@/lib/auth-client'
import { useForm } from '@/lib/use-form'
import { validateEmail } from '@/lib/validation'
import Link from 'next/link'
import { StepHeading } from './step-heading'

export function RecoverForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')
  const [sentTo, setSentTo] = useState('')
  const [formError, setFormError] = useState('')
  const sentRef = useRef<HTMLDivElement>(null)

  const form = useForm({ email: '' }, (values) => ({ email: validateEmail(values.email) }))

  useEffect(() => {
    if (status === 'sent') sentRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus()
  }, [status])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (status === 'loading' || !form.validateAll()) return
    setFormError('')
    setStatus('loading')
    try {
      const email = form.values.email.trim()
      await requestPasswordReset({ email })
      setSentTo(email)
      setStatus('sent')
    } catch (error) {
      setFormError(authErrorMessage(error))
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <div ref={sentRef} className="space-y-6" role="status">
        <span className="grid size-14 place-items-center rounded-2xl bg-harbor-soft text-harbor">
          <MailCheck aria-hidden="true" className="size-8" />
        </span>
        <StepHeading title="Revisa tu correo">
          Si existe una cuenta asociada a <strong className="font-bold text-navy">{sentTo}</strong>,
          recibirás en unos minutos las instrucciones para crear una nueva contraseña.
        </StepHeading>
        <p className="text-sm text-ink-soft">
          Si no lo ves, revisa la carpeta de correo no deseado o solicita el envío de nuevo.
        </p>
        <div className="flex flex-col gap-3">
          <ButtonLink href="/">Volver al inicio de sesión</ButtonLink>
          <Button variant="quiet" onClick={() => setStatus('idle')}>
            Usar otro correo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/" className="bila-link inline-flex items-center gap-2 text-sm">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver al inicio de sesión
      </Link>

      <StepHeading title="Recupera tu cuenta">
        Escribe el correo de tu cuenta y te enviaremos instrucciones para crear una nueva contraseña.
      </StepHeading>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <Alert tone="error" title="No pudimos enviar la solicitud">{formError}</Alert>}
        <TextField
          label="Correo electrónico"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@dominio.com"
          {...form.field('email')}
        />
        <Button type="submit" loading={status === 'loading'} loadingLabel="Enviando…" className="w-full">
          Solicitar recuperación
        </Button>
      </form>
    </div>
  )
}
