'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import imageCompression from 'browser-image-compression'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

import {
  Anchor, LayoutDashboard, Users, Search, Plus, LogOut, ShieldCheck,
  Loader2, Trash2, X, ImageIcon, Edit3, Eye, Coffee, Waves,
  Mail, Phone, MessageSquare, CheckCircle2, Clock
} from 'lucide-react'

const neuOut = 'bg-[#e0e5ec] shadow-[7px_7px_14px_#bebebe,-7px_-7px_14px_#ffffff]'
const neuIn = 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]'
const neuBtn = 'bg-[#e0e5ec] shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff] transition-all'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Flota')
  const [yachts, setYachts] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailMode, setIsDetailMode] = useState(true)
  const [currentYacht, setCurrentYacht] = useState<any>(null)
  
  const [newYacht, setNewYacht] = useState({ 
    name: '', size: '', capacity: '', cabins: '', 
    bathrooms: '', description: '', features: '', includes: '' 
  })

  const [files, setFiles] = useState<FileList | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setUserRole(profile?.role || 'vendedor')
      const { data: yData } = await supabase.from('yachts').select('*').order('created_at', { ascending: false })
      if (yData) setYachts(yData)
      const { data: lData } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      if (lData) setLeads(lData)
    } catch (err) { toast.error("Error al sincronizar datos") } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  // --- DRAG & DROP ENGINE ---
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(currentYacht.images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    setCurrentYacht({ ...currentYacht, images: items })
    toast.success("Nuevo orden aplicado visualmente")
  }

  // --- COMPRESIÓN Y SUBIDA DE ALTA CALIDAD ---
  const processAndUploadFiles = async (filesList: FileList) => {
    const uploadPromises = Array.from(filesList).map(async (file) => {
      const options = {
        maxSizeMB: 4,              // 4MB para nitidez total
        maxWidthOrHeight: 2560,    // Resolución 2K para pantallas Retina
        useWebWorker: true,
        initialQuality: 0.9,       // Calidad al 90%
      }

      try {
        const compressed = await imageCompression(file, options)
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const { error } = await supabase.storage.from('yachts').upload(fileName, compressed)
        if (error) throw error
        const { data } = supabase.storage.from('yachts').getPublicUrl(fileName)
        return data.publicUrl
      } catch (err) {
        console.error("Error comprimiendo:", err)
        // Fallback: subimos original si falla compresión
        const fileName = `${Date.now()}-fallback`
        await supabase.storage.from('yachts').upload(fileName, file)
        const { data } = supabase.storage.from('yachts').getPublicUrl(fileName)
        return data.publicUrl
      }
    })
    return Promise.all(uploadPromises)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (selected) {
      setFiles(selected)
      const urls = Array.from(selected).map((file) => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  const handleAddYacht = async (e: React.FormEvent) => {
    e.preventDefault()
    const tid = toast.loading("Optimizando y publicando embarcación...")
    try {
      setSaving(true)
      const imageUrls = files ? await processAndUploadFiles(files) : []
      
      // SOLUCIÓN AL BUG DE ROOMS: Forzar a que sean números antes de enviar
      const { error } = await supabase.from('yachts').insert([{
        ...newYacht,
        capacity: Number(newYacht.capacity), // Convertir a número
        cabins: Number(newYacht.cabins),     // Convertir a número (SOLUCIÓN)
        features: newYacht.features.split(',').map(i => i.trim()).filter(i => i !== ""),
        includes: newYacht.includes.split(',').map(i => i.trim()).filter(i => i !== ""),
        images: imageUrls
      }])
      
      if (error) throw error
      toast.success("¡Yate publicado en el catálogo!", { id: tid })
      setIsModalOpen(false)
      setNewYacht({ name: '', size: '', capacity: '', cabins: '', bathrooms: '', description: '', features: '', includes: '' })
      setPreviewUrls([]); setFiles(null); fetchData()
    } catch (err: any) { toast.error(err.message, { id: tid }) } finally { setSaving(false) }
  }

  const handleUpdateYacht = async (e: React.FormEvent) => {
    e.preventDefault()
    const tid = toast.loading("Guardando cambios y galería... ⚓")
    try {
      setSaving(true)
      let updatedImages = [...(currentYacht.images || [])]
      if (files && files.length > 0) {
        const newUrls = await processAndUploadFiles(files)
        updatedImages = [...updatedImages, ...newUrls]
      }
      
      // SOLUCIÓN AL BUG DE ROOMS EN EDICIÓN: Forzar conversión
      const { error } = await supabase.from('yachts').update({
        ...currentYacht,
        capacity: Number(currentYacht.capacity), // Convertir a número
        cabins: Number(currentYacht.cabins),     // Convertir a número (SOLUCIÓN)
        features: typeof currentYacht.features === 'string' ? currentYacht.features.split(',').map((i:any) => i.trim()).filter((i:any) => i !== "") : currentYacht.features,
        includes: typeof currentYacht.includes === 'string' ? currentYacht.includes.split(',').map((i:any) => i.trim()).filter((i:any) => i !== "") : currentYacht.includes,
        images: updatedImages
      }).eq('id', currentYacht.id)
      
      if (error) throw error
      toast.success("Catálogo actualizado", { id: tid })
      closeEditModal(); fetchData()
    } catch (err: any) { toast.error(err.message, { id: tid }) } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    toast("¿Confirmas que quieres eliminar este yate?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          const tid = toast.loading("Eliminando de la base de datos...")
          try {
            const { error } = await supabase.from('yachts').delete().eq('id', id)
            if (error) throw error
            setYachts(prev => prev.filter(y => y.id !== id))
            toast.success("Borrado", { id: tid })
          } catch (err: any) {
            toast.error("Error al borrar", { id: tid })
          }
        }
      },
      cancel: { 
        label: "Cancelar",
        onClick: () => {} // <--- ESTO ES LO QUE TE PEDÍA EL ERROR
      }
    })
  }

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id)
    if (!error) { toast.success(`Lead actualizado a: ${newStatus}`); fetchData() }
  }

  const openDetails = (yacht: any, edit: boolean) => {
    setCurrentYacht({
        ...yacht,
        features: Array.isArray(yacht.features) ? yacht.features.join(', ') : yacht.features,
        includes: Array.isArray(yacht.includes) ? yacht.includes.join(', ') : yacht.includes
    })
    setIsDetailMode(!edit); setIsEditModalOpen(true)
  }

  const closeEditModal = () => { setIsEditModalOpen(false); setFiles(null); setPreviewUrls([]) }
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/auth') }

  if (loading && yachts.length === 0) return <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-[#374151] flex flex-col md:flex-row font-sans overflow-x-hidden">
      <aside className={`md:w-24 w-full h-auto md:h-screen ${neuOut} flex md:flex-col flex-row items-center py-4 md:py-10 px-6 md:px-0 justify-between sticky top-0 z-50`}>
        <div className="font-bold text-xl text-[#1e3a8a] italic pointer-events-none">BW</div>
        <nav className="flex md:flex-col flex-row gap-4 md:gap-8">
          {[{ id: 'Dashboard', icon: <LayoutDashboard size={22} /> }, { id: 'Flota', icon: <Anchor size={22} /> }, { id: 'Leads', icon: <Users size={22} /> }].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-3 md:p-5 rounded-2xl transition-all ${activeTab === item.id ? neuIn + ' text-[#2563eb]' : 'text-[#94a3b8]'}`}>
              {item.icon}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className={`p-3 rounded-2xl ${neuBtn} text-red-400 hidden md:block`}><LogOut size={20} /></button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="p-4 md:p-8 flex justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <input type="text" placeholder={`Buscar en ${activeTab}...`} className={`w-full ${neuIn} rounded-full py-3 px-6 pl-12 outline-none text-sm`} />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black text-blue-500 uppercase">{userRole}</p>
            <div className={`w-10 h-10 rounded-full ${neuOut} flex items-center justify-center text-blue-600`}><ShieldCheck size={20} /></div>
          </div>
        </header>

        <main className="p-4 md:p-10 space-y-8">
          <div className="flex justify-between items-end gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#94a3b8] font-bold">Consola de Mando</p>
              <h1 className="text-3xl font-light text-[#1e3a8a]">Sección <span className="font-bold">{activeTab}</span></h1>
            </div>
            {userRole === 'admin' && activeTab === 'Flota' && (
              <button onClick={() => setIsModalOpen(true)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${neuBtn} text-[#2563eb] text-xs font-bold uppercase`}>
                <Plus size={16} /> New Yacht
              </button>
            )}
          </div>

          {activeTab === 'Flota' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-1">
              {yachts.map((yacht) => (
                <div key={yacht.id} className={`rounded-[35px] p-5 ${neuOut} group relative transition-all`}>
                  {userRole === 'admin' && (
                    <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={() => openDetails(yacht, true)} className={`p-2.5 rounded-xl ${neuBtn} text-blue-500 hover:text-blue-600`}><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(yacht.id)} className={`p-2.5 rounded-xl ${neuBtn} text-red-500 hover:text-red-600`}><Trash2 size={16} /></button>
                    </div>
                  )}
                  <div className="h-44 rounded-[25px] overflow-hidden mb-4 shadow-inner">
                    <img src={yacht.images?.[0] || 'https://via.placeholder.com/600x400'} alt={yacht.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="font-bold text-[#1e3a8a] text-lg">{yacht.name}</h3>
                  <p className="text-[11px] text-[#94a3b8] mb-4 uppercase font-bold tracking-tighter">{yacht.size} • {yacht.capacity} Pax</p>
                  <div className={`flex justify-between items-center p-3 rounded-xl ${neuIn}`}>
                    <span className="text-xs font-bold text-blue-600 px-2 italic uppercase shadow-sm bg-blue-50 py-0.5 rounded-full">Activo</span>
                    <button onClick={() => openDetails(yacht, false)} className="text-[11px] flex items-center gap-1 uppercase font-black text-[#1e3a8a] hover:text-blue-600 transition-colors"><Eye size={12} /> Detalles</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Leads' && (
            <div className={`rounded-[35px] ${neuOut} overflow-hidden p-1`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100/50 text-[#1e3a8a] text-[10px] uppercase font-bold">
                    <tr><th className="p-6">Cliente</th><th className="p-6">Contacto Directo</th><th className="p-6">Servicio</th><th className="p-6 text-center">Gestión</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/50 transition-colors">
                        <td className="p-6">
                            <p className="font-bold text-[#1e3a8a] text-base">{lead.full_name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Recibido: {new Date(lead.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="p-6"><div className="flex gap-2.5">
                          <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" className={`p-3 rounded-2xl ${neuBtn} text-green-600 hover:text-green-700`}><MessageSquare size={18} /></a>
                          <a href={`sms:${lead.phone.replace(/\D/g, '')}`} className={`p-3 rounded-2xl ${neuBtn} text-blue-500 hover:text-blue-600`}><Mail size={18} /></a>
                        </div></td>
                        <td className="p-6">
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{lead.service_type}</p>
                            <p className="text-blue-600 font-mono text-base font-black tracking-tight">{lead.budget}</p>
                        </td>
                        <td className="p-6 text-center"><div className="flex items-center justify-center gap-3">
                          <button onClick={() => updateLeadStatus(lead.id, lead.status === 'vendido' ? 'nuevo' : 'vendido')} className={`p-2.5 rounded-xl ${neuBtn} ${lead.status === 'vendido' ? 'text-green-600' : 'text-gray-400'}`}>
                              {lead.status === 'vendido' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                          </button>
                          <span className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-sm border border-black/5 ${
                            lead.status === 'vendido' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {lead.status || 'nuevo'}
                          </span>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL NUEVO YATE (CORREGIDO Y AGREGADO DESCRIPCIÓN) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${neuOut} w-full max-w-lg rounded-[40px] p-8 relative max-h-[90vh] overflow-y-auto`}>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-6 text-gray-400 hover:text-red-500"><X size={20} /></button>
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-6 text-center uppercase tracking-widest">Nueva Embarcación</h2>
              <form onSubmit={handleAddYacht} className="space-y-4 pt-1">
                <input required placeholder="Nombre del Yate (Dyna craft 80ft)" className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <input required placeholder="Tamaño (ej: 80ft)" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, size: e.target.value})} />
                   <input required placeholder="Baños" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, bathrooms: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Pax Max (Capacidad)" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, capacity: e.target.value})} />
                  <input required type="number" placeholder="Rooms (Cabinas)" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, cabins: e.target.value})} />
                </div>
                
                {/* --- CAMPO DE DESCRIPCIÓN AGREGADO (SOLUCIÓN) --- */}
                <textarea 
                    required
                    placeholder="Descripción comercial para la landing page (vende el sueño)..." 
                    rows={4} 
                    className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none`} 
                    onChange={e => setNewYacht({...newYacht, description: e.target.value})} 
                />

                <textarea required placeholder="Características (coma sep: WiFi, AC, TV...)" className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none`} onChange={e => setNewYacht({...newYacht, features: e.target.value})} />
                <textarea required placeholder="Incluye (coma sep: Bebidas, Snorkel...)" className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none`} onChange={e => setNewYacht({...newYacht, includes: e.target.value})} />
                <label className={`block w-full ${neuIn} rounded-2xl p-4 cursor-pointer text-center text-sm text-[#1e3a8a] font-bold shadow-md hover:bg-gray-100/50transition-all`}>
                    <div className="flex items-center justify-center gap-2"><ImageIcon size={16} /> SUBIR FOTOS</div>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                {previewUrls.length > 0 && <div className="grid grid-cols-3 gap-3 pt-2">{previewUrls.map((url, i) => <img key={i} src={url} className="h-20 w-full object-cover rounded-xl shadow-md border" />)}</div>}
                <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl ${neuBtn} text-blue-600 font-black uppercase mt-6 flex justify-center items-center gap-2 text-sm tracking-widest`}>
                  {saving ? <Loader2 className="animate-spin" size={16} /> : 'PUBLICAR EN FLOTA'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && currentYacht && (
          <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${neuOut} w-full max-w-2xl rounded-[40px] p-8 md:p-12 relative my-10 max-h-[90vh] overflow-y-auto`}>
              <button onClick={closeEditModal} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"><X size={22} /></button>
              <h2 className="text-2xl font-bold text-[#1e3a8a] mb-8 text-center uppercase tracking-widest">{isDetailMode ? 'Ficha Técnica' : 'Editar Embarcación'}</h2>
              <form onSubmit={handleUpdateYacht} className="space-y-5 pt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5"><p className="text-[10px] font-black text-blue-500 ml-3 uppercase tracking-wider">Nombre del Yate</p><input disabled={isDetailMode} value={currentYacht.name} onChange={e => setCurrentYacht({...currentYacht, name: e.target.value})} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div>
                    <div className="space-y-1.5"><p className="text-[10px] font-black text-blue-500 ml-3 uppercase tracking-wider">Specs (Tamaño - Baños)</p><div className="flex gap-3"><input disabled={isDetailMode} value={currentYacht.size} onChange={e => setCurrentYacht({...currentYacht, size: e.target.value})} className={`w-1/2 ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /><input disabled={isDetailMode} value={currentYacht.bathrooms} onChange={e => setCurrentYacht({...currentYacht, bathrooms: e.target.value})} className={`w-1/2 ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* BUG DE ROOMS EN EDICIÓN: El input es tipo text pero el backend espera número */}
                    <div className="space-y-1.5"><p className="text-[10px] font-black text-blue-500 ml-3 uppercase tracking-wider">Pax Max</p><input disabled={isDetailMode} value={currentYacht.capacity} onChange={e => setCurrentYacht({...currentYacht, capacity: e.target.value})} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div>
                    <div className="space-y-1.5"><p className="text-[10px] font-black text-blue-500 ml-3 uppercase tracking-wider">Rooms (Cabinas)</p><input disabled={isDetailMode} value={currentYacht.cabins} onChange={e => setCurrentYacht({...currentYacht, cabins: e.target.value})} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div>
                </div>

                <div className="space-y-1.5"><p className="text-[10px] font-black text-blue-500 ml-3 uppercase tracking-wider">Descripción Comercial (Sells the dream)</p><textarea disabled={isDetailMode} value={currentYacht.description} onChange={e => setCurrentYacht({...currentYacht, description: e.target.value})} rows={4} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none disabled:opacity-70`} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 text-xs"><p className="text-[10px] font-black text-blue-500 ml-3 uppercase flex items-center gap-1 tracking-wider"><Waves size={10}/> Características</p><textarea disabled={isDetailMode} value={currentYacht.features || ''} onChange={e => setCurrentYacht({...currentYacht, features: e.target.value})} rows={3} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none disabled:opacity-70`} /></div>
                    <div className="space-y-1.5 text-xs"><p className="text-[10px] font-black text-blue-500 ml-3 uppercase flex items-center gap-1 tracking-wider"><Coffee size={10}/> Incluye</p><textarea disabled={isDetailMode} value={currentYacht.includes || ''} onChange={e => setCurrentYacht({...currentYacht, includes: e.target.value})} rows={3} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none disabled:opacity-70`} /></div>
                </div>
                
                {/* --- SECCIÓN GALERÍA --- */}
                {!isDetailMode && (
                  <div className="space-y-4 pt-6 border-t border-gray-300/50">
                    <p className="text-[10px] font-black text-blue-500 ml-3 uppercase tracking-wider italic">Galería (Arrastra para reordenar / Portada)</p>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="gallery-droppable" direction="horizontal">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-4 sm:grid-cols-5 gap-3 p-3 bg-gray-200/50 rounded-2xl shadow-inner min-h-[110px]">
                            {currentYacht.images?.map((img: string, idx: number) => (
                              <Draggable key={`img-drag-${idx}`} draggableId={`img-id-${idx}`} index={idx}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`relative aspect-square rounded-xl overflow-hidden shadow-md group transition-all duration-300 ${snapshot.isDragging ? 'z-50 ring-4 ring-blue-500 shadow-2xl scale-105' : 'hover:scale-[1.02]'}`}
                                    style={{ ...provided.draggableProps.style, left: 'auto !important', top: 'auto !important' }}
                                  >
                                    <img src={img} className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                                    {idx === 0 && <div className="absolute top-1.5 left-1.5 bg-green-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full z-10 shadow-sm">PORTADA</div>}
                                    
                                    {/* OVERLAY DE ELIMINACIÓN */}
                                    <div className="absolute inset-0 bg-red-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px] z-20">
                                      <button 
                                        type="button" 
                                        onMouseDown={(e) => e.stopPropagation()} 
                                        onClick={(e) => { 
                                          e.stopPropagation();
                                          const n = currentYacht.images.filter((_:any, i:number) => i !== idx); 
                                          setCurrentYacht({...currentYacht, images: n}); 
                                          toast.error("Imagen removida localmente");
                                        }} 
                                        className="p-3 bg-white rounded-full text-red-600 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-red-600 hover:text-white"
                                      >
                                        <Trash2 size={18} strokeWidth={2.5} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {previewUrls.map((url, i) => (
                              <div key={`p-${i}`} className="aspect-square rounded-xl overflow-hidden border-2 border-blue-400 border-dashed relative">
                                <img src={url} className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={14} className="text-blue-600 animate-spin" /></div>
                              </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-400 hover:border-blue-500 transition-all cursor-pointer bg-white/30 group"><Plus size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" /><input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} /></label>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}

                <div className="flex gap-5 mt-8 pt-6 border-t border-gray-300/50">
                  {isDetailMode ? (
                    userRole === 'admin' && <button type="button" onClick={() => setIsDetailMode(false)} className={`w-full py-4 rounded-2xl ${neuBtn} text-[#1e3a8a] font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors tracking-widest`}><Edit3 size={15} /> ACTUALIZAR INFORMACIÓN</button>
                  ) : (
                    <>
                        <button type="button" onClick={() => setIsDetailMode(true)} className={`w-1/2 py-4 rounded-2xl ${neuBtn} text-zinc-500 font-bold uppercase text-xs hover:text-red-500 transition-colors`}>CANCELAR</button>
                        <button type="submit" disabled={saving} className={`w-1/2 py-4 rounded-2xl ${neuBtn} text-blue-600 font-black uppercase text-xs flex justify-center items-center gap-2 tracking-widest`}>
                            {saving ? <Loader2 className="animate-spin" size={15} /> : 'GUARDAR CAMBIOS ⚓'}
                        </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}