import type { Metadata } from 'next'
import { ShieldCheck, Watch, Activity, MapPin, Package, Users, AlertTriangle } from 'lucide-react'
import { Alert } from '@/components/bila/alert'
import { ButtonLink } from '@/components/bila/button'
import { EmptyState } from '@/components/bila/empty-state'
import { NeutralTag, StatusTag } from '@/components/bila/status-tag'
import { getLinkedDevices, getProfile, requireUser, type Profile } from '@/lib/session'
import { DEMO_MODE } from '@/lib/demo'
import { VitalsMonitor } from '@/components/space/vitals-monitor'

export const metadata: Metadata = { title: 'Home' }

const ROLE_LABEL: Record<Profile['role'], string> = {
  persona: 'Persona registrada',
  rescatista: 'Rescatista',
  coordinador: 'Coordinador de emergencias',
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'navy',
}: {
  icon: typeof Activity
  label: string
  value: string | number
  accent?: 'navy' | 'harbor' | 'gold' | 'danger'
}) {
  const accentClasses = {
    navy: 'bg-navy/5 text-navy',
    harbor: 'bg-harbor-soft text-harbor',
    gold: 'bg-gold-soft text-caution',
    danger: 'bg-danger-soft text-danger',
  }
  return (
    <div className="rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-card">
      <div className="flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-xl ${accentClasses[accent]}`}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-soft">{label}</p>
          <p className="text-2xl font-bold text-navy">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default async function SpacePage() {
  const user = await requireUser()
  const profile = await getProfile(user.id)
  const devices = profile?.role === 'persona' ? await getLinkedDevices(user.id) : []

  if (!profile) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="Tu perfil aún no está completo"
        action={<ButtonLink href="/registro">Completar registro</ButtonLink>}
      >
        Tu cuenta existe, pero falta elegir el tipo de cuenta y completar el perfil.
      </EmptyState>
    )
  }

  const isOperational = profile.role !== 'persona'

  return (
    <div className="space-y-8">
      {/* Header greeting */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink-soft">Home / Mi espacio</p>
        <NeutralTag>{ROLE_LABEL[profile.role]}</NeutralTag>
        <h1 className="text-balance text-3xl font-bold text-navy sm:text-4xl">
          Hola, {profile.firstName}
        </h1>
        {profile.organization && (
          <p className="text-base text-ink-soft">{profile.organization}</p>
        )}
      </div>

      {DEMO_MODE && <VitalsMonitor deviceType={profile.deviceType} />}

      {/* Verification alerts */}
      {profile.verificationStatus === 'pending' && (
        <Alert tone="warning" title="Tu solicitud está pendiente de verificación">
          {DEMO_MODE ? 'Solicitud enviada para comprobación. En esta demostración puedes explorar Home; no se contacta a tu organización ni se envían correos.' : `Hasta que tu organización confirme tu identidad y afiliación, tu cuenta no tendrá permisos operativos. Te avisaremos al correo ${user.email} cuando haya una decisión.`}
        </Alert>
      )}
      {profile.verificationStatus === 'rejected' && (
        <Alert tone="error" title="No pudimos verificar tu solicitud">
          Comunícate con tu organización para revisar la información enviada.
        </Alert>
      )}

      {/* Dashboard for operational users */}
      {isOperational && profile.verificationStatus === 'approved' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={AlertTriangle} label="Emergencias activas" value={0} accent="danger" />
            <StatCard icon={MapPin} label="Personas rastreadas" value={0} accent="harbor" />
            <StatCard icon={Package} label="Recursos disponibles" value={0} accent="gold" />
            <StatCard icon={Users} label="Equipo en campo" value={0} accent="navy" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick actions card */}
            <section className="space-y-4 rounded-2xl border border-line bg-white p-6">
              <h2 className="text-lg font-bold text-navy">Acciones rápidas</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <ButtonLink href="/espacio/mapa" variant="secondary" className="justify-start gap-3">
                  <MapPin aria-hidden="true" className="size-5" />
                  Ver mapa en tiempo real
                </ButtonLink>
                <ButtonLink href="/espacio/personas" variant="secondary" className="justify-start gap-3">
                  <Activity aria-hidden="true" className="size-5" />
                  Buscar persona
                </ButtonLink>
                <ButtonLink href="/espacio/recursos" variant="secondary" className="justify-start gap-3">
                  <Package aria-hidden="true" className="size-5" />
                  Gestionar recursos
                </ButtonLink>
                <ButtonLink href="/espacio/emergencias" variant="secondary" className="justify-start gap-3">
                  <AlertTriangle aria-hidden="true" className="size-5" />
                  Declarar emergencia
                </ButtonLink>
              </div>
            </section>

            {/* Connectivity status */}
            <section className="space-y-4 rounded-2xl border border-line bg-white p-6">
              <h2 className="text-lg font-bold text-navy">Estado del sistema</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-harbor-soft/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-harbor opacity-75" />
                      <span className="relative inline-flex size-3 rounded-full bg-harbor" />
                    </span>
                    <span className="text-sm font-semibold text-navy">LoRaWAN Gateway</span>
                  </div>
                  <StatusTag kind="synced" label="Activo" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-harbor-soft/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-harbor opacity-75" />
                      <span className="relative inline-flex size-3 rounded-full bg-harbor" />
                    </span>
                    <span className="text-sm font-semibold text-navy">BLE Mesh</span>
                  </div>
                  <StatusTag kind="synced" label="12 nodos" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-cloud-deep/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-3">
                      <span className="relative inline-flex size-3 rounded-full bg-line-strong" />
                    </span>
                    <span className="text-sm font-semibold text-navy">GPS Satelital</span>
                  </div>
                  <NeutralTag>Modo pasivo</NeutralTag>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {/* Account status for all users */}
      <section aria-labelledby="estado" className="space-y-4 rounded-2xl border border-line bg-white p-6">
        <h2 id="estado" className="text-lg font-bold text-navy">
          Estado de tu cuenta
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.verificationStatus === 'pending' && <StatusTag kind="pending" />}
          {profile.verificationStatus === 'approved' && <StatusTag kind="verified" />}
          {profile.role === 'persona' && (devices.length > 0 || profile.deviceType) && (
            <StatusTag kind="wearable-linked" />
          )}
          {profile.role === 'persona' && devices.length === 0 && !profile.deviceType && (
            <NeutralTag>Sin dispositivo asociado</NeutralTag>
          )}
        </div>
        {profile.deviceType && <p className="text-sm text-ink-soft">Tipo de dispositivo: <strong className="text-navy">{profile.deviceType === 'pulsera' ? 'Pulsera' : 'Anillo'}</strong>{DEMO_MODE && ' · Simulado'}</p>}
        {devices.length > 0 && (
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Watch aria-hidden="true" className="size-4" />
            Código asociado: <span className="font-mono text-navy">{devices[0]}</span>
          </p>
        )}
      </section>
    </div>
  )
}
