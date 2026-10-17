import { Check, Circle } from 'lucide-react'
import { passwordRules } from '@/lib/validation'
import { cn } from '@/lib/utils'

export function PasswordRules({ value }: { value: string }) {
  return (
    <ul aria-label="Reglas de la contraseña" className="mt-3 space-y-1.5">
      {passwordRules.map((rule) => {
        const met = rule.test(value)
        const Icon = met ? Check : Circle
        return (
          <li
            key={rule.id}
            className={cn('flex items-center gap-2 text-sm', met ? 'font-semibold text-success' : 'text-ink-soft')}
          >
            <Icon aria-hidden="true" strokeWidth={met ? 3 : 2} className="size-4 shrink-0" />
            <span>
              {rule.label}
              <span className="sr-only">{met ? ' (cumplida)' : ' (pendiente)'}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
