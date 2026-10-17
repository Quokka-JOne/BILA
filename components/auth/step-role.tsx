'use client'

import { HardHat, Network, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '@/components/bila/alert'
import { RoleCard } from '@/components/bila/role-card'
import { StepActions } from './step-actions'
import { StepHeading } from './step-heading'
import type { Role } from './register-types'
import { DEMO_MODE } from '@/lib/demo'

const roles = [
  {
    value: 'persona',
    icon: UserRound,
    title: 'Persona registrada',
    description: 'Para quien desea registrar su identidad y preparar su información de emergencia.',
  },
  {
    value: 'rescatista',
    icon: HardHat,
    title: 'Rescatista',
    description: 'Para integrantes autorizados de equipos de búsqueda y asistencia.',
    note: 'Requiere verificación institucional',
  },
  {
    value: 'coordinador',
    icon: Network,
    title: 'Coordinador de emergencias',
    description:
      'Para responsables de supervisar incidentes, priorizar necesidades y administrar recursos.',
    note: 'Requiere aprobación administrativa',
  },
] as const

export function StepRole({
  initial,
  onBack,
  onNext,
}: {
  initial: Role | ''
  onBack: () => void
  onNext: (role: Role) => void
}) {
  const [role, setRole] = useState<Role | ''>(initial)
  const [error, setError] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!role) {
      setError('Elige el tipo de cuenta para continuar.')
      return
    }
    onNext(role)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <StepHeading title="¿Cómo usarás BILA?">
        Elige el tipo de cuenta que mejor describe tu caso.
      </StepHeading>

      <fieldset>
        <legend className="sr-only">Tipo de cuenta</legend>
        <div className="space-y-3">
          {roles.map((item) => (
            <RoleCard
              key={item.value}
              name="role"
              checked={role === item.value}
              onChange={(value) => {
                setRole(value as Role)
                setError('')
              }}
              {...item}
              note={'note' in item ? (DEMO_MODE ? 'Comprobación simulada' : item.note) : undefined}
            />
          ))}
        </div>
      </fieldset>

      {error && <Alert tone="error" title={error} />}

      <Alert tone="info" title={DEMO_MODE ? 'Explora los tres tipos de cuenta' : 'Elegir un tipo no concede permisos'}>
        {DEMO_MODE ? 'Completa el perfil para entrar a Home. Para rescatistas y coordinadores mostraremos una solicitud de comprobación simulada, sin contactar a ninguna organización.' : 'Las cuentas de rescatista y de coordinador se activan solo después de verificar tu identidad y tu afiliación con tu organización.'}
      </Alert>

      <StepActions nextLabel="Continuar" onBack={onBack} />
    </form>
  )
}
