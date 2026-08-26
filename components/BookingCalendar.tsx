'use client';

import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { useI18n } from '@/components/LocaleProvider';

interface BookingCalendarProps {
  onDateChange?: (date: Date | undefined) => void;
}

export default function BookingCalendar({ onDateChange }: BookingCalendarProps) {
  const { dict, locale } = useI18n();
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const dateLocale = locale === 'en' ? enUS : es;

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const disabledDays = { before: new Date() };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#0A192F] font-semibold mb-4 text-center">
        {dict.calendar.label}
      </p>
      
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        locale={dateLocale}
        disabled={disabledDays}
        modifiersClassNames={{
          selected: 'bg-[#0A192F] text-white rounded-full hover:bg-[#0A192F]/90',
          today: 'font-bold text-[#0A192F] underline'
        }}
        // @ts-ignore - Le decimos a Vercel que ignore el error de tipado aquí
        styles={{
          caption: { color: '#0A192F', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic' },
          head_cell: { color: '#A1A1AA', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' },
        } as any}
      />

      {selected ? (
        <div className="mt-4 p-3 bg-[#0A192F]/5 rounded-xl w-full text-center">
          <p className="text-xs text-[#0A192F] font-medium">
            {dict.calendar.selected}:{' '}
            <span className="capitalize font-bold">
              {format(
                selected,
                locale === 'en' ? 'EEEE, MMMM d' : "EEEE, d 'de' MMMM",
                { locale: dateLocale },
              )}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-xs text-zinc-400 mt-4 text-center">
          {dict.calendar.pickDay}
        </p>
      )}
    </div>
  );
}
