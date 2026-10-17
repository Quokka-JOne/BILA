import Link from 'next/link'
import type { ReactNode } from 'react'
import { Isotipo, Lockup, Wordmark } from '@/components/brand/logo'
import { ConnectivityBadge } from '@/components/bila/connectivity'
import { DemoNotice } from '@/components/bila/demo-notice'
import { cn } from '@/lib/utils'

export function AuthShell({
  children,
  width = 'sm',
}: {
  children: ReactNode
  width?: 'sm' | 'md'
}) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="on-navy sticky top-0 hidden h-dvh self-start overflow-hidden bg-navy text-white lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-10 lg:p-12 xl:p-16">
        <div className="flex flex-col items-center gap-7 rounded-[2.5rem] bg-white px-14 py-10 shadow-lift" aria-label="BILA">
          <Isotipo size={240} className="max-h-[32dvh]" priority />
          <Wordmark size={52} label="BILA" priority />
        </div>

        <div className="max-w-md text-center">
          <p className="text-lg font-semibold text-gold">«La esperanza de volver a encontrar»</p>
          <h2 className="mt-3 text-balance text-3xl font-bold leading-tight xl:text-4xl">
            La tecnología nos acerca cuando más importa
          </h2>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:justify-end">
          <Link href="/" aria-label="BILA, ir al inicio de sesión" className="rounded-lg lg:hidden">
            <Lockup size={36} />
          </Link>
          <ConnectivityBadge />
        </header>

        <main
          id="contenido"
          className="flex flex-1 items-start justify-center px-5 pb-12 pt-4 sm:px-8 lg:items-center"
        >
          <div className={cn('w-full space-y-7 animate-rise', width === 'sm' ? 'max-w-md' : 'max-w-xl')}>
            <DemoNotice />
            {children}
          </div>
        </main>

        <footer className="px-5 pb-6 text-center text-sm text-ink-soft sm:px-8">
          BILA · La esperanza de volver a encontrar.
        </footer>
      </div>
    </div>
  )
}
