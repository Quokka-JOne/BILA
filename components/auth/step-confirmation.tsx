'use client'

import { useEffect, useRef } from 'react'
import { ButtonLink } from '@/components/bila/button'
import { StatusTag } from '@/components/bila/status-tag'
import { Isotipo } from '@/components/brand/logo'
import { StepHeading } from './step-heading'
import type { Role } from './register-types'

const next: Record<Role, { cta: string; href: string }> = {
  persona: { cta: 'Continuar a mi espacio', href: '/espacio' },
  rescatista: { cta: 'Continuar a mi espacio', href: '/espacio' },
  coordinador: { cta: 'Continuar a mi espacio', href: '/espacio' },
}

export function StepConfirmation({ role, email }: { role: Role; email: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const needsApproval = role !== 'persona'

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus()
  }, [])

  return (
    <div ref={ref} role="status" className="space-y-8 text-center sm:text-left">
      <Isotipo size={96} label="BILA" className="mx-auto sm:mx-0" priority />

      <StepHeading title="Tu cuenta está lista para dar el siguiente paso">
        {needsApproval
          ? `Recibimos tu solicitud. Te escribiremos a ${email} cuando haya una respuesta.`
          : `Enviamos un mensaje de confirmación a ${email}. Ya puedes completar tu perfil.`}
      </StepHeading>

      {needsApproval && (
        <section
          aria-labelledby="pending-title"
          className="space-y-4 rounded-2xl border border-line bg-white p-5 text-left sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="pending-title" className="text-lg font-bold text-navy">
              {role === 'rescatista' ? 'Verificación de identidad' : 'Aprobación administrativa'}
            </h2>
            <StatusTag kind="pending" />
          </div>
          <ol className="space-y-3 text-sm leading-relaxed text-navy">
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">
                1
              </span>
              <span>
                {role === 'rescatista'
                  ? 'Confirmamos tu identidad y tu afiliación con tu organización.'
                  : 'Contactamos a tu organización para revisar tu solicitud.'}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">
                2
              </span>
              <span>Te avisamos por correo con el resultado.</span>
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">
                3
              </span>
              <span>Al aprobarse, se activan tus herramientas operativas. Hasta entonces no tendrás acceso a información de personas.</span>
            </li>
          </ol>
        </section>
      )}

      <ButtonLink href={next[role].href} variant={needsApproval ? 'primary' : 'gold'} className="w-full sm:w-auto">
        {next[role].cta}
      </ButtonLink>
    </div>
  )
}
