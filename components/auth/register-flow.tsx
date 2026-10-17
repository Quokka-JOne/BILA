'use client'

import { useEffect, useRef, useState } from 'react'
import { Stepper } from '@/components/bila/stepper'
import { authErrorMessage, createAccount } from '@/lib/auth-client'
import { ProfileCoordinator } from './profile-coordinator'
import { ProfilePersona } from './profile-persona'
import { ProfileRescuer } from './profile-rescuer'
import type { AccountValues, ProfileDrafts, Role } from './register-types'
import { StepAccount } from './step-account'
import { StepConfirmation } from './step-confirmation'
import { StepRole } from './step-role'

const STEPS = ['Cuenta', 'Tipo de cuenta', 'Perfil', 'Confirmación'] as const

const emptyAccount: AccountValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm: '',
}

export function RegisterFlow() {
  const [step, setStep] = useState(0)
  const [account, setAccount] = useState<AccountValues>(emptyAccount)
  const [role, setRole] = useState<Role | ''>('')
  const [drafts, setDrafts] = useState<ProfileDrafts>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    containerRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus()
  }, [step])

  async function submit<K extends Role>(selected: K, values: NonNullable<ProfileDrafts[K]>) {
    setDrafts((current) => ({ ...current, [selected]: values }))
    setError('')
    setSubmitting(true)
    try {
      await createAccount({
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        password: account.password,
        role: selected,
        profile: values,
      })
      setStep(3)
    } catch (caught) {
      setError(authErrorMessage(caught))
    } finally {
      setSubmitting(false)
    }
  }

  function goBack<K extends Role>(selected: K, values: NonNullable<ProfileDrafts[K]>) {
    setDrafts((current) => ({ ...current, [selected]: values }))
    setError('')
    setStep(1)
  }

  return (
    <div ref={containerRef} className="space-y-8">
      {step < 3 && <Stepper steps={STEPS} current={step} />}

      {step === 0 && (
        <StepAccount
          initial={account}
          onNext={(values) => {
            setAccount(values)
            setStep(1)
          }}
        />
      )}

      {step === 1 && (
        <StepRole
          initial={role}
          onBack={() => setStep(0)}
          onNext={(selected) => {
            setRole(selected)
            setStep(2)
          }}
        />
      )}

      {step === 2 && role === 'persona' && (
        <ProfilePersona
          account={account}
          initial={drafts.persona}
          submitting={submitting}
          error={error}
          onBack={(values) => goBack('persona', values)}
          onSubmit={(values) => submit('persona', values)}
        />
      )}

      {step === 2 && role === 'rescatista' && (
        <ProfileRescuer
          account={account}
          initial={drafts.rescatista}
          submitting={submitting}
          error={error}
          onBack={(values) => goBack('rescatista', values)}
          onSubmit={(values) => submit('rescatista', values)}
        />
      )}

      {step === 2 && role === 'coordinador' && (
        <ProfileCoordinator
          account={account}
          initial={drafts.coordinador}
          submitting={submitting}
          error={error}
          onBack={(values) => goBack('coordinador', values)}
          onSubmit={(values) => submit('coordinador', values)}
        />
      )}

      {step === 3 && role && <StepConfirmation role={role} email={account.email.trim()} />}
    </div>
  )
}
