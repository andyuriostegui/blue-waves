'use client';

import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface BookingCalendarProps {
  onDateChange?: (date: Date | undefined) => void;
}

export default function BookingCalendar({ onDateChange }: BookingCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  // Deshabilitar días pasados (para que no reserven ayer)
  const disabledDays = { before: new Date() };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#0A192F] font-semibold mb-4 text-center">
        Selecciona tu Fecha
      </p>
      
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        locale={es}
        disabled={disabledDays}
        modifiersClassNames={{
          selected: 'bg-[#0A192F] text-white rounded-full hover:bg-[#0A192F]/90',
          today: 'font-bold text-[#0A192F] underline'
        }}
        styles={{
          caption: { color: '#0A192F', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic' },
          head_cell: { color: '#A1A1AA', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', tracking: '0.1em' },
        }}
      />

      {selected ? (
        <div className="mt-4 p-3 bg-[#0A192F]/5 rounded-xl w-full text-center">
          <p className="text-xs text-[#0A192F] font-medium">
            Fecha seleccionada: <span className="capitalize font-bold">{format(selected, "EEEE, d 'de' MMMM", { locale: es })}</span>
          </p>
        </div>
      ) : (
        <p className="text-xs text-zinc-400 mt-4 text-center">
          Por favor, elige un día para tu experiencia marítima.
        </p>
      )}
    </div>
  );
}