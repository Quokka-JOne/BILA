import type { ReactNode } from 'react'

export function StepHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <h1
        tabIndex={-1}
        data-step-heading
        className="text-balance text-3xl font-bold leading-tight text-navy outline-none sm:text-4xl"
      >
        {title}
      </h1>
      {children && <p className="mt-3 text-base leading-relaxed text-ink-soft">{children}</p>}
    </div>
  )
}
