import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line-strong bg-white/60 px-6 py-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-cloud-deep text-navy">
        <Icon aria-hidden="true" className="size-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-ink-soft">{children}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function SkeletonLines({ lines = 3 }: { lines?: number }) {
  return (
    <div role="status" aria-label="Cargando contenido" className="space-y-3 rounded-2xl bg-white p-5">
      {Array.from({ length: lines }).map((_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="block h-4 animate-pulse rounded-full bg-cloud-deep"
          style={{ width: `${index === lines - 1 ? 55 : 100 - index * 12}%` }}
        />
      ))}
    </div>
  )
}
