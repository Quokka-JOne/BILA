import { Check, type LucideIcon } from 'lucide-react'
import { NeutralTag } from './status-tag'

export function RoleCard({
  name,
  value,
  checked,
  onChange,
  icon: Icon,
  title,
  description,
  note,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  icon: LucideIcon
  title: string
  description: string
  note?: string
}) {
  return (
    <label className="group relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-line bg-white p-5 transition-shadow hover:border-line-strong has-[:checked]:border-navy has-[:checked]:shadow-card has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-cloud text-navy group-has-[:checked]:bg-navy group-has-[:checked]:text-white">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold leading-snug text-navy">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{description}</span>
        {note && (
          <span className="mt-3 block">
            <NeutralTag>{note}</NeutralTag>
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border-2 border-line-strong group-has-[:checked]:border-gold group-has-[:checked]:bg-gold"
      >
        <Check
          strokeWidth={3}
          className="size-4 text-navy opacity-0 group-has-[:checked]:opacity-100"
        />
      </span>
    </label>
  )
}
