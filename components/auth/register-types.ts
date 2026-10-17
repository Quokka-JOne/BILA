export type Role = 'persona' | 'rescatista' | 'coordinador'

export type AccountValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm: string
}

export type PersonaValues = {
  birthDate: string
  phone: string
  emergencyName: string
  emergencyRelation: string
  emergencyPhone: string
  medicalNotes: string
  shareMedical: boolean
  shareLocation: boolean
  deviceType: string
}

export type RescuerValues = {
  organization: string
  professionalId: string
  verifier: string
  consent: boolean
}

export type CoordinatorValues = {
  organization: string
  position: string
  approver: string
  consent: boolean
}

export type ProfileDrafts = {
  persona?: PersonaValues
  rescatista?: RescuerValues
  coordinador?: CoordinatorValues
}

export type ProfileFormProps<V> = {
  account: AccountValues
  initial?: V
  submitting: boolean
  error: string
  onBack: (values: V) => void
  onSubmit: (values: V) => void
}
