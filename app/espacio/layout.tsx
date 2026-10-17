import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  Activity,
  LayoutDashboard,
  MapPin,
  Package,
  Search,
  Users,
} from 'lucide-react'
import { Lockup } from '@/components/brand/logo'
import { SignOutButton } from '@/components/space/sign-out-button'
import { requireUser, getProfile } from '@/lib/session'
import { redirect } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/espacio', icon: LayoutDashboard, label: 'Panel' },
  { href: '/espacio/mapa', icon: MapPin, label: 'Mapa' },
  { href: '/espacio/personas', icon: Search, label: 'Personas' },
  { href: '/espacio/recursos', icon: Package, label: 'Recursos' },
  { href: '/espacio/emergencias', icon: Activity, label: 'Emergencias' },
  { href: '/espacio/equipo', icon: Users, label: 'Equipo' },
]

export default async function SpaceLayout({ children }: { children: ReactNode }) {
  const user = await requireUser()
  const profile = await getProfile(user.id)

  if (!profile) redirect('/registro')

  const isOperational = profile.role !== 'persona'

  return (
    <div className="min-h-dvh bg-cloud">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/espacio" aria-label="BILA, mi espacio">
              <Lockup size={36} />
            </Link>

            {/* Desktop nav */}
            {isOperational && (
              <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-cloud-deep"
                    >
                      <Icon aria-hidden="true" className="size-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-ink-soft sm:block">
              {profile.firstName} {profile.lastName}
            </span>
            <SignOutButton />
          </div>
        </div>

        {/* Mobile nav */}
        {isOperational && (
          <nav
            className="flex gap-1 overflow-x-auto border-t border-line/50 px-4 py-1.5 md:hidden"
            aria-label="Navegación principal"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-navy transition-colors hover:bg-cloud-deep"
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      {/* Main content area */}
      <main id="contenido" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
