import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/bila/button'

export function StepActions({
  nextLabel,
  loadingLabel,
  loading,
  onBack,
}: {
  nextLabel: string
  loadingLabel?: string
  loading?: boolean
  onBack?: () => void
}) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
      {onBack ? (
        <Button variant="secondary" onClick={onBack} disabled={loading} className="sm:min-w-32">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Atrás
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" loading={loading} loadingLabel={loadingLabel} className="sm:min-w-48">
        {nextLabel}
      </Button>
    </div>
  )
}
