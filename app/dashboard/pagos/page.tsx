// app/dashboard/pagos/page.tsx
// Panel del dueño para generar links de pago y ver historial
'use client'
import { useState, useEffect } from 'react'
import { Copy, Check, Link2, DollarSign, Clock, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PagosDashboard() {
  const [form, setForm] = useState({
    amount: '',
    yachtName: '',
    clientName: '',
    clientEmail: '',
  })
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pagos, setPagos] = useState<any[]>([])
  const [loadingPagos, setLoadingPagos] = useState(true)

  // Cargar historial de pagos
  useEffect(() => {
    const fetchPagos = async () => {
      const { data } = await supabase
        .from('pagos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) setPagos(data)
      setLoadingPagos(false)
    }
    fetchPagos()
  }, [generatedLink])

  const generateLink = () => {
    if (!form.amount || !form.yachtName || !form.clientName) return

    const base = window.location.origin
    const params = new URLSearchParams({
      amount: form.amount,
      yacht: form.yachtName,
      client: form.clientName,
      email: form.clientEmail,
    })
    setGeneratedLink(`${base}/pay/reserva?${params.toString()}`)
  }

  const copyLink = () => {
    if (!generatedLink) return
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => {
    setForm({ amount: '', yachtName: '', clientName: '', clientEmail: '' })
    setGeneratedLink(null)
  }

  const totalRecaudado = pagos
    .filter(p => p.status === 'completado')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-[#0A192F] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-blue-400 font-bold mb-1">Blue Waves Cancún</p>
          <h1 className="font-serif text-4xl italic font-light">Panel de Pagos</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Total recaudado</p>
            <p className="text-2xl font-bold text-white">${totalRecaudado.toLocaleString('es-MX')} <span className="text-sm text-zinc-400 font-normal">MXN</span></p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Pagos completados</p>
            <p className="text-2xl font-bold text-white">{pagos.filter(p => p.status === 'completado').length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-1 col-span-2 md:col-span-1">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Total transacciones</p>
            <p className="text-2xl font-bold text-white">{pagos.length}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Generador de links */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Link2 size={14} />
              </div>
              <h2 className="font-serif text-xl">Generar Link de Pago</h2>
            </div>

            {!generatedLink ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">Monto (MXN)</label>
                  <input
                    type="number"
                    placeholder="Ej. 45000"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition text-lg font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">Yate</label>
                  <input
                    type="text"
                    placeholder="Ej. Blue Dream 52ft"
                    value={form.yachtName}
                    onChange={e => setForm(f => ({ ...f, yachtName: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">Nombre del cliente</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Rodríguez"
                    value={form.clientName}
                    onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block">Email del cliente (opcional)</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={form.clientEmail}
                    onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <button
                  onClick={generateLink}
                  disabled={!form.amount || !form.yachtName || !form.clientName}
                  className="w-full bg-blue-600 text-white py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
                >
                  Generar Link
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Link generado</p>
                  <p className="text-xs text-zinc-300 break-all leading-relaxed">{generatedLink}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={copyLink}
                    className="w-full bg-blue-600 text-white py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-blue-500 transition-all rounded-lg flex items-center justify-center gap-2"
                  >
                    {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Link</>}
                  </button>

                  {/* Botón de WhatsApp directo */}
                  <a
                    href={`https://wa.me/?text=Hola! Aquí está tu link de pago para tu reserva en Blue Waves Cancún: ${encodeURIComponent(generatedLink)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-green-600 text-white py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-green-500 transition-all rounded-lg flex items-center justify-center gap-2"
                  >
                    Enviar por WhatsApp
                  </a>

                  <button
                    onClick={resetForm}
                    className="w-full border border-white/20 text-zinc-400 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all rounded-lg"
                  >
                    Nuevo link
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Historial */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <DollarSign size={14} />
              </div>
              <h2 className="font-serif text-xl">Historial de Pagos</h2>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {loadingPagos ? (
                <p className="text-zinc-500 text-sm text-center py-8">Cargando...</p>
              ) : pagos.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8 font-serif italic">Aún no hay pagos registrados.</p>
              ) : (
                pagos.map((pago) => (
                  <div key={pago.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{pago.client_name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{pago.yacht_name}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        {new Date(pago.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-white">${pago.amount.toLocaleString('es-MX')}</p>
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                        pago.status === 'completado' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {pago.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}