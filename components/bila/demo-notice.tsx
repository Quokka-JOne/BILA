import { FlaskConical } from 'lucide-react'
import { DEMO_MODE, DEMO_NOTICE } from '@/lib/demo'

export function DemoNotice() {
  if (!DEMO_MODE) return null
  return (
    <div role="note" className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-navy">
      <FlaskConical aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-caution" />
      <p><strong className="font-bold">Modo demostración.</strong> {DEMO_NOTICE} Usa datos ficticios.</p>
    </div>
  )
}
