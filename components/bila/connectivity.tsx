'use client'

import { Wifi, WifiOff } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { Alert } from './alert'

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

export function useOnline() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )
}

/** Refleja únicamente el estado de red que reporta el navegador. */
export function ConnectivityBadge({ className }: { className?: string }) {
  const online = useOnline()
  const Icon = online ? Wifi : WifiOff
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold',
        online ? 'border-harbor/40 bg-harbor-soft text-harbor' : 'border-caution bg-caution-soft text-caution',
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {online ? 'Conectado a internet' : 'Sin conexión a internet'}
    </span>
  )
}

export function OfflineNotice({ children }: { children: string }) {
  const online = useOnline()
  if (online) return null
  return (
    <Alert tone="warning" title="Sin conexión a internet">
      {children}
    </Alert>
  )
}
