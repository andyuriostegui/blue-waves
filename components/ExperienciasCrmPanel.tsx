'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import {
  ExternalLink,
  ImageIcon,
  Loader2,
  Play,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  EXPERIENCE_MEDIA_SLOTS,
  loadExperienceManifest,
  removeExperienceMedia,
  reorderExperienceSlot,
  slotsForEditor,
  uploadExperienceFiles,
  type ExperienceSlotId,
  type StoredExperienceMedia,
} from '@/lib/experience-media'

const neuOut = 'bg-[#e0e5ec] shadow-[7px_7px_14px_#bebebe,-7px_-7px_14px_#ffffff]'
const neuIn = 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]'
const neuBtn =
  'bg-[#e0e5ec] shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#bebebe,inset_-2px_-2px_5px_#ffffff] transition-all'

export default function ExperienciasCrmPanel({ isAdmin }: { isAdmin: boolean }) {
  const [slots, setSlots] = useState<Record<ExperienceSlotId, StoredExperienceMedia[]> | null>(null)
  const [busySlot, setBusySlot] = useState<ExperienceSlotId | null>(null)

  useEffect(() => {
    void loadExperienceManifest()
      .then((manifest) => setSlots(slotsForEditor(manifest)))
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : 'No se pudo cargar Experiencias')
        setSlots(slotsForEditor(null))
      })
  }, [])

  const run = async (
    slot: ExperienceSlotId,
    work: () => Promise<Record<ExperienceSlotId, StoredExperienceMedia[]>>,
  ) => {
    if (!isAdmin) {
      toast.error('Solo el admin puede editar las fotos de Experiencias')
      return false
    }
    setBusySlot(slot)
    try {
      setSlots(await work())
      return true
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar')
      return false
    } finally {
      setBusySlot(null)
    }
  }

  const onUpload = (slot: ExperienceSlotId, files: FileList | null) => {
    if (!files?.length || !slots) return
    const tid = toast.loading('Subiendo a Experiencias...')
    void run(slot, () => uploadExperienceFiles(slot, files, slots)).then((ok) => {
      if (ok) toast.success('Fotos publicadas en /experiencias', { id: tid })
      else toast.dismiss(tid)
    })
  }

  const onDelete = (slot: ExperienceSlotId, id: string) => {
    if (!slots) return
    toast('¿Quitar esta foto de la web?', {
      action: {
        label: 'Quitar',
        onClick: () => {
          void run(slot, () => removeExperienceMedia(slot, id, slots)).then((ok) => {
            if (ok) toast.success('Foto quitada')
          })
        },
      },
    })
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !slots) return
    const slot = result.source.droppableId as ExperienceSlotId
    if (result.source.droppableId !== result.destination.droppableId) return
    const items = Array.from(slots[slot])
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    void run(slot, () => reorderExperienceSlot(slot, items, slots))
  }

  if (!slots) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className={`${neuOut} rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-black">Página pública</p>
          <p className="text-sm text-zinc-600 mt-1 max-w-xl">
            Lo que subas o quites aquí se ve en{' '}
            <span className="font-semibold text-[#1e3a8a]">/experiencias</span>. Arrastra para
            reordenar. La primera de Portada es el hero.
          </p>
        </div>
        <Link
          href="/experiencias"
          target="_blank"
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl ${neuBtn} text-[#2563eb] text-[11px] font-bold uppercase`}
        >
          Ver página <ExternalLink size={14} />
        </Link>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {EXPERIENCE_MEDIA_SLOTS.map((section) => {
            const items = slots[section.id]
            const busy = busySlot === section.id
            return (
              <section key={section.id} className={`${neuOut} rounded-[32px] p-5 md:p-6 space-y-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[#1e3a8a] font-bold uppercase tracking-widest text-sm">
                      {section.label}
                    </h2>
                    <p className="text-[11px] text-zinc-500 mt-1">{section.hint}</p>
                  </div>
                  {isAdmin && (
                    <label className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl ${neuBtn} text-[10px] font-black uppercase text-blue-600 cursor-pointer ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
                      {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      Subir
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={(event) => {
                          onUpload(section.id, event.target.files)
                          event.target.value = ''
                        }}
                      />
                    </label>
                  )}
                </div>

                <Droppable droppableId={section.id} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`grid grid-cols-3 sm:grid-cols-4 gap-3 min-h-[96px] p-3 rounded-2xl ${neuIn}`}
                    >
                      {items.length === 0 ? (
                        <p className="col-span-4 text-xs text-zinc-400 py-6 text-center">
                          Sin fotos en esta sección.
                        </p>
                      ) : (
                        items.map((item, index) => (
                          <Draggable
                            key={`${section.id}-${item.id}`}
                            draggableId={`${section.id}-${item.id}`}
                            index={index}
                            isDragDisabled={!isAdmin || busy}
                          >
                            {(drag, snapshot) => (
                              <div
                                ref={drag.innerRef}
                                {...drag.draggableProps}
                                {...drag.dragHandleProps}
                                className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-300 ${snapshot.isDragging ? 'z-20 ring-4 ring-blue-500' : ''}`}
                              >
                                {item.type === 'video' ? (
                                  <span className="flex h-full w-full items-center justify-center bg-[#1e3a8a] text-white">
                                    <Play size={18} fill="currentColor" />
                                  </span>
                                ) : (
                                  <img src={item.src} alt="" className="h-full w-full object-cover" />
                                )}
                                {index === 0 && (section.id === 'hero' || section.id === 'cta') && (
                                  <span className="absolute top-1 left-1 bg-green-500 text-white text-[6px] px-1 rounded-full font-black">
                                    PORTADA
                                  </span>
                                )}
                                {!item.path && (
                                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[6px] px-1 rounded font-bold uppercase">
                                    Sitio
                                  </span>
                                )}
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => onDelete(section.id, item.id)}
                                    className="absolute inset-0 bg-red-600/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                                    aria-label="Quitar foto"
                                  >
                                    <Trash2 size={16} className="text-white" />
                                  </button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                      {isAdmin && (
                        <label className="flex items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer bg-white/50">
                          <ImageIcon size={18} className="text-gray-400" />
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                            className="hidden"
                            onChange={(event) => {
                              onUpload(section.id, event.target.files)
                              event.target.value = ''
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </Droppable>
              </section>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
