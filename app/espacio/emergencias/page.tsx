'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Clock,
  Radio,
  Flame,
  Waves,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react'
import { StatusTag, NeutralTag } from '@/components/bila/status-tag'
import { Button } from '@/components/bila/button'

type Emergency = {
  id: string
  title: string
  type: 'sismo' | 'derrumbe' | 'fuga_gas' | 'inundacion'
  severity: 'critica' | 'alta' | 'media' | 'baja'
  location: string
  timestamp: string
  signalsCount: number
  teamsAssigned: number
  status: 'activa' | 'en_atencion' | 'controlada'
}

const INITIAL_EMERGENCIES: Emergency[] = [
  {
    id: 'EMG-2026-004',
    title: 'Derrumbe estructural con víctimas potenciales',
    type: 'derrumbe',
    severity: 'critica',
    location: 'Col. Roma Norte, Calle Álvaro Obregón #182',
    timestamp: 'Hace 8 minutos',
    signalsCount: 14,
    teamsAssigned: 3,
    status: 'activa',
  },
  {
    id: 'EMG-2026-003',
    title: 'Fuga de gas y posible conflagración post-sismo',
    type: 'fuga_gas',
    severity: 'alta',
    location: 'Col. Condesa, Av. Michoacán #45',
    timestamp: 'Hace 22 minutos',
    signalsCount: 6,
    teamsAssigned: 2,
    status: 'en_atencion',
  },
  {
    id: 'EMG-2026-002',
    title: 'Evacuación de hospital y fallas eléctricas',
    type: 'sismo',
    severity: 'alta',
    location: 'Col. Juárez, Calle Londres #102',
    timestamp: 'Hace 45 minutos',
    signalsCount: 9,
    teamsAssigned: 4,
    status: 'en_atencion',
  },
  {
    id: 'EMG-2026-001',
    title: 'Grieta estructural en puente peatonal',
    type: 'sismo',
    severity: 'media',
    location: 'Viaducto Miguel Alemán y Calz. de Tlalpan',
    timestamp: 'Hace 1 hora',
    signalsCount: 2,
    teamsAssigned: 1,
    status: 'controlada',
  },
]

export default function EmergenciasPage() {
  const [filter, setFilter] = useState<'todas' | 'activa' | 'en_atencion' | 'controlada'>('todas')
  const [emergencies] = useState<Emergency[]>(INITIAL_EMERGENCIES)

  const filtered = emergencies.filter(
    (e) => filter === 'todas' || e.status === filter,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Gestión de Emergencias Sísmicas
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Protocolos de respuesta inmediata y coordinación de incidentes en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm">
            <AlertTriangle className="size-4" /> Declarar Alerta Roja
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Críticas</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">1</div>
          <p className="mt-0.5 text-xs text-ink-soft">Prioridad máxima de rescate</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600">
            <Activity className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">En Atención</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">2</div>
          <p className="mt-0.5 text-xs text-ink-soft">Brigadas desplegadas</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-forest">
            <CheckCircle2 className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Controladas</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">1</div>
          <p className="mt-0.5 text-xs text-ink-soft">Áreas seguras</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-navy">
            <Radio className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Señales LoRaWAN</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">31</div>
          <p className="mt-0.5 text-xs text-ink-soft">Wearables transmitiendo</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-line pb-2">
        {(
          [
            { id: 'todas', label: 'Todas las alertas' },
            { id: 'activa', label: 'Activas' },
            { id: 'en_atencion', label: 'En curso' },
            { id: 'controlada', label: 'Controladas' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === tab.id
                ? 'bg-navy text-white shadow-sm'
                : 'text-ink-soft hover:bg-cloud-deep hover:text-navy'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink-soft">{item.id}</span>
                  {item.severity === 'critica' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                      <Flame className="size-3" /> Crítica
                    </span>
                  )}
                  {item.severity === 'alta' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Alta prioridad
                    </span>
                  )}
                  {item.severity === 'media' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      Media
                    </span>
                  )}
                  {item.status === 'activa' && <StatusTag kind="urgent" label="Activa" />}
                  {item.status === 'en_atencion' && <NeutralTag>En atención</NeutralTag>}
                  {item.status === 'controlada' && <StatusTag kind="verified" label="Controlada" />}
                </div>
                <h3 className="text-base font-bold text-navy">{item.title}</h3>
                <p className="text-xs text-ink-soft">{item.location}</p>
              </div>

              <div className="flex shrink-0 items-center gap-4 text-xs font-medium text-ink-soft">
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {item.timestamp}
                </div>
                <div className="flex items-center gap-1">
                  <Radio className="size-3.5 text-navy" />
                  {item.signalsCount} balizas
                </div>
                <div className="flex items-center gap-1">
                  <ShieldAlert className="size-3.5 text-forest" />
                  {item.teamsAssigned} brigadas
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
