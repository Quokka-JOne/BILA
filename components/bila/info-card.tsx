import { Eye, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Explica por qué se pide un dato sensible y quién puede consultarlo. */
export function WhyWeAsk({ why, who }: { why: string; who: string }) {
  return (
    <div className="space-y-2 rounded-xl bg-harbor-soft p-4 text-sm leading-relaxed text-navy">
      <p className="flex items-start gap-2">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-harbor" />
        <span>
          <strong className="font-bold text-harbor">Por qué lo pedimos: </strong>
          {why}
        </span>
      </p>
      <p className="flex items-start gap-2">
        <Eye aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-harbor" />
        <span>
          <strong className="font-bold text-harbor">Quién puede verlo: </strong>
          {who}
        </span>
      </p>
    </div>
  )
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <fieldset className={cn('space-y-5 rounded-2xl border border-line bg-white p-5 sm:p-6', className)}>
      <legend className="rounded-md bg-cloud px-2 text-base font-bold text-navy">{title}</legend>
      {description && <p className="-mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>}
      {children}
    </fieldset>
  )
}
