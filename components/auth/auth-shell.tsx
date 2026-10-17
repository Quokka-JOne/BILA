import Link from 'next/link'
import type { ReactNode } from 'react'
import { Lockup } from '@/components/brand/logo'
import { SignalField } from '@/components/brand/signal-field'
import { ConnectivityBadge } from '@/components/bila/connectivity'
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
      <aside className="on-navy relative hidden overflow-hidden bg-navy text-white lg:flex lg:flex-col lg:justify-between lg:gap-8 lg:p-12 xl:p-16">
        <div className="relative z-10 inline-flex self-start rounded-2xl bg-white px-6 py-4 shadow-lift">
          <Lockup size={52} />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center">
          <SignalField className="max-h-[48vh] w-full max-w-lg" />
        </div>

        <div className="relative z-10 max-w-md">
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
          <div className={cn('w-full animate-rise', width === 'sm' ? 'max-w-md' : 'max-w-xl')}>
            {children}
          </div>
        </main>

        <footer className="px-5 pb-6 text-center text-sm text-ink-soft sm:px-8">
          BILA no muestra información de personas hasta verificar tu identidad.
        </footer>
      </div>
    </div>
  )
}
