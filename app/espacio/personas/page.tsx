'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Heart,
  AlertTriangle,
  ChevronRight,
  Baby,
  User,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/bila/button'
import { StatusTag, NeutralTag } from '@/components/bila/status-tag'

type Person = {
  id: string
  name: string
  age: number
  status: 'safe' | 'missing' | 'located' | 'rescued' | 'hospitalized'
  priority: 'critical' | 'high' | 'normal' | 'low'
  vulnerable: ('elderly' | 'child' | 'pregnant' | 'medical')[]
  deviceCode: string | null
  lastSeen: string
  emergencyContact: string
  medicalNotes?: string
}

const SAMPLE_PEOPLE: Person[] = [
  { id: '1', name: 'María García López', age: 72, status: 'missing', priority: 'critical', vulnerable: ['elderly', 'medical'], deviceCode: 'BILA-003', lastSeen: 'Hace 45 min', emergencyContact: 'Juan García · +52 55 1234 5678', medicalNotes: 'Diabetes tipo 2, hipertensión' },
  { id: '2', name: 'Sofía Hernández Ruiz', age: 28, status: 'located', priority: 'high', vulnerable: ['pregnant'], deviceCode: 'BILA-007', lastSeen: 'Hace 3 min', emergencyContact: 'Carlos Hernández · +52 55 9876 5432' },
  { id: '3', name: 'Pedro Ramírez', age: 45, status: 'safe', priority: 'normal', vulnerable: [], deviceCode: 'BILA-012', lastSeen: 'Hace 1 min', emergencyContact: 'Ana Ramírez · +52 55 5555 1234' },
  { id: '4', name: 'Valentina Ortiz', age: 6, status: 'missing', priority: 'critical', vulnerable: ['child'], deviceCode: 'BILA-015', lastSeen: 'Hace 1h 20min', emergencyContact: 'Laura Ortiz · +52 55 7777 8888' },
  { id: '5', name: 'Roberto Méndez Gutiérrez', age: 55, status: 'rescued', priority: 'normal', vulnerable: ['medical'], deviceCode: 'BILA-004', lastSeen: 'Hace 10 min', emergencyContact: 'Elena Méndez · +52 55 3333 4444', medicalNotes: 'Alergia a penicilina' },
  { id: '6', name: 'Isabel Torres', age: 35, status: 'hospitalized', priority: 'high', vulnerable: ['medical'], deviceCode: 'BILA-020', lastSeen: 'Hace 30 min', emergencyContact: 'Miguel Torres · +52 55 1111 2222', medicalNotes: 'Fractura de fémur' },
]

const STATUS_STYLES = {
  safe: { label: 'Seguro', className: 'bg-success-soft text-success' },
  missing: { label: 'Sin localizar', className: 'bg-danger-soft text-danger' },
  located: { label: 'Localizado', className: 'bg-harbor-soft text-harbor' },
  rescued: { label: 'Rescatado', className: 'bg-success-soft text-success' },
  hospitalized: { label: 'Hospitalizado', className: 'bg-caution-soft text-caution' },
}

const PRIORITY_STYLES = {
  critical: { label: 'Crítica', className: 'bg-danger text-white' },
  high: { label: 'Alta', className: 'bg-caution-soft text-caution' },
  normal: { label: 'Normal', className: 'bg-cloud-deep text-navy' },
  low: { label: 'Baja', className: 'bg-cloud-deep text-ink-soft' },
}

const VULNERABLE_ICONS = {
  elderly: { icon: Clock, label: 'Adulto mayor' },
  child: { icon: Baby, label: 'Menor de edad' },
  pregnant: { icon: Heart, label: 'Embarazada' },
  medical: { icon: AlertTriangle, label: 'Condición médica' },
}

export default function PersonasPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const filtered = SAMPLE_PEOPLE.filter((p) => {
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.deviceCode?.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesQuery && matchesStatus
  })

  // Sort by priority (critical first)
  const sorted = [...filtered].sort((a, b) => {
    const order = { critical: 0, high: 1, normal: 2, low: 3 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Búsqueda de personas</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Identifica, localiza y gestiona la atención prioritaria de personas registradas
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            placeholder="Buscar por nombre o código de dispositivo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full rounded-xl border-2 border-line-strong bg-white py-3 pl-12 pr-4 text-base text-navy placeholder:text-ink-soft/70 focus:border-navy"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'missing', label: 'Sin localizar' },
            { value: 'located', label: 'Localizados' },
            { value: 'safe', label: 'Seguros' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                statusFilter === opt.value
                  ? 'bg-navy text-white'
                  : 'border-2 border-line bg-white text-navy hover:bg-cloud-deep'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          <strong className="font-bold text-navy">{sorted.length}</strong> personas encontradas
        </p>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-danger" /> Prioridad crítica
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-caution" /> Prioridad alta
          </span>
        </div>
      </div>

      {/* Person list */}
      <div className="grid gap-3 lg:grid-cols-2">
        {sorted.map((person) => (
          <button
            key={person.id}
            onClick={() => setSelectedPerson(person)}
            className={`group flex items-start gap-4 rounded-2xl border bg-white p-5 text-left transition-all hover:shadow-card ${
              selectedPerson?.id === person.id ? 'border-navy shadow-card' : 'border-line'
            } ${person.priority === 'critical' ? 'ring-2 ring-danger/20' : ''}`}
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${person.priority === 'critical' ? 'bg-danger text-white' : 'bg-cloud-deep text-navy'}`}>
              <User aria-hidden="true" className="size-6" />
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-navy">{person.name}</p>
                  <p className="text-sm text-ink-soft">{person.age} años · {person.deviceCode ?? 'Sin dispositivo'}</p>
                </div>
                <ChevronRight className="mt-1 size-5 shrink-0 text-line-strong transition-colors group-hover:text-navy" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[person.status].className}`}>
                  {STATUS_STYLES[person.status].label}
                </span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[person.priority].className}`}>
                  {PRIORITY_STYLES[person.priority].label}
                </span>
                {person.vulnerable.map((v) => {
                  const info = VULNERABLE_ICONS[v]
                  const Icon = info.icon
                  return (
                    <span key={v} className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-semibold text-caution">
                      <Icon className="size-3" />
                      {info.label}
                    </span>
                  )
                })}
              </div>
              <p className="text-xs text-ink-soft">
                <MapPin className="mr-1 inline size-3" />
                Última señal: {person.lastSeen}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Person detail modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm" onClick={() => setSelectedPerson(null)}>
          <div className="w-full max-w-lg space-y-5 rounded-3xl bg-white p-6 shadow-lift sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">{selectedPerson.name}</h2>
                <p className="text-sm text-ink-soft">{selectedPerson.age} años · {selectedPerson.deviceCode}</p>
              </div>
              <button onClick={() => setSelectedPerson(null)} className="text-ink-soft hover:text-navy">✕</button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[selectedPerson.status].className}`}>
                {STATUS_STYLES[selectedPerson.status].label}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${PRIORITY_STYLES[selectedPerson.priority].className}`}>
                Prioridad: {PRIORITY_STYLES[selectedPerson.priority].label}
              </span>
            </div>

            <div className="space-y-3 rounded-xl bg-cloud p-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-ink-soft" />
                <span className="font-medium text-navy">{selectedPerson.emergencyContact}</span>
              </div>
              {selectedPerson.medicalNotes && (
                <div className="flex items-start gap-2">
                  <Heart className="mt-0.5 size-4 text-danger" />
                  <span className="text-navy">{selectedPerson.medicalNotes}</span>
                </div>
              )}
              {selectedPerson.vulnerable.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedPerson.vulnerable.map((v) => {
                    const info = VULNERABLE_ICONS[v]
                    return (
                      <NeutralTag key={v}>{info.label}</NeutralTag>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">Rastrear</Button>
              <Button variant="gold" className="flex-1">Marcar como rescatado</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
