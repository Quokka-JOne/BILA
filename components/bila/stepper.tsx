import { cn } from '@/lib/utils'

export function Stepper({ steps, current }: { steps: ReadonlyArray<string>; current: number }) {
  return (
    <nav aria-label="Progreso del registro">
      <p className="text-sm font-semibold text-navy">
        Paso {current + 1} de {steps.length}
        <span className="font-medium text-ink-soft"> · {steps[current]}</span>
      </p>
      <ol className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const state = index < current ? 'done' : index === current ? 'current' : 'todo'
          return (
            <li key={step} aria-current={state === 'current' ? 'step' : undefined}>
              <span
                className={cn(
                  'block h-2 rounded-full',
                  state === 'done' && 'bg-harbor',
                  state === 'current' && 'bg-navy',
                  state === 'todo' && 'bg-line',
                )}
              />
              <span
                className={cn(
                  'mt-2 hidden text-xs sm:block',
                  state === 'current' ? 'font-bold text-navy' : 'font-medium text-ink-soft',
                )}
              >
                {step}
              </span>
              <span className="sr-only">
                {step}
                {state === 'done' ? ' (completado)' : state === 'current' ? ' (paso actual)' : ' (pendiente)'}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
