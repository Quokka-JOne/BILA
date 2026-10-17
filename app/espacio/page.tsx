import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Watch } from 'lucide-react'
import { Alert } from '@/components/bila/alert'
import { ButtonLink } from '@/components/bila/button'
import { EmptyState } from '@/components/bila/empty-state'
import { NeutralTag, StatusTag } from '@/components/bila/status-tag'
import { Lockup } from '@/components/brand/logo'
import { SignOutButton } from '@/components/space/sign-out-button'
import { getLinkedDevices, getProfile, requireUser, type Profile } from '@/lib/session'

export const metadata: Metadata = { title: 'Mi espacio' }

const ROLE_LABEL: Record<Profile['role'], string> = {
  persona: 'Persona registrada',
  rescatista: 'Rescatista',
  coordinador: 'Coordinador de emergencias',
}

export default async function SpacePage() {
  const user = await requireUser()
  const profile = await getProfile(user.id)
  const devices = profile?.role === 'persona' ? await getLinkedDevices(user.id) : []

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/espacio" aria-label="BILA, mi espacio">
            <Lockup size={36} />
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
        {!profile ? (
          <EmptyState
            icon={ShieldCheck}
            title="Tu perfil aún no está completo"
            action={<ButtonLink href="/registro">Completar registro</ButtonLink>}
          >
            Tu cuenta existe, pero falta elegir el tipo de cuenta y completar el perfil.
          </EmptyState>
        ) : (
          <>
            <div className="space-y-3">
              <NeutralTag>{ROLE_LABEL[profile.role]}</NeutralTag>
              <h1 className="text-balance text-3xl font-bold text-navy sm:text-4xl">
                Hola, {profile.firstName}
              </h1>
              {profile.organization && (
                <p className="text-base text-ink-soft">{profile.organization}</p>
              )}
            </div>

            {profile.verificationStatus === 'pending' && (
              <Alert tone="warning" title="Tu solicitud está pendiente de verificación">
                Hasta que tu organización confirme tu identidad y afiliación, tu cuenta no tendrá
                permisos operativos. Te avisaremos al correo {user.email} cuando haya una decisión.
              </Alert>
            )}
            {profile.verificationStatus === 'rejected' && (
              <Alert tone="error" title="No pudimos verificar tu solicitud">
                Comunícate con tu organización para revisar la información enviada.
              </Alert>
            )}

            <section aria-labelledby="estado" className="space-y-4 rounded-2xl border border-line bg-white p-6">
              <h2 id="estado" className="text-lg font-bold text-navy">
                Estado de tu cuenta
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.verificationStatus === 'pending' && <StatusTag kind="pending" />}
                {profile.verificationStatus === 'approved' && <StatusTag kind="verified" />}
                {profile.role === 'persona' && devices.length > 0 && (
                  <StatusTag kind="wearable-linked" />
                )}
                {profile.role === 'persona' && devices.length === 0 && (
                  <NeutralTag>Sin dispositivo asociado</NeutralTag>
                )}
              </div>
              {devices.length > 0 && (
                <p className="flex items-center gap-2 text-sm text-ink-soft">
                  <Watch aria-hidden="true" className="size-4" />
                  Código asociado: <span className="font-mono text-navy">{devices[0]}</span>
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
