import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type AlertTone = 'error' | 'warning' | 'success' | 'info'

const tones = {
  error: {
    box: 'border-danger bg-danger-soft',
    title: 'text-danger',
    Icon: CircleAlert,
    role: 'alert' as const,
  },
  warning: {
    box: 'border-caution bg-caution-soft',
    title: 'text-caution',
    Icon: TriangleAlert,
    role: 'status' as const,
  },
  success: {
    box: 'border-success bg-success-soft',
    title: 'text-success',
    Icon: CircleCheck,
    role: 'status' as const,
  },
  info: {
    box: 'border-harbor bg-harbor-soft',
    title: 'text-harbor',
    Icon: Info,
    role: 'status' as const,
  },
}

export function Alert({
  tone,
  title,
  children,
  className,
}: {
  tone: AlertTone
  title: string
  children?: ReactNode
  className?: string
}) {
  const { box, title: titleClass, Icon, role } = tones[tone]
  return (
    <div role={role} className={cn('flex gap-3 rounded-xl border-l-4 p-4', box, className)}>
      <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', titleClass)} />
      <div className="min-w-0 text-sm text-navy">
        <p className={cn('font-bold', titleClass)}>{title}</p>
        {children && <div className="mt-1 leading-relaxed">{children}</div>}
      </div>
    </div>
  )
}
