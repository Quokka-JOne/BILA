import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { RegisterFlow } from '@/components/auth/register-flow'

export const metadata: Metadata = { title: 'Crear cuenta' }

export default function RegisterPage() {
  return (
    <AuthShell width="md">
      <RegisterFlow />
    </AuthShell>
  )
}
