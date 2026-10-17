import Link from 'next/link'
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

export type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'quiet'

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-navy text-white hover:bg-pageant active:bg-pageant',
  gold: 'bg-gold text-navy hover:brightness-105 active:brightness-95',
  secondary: 'border-2 border-navy bg-white text-navy hover:bg-cloud-deep',
  quiet: 'px-3 text-navy underline decoration-gold decoration-2 underline-offset-4 hover:bg-cloud-deep',
}

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return cn(base, variants[variant], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
  loadingLabel?: string
}

export function Button({
  variant = 'primary',
  loading = false,
  loadingLabel,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, className)}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />
}
