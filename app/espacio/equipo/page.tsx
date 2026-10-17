'use client'

import { useState } from 'react'
import {
  Users,
  HardHat,
  Shield,
  Phone,
  Radio,
  MapPin,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  Search,
} from 'lucide-react'
import { StatusTag, NeutralTag } from '@/components/bila/status-tag'
import { Button } from '@/components/bila/button'

type Rescuer = {
  id: string
  name: string
  role: 'Líder de Brigada' | 'Especialista USAR' | 'Médico Triage' | 'Operador Telecom LoRaWAN'
  organization: string
  zone: string
  status: 'en_campo' | 'disponible' | 'en_descanso'
  batteryLevel: number
  lastContact: string
  activeEmergencyId?: string
}

const RESCUERS: Rescuer[] = [
  {
    id: 'BRIG-01',
    name: 'Cap. Martín Domínguez',
    role: 'Líder de Brigada',
    organization: 'Topos Tlatelolco',
    zone: 'Roma Norte (Sector 4)',
    status: 'en_campo',
    batteryLevel: 94,
    lastContact: 'Hace 2 min',
    activeEmergencyId: 'EMG-2026-004',
  },
  {
    id: 'BRIG-02',
    name: 'Dra. Carmen Valenzuela',
    role: 'Médico Triage',
    organization: 'Cruz Roja Mexicana',
    zone: 'Condesa Puesto de Mando',
    status: 'en_campo',
    batteryLevel: 82,
    lastContact: 'Hace 5 min',
    activeEmergencyId: 'EMG-2026-003',
  },
  {
    id: 'BRIG-03',
    name: 'Ing. Rodrigo Salazar',
    role: 'Operador Telecom LoRaWAN',
    organization: 'CENAPRED / BILA Core',
    zone: 'Puesto Central Reforma',
    status: 'disponible',
    batteryLevel: 98,
    lastContact: 'Activo ahora',
  },
  {
    id: 'BRIG-04',
    name: 'Téc. Sofía Hernández',
    role: 'Especialista USAR',
    organization: 'Bomberos CDMX',
    zone: 'Col. Juárez Hospital',
    status: 'en_campo',
    batteryLevel: 67,
    lastContact: 'Hace 12 min',
    activeEmergencyId: 'EMG-2026-002',
  },
]

export default function EquipoPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'en_campo' | 'disponible' | 'en_descanso'>('todos')

  const filtered = RESCUERS.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Brigadas y Personal de Rescate
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Monitoreo en vivo de brigadistas desplegados, telecomunicaciones y disponibilidad de equipos USAR.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-forest">
            <UserCheck className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">En Campo</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">3</div>
          <p className="mt-0.5 text-xs text-ink-soft">Brigadas activas en zona cero</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <Users className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Disponibles</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">1</div>
          <p className="mt-0.5 text-xs text-ink-soft">Listos para relevo o despliegue</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-navy">
            <Radio className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Nodos Repetidores</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">12</div>
          <p className="mt-0.5 text-xs text-ink-soft">Auracast & LoRaWAN online</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Tiempo Promedio</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">4.2 min</div>
          <p className="mt-0.5 text-xs text-ink-soft">Respuesta inicial de brigada</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Buscar por nombre, brigada o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm text-navy placeholder:text-ink-soft/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
        </div>

        <div className="flex gap-2">
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'en_campo', label: 'En campo' },
              { id: 'disponible', label: 'Disponibles' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-ink-soft hover:bg-cloud-deep hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Rescuers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <HardHat className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy">{r.name}</h3>
                  <p className="text-xs font-medium text-ink-soft">{r.role} · {r.organization}</p>
                </div>
              </div>
              <div>
                {r.status === 'en_campo' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    En campo
                  </span>
                )}
                {r.status === 'disponible' && <StatusTag kind="verified" label="Disponible" />}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line/60 pt-3 text-xs text-ink-soft">
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-navy" />
                <span className="truncate">{r.zone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio className="size-3.5 text-forest" />
                <span>Batería baliza: {r.batteryLevel}%</span>
              </div>
            </div>

            {r.activeEmergencyId && (
              <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs font-medium text-red-800">
                Asignado a: <span className="font-bold">{r.activeEmergencyId}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
