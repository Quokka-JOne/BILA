'use client'

import { Alert } from '@/components/bila/alert'
import { CheckboxField, TextField } from '@/components/bila/fields'
import { FormSection, WhyWeAsk } from '@/components/bila/info-card'
import { useForm } from '@/lib/use-form'
import { validateEmailOrPhone, validateRequired } from '@/lib/validation'
import { StepActions } from './step-actions'
import { StepHeading } from './step-heading'
import type { CoordinatorValues, ProfileFormProps } from './register-types'
import { DEMO_MODE } from '@/lib/demo'

const empty: CoordinatorValues = { organization: '', position: '', approver: '', consent: false }

export function ProfileCoordinator({
  account,
  initial,
  submitting,
  error,
  onBack,
  onSubmit,
}: ProfileFormProps<CoordinatorValues>) {
  const form = useForm<CoordinatorValues>(initial ?? empty, (values) => ({
    organization: validateRequired(values.organization, 'Indica tu organización.'),
    position: validateRequired(values.position, 'Indica tu cargo o función.'),
    approver: validateEmailOrPhone(
      values.approver,
      'Escribe un correo o teléfono de quien pueda aprobar tu solicitud.',
    ),
    consent: values.consent ? undefined : 'Debes aceptar la revisión para continuar.',
  }))

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!submitting && form.validateAll()) onSubmit(form.values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <StepHeading title="Solicita tu aprobación">
        {DEMO_MODE ? 'Completa un perfil de ejemplo para explorar la experiencia de coordinación.' : 'Los permisos de coordinación requieren la aprobación administrativa de tu organización.'}
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

      <FormSection title="Organización y función">
        <TextField
          label="Organización"
          autoComplete="organization"
          placeholder="Por ejemplo: Coordinación Estatal de Emergencias"
          {...form.field('organization')}
        />
        <TextField
          label="Cargo o función"
          autoComplete="organization-title"
          {...form.field('position')}
        />
        <TextField
          label="Contacto de quien aprobará tu solicitud"
          autoComplete="off"
          hint="Correo o teléfono de una persona con autoridad en tu organización."
          {...form.field('approver')}
        />
        <WhyWeAsk
          why="Los coordinadores priorizan atención y administran recursos, por lo que su acceso se concede con control."
          who="Solo el equipo de administración de BILA y la persona que designes para aprobar."
        />
      </FormSection>

      <CheckboxField
        label="Autorizo a BILA a contactar a mi organización para revisar esta solicitud"
        description={DEMO_MODE ? 'La aprobación es simulada; no se enviarán mensajes a tu organización.' : 'Tu cuenta quedará pendiente hasta recibir la aprobación.'}
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
