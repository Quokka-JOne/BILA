'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './button'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      onClick={(event) => {
        if (event.target === ref.current) onCancel()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-0 text-navy shadow-lift backdrop:bg-navy/60"
    >
      <div className="p-6 sm:p-8">
        <h2 id={titleId} className="text-xl font-bold leading-snug">
          {title}
        </h2>
        <div id={descriptionId} className="mt-3 text-base leading-relaxed text-ink-soft">
          {description}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          <Button onClick={onCancel} className="sm:flex-1">
            {cancelLabel}
          </Button>
          <Button variant="secondary" onClick={onConfirm} className="sm:flex-1">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
