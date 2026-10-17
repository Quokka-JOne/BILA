'use client'

import { Alert } from '@/components/bila/alert'
import { CheckboxField, TextAreaField, TextField } from '@/components/bila/fields'
import { FormSection, WhyWeAsk } from '@/components/bila/info-card'
import { useForm } from '@/lib/use-form'
import { validatePhone, validateRequired } from '@/lib/validation'
import { StepActions } from './step-actions'
import { StepHeading } from './step-heading'
import type { PersonaValues, ProfileFormProps } from './register-types'

const empty: PersonaValues = {
  birthDate: '',
  phone: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
  medicalNotes: '',
  shareMedical: false,
  shareLocation: false,
  deviceCode: '',
}

export function ProfilePersona({
  initial,
  submitting,
  error,
  onBack,
  onSubmit,
}: ProfileFormProps<PersonaValues>) {
  const form = useForm<PersonaValues>(initial ?? empty, (values) => ({
    birthDate: validateRequired(values.birthDate, 'Indica tu fecha de nacimiento.'),
    phone: validatePhone(values.phone, 'Escribe un teléfono de contacto.'),
    emergencyName: validateRequired(values.emergencyName, 'Escribe el nombre de tu contacto de emergencia.'),
    emergencyRelation: validateRequired(values.emergencyRelation, 'Indica qué relación tienen.'),
    emergencyPhone: validatePhone(values.emergencyPhone, 'Escribe el teléfono de tu contacto de emergencia.'),
  }))

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!submitting && form.validateAll()) onSubmit(form.values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <StepHeading title="Prepara tu información de emergencia">
        Comparte solo lo necesario. Puedes cambiar estas decisiones cuando quieras.
      </StepHeading>

      {error && <Alert tone="error" title="No pudimos crear tu cuenta">{error}</Alert>}

      <FormSection title="Datos personales esenciales">
        <TextField
          label="Fecha de nacimiento"
          type="date"
          autoComplete="bday"
          {...form.field('birthDate')}
        />
        <TextField
          label="Teléfono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+52 55 1234 5678"
          {...form.field('phone')}
        />
        <WhyWeAsk
          why="Ayuda a los equipos de rescate a confirmar que la persona identificada eres tú."
          who="Solo rescatistas y coordinadores verificados, durante una emergencia activa."
        />
      </FormSection>

      <FormSection title="Contacto de emergencia">
        <TextField label="Nombre completo" autoComplete="off" {...form.field('emergencyName')} />
        <TextField
          label="Relación contigo"
          placeholder="Madre, pareja, amigo…"
          autoComplete="off"
          {...form.field('emergencyRelation')}
        />
        <TextField
          label="Teléfono"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="+52 55 1234 5678"
          {...form.field('emergencyPhone')}
        />
        <WhyWeAsk
          why="Para avisar a alguien de confianza cuando te localicen."
          who="Solo equipos de rescate verificados que atiendan tu caso."
        />
      </FormSection>

      <FormSection
        title="Información médica"
        description="Es voluntaria. Escribe únicamente lo estrictamente necesario para tu atención."
      >
        <TextAreaField
          label="Condiciones, alergias o medicación relevantes"
          optional
          placeholder="Por ejemplo: alergia a la penicilina"
          {...form.field('medicalNotes')}
        />
        <WhyWeAsk
          why="Evita decisiones de atención que puedan ponerte en riesgo."
          who="Solo rescatistas verificados, y únicamente si activas la opción de compartir."
        />
      </FormSection>

      <FormSection title="Preferencias de privacidad">
        <CheckboxField
          label="Compartir mi información médica con equipos de rescate"
          description="Si no la marcas, tu información médica no se mostrará."
          {...form.check('shareMedical')}
        />
        <CheckboxField
          label="Permitir que los equipos de rescate consulten mi última ubicación conocida"
          description="Solo se mostrará si tu dispositivo BILA llegó a enviarla."
          {...form.check('shareLocation')}
        />
      </FormSection>

      <FormSection
        title="Dispositivo BILA"
        description="Si ya tienes una pulsera o anillo BILA, puedes asociarlo ahora. También puedes hacerlo más tarde."
      >
        <TextField
          label="Código del dispositivo"
          optional
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="Impreso en tu pulsera o anillo"
          {...form.field('deviceCode')}
        />
      </FormSection>

      <StepActions
        nextLabel="Crear cuenta"
        loadingLabel="Creando cuenta…"
        loading={submitting}
        onBack={() => onBack(form.values)}
      />
    </form>
  )
}
