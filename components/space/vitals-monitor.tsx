'use client'

import { useEffect, useState } from 'react'
import { Activity, ArrowUpRight, BatteryMedium, Bluetooth, Circle, Droplets, Gauge, HeartPulse, Pause, Play, RefreshCw, Watch } from 'lucide-react'

const samples = [72, 74, 73, 76, 75, 72, 71, 73, 74, 72, 70, 72, 74, 73, 72, 75, 74, 72, 73, 71, 72, 74, 73, 72]
const oxygen = [98, 98, 99, 98, 97, 98, 99, 98]
const pressure = [[118, 76], [120, 78], [119, 77], [117, 76], [118, 78], [120, 77]]

function Sparkline({ values, color, label }: { values: number[]; color: string; label: string }) {
  const min = Math.min(...values) - 3
  const max = Math.max(...values) + 3
  const points = values.map((value, index) => `${index * 300 / (values.length - 1)},${50 - (value - min) * 44 / (max - min)}`).join(' ')
  return (
    <svg viewBox="0 0 300 56" className="mt-4 h-14 w-full" role="img" aria-label={label} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function VitalsMonitor({ deviceType = '' }: { deviceType?: 'pulsera' | 'anillo' | '' }) {
  const [tick, setTick] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [updated, setUpdated] = useState('Hace un momento')
  useEffect(() => {
    if (!playing) return
    const interval = window.setInterval(() => {
      setTick(value => value + 1)
      setUpdated(new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 3000)
    return () => window.clearInterval(interval)
  }, [playing])

  const pulse = samples[tick % samples.length]
  const spo2 = oxygen[tick % oxygen.length]
  const [systolic, diastolic] = pressure[tick % pressure.length]
  const history = Array.from({ length: 24 }, (_, index) => samples[(index + tick) % samples.length])
  const device = deviceType === 'anillo' ? 'Anillo' : 'Pulsera'
  const DeviceIcon = deviceType === 'anillo' ? Circle : Watch
  const ecg = Array.from({ length: 6 }, (_, index) => {
    const x = index * 100
    const height = (pulse - 65) * 1.5
    return `${x},86 ${x + 15},86 ${x + 21},79 ${x + 28},86 ${x + 39},86 ${x + 44},100 ${x + 50},${28 - height} ${x + 56},126 ${x + 62},86 ${x + 75},86 ${x + 82},75 ${x + 90},86 ${x + 100},86`
  }).join(' ')

  return (
    <section aria-labelledby="monitor-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-harbor">Un vínculo con tu bienestar</p>
          <h2 id="monitor-title" className="text-2xl font-bold text-navy">Monitoreo de signos vitales</h2>
          <p className="mt-2 text-sm text-ink-soft">Una vista de cómo BILA acompañaría tu día, con datos de ejemplo.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-harbor">
          <span className={`size-2 rounded-full ${playing ? 'animate-pulse bg-harbor' : 'bg-line-strong'}`} />
          {playing ? 'Simulación activa' : 'Simulación en pausa'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Pulsaciones', value: pulse, unit: 'latidos/min', Icon: HeartPulse, color: '#21666b', style: 'bg-harbor-soft text-harbor', values: history },
          { label: 'Oxígeno en sangre', value: spo2, unit: '% SpO₂', Icon: Droplets, color: '#080b55', style: 'bg-navy/5 text-navy', values: Array.from({ length: 24 }, (_, i) => oxygen[(i + tick) % oxygen.length]) },
          { label: 'Presión arterial', value: `${systolic}/${diastolic}`, unit: 'mmHg', Icon: Gauge, color: '#c58b00', style: 'bg-gold-soft text-caution', values: Array.from({ length: 24 }, (_, i) => pressure[(i + tick) % pressure.length][0]) },
        ].map(({ label, value, unit, Icon, color, style, values }) => (
          <article key={label} className="overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <span className={`grid size-11 place-items-center rounded-2xl ${style}`}><Icon aria-hidden="true" className="size-6" /></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">Simulado</span>
            </div>
            <h3 className="mt-5 text-sm font-semibold text-ink-soft">{label}</h3>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-4xl font-medium tracking-tight text-navy">{value}</span>
              <span className="text-xs text-ink-soft">{unit}</span>
            </div>
            <Sparkline values={values} color={color} label={`Tendencia simulada de ${label.toLowerCase()}`} />
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="on-navy overflow-hidden rounded-3xl bg-navy p-6 text-white sm:p-8" aria-labelledby="rhythm-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Señal de ejemplo</p>
              <h3 id="rhythm-title" className="mt-2 text-xl font-bold">Tu ritmo, en una mirada</h3>
            </div>
            <HeartPulse aria-hidden="true" className="size-6 text-gold" />
          </div>
          <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-4">
            <svg viewBox="0 0 600 160" className="h-40 w-full" role="img" aria-label="Señal cardíaca ilustrativa, generada para la demostración">
              <defs>
                <pattern id="ecg-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M 25 0 L 0 0 0 25" fill="none" stroke="#ffffff" strokeOpacity="0.07" /></pattern>
              </defs>
              <rect width="600" height="160" fill="url(#ecg-grid)" />
              <polyline points={ecg} fill="none" stroke="#e3a209" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div className="flex justify-between px-3 text-[10px] font-medium uppercase tracking-wider text-white/45"><span>Trazo ilustrativo</span><span>Datos simulados</span></div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-xs text-white/65"><Activity className="size-4 text-gold" aria-hidden="true" />Actualización: {updated}</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPlaying(value => !value)} aria-pressed={!playing}
                className="flex min-h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-xs font-semibold text-white hover:bg-white/20">
                {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
                {playing ? 'Pausar simulación' : 'Reanudar simulación'}
              </button>
              <button type="button" aria-label="Actualizar datos simulados" onClick={() => { setTick(value => value + 1); setUpdated(new Date().toLocaleTimeString('es-GT')) }}
                className="grid size-10 place-items-center rounded-xl border border-white/20 text-white hover:bg-white/10"><RefreshCw aria-hidden="true" className="size-4" /></button>
            </div>
          </div>
        </section>

        <section className="flex flex-col rounded-3xl border border-line bg-white p-6 sm:p-8" aria-labelledby="wearable-title">
          <div className="flex items-center justify-between">
            <h3 id="wearable-title" className="text-lg font-bold text-navy">Tu dispositivo BILA</h3>
            <Bluetooth aria-hidden="true" className="size-5 text-harbor" />
          </div>
          <div className="my-6 flex items-center gap-5 rounded-2xl bg-cloud p-5">
            <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-white text-navy"><DeviceIcon aria-hidden="true" className="size-12" strokeWidth={1.3} /></span>
            <div><p className="text-lg font-bold text-navy">{device} BILA</p><p className="mt-1 text-xs font-medium text-harbor">Dispositivo de demostración</p></div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between gap-3"><span className="text-ink-soft">Conexión</span><span className="font-semibold text-harbor">Simulada</span></div>
            <div className="flex justify-between gap-3"><span className="text-ink-soft">Batería de ejemplo</span><span className="flex items-center gap-2 font-semibold text-navy"><BatteryMedium aria-hidden="true" className="size-4" />86 %</span></div>
            <div className="flex justify-between gap-3"><span className="text-ink-soft">Frecuencia de actualización</span><span className="font-semibold text-navy">3 segundos</span></div>
          </div>
          <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-ink-soft">No hay un dispositivo físico conectado. Esta vista no mide tu salud ni envía alertas reales.</p>
        </section>
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-harbor/15 bg-harbor-soft p-5">
        <ArrowUpRight aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-harbor" />
        <div><p className="text-sm font-bold text-harbor">La tecnología nos acerca cuando más importa</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">Explora el monitoreo, pausa la simulación o actualiza los valores para conocer la experiencia BILA.</p></div>
      </div>
    </section>
  )
}
