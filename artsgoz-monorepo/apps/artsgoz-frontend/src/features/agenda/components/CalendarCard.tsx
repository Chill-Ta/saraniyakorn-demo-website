import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AgendaEvent } from '../types.js';

interface CalendarCardProps {
  daysOfWeek: string[];
  calendarDays: (number | null)[];
  eventsByDate: Record<number, AgendaEvent[]>;
  selectedDate: number;
  onSelectDate: (day: number) => void;
  getDayLabel: (day: number) => string;
  monthLabel?: string;
}

export function CalendarCard({
  daysOfWeek,
  calendarDays,
  eventsByDate,
  selectedDate,
  onSelectDate,
  getDayLabel,
  monthLabel = 'agenda.month_label',
}: CalendarCardProps) {
  const { t } = useTranslation('home');
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 w-full">
      {/* Minimal Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            {t(monthLabel)}
          </span>
          <span className="font-chulalongkorn text-[13px] md:text-[14px] font-semibold text-pink-500 uppercase tracking-wide mt-0.5">
            {`${getDayLabel(selectedDate)}ที่ ${selectedDate} ส.ค.`}
          </span>
        </div>
        
        {/* Navigation Buttons (Pink Interactive Circle Buttons) */}
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 cursor-pointer"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            type="button" 
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 cursor-pointer"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center gap-y-1 mb-2">
          {daysOfWeek.map((day, idx) => (
            <span
              key={idx}
              className={`font-serif text-[14px] md:text-[15px] font-bold ${
                idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Month Days */}
        <div className="grid grid-cols-7 text-center gap-y-1 gap-x-1">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={idx} className="h-10 w-10 mx-auto" />;
            }

            const hasEvents = eventsByDate[day] && eventsByDate[day].length > 0;
            const isSelected = selectedDate === day;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDate(day)}
                className="flex items-center justify-center h-10 w-10 mx-auto cursor-pointer relative focus:outline-none"
              >
                <span
                  className={`font-serif flex items-center justify-center rounded-full transition-all duration-200 h-9 w-9 text-[15px] md:text-[16px] font-semibold ${
                    isSelected
                      ? 'bg-pink-500 text-white font-bold shadow-md shadow-pink-500/20 scale-105'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                  }`}
                >
                  {day}
                </span>
                {hasEvents && (
                  <span 
                    className="w-1.5 h-1.5 rounded-full absolute bottom-1 z-20 transition-all duration-200" 
                    style={{ backgroundColor: isSelected ? '#FFFFFF' : '#DE5D8F' }} 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {eventsByDate[selectedDate] && eventsByDate[selectedDate].length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-[12px] md:text-[13px] font-bold text-gray-400 uppercase tracking-wider block mb-2 font-chulalongkorn">
            {t('agenda.upcoming_title')}
          </span>
          <div className="space-y-2">
            {eventsByDate[selectedDate].map((event) => (
              <div 
                key={event.id}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-pink-50/10 hover:bg-pink-50/20 border border-transparent hover:border-pink-100/30 transition-all duration-200"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[15px] md:text-[16px] font-bold text-gray-850 leading-snug">
                    {t(event.title)}
                  </p>
                  <p className="text-[12px] md:text-[13px] font-medium text-gray-400 mt-0.5">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
