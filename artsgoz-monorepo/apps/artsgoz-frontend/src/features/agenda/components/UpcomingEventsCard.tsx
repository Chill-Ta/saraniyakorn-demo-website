import { useTranslation } from 'react-i18next';
import { UpcomingEvent } from '../types.js';
import { AgendaBadge } from './AgendaBadge.js';

interface UpcomingEventsCardProps {
  events: UpcomingEvent[];
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  const { t } = useTranslation('home');
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 md:p-8 w-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{t('agenda.upcoming_title')}</span>
        <button
          type="button"
          className="font-serif text-[15px] md:text-[16px] font-bold text-[#DE5D8F] hover:text-[#DE5D8F]/80 transition-colors duration-200 cursor-pointer focus:outline-none bg-transparent border-none"
        >
          {t('agenda.view_all')}
        </button>
      </div>

      {/* Event Rows */}
      <div className="flex flex-col gap-4">
        {events.map((event, idx) => {
          return (
            <div
              key={`${event.month}-${event.day}-${idx}`}
              className={`group flex items-center justify-between p-3.5 md:p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                event.isToday 
                  ? 'bg-pink-50/10 hover:bg-pink-100/30 active:bg-pink-200/40 border border-dashed border-pink-100/50' 
                  : 'hover:bg-gray-100 active:bg-gray-200/70 border border-transparent'
              }`}
            >
              <div className="flex items-center min-w-0 flex-1">
                {/* Minimalist Date Chip */}
                <div 
                  className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl shrink-0 select-none transition-colors ${
                    event.isToday 
                      ? 'text-pink-500' 
                      : 'text-gray-600'
                  }`}
                >
                  <span className="font-serif text-[20px] md:text-[22px] font-bold leading-none">
                    {event.day}
                  </span>
                  <span className="font-serif text-[10px] md:text-[11px] font-semibold uppercase tracking-wider mt-0.5 opacity-80">
                    {t(event.month)}
                  </span>
                </div>

                {/* Event Info */}
                <div className="flex flex-col ml-4 md:ml-5 min-w-0 flex-1 justify-center">
                  <h4 className="font-serif text-[16px] md:text-[18px] font-bold text-gray-800 leading-snug line-clamp-1 group-hover:text-pink-500 transition-colors">
                    {t(event.title)}
                  </h4>
                  <span className="text-[12px] md:text-[13px] font-medium leading-none text-gray-400 mt-1">{event.time}</span>
                </div>
              </div>

              {/* Action Button / Badge */}
              <div className="flex items-center gap-1.5 pl-3 shrink-0 flex-wrap justify-end">
                {event.dayLabels && event.dayLabels.length > 0 ? (
                  event.dayLabels.map((label, idx) => (
                    <AgendaBadge key={`${label}-${idx}`}>{t(label)}</AgendaBadge>
                  ))
                ) : event.dayLabel ? (
                  <AgendaBadge>{t(event.dayLabel)}</AgendaBadge>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
