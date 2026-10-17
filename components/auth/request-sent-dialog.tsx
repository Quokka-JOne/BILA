'use client'

import { useEffect, useRef } from 'react'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/components/bila/button'
import { DEMO_MODE } from '@/lib/demo'

export function RequestSentDialog({ open, onContinue }: { open: boolean; onContinue: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal()
    if (!open && ref.current?.open) ref.current.close()
  }, [open])
  return (
    <dialog ref={ref} aria-labelledby="request-sent-title" aria-describedby="request-sent-description"
      onCancel={(event) => { event.preventDefault(); onContinue() }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-8 text-center text-navy shadow-lift backdrop:bg-navy/60 backdrop:backdrop-blur-sm">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-harbor-soft text-harbor">
        <CircleCheck aria-hidden="true" className="size-9" />
      </span>
      <h2 id="request-sent-title" className="mt-6 text-2xl font-bold">Solicitud enviada para comprobación</h2>
      <p id="request-sent-description" className="mt-3 text-base leading-relaxed text-ink-soft">
        {DEMO_MODE ? 'En esta demostración, la comprobación es simulada. Ya puedes explorar Home con tu sesión iniciada.' : 'Tu solicitud quedó pendiente de revisión. Ya puedes entrar a tu espacio.'}
      </p>
      <Button onClick={onContinue} className="mt-7 w-full">Ir a Home</Button>
    </dialog>
  )
}
