import { AgendaData } from '../hooks/useAgenda.js';
import { CalendarEvent, toBuddhistYear, THAI_MONTHS, THAI_DAYS_FULL } from '../constants.js';
import { Asterisk } from 'lucide-react';

interface TodayFocusPanelProps {
  data: AgendaData;
}

export function TodayFocusPanel({ data }: TodayFocusPanelProps) {
  const { todayDate, todayMonth, todayYear } = data;
  const dayName = THAI_DAYS_FULL[new Date(todayYear, todayMonth - 1, todayDate).getDay()];
  const monthName = THAI_MONTHS[todayMonth];
  const buddhistYear = toBuddhistYear(todayYear);

  // Get current events for the selected date
  const selectedKey = data.getDateKey(data.selectedDate);
  const eventsOnSelectedDate = data.eventsByDateKey[selectedKey] || [];

  // Fallback if no events on selected date: show upcoming events
  const displayEvents: CalendarEvent[] = eventsOnSelectedDate.length > 0 
    ? eventsOnSelectedDate 
    : data.upcomingEvents.flatMap((ue) => data.eventsByDateKey[ue.dateKey] || []).slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-transparent p-4 sm:p-6 md:p-8 select-none justify-start">
      {/* Top Header: Big Date + Stacked Day/Month/Year */}
      <div className="flex items-center justify-center gap-5 sm:gap-6 md:gap-8 pt-2 pb-4">
        {/* Big Date Number in Pink #D23976 */}
        <span
          className="font-serif leading-none font-bold tracking-tight text-center"
          style={{
            fontSize: 'clamp(64px, 12vw, 150px)',
            color: '#D23976',
            lineHeight: '0.85',
          }}
        >
          {todayDate}
        </span>

        {/* Stacked Day / Month / Year Column */}
        <div className="flex flex-col justify-center gap-0.5 sm:gap-1 font-serif text-[#303030]">
          <span className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-tight">
            วัน{dayName}
          </span>
          <span className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-tight">
            {monthName}
          </span>
          <span className="text-[18px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-tight">
            {buddhistYear}
          </span>
        </div>
      </div>

      {/* Events List — Transparent background with subtle gray hover */}
      <div className="flex flex-col gap-2.5 sm:gap-3 pt-2 sm:pt-4 justify-start flex-1">
        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
            <p className="font-serif text-[16px] sm:text-[18px] md:text-[20px] text-[#818181] font-bold">ไม่มีกิจกรรมในวันนี้</p>
          </div>
        ) : (
          displayEvents.slice(0, 3).map((ev) => (
            <div
              key={ev.id}
              className="flex items-start justify-between gap-3 sm:gap-4 p-2.5 sm:p-3.5 md:p-4 rounded-xl hover:bg-[#303030]/5 transition-colors cursor-pointer"
            >
              {/* Left: Asterisk Icon + Event Title */}
              <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                {/* Asterisk Icon */}
                <div className="shrink-0 text-[#D23976] mt-0.5">
                  <Asterisk className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12" strokeWidth={3.2} />
                </div>

                {/* Title */}
                <span className="font-serif text-[15px] sm:text-[18px] md:text-[22px] lg:text-[25px] font-bold text-[#303030] leading-snug whitespace-pre-line">
                  {ev.title}
                </span>
              </div>

              {/* Right: Time & Location Right Aligned */}
              <div className="flex flex-col items-end text-right shrink-0 font-serif text-[#818181] gap-0.5 pt-0.5">
                <span className="text-[13px] sm:text-[15px] md:text-[18px] lg:text-[20px] font-bold leading-tight">
                  {ev.time}
                </span>
                <span className="text-[11px] sm:text-[13px] md:text-[15px] lg:text-[17px] font-bold leading-tight">
                  {ev.location}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
