import { AgendaData } from '../hooks/useAgenda.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarPanelProps {
  data: AgendaData;
}

export function MiniCalendarPanel({ data }: MiniCalendarPanelProps) {
  const {
    monthNameThai,
    buddhistYear,
    calendarDays,
    daysOfWeek,
    prevMonth,
    nextMonth,
    selectedDate,
    setSelectedDate,
    eventsByDateKey,
    getDateKey,
    todayDate,
    todayMonth,
    todayYear,
    month,
    year,
  } = data;

  const isCurrentMonth = month === todayMonth && year === todayYear;

  return (
    <div className="flex flex-col h-full bg-transparent p-4 sm:p-6 md:p-8 select-none justify-between">
      {/* Top Header: Left Chevron (No circle) | Centered Month & Year | Right Chevron (No circle) */}
      <div className="flex items-center justify-between w-full pb-4 sm:pb-6 border-b-2 border-[#303030]/10">
        {/* Left Chevron Button without circle border */}
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 sm:p-2 text-[#303030] hover:text-[#D23976] hover:opacity-75 transition-all duration-200 cursor-pointer active:scale-95 shrink-0 bg-transparent border-none"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
        </button>

        {/* Centered Month & Year Text */}
        <div className="flex items-center gap-2 font-serif text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-[#303030]">
          <span>{monthNameThai}</span>
          <span>{buddhistYear}</span>
        </div>

        {/* Right Chevron Button without circle border */}
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 sm:p-2 text-[#303030] hover:text-[#D23976] hover:opacity-75 transition-all duration-200 cursor-pointer active:scale-95 shrink-0 bg-transparent border-none"
          aria-label="Next Month"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
        </button>
      </div>

      {/* Days of Week Row */}
      <div className="grid grid-cols-7 text-center my-3">
        {daysOfWeek.map((day, idx) => (
          <span
            key={idx}
            className={`font-serif text-[16px] md:text-[18px] font-bold ${
              idx === 0 ? 'text-[#D23976]' : idx === 6 ? 'text-[#0165F8]' : 'text-[#818181]'
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid (Figma Node #8000:45262) — Square border around day + dots with transparent background */}
      <div className="grid grid-cols-7 text-center gap-y-1.5 sm:gap-y-2 gap-x-0.5 sm:gap-x-1 my-auto">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 aspect-square mx-auto" />;
          }

          const dateKey = getDateKey(day);
          const dayEvents = eventsByDateKey[dateKey] || [];
          const eventCount = Math.min(dayEvents.length, 3);
          const hasEvents = eventCount > 0;
          const isSelected = selectedDate === day;
          const isToday = isCurrentMonth && day === todayDate;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center justify-center p-0.5 sm:p-1 rounded-[6px] aspect-square transition-all duration-200 cursor-pointer relative focus:outline-none w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 mx-auto ${
                isSelected
                  ? 'border-2 border-[#D23976] bg-transparent text-[#D23976] shadow-xs'
                  : isToday
                  ? 'bg-[#D23976] text-white shadow-xs'
                  : 'text-[#D23976] hover:bg-[#303030]/10 border-2 border-transparent'
              }`}
            >
              {/* Day Number */}
              <span
                className={`font-serif text-[14px] sm:text-[18px] md:text-[22px] font-bold leading-none ${
                  isToday ? 'text-white font-black' : isSelected ? 'text-[#D23976] font-black' : ''
                }`}
              >
                {day}
              </span>

              {/* Event Dots Container */}
              <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 h-1.5 sm:h-2">
                {hasEvents ? (
                  Array.from({ length: eventCount }).map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                        isToday
                          ? 'bg-white'
                          : dotIdx === 0
                          ? 'bg-[#303030]'
                          : dotIdx === 1
                          ? 'bg-[#F58A07]'
                          : 'bg-[#D23976]'
                      }`}
                    />
                  ))
                ) : (
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 opacity-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
