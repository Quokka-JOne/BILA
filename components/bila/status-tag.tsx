import {
  CircleCheck,
  Clock,
  CloudUpload,
  HardDrive,
  History,
  LocateFixed,
  MapPinOff,
  ShieldAlert,
  Watch,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type TagKind =
  | 'pending'
  | 'verified'
  | 'wearable-linked'
  | 'location-current'
  | 'location-last'
  | 'location-unavailable'
  | 'stored-local'
  | 'pending-sync'
  | 'synced'
  | 'urgent'

type TagStyle = { label: string; Icon: LucideIcon; className: string }

const tags: Record<TagKind, TagStyle> = {
  pending: { label: 'Verificación pendiente', Icon: Clock, className: 'bg-caution-soft text-caution' },
  verified: { label: 'Verificado', Icon: CircleCheck, className: 'bg-success-soft text-success' },
  'wearable-linked': { label: 'Dispositivo asociado', Icon: Watch, className: 'bg-harbor-soft text-harbor' },
  'location-current': { label: 'Ubicación actual', Icon: LocateFixed, className: 'bg-harbor-soft text-harbor' },
  'location-last': {
    label: 'Última ubicación conocida',
    Icon: History,
    className: 'bg-gold-soft text-caution',
  },
  'location-unavailable': {
    label: 'Ubicación no disponible',
    Icon: MapPinOff,
    className: 'bg-cloud-deep text-ink-soft',
  },
  'stored-local': {
    label: 'Guardado en este dispositivo',
    Icon: HardDrive,
    className: 'bg-cloud-deep text-navy',
  },
  'pending-sync': { label: 'Pendiente de sincronizar', Icon: CloudUpload, className: 'bg-caution-soft text-caution' },
  synced: { label: 'Sincronizado', Icon: CircleCheck, className: 'bg-success-soft text-success' },
  urgent: { label: 'Atención urgente', Icon: ShieldAlert, className: 'bg-danger-soft text-danger' },
}

export function StatusTag({ kind, label, className }: { kind: TagKind; label?: string; className?: string }) {
  const { label: defaultLabel, Icon, className: tone } = tags[kind]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
        tone,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {label ?? defaultLabel}
    </span>
  )
}

export function NeutralTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-cloud-deep px-3 py-1 text-xs font-semibold text-navy',
        className,
      )}
    >
      {children}
    </span>
  )
}
