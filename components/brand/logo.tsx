import Image from 'next/image'
import { cn } from '@/lib/utils'

type MarkProps = {
  size?: number
  label?: string
  className?: string
  priority?: boolean
}

export function Isotipo({ size = 48, label, className, priority }: MarkProps) {
  return (
    <Image
      src="/brand/isotipo.png"
      alt={label ?? ''}
      width={741}
      height={1024}
      priority={priority}
      style={{ height: size, width: 'auto' }}
      className={cn('shrink-0', className)}
    />
  )
}

export function Wordmark({ size = 24, label = 'BILA', className, priority }: MarkProps) {
  return (
    <Image
      src="/brand/wordmark.png"
      alt={label}
      width={1485}
      height={532}
      priority={priority}
      style={{ height: size, width: 'auto' }}
      className={cn('shrink-0', className)}
    />
  )
}

/** Isotipo y logotipo oficiales, colocados lado a lado sin modificarlos. */
export function Lockup({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Isotipo size={size} priority />
      <Wordmark size={Math.round(size * 0.58)} priority />
    </span>
  )
}
