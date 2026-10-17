import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { RecoverForm } from '@/components/auth/recover-form'

export const metadata: Metadata = { title: 'Recuperar cuenta' }

export default function RecoverPage() {
  return (
    <AuthShell>
      <RecoverForm />
    </AuthShell>
  )
}
