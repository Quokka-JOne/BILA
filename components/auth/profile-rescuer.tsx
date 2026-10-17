'use client'

import { Alert } from '@/components/bila/alert'
import { CheckboxField, TextField } from '@/components/bila/fields'
import { FormSection, WhyWeAsk } from '@/components/bila/info-card'
import { useForm } from '@/lib/use-form'
import { validateEmailOrPhone, validateRequired } from '@/lib/validation'
import { StepActions } from './step-actions'
import { StepHeading } from './step-heading'
import type { ProfileFormProps, RescuerValues } from './register-types'
import { DEMO_MODE } from '@/lib/demo'

const empty: RescuerValues = { organization: '', professionalId: '', verifier: '', consent: false }

export function ProfileRescuer({
  account,
  initial,
  submitting,
  error,
  onBack,
  onSubmit,
}: ProfileFormProps<RescuerValues>) {
  const form = useForm<RescuerValues>(initial ?? empty, (values) => ({
    organization: validateRequired(values.organization, 'Indica tu organización o equipo.'),
    verifier: validateEmailOrPhone(
      values.verifier,
      'Escribe un correo o teléfono de contacto de tu organización.',
    ),
    consent: values.consent ? undefined : 'Debes aceptar la verificación para continuar.',
  }))

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!submitting && form.validateAll()) onSubmit(form.values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <StepHeading title="Solicita tu verificación">
        {DEMO_MODE ? 'Completa un perfil de ejemplo para conocer cómo sería la solicitud de comprobación.' : 'Confirmaremos tu identidad y tu afiliación antes de activar herramientas operativas.'}
      </StepHeading>

      {error && <Alert tone="error" title="No pudimos enviar tu solicitud">{error}</Alert>}

      <FormSection title="Tus datos">
        <dl className="grid gap-1 text-base text-navy">
          <dt className="text-sm font-semibold text-ink-soft">Nombre y apellidos</dt>
          <dd className="font-semibold">
            {account.firstName} {account.lastName}
          </dd>
        </dl>
      </FormSection>

      <FormSection title="Organización o equipo">
        <TextField
          label="Organización o equipo"
          autoComplete="organization"
          placeholder="Por ejemplo: Protección Civil Municipal"
          {...form.field('organization')}
        />
        <TextField
          label="Identificador profesional o institucional"
          optional
          autoComplete="off"
          hint="Credencial, matrícula o número de integrante, si tu organización lo emite."
          {...form.field('professionalId')}
        />
        <TextField
          label="Contacto para confirmar tu afiliación"
          autoComplete="off"
          hint="Correo o teléfono de un responsable de tu organización."
          {...form.field('verifier')}
        />
        <WhyWeAsk
          why="Para evitar que personas ajenas accedan a información de quienes necesitan ayuda."
          who="Solo el equipo de verificación de BILA. No se comparte con otros usuarios."
        />
      </FormSection>

      <CheckboxField
        label="Autorizo a BILA a verificar mi identidad y afiliación"
        description={DEMO_MODE ? 'La comprobación es simulada; no se contactará a ninguna organización.' : 'Tu cuenta quedará pendiente hasta completar la verificación.'}
        {...form.check('consent')}
      />

      <StepActions
        nextLabel="Enviar solicitud"
        loadingLabel="Enviando…"
        loading={submitting}
        onBack={() => onBack(form.values)}
      />
    </form>
  )
}
