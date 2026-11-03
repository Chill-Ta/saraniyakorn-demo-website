import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { buildAgendaData } from '../hooks/useAgenda.js';
import { TodayFocusPanel } from './TodayFocusPanel.js';
import { MiniCalendarPanel } from './MiniCalendarPanel.js';

/**
 * AgendaWidgets — owns month/date state, composes the two Figma calendar panels with transparent card backgrounds.
 */
export function AgendaWidgets() {
  const { t } = useTranslation('home');

  const now = new Date();
  const [displayYear, setDisplayYear] = useState(now.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(now.getDate());

  const prevMonth = useCallback(() => {
    setDisplayMonth((m) => {
      if (m === 1) { setDisplayYear((y) => y - 1); return 12; }
      return m - 1;
    });
  }, [setDisplayMonth, setDisplayYear]);

  const nextMonth = useCallback(() => {
    setDisplayMonth((m) => {
      if (m === 12) { setDisplayYear((y) => y + 1); return 1; }
      return m + 1;
    });
  }, [setDisplayMonth, setDisplayYear]);

  const data = buildAgendaData(displayYear, displayMonth, selectedDate, prevMonth, nextMonth, setSelectedDate);

  return (
    <div className="w-full flex flex-col gap-8 select-none relative">
      {/* Section Header */}
      <div className="flex flex-col gap-2 relative z-10">
        <h2 className="font-serif text-[40px] lg:text-[48px] font-bold leading-[1.15] text-[#303030]">
          {t('agenda.title')}
        </h2>
        <p className="font-serif text-[16px] leading-[26px] text-[#818181]">
          {t('agenda.description')}
        </p>
      </div>

      {/* Two-Panel Grid with 2 TRANSPARENT cards matching Figma #8000:45262 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8 items-stretch relative z-10">
        {/* Left Card: Today Focus + Events List */}
        <div className="border-2 border-[#303030] rounded-[6px] bg-transparent overflow-hidden min-h-[513px] flex flex-col">
          <TodayFocusPanel data={data} />
        </div>

        {/* Right Card: Mini Calendar */}
        <div className="border-2 border-[#303030] rounded-[6px] bg-transparent overflow-hidden min-h-[513px] flex flex-col">
          <MiniCalendarPanel data={data} />
        </div>
      </div>
    </div>
  );
}
