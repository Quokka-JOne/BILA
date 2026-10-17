'use client'

import { useState } from 'react'
import {
  Package,
  Droplets,
  Apple,
  Pill,
  Home,
  Wrench,
  Plus,
  Minus,
  ArrowUpDown,
  BarChart3,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/bila/button'
import { NeutralTag } from '@/components/bila/status-tag'

type SupplyCategory = 'water' | 'food' | 'medicine' | 'shelter' | 'equipment' | 'other'

type SupplyItem = {
  id: string
  category: SupplyCategory
  name: string
  quantity: number
  unit: string
  minRequired: number
  location: string
  lastUpdated: string
}

const CATEGORY_CONFIG: Record<SupplyCategory, { icon: typeof Package; label: string; color: string }> = {
  water: { icon: Droplets, label: 'Agua', color: 'bg-blue-50 text-blue-600' },
  food: { icon: Apple, label: 'Alimentos', color: 'bg-emerald-50 text-emerald-600' },
  medicine: { icon: Pill, label: 'Medicinas', color: 'bg-purple-50 text-purple-600' },
  shelter: { icon: Home, label: 'Refugio', color: 'bg-amber-50 text-amber-700' },
  equipment: { icon: Wrench, label: 'Equipamiento', color: 'bg-slate-100 text-slate-600' },
  other: { icon: Package, label: 'Otros', color: 'bg-cloud-deep text-navy' },
}

const SAMPLE_SUPPLIES: SupplyItem[] = [
  { id: '1', category: 'water', name: 'Garrafones de agua potable (20L)', quantity: 245, unit: 'garrafones', minRequired: 500, location: 'Centro de acopio A', lastUpdated: 'Hace 15 min' },
  { id: '2', category: 'water', name: 'Botellas de agua (500ml)', quantity: 3200, unit: 'botellas', minRequired: 2000, location: 'Centro de acopio A', lastUpdated: 'Hace 30 min' },
  { id: '3', category: 'food', name: 'Raciones de emergencia', quantity: 850, unit: 'raciones', minRequired: 1000, location: 'Almacén central', lastUpdated: 'Hace 1h' },
  { id: '4', category: 'food', name: 'Latas de alimento', quantity: 1500, unit: 'latas', minRequired: 1200, location: 'Centro de acopio B', lastUpdated: 'Hace 2h' },
  { id: '5', category: 'medicine', name: 'Kits de primeros auxilios', quantity: 45, unit: 'kits', minRequired: 100, location: 'Hospital de campo', lastUpdated: 'Hace 45 min' },
  { id: '6', category: 'medicine', name: 'Insulina', quantity: 12, unit: 'dosis', minRequired: 50, location: 'Hospital de campo', lastUpdated: 'Hace 20 min' },
  { id: '7', category: 'shelter', name: 'Carpas familiares', quantity: 35, unit: 'carpas', minRequired: 80, location: 'Base operativa', lastUpdated: 'Hace 3h' },
  { id: '8', category: 'shelter', name: 'Cobijas térmicas', quantity: 400, unit: 'cobijas', minRequired: 300, location: 'Centro de acopio A', lastUpdated: 'Hace 1h' },
  { id: '9', category: 'equipment', name: 'Linternas con batería', quantity: 120, unit: 'linternas', minRequired: 200, location: 'Base operativa', lastUpdated: 'Hace 5h' },
  { id: '10', category: 'equipment', name: 'Radios portátiles', quantity: 18, unit: 'radios', minRequired: 30, location: 'Centro de comando', lastUpdated: 'Hace 2h' },
]

export default function RecursosPage() {
  const [filter, setFilter] = useState<SupplyCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'urgency'>('urgency')

  const filtered = SAMPLE_SUPPLIES.filter((s) => filter === 'all' || s.category === filter)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'urgency') {
      const urgencyA = a.quantity / a.minRequired
      const urgencyB = b.quantity / b.minRequired
      return urgencyA - urgencyB
    }
    return a.name.localeCompare(b.name)
  })

  const totalItems = SAMPLE_SUPPLIES.reduce((acc, s) => acc + s.quantity, 0)
  const criticalItems = SAMPLE_SUPPLIES.filter((s) => s.quantity / s.minRequired < 0.5).length
  const categories = Object.keys(CATEGORY_CONFIG) as SupplyCategory[]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Gestión de recursos</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Administra el inventario de suministros para garantizar distribución equitativa
          </p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus aria-hidden="true" className="size-4" />
          Registrar suministro
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-harbor-soft text-harbor">
              <BarChart3 className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink-soft">Total de artículos</p>
              <p className="text-2xl font-bold text-navy">{totalItems.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-danger-soft text-danger">
              <TrendingDown className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink-soft">Recursos críticos</p>
              <p className="text-2xl font-bold text-danger">{criticalItems}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-gold-soft text-caution">
              <Package className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink-soft">Categorías activas</p>
              <p className="text-2xl font-bold text-navy">{new Set(SAMPLE_SUPPLIES.map((s) => s.category)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              filter === 'all' ? 'bg-navy text-white' : 'border-2 border-line bg-white text-navy hover:bg-cloud-deep'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => {
            const config = CATEGORY_CONFIG[cat]
            const Icon = config.icon
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === cat ? 'bg-navy text-white' : 'border-2 border-line bg-white text-navy hover:bg-cloud-deep'
                }`}
              >
                <Icon className="size-3.5" />
                {config.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'urgency' ? 'name' : 'urgency')}
          className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-navy"
        >
          <ArrowUpDown className="size-3.5" />
          {sortBy === 'urgency' ? 'Por urgencia' : 'Por nombre'}
        </button>
      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-cloud/50">
                <th className="px-5 py-3 text-left font-bold text-navy">Recurso</th>
                <th className="px-5 py-3 text-left font-bold text-navy">Categoría</th>
                <th className="px-5 py-3 text-right font-bold text-navy">Disponible</th>
                <th className="px-5 py-3 text-right font-bold text-navy">Mínimo</th>
                <th className="hidden px-5 py-3 text-left font-bold text-navy sm:table-cell">Estado</th>
                <th className="hidden px-5 py-3 text-left font-bold text-navy md:table-cell">Ubicación</th>
                <th className="px-5 py-3 text-center font-bold text-navy">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sorted.map((item) => {
                const ratio = item.quantity / item.minRequired
                const config = CATEGORY_CONFIG[item.category]
                const Icon = config.icon
                const isCritical = ratio < 0.5
                const isLow = ratio < 0.8
                return (
                  <tr key={item.id} className={`transition-colors hover:bg-cloud/30 ${isCritical ? 'bg-danger-soft/20' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy">{item.name}</p>
                      <p className="text-xs text-ink-soft">{item.lastUpdated}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.color}`}>
                        <Icon className="size-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`font-bold ${isCritical ? 'text-danger' : 'text-navy'}`}>
                        {item.quantity.toLocaleString()}
                      </span>
                      <span className="ml-1 text-xs text-ink-soft">{item.unit}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-ink-soft">
                      {item.minRequired.toLocaleString()}
                    </td>
                    <td className="hidden px-5 py-4 sm:table-cell">
                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-cloud-deep">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isCritical ? 'bg-danger' : isLow ? 'bg-caution' : 'bg-success'
                            }`}
                            style={{ width: `${Math.min(100, ratio * 100)}%` }}
                          />
                        </div>
                        {isCritical && <AlertTriangle className="size-4 text-danger" />}
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 text-sm text-ink-soft md:table-cell">
                      {item.location}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="grid size-8 place-items-center rounded-lg border border-line text-navy hover:bg-cloud-deep">
                          <Minus className="size-3.5" />
                        </button>
                        <button className="grid size-8 place-items-center rounded-lg border border-line text-navy hover:bg-cloud-deep">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
