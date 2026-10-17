'use client'

import { useState } from 'react'
import {
  MapPin,
  Satellite,
  Radio,
  Bluetooth,
  Layers,
  Users,
  AlertTriangle,
  Locate,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/bila/button'
import { NeutralTag, StatusTag } from '@/components/bila/status-tag'

type DevicePin = {
  id: string
  name: string
  lat: number
  lng: number
  status: 'safe' | 'located' | 'missing' | 'emergency'
  protocol: 'lorawan' | 'ble' | 'gps'
  battery: number
  lastSeen: string
}

const SAMPLE_DEVICES: DevicePin[] = [
  { id: 'BILA-001', name: 'María García', lat: 19.4326, lng: -99.1332, status: 'safe', protocol: 'lorawan', battery: 87, lastSeen: 'Hace 2 min' },
  { id: 'BILA-002', name: 'Carlos Ruiz', lat: 19.4280, lng: -99.1400, status: 'located', protocol: 'ble', battery: 45, lastSeen: 'Hace 8 min' },
  { id: 'BILA-003', name: 'Ana López', lat: 19.4350, lng: -99.1250, status: 'missing', protocol: 'gps', battery: 12, lastSeen: 'Hace 45 min' },
  { id: 'BILA-004', name: 'Roberto Méndez', lat: 19.4300, lng: -99.1380, status: 'emergency', protocol: 'lorawan', battery: 23, lastSeen: 'Hace 1 min' },
  { id: 'BILA-005', name: 'Laura Torres', lat: 19.4360, lng: -99.1310, status: 'safe', protocol: 'ble', battery: 92, lastSeen: 'Hace 5 min' },
]

const STATUS_COLORS = {
  safe: 'bg-success',
  located: 'bg-harbor',
  missing: 'bg-caution',
  emergency: 'bg-danger',
}

const STATUS_LABELS = {
  safe: 'Seguro',
  located: 'Localizado',
  missing: 'Sin localizar',
  emergency: 'Emergencia',
}

const PROTOCOL_ICONS = {
  lorawan: Radio,
  ble: Bluetooth,
  gps: Satellite,
}

export default function MapPage() {
  const [selectedDevice, setSelectedDevice] = useState<DevicePin | null>(null)
  const [activeLayer, setActiveLayer] = useState<'all' | 'emergency' | 'missing'>('all')

  const filteredDevices = SAMPLE_DEVICES.filter((d) => {
    if (activeLayer === 'emergency') return d.status === 'emergency'
    if (activeLayer === 'missing') return d.status === 'missing'
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Mapa en tiempo real</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Visualización de dispositivos BILA activos y señales de emergencia
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <RefreshCw aria-hidden="true" className="size-4" />
            Actualizar
          </Button>
          <Button variant="primary" className="gap-2">
            <Locate aria-hidden="true" className="size-4" />
            Mi ubicación
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Map area */}
        <div className="relative min-h-[500px] overflow-hidden rounded-2xl border border-line bg-navy">
          {/* Simulated map grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cfe3e4" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Simulated radar rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[280, 200, 120].map((size) => (
              <div
                key={size}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-harbor/20"
                style={{ width: size, height: size }}
              />
            ))}
            <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_20px_rgba(227,162,9,0.5)]" />
          </div>

          {/* Device pins */}
          {filteredDevices.map((device, i) => {
            const offsetX = 15 + (i * 17) % 70
            const offsetY = 10 + (i * 23) % 70
            return (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className="group absolute transition-transform hover:scale-110"
                style={{ left: `${offsetX}%`, top: `${offsetY}%` }}
                aria-label={`${device.name}: ${STATUS_LABELS[device.status]}`}
              >
                <span className="relative flex size-6">
                  {device.status === 'emergency' && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-75" />
                  )}
                  <span className={`relative inline-flex size-6 items-center justify-center rounded-full ${STATUS_COLORS[device.status]} text-white shadow-lg`}>
                    <MapPin className="size-3.5" />
                  </span>
                </span>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy/90 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {device.name}
                </span>
              </button>
            )
          })}

          {/* Map controls */}
          <div className="absolute right-3 top-3 flex flex-col gap-1">
            <button className="grid size-8 place-items-center rounded-lg bg-white/90 text-navy shadow hover:bg-white">
              <ZoomIn className="size-4" />
            </button>
            <button className="grid size-8 place-items-center rounded-lg bg-white/90 text-navy shadow hover:bg-white">
              <ZoomOut className="size-4" />
            </button>
          </div>

          {/* Layer controls */}
          <div className="absolute bottom-3 left-3 flex gap-1">
            {(['all', 'emergency', 'missing'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow transition-colors ${
                  activeLayer === layer
                    ? 'bg-gold text-navy'
                    : 'bg-white/90 text-navy hover:bg-white'
                }`}
              >
                <Layers className="size-3" />
                {layer === 'all' ? 'Todos' : layer === 'emergency' ? 'Emergencia' : 'Sin localizar'}
              </button>
            ))}
          </div>

          {/* Stats overlay */}
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="flex items-center gap-1.5 rounded-lg bg-navy/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Users className="size-3" />
              {filteredDevices.length} dispositivos
            </span>
            {filteredDevices.some((d) => d.status === 'emergency') && (
              <span className="flex items-center gap-1.5 rounded-lg bg-danger/90 px-3 py-1.5 text-xs font-bold text-white animate-pulse">
                <AlertTriangle className="size-3" />
                Señal de emergencia
              </span>
            )}
          </div>
        </div>

        {/* Sidebar: device list + details */}
        <div className="space-y-4">
          {selectedDevice ? (
            <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-navy">{selectedDevice.name}</h3>
                  <p className="font-mono text-sm text-ink-soft">{selectedDevice.id}</p>
                </div>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="text-sm font-semibold text-ink-soft hover:text-navy"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusTag
                  kind={
                    selectedDevice.status === 'emergency' ? 'urgent' :
                    selectedDevice.status === 'safe' ? 'verified' :
                    selectedDevice.status === 'located' ? 'location-current' :
                    'location-unavailable'
                  }
                  label={STATUS_LABELS[selectedDevice.status]}
                />
                <NeutralTag>
                  {selectedDevice.protocol.toUpperCase()}
                </NeutralTag>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Batería</span>
                  <span className="font-semibold text-navy">
                    <span className={`inline-block size-2 rounded-full mr-1.5 ${selectedDevice.battery > 50 ? 'bg-success' : selectedDevice.battery > 20 ? 'bg-caution' : 'bg-danger'}`} />
                    {selectedDevice.battery}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Última señal</span>
                  <span className="font-semibold text-navy">{selectedDevice.lastSeen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Protocolo</span>
                  <span className="flex items-center gap-1.5 font-semibold text-navy">
                    {(() => { const Icon = PROTOCOL_ICONS[selectedDevice.protocol]; return <Icon className="size-3.5" /> })()}
                    {selectedDevice.protocol.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Coordenadas</span>
                  <span className="font-mono text-xs text-navy">
                    {selectedDevice.lat.toFixed(4)}, {selectedDevice.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="primary" className="flex-1 text-sm">
                  Rastrear
                </Button>
                <Button variant="secondary" className="flex-1 text-sm">
                  Historial
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="mb-3 text-sm font-bold text-navy">Dispositivos activos</p>
              <p className="mb-4 text-xs text-ink-soft">Selecciona un pin en el mapa o un dispositivo de la lista</p>
            </div>
          )}

          {/* Device list */}
          <div className="space-y-2">
            {SAMPLE_DEVICES.map((device) => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-all hover:shadow-card ${
                  selectedDevice?.id === device.id ? 'border-navy shadow-card' : 'border-line'
                }`}
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${STATUS_COLORS[device.status]} text-white`}>
                  <MapPin className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{device.name}</p>
                  <p className="text-xs text-ink-soft">{device.id} · {device.lastSeen}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold ${device.battery > 50 ? 'text-success' : device.battery > 20 ? 'text-caution' : 'text-danger'}`}>
                    {device.battery}%
                  </span>
                  <span className="text-[10px] font-medium text-ink-soft">{device.protocol.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
