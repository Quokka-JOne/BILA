'use client'

import { Check, ChevronDown, CircleAlert, Eye, EyeOff } from 'lucide-react'
import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

type FrameProps = {
  label: string
  hint?: ReactNode
  error?: string
  optional?: boolean
}

const control =
  'block w-full rounded-xl border-2 bg-white px-4 text-base text-navy transition-colors placeholder:text-ink-soft/70 hover:border-navy focus:border-navy disabled:bg-cloud-deep disabled:text-ink-soft'

function controlClass(error?: string, extra?: string) {
  return cn(control, error ? 'border-danger' : 'border-line-strong', extra)
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-medium text-danger">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

function Frame({
  id,
  label,
  hint,
  error,
  optional,
  children,
  after,
}: FrameProps & { id: string; children: ReactNode; after?: ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-navy"
      >
        <span>{label}</span>
        {optional && <span className="text-xs font-medium text-ink-soft">Opcional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 mb-2 text-sm text-ink-soft">
          {hint}
        </p>
      )}
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
      {after}
    </div>
  )
}

type TextFieldProps = FrameProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>

export function TextField({ label, hint, error, optional, className, ...input }: TextFieldProps) {
  const id = useId()
  return (
    <Frame id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(error, cn('min-h-12', className))}
        {...input}
      />
    </Frame>
  )
}

type PasswordFieldProps = FrameProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & { footer?: ReactNode }

export function PasswordField({
  label,
  hint,
  error,
  optional,
  footer,
  className,
  ...input
}: PasswordFieldProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  return (
    <Frame id={id} label={label} hint={hint} error={error} optional={optional} after={footer}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={controlClass(error, cn('min-h-12 pr-14', className))}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-pressed={visible}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-navy hover:bg-cloud-deep"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-5" />
          ) : (
            <Eye aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>
    </Frame>
  )
}

type SelectFieldProps = FrameProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
    options: ReadonlyArray<{ value: string; label: string }>
    placeholder?: string
  }

export function SelectField({
  label,
  hint,
  error,
  optional,
  options,
  placeholder = 'Selecciona una opción',
  className,
  ...select
}: SelectFieldProps) {
  const id = useId()
  return (
    <Frame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={controlClass(error, cn('min-h-12 appearance-none pr-12', className))}
          {...select}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-navy"
        />
      </div>
    </Frame>
  )
}

type TextAreaFieldProps = FrameProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>

export function TextAreaField({
  label,
  hint,
  error,
  optional,
  className,
  ...textarea
}: TextAreaFieldProps) {
  const id = useId()
  return (
    <Frame id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(error, cn('min-h-24 py-3', className))}
        {...textarea}
      />
    </Frame>
  )
}

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  label: ReactNode
  description?: ReactNode
  error?: string
}

export function CheckboxField({ label, description, error, className, ...input }: CheckboxFieldProps) {
  const id = useId()
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
          <input
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, description, error)}
            className={cn(
              'peer size-6 cursor-pointer appearance-none rounded-md border-2 bg-white checked:border-navy checked:bg-navy hover:border-navy',
              error ? 'border-danger' : 'border-line-strong',
            )}
            {...input}
          />
          <Check
            aria-hidden="true"
            strokeWidth={3}
            className="pointer-events-none absolute size-4 text-white opacity-0 peer-checked:opacity-100"
          />
        </span>
        <div className="min-w-0">
          <label htmlFor={id} className="cursor-pointer text-base font-medium text-navy">
            {label}
          </label>
          {description && (
            <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

type RadioOption = { value: string; label: string; description?: string }

export function RadioGroupField({
  legend,
  name,
  value,
  options,
  onChange,
  error,
}: {
  legend: string
  name: string
  value: string
  options: ReadonlyArray<RadioOption>
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-navy">{legend}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="group flex cursor-pointer items-start gap-3 rounded-xl border-2 border-line bg-white p-4 hover:border-line-strong has-[:checked]:border-navy has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 border-line-strong group-has-[:checked]:border-navy"
            >
              <span className="size-2.5 rounded-full bg-navy opacity-0 group-has-[:checked]:opacity-100" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-semibold text-navy">{option.label}</span>
              {option.description && (
                <span className="mt-0.5 block text-sm text-ink-soft">{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
      {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
    </fieldset>
  )
}
