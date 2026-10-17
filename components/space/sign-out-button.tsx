'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/bila/button'
import { signOut } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await signOut()
    } finally {
      router.replace('/')
      router.refresh()
    }
  }

  return (
    <Button variant="secondary" loading={loading} loadingLabel="Cerrando sesión" onClick={handleClick}>
      <LogOut aria-hidden="true" className="size-5" />
      Cerrar sesión
    </Button>
  )
}
