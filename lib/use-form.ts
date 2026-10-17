'use client'

import { useState, type ChangeEvent } from 'react'

type Values = Record<string, string | boolean>
type Errors<T> = Partial<Record<keyof T & string, string | undefined>>
type ChangeTarget = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function useForm<T extends Values>(initial: T, validate: (values: T) => Errors<T>) {
  const [values, setValues] = useState<T>(initial)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = validate(values)

  const errorFor = (name: keyof T & string) => (touched[name] ? errors[name] : undefined)
  const setValue = (name: keyof T & string, value: string | boolean) =>
    setValues((previous) => ({ ...previous, [name]: value }))
  const markTouched = (name: string) => setTouched((previous) => ({ ...previous, [name]: true }))

  const field = (name: keyof T & string) => ({
    name,
    value: values[name] as string,
    error: errorFor(name),
    onChange: (event: ChangeEvent<ChangeTarget>) => setValue(name, event.target.value),
    onBlur: () => markTouched(name),
  })

  const check = (name: keyof T & string) => ({
    name,
    checked: values[name] as boolean,
    error: errorFor(name),
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setValue(name, event.target.checked)
      markTouched(name)
    },
  })

  /** Marca todos los campos como tocados y enfoca el primero con error. */
  const validateAll = (): boolean => {
    const names = Object.keys(values)
    setTouched(Object.fromEntries(names.map((name) => [name, true])))
    const firstInvalid = names.find((name) => errors[name as keyof T & string])
    if (!firstInvalid) return true
    requestAnimationFrame(() => {
      const target = document.getElementsByName(firstInvalid)[0]
      target?.focus()
    })
    return false
  }

  return { values, field, check, setValue, validateAll }
}
