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
  Mail, Phone, MessageSquare, CheckCircle2, Clock, Ship
} from 'lucide-react'

const neuOut = 'bg-[#e0e5ec] shadow-[7px_7px_14px_#bebebe,-7px_-7px_14px_#ffffff]'
const neuIn = 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]'
const neuBtn = 'bg-[#e0e5ec] shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff] transition-all'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [yachts, setYachts] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    completados: 0,
    yates: 0
  });

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
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setUserRole(profile?.role || 'vendedor')
      
      const { data: yData } = await supabase.from('yachts').select('*').order('created_at', { ascending: false })
      const { data: lData } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      
      if (yData) setYachts(yData)
      if (lData) setLeads(lData)

      setStats({
        total: lData?.length || 0,
        pendientes: lData?.filter(l => l.status === 'nuevo' || !l.status).length || 0,
        completados: lData?.filter(l => l.status === 'vendido').length || 0,
        yates: yData?.length || 0
      });

    } catch (err) { 
      console.error(err)
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(currentYacht.images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setCurrentYacht({ ...currentYacht, images: items })
  }

  const processAndUploadFiles = async (filesList: FileList) => {
    const uploadPromises = Array.from(filesList).map(async (file) => {
      const options = { maxSizeMB: 4, maxWidthOrHeight: 2560, useWebWorker: true, initialQuality: 0.9 }
      const compressed = await imageCompression(file, options)
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      await supabase.storage.from('yachts').upload(fileName, compressed)
      const { data } = supabase.storage.from('yachts').getPublicUrl(fileName)
      return data.publicUrl
    })
    return Promise.all(uploadPromises)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files)
      setPreviewUrls(Array.from(e.target.files).map(f => URL.createObjectURL(f)))
    }
  }

  const handleAddYacht = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const tid = toast.loading("Publicando...")
    try {
      const imageUrls = files ? await processAndUploadFiles(files) : []
      const { error } = await supabase.from('yachts').insert([{
        ...newYacht,
        capacity: Number(newYacht.capacity),
        cabins: Number(newYacht.cabins),
        features: newYacht.features.split(',').map(i => i.trim()),
        includes: newYacht.includes.split(',').map(i => i.trim()),
        images: imageUrls
      }])
      if (error) throw error
      toast.success("Yate listo", { id: tid })
      setIsModalOpen(false); fetchData()
    } catch (err: any) { toast.error(err.message, { id: tid }) } finally { setSaving(false) }
  }

  const handleUpdateYacht = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const tid = toast.loading("Actualizando...")
    try {
      let updatedImages = [...(currentYacht.images || [])]
      if (files) {
        const newUrls = await processAndUploadFiles(files)
        updatedImages = [...updatedImages, ...newUrls]
      }
      const { error } = await supabase.from('yachts').update({
        ...currentYacht,
        capacity: Number(currentYacht.capacity),
        cabins: Number(currentYacht.cabins),
        images: updatedImages
      }).eq('id', currentYacht.id)
      if (error) throw error
      toast.success("Guardado", { id: tid })
      closeEditModal(); fetchData()
    } catch (err: any) { toast.error(err.message, { id: tid }) } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    toast("¿Borrar este yate?", {
      action: { label: "Eliminar", onClick: async () => {
        await supabase.from('yachts').delete().eq('id', id)
        fetchData()
      }},
    })
  }

  const updateLeadStatus = async (id: string, s: string) => {
    await supabase.from('leads').update({ status: s }).eq('id', id)
    fetchData()
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

  if (loading) return <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-[#374151] flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      <aside className={`md:w-24 w-full h-auto md:h-screen ${neuOut} flex md:flex-col flex-row items-center py-4 md:py-10 px-6 md:px-0 justify-between sticky top-0 z-50`}>
        <div className="font-bold text-xl text-[#1e3a8a] italic">BW</div>
        <nav className="flex md:flex-col flex-row gap-4 md:gap-8">
          {[
            { id: 'Dashboard', icon: <LayoutDashboard size={22} /> }, 
            { id: 'Flota', icon: <Anchor size={22} /> }, 
            { id: 'Leads', icon: <Users size={22} /> }
          ].map((item) => (
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

          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && (
              <motion.div 
                key="dash"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4"
              >
                {[
                  { title: "Total Leads", value: stats.total, icon: <Users className="text-blue-500" />, color: "bg-blue-500" },
                  { title: "Pendientes", value: stats.pendientes, icon: <Clock className="text-amber-500" />, color: "bg-amber-500" },
                  { title: "Completados", value: stats.completados, icon: <CheckCircle2 className="text-green-500" />, color: "bg-green-500" },
                  { title: "Flota Actual", value: stats.yates, icon: <Ship className="text-indigo-500" />, color: "bg-indigo-500" },
                ].map((card, i) => (
                  <div key={i} className={`p-6 rounded-[35px] ${neuOut} flex flex-col items-center text-center space-y-4`}>
                    <div className={`p-4 rounded-2xl ${neuIn} flex items-center justify-center`}>{card.icon}</div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{card.title}</p>
                      <h3 className="text-3xl font-bold text-[#1e3a8a] mt-1">{card.value}</h3>
                    </div>
                    <div className={`h-1.5 w-10 rounded-full ${card.color} opacity-20`} />
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'Flota' && (
              <motion.div 
                key="flota"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {yachts.map((yacht) => (
                  <div key={yacht.id} className={`rounded-[35px] p-5 ${neuOut} group relative`}>
                    <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openDetails(yacht, true)} className={`p-2.5 rounded-xl ${neuBtn} text-blue-500`}><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(yacht.id)} className={`p-2.5 rounded-xl ${neuBtn} text-red-500`}><Trash2 size={16} /></button>
                    </div>
                    <div className="h-44 rounded-[25px] overflow-hidden mb-4 shadow-inner">
                      <img src={yacht.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="font-bold text-[#1e3a8a] text-lg">{yacht.name}</h3>
                    <p className="text-[11px] text-[#94a3b8] mb-4 uppercase font-bold">{yacht.size} • {yacht.capacity} Pax</p>
                    <div className={`flex justify-between items-center p-3 rounded-xl ${neuIn}`}>
                      <span className="text-xs font-bold text-blue-600 px-2 italic uppercase">Activo</span>
                      <button onClick={() => openDetails(yacht, false)} className="text-[11px] uppercase font-black text-[#1e3a8a] flex items-center gap-1"><Eye size={12} /> Detalles</button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'Leads' && (
              <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${neuOut} rounded-[35px] overflow-hidden`}>
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100/50 text-[#1e3a8a] text-[10px] uppercase font-bold">
                    <tr><th className="p-6">Cliente</th><th className="p-6">Contacto</th><th className="p-6">Servicio</th><th className="p-6 text-center">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/50 transition-colors">
                        <td className="p-6">
                          <p className="font-bold text-[#1e3a8a]">{lead.full_name}</p>
                          <p className="text-[10px] text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2">
                            <a href={`https://wa.me/${lead.phone}`} target="_blank" className={`p-3 rounded-2xl ${neuBtn} text-green-600`}><MessageSquare size={18} /></a>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-[11px] font-bold text-zinc-500 uppercase">{lead.service_type}</p>
                          <p className="text-blue-600 font-black tracking-tight">{lead.budget}</p>
                        </td>
                        <td className="p-6 text-center">
                          <button onClick={() => updateLeadStatus(lead.id, lead.status === 'vendido' ? 'nuevo' : 'vendido')} className={`px-4 py-2 rounded-xl ${neuBtn} text-[10px] font-black uppercase ${lead.status === 'vendido' ? 'text-green-600' : 'text-blue-500'}`}>
                            {lead.status || 'nuevo'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* MODAL NUEVO YATE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${neuOut} w-full max-w-lg rounded-[40px] p-8 relative max-h-[90vh] overflow-y-auto`}>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-6 text-gray-400 hover:text-red-500"><X size={20} /></button>
              <h2 className="text-xl font-bold text-[#1e3a8a] mb-6 text-center uppercase tracking-widest italic">Nueva Embarcación</h2>
              <form onSubmit={handleAddYacht} className="space-y-4 pt-1">
                <input required placeholder="Nombre (ej: Dyna Craft 80ft)" className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <input required placeholder="Tamaño" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, size: e.target.value})} />
                   <input required placeholder="Baños" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, bathrooms: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Pax Max" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, capacity: e.target.value})} />
                  <input required type="number" placeholder="Cabinas" className={`${neuIn} rounded-2xl py-3 px-5 outline-none text-sm`} onChange={e => setNewYacht({...newYacht, cabins: e.target.value})} />
                </div>
                <textarea required placeholder="Descripción..." rows={3} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none`} onChange={e => setNewYacht({...newYacht, description: e.target.value})} />
                <textarea required placeholder="Características (coma sep...)" className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none`} onChange={e => setNewYacht({...newYacht, features: e.target.value})} />
                <textarea required placeholder="Incluye (coma sep...)" className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none`} onChange={e => setNewYacht({...newYacht, includes: e.target.value})} />
                <label className={`block w-full ${neuIn} rounded-2xl p-4 cursor-pointer text-center text-sm text-[#1e3a8a] font-bold`}>
                    <div className="flex items-center justify-center gap-2"><ImageIcon size={16} /> SUBIR FOTOS</div>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                {previewUrls.length > 0 && <div className="grid grid-cols-3 gap-3 pt-2">{previewUrls.map((url, i) => <img key={i} src={url} className="h-20 w-full object-cover rounded-xl border shadow-inner" />)}</div>}
                <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl ${neuBtn} text-blue-600 font-black uppercase mt-6 tracking-widest text-sm`}>
                  {saving ? <Loader2 className="animate-spin" size={16} /> : 'PUBLICAR EMBARCACIÓN ⚓'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && currentYacht && (
          <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${neuOut} w-full max-w-2xl rounded-[40px] p-8 md:p-12 relative max-h-[90vh] overflow-y-auto`}>
              <button onClick={closeEditModal} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><X size={22} /></button>
              <h2 className="text-2xl font-bold text-[#1e3a8a] mb-8 text-center uppercase tracking-widest italic">{isDetailMode ? 'Ficha Técnica' : 'Editar Embarcación'}</h2>
              <form onSubmit={handleUpdateYacht} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1"><p className="text-[9px] font-black text-blue-500 ml-3 uppercase">Nombre</p><input disabled={isDetailMode} value={currentYacht.name} onChange={e => setCurrentYacht({...currentYacht, name: e.target.value})} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div>
                    <div className="space-y-1"><p className="text-[9px] font-black text-blue-500 ml-3 uppercase">Specs</p><div className="flex gap-3"><input disabled={isDetailMode} value={currentYacht.size} onChange={e => setCurrentYacht({...currentYacht, size: e.target.value})} className={`w-1/2 ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /><input disabled={isDetailMode} value={currentYacht.bathrooms} onChange={e => setCurrentYacht({...currentYacht, bathrooms: e.target.value})} className={`w-1/2 ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1"><p className="text-[9px] font-black text-blue-500 ml-3 uppercase">Pax Max</p><input disabled={isDetailMode} value={currentYacht.capacity} onChange={e => setCurrentYacht({...currentYacht, capacity: e.target.value})} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div>
                    <div className="space-y-1"><p className="text-[9px] font-black text-blue-500 ml-3 uppercase">Cabinas</p><input disabled={isDetailMode} value={currentYacht.cabins} onChange={e => setCurrentYacht({...currentYacht, cabins: e.target.value})} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm disabled:opacity-70`} /></div>
                </div>
                <div className="space-y-1"><p className="text-[9px] font-black text-blue-500 ml-3 uppercase">Descripción</p><textarea disabled={isDetailMode} value={currentYacht.description} onChange={e => setCurrentYacht({...currentYacht, description: e.target.value})} rows={3} className={`w-full ${neuIn} rounded-2xl py-3 px-5 outline-none text-sm resize-none disabled:opacity-70`} /></div>
                
                {!isDetailMode && (
                  <div className="space-y-4 pt-4">
                    <p className="text-[9px] font-black text-blue-500 ml-3 uppercase italic">Galería (Arrastra para reordenar)</p>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="gallery-droppable" direction="horizontal">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-4 sm:grid-cols-5 gap-3 p-3 bg-gray-200/50 rounded-2xl shadow-inner min-h-[110px]">
                            {currentYacht.images?.map((img: string, idx: number) => (
                              <Draggable key={`img-${idx}`} draggableId={`img-${idx}`} index={idx}>
                                {(provided, snapshot) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`relative aspect-square rounded-xl overflow-hidden shadow-md ${snapshot.isDragging ? 'z-50 ring-4 ring-blue-500 scale-105' : ''}`}>
                                    <img src={img} className="w-full h-full object-cover" />
                                    {idx === 0 && <div className="absolute top-1 left-1 bg-green-500 text-white text-[6px] px-1 rounded-full font-black">PORTADA</div>}
                                    <button type="button" onClick={() => { const n = currentYacht.images.filter((_:any, i:number) => i !== idx); setCurrentYacht({...currentYacht, images: n}); }} className="absolute inset-0 bg-red-600/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={16} className="text-white" /></button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <label className="flex items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer bg-white/50"><Plus size={20} className="text-gray-400" /><input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} /></label>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}

                <div className="flex gap-5 mt-6 pt-6 border-t border-gray-300/30">
                  {isDetailMode ? (
                    userRole === 'admin' && <button type="button" onClick={() => setIsDetailMode(false)} className={`w-full py-4 rounded-2xl ${neuBtn} text-[#1e3a8a] font-black uppercase text-xs tracking-widest`}><Edit3 size={15} className="inline mr-2" /> MODIFICAR INFO</button>
                  ) : (
                    <>
                      <button type="button" onClick={() => setIsDetailMode(true)} className={`w-1/2 py-4 rounded-2xl ${neuBtn} text-zinc-500 font-bold uppercase text-xs`}>DESCARTAR</button>
                      <button type="submit" disabled={saving} className={`w-1/2 py-4 rounded-2xl ${neuBtn} text-blue-600 font-black uppercase text-xs tracking-widest`}>
                        {saving ? <Loader2 className="animate-spin" size={15} /> : 'CONFIRMAR ⚓'}
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