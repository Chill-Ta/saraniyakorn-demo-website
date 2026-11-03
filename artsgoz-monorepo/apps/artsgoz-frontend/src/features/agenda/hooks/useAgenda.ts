import {
  buildCalendarDays,
  getMockEvents,
  THAI_MONTHS,
  THAI_MONTHS_SHORT,
  THAI_DAYS_FULL,
  toBuddhistYear,
  CalendarEvent,
} from '../constants.js';
import { UpcomingEvent } from '../types.js';

export interface AgendaData {
  /** Current displayed year (CE) */
  year: number;
  /** Current displayed month (1-indexed) */
  month: number;
  /** Today's date number */
  todayDate: number;
  /** Today's month (1-indexed) */
  todayMonth: number;
  /** Today's year (CE) */
  todayYear: number;
  /** Thai full day name for today */
  todayDayName: string;
  /** Thai month name for current displayed month */
  monthNameThai: string;
  /** Buddhist Era year for display */
  buddhistYear: number;
  /** Calendar grid: null = empty cell, number = day */
  calendarDays: (number | null)[];
  /** Days of week header labels */
  daysOfWeek: string[];
  /** All events keyed by ISO date string YYYY-MM-DD */
  eventsByDateKey: Record<string, CalendarEvent[]>;
  /** Events on the currently selected day */
  selectedDayEvents: CalendarEvent[];
  /** Upcoming events list (next 5 events from today) */
  upcomingEvents: UpcomingEvent[];
  /** Go to previous month */
  prevMonth: () => void;
  /** Go to next month */
  nextMonth: () => void;
  /** Set selected date */
  setSelectedDate: (date: number) => void;
  /** Currently selected date number */
  selectedDate: number;
  /** Get ISO date key for a given day number in displayed month */
  getDateKey: (day: number) => string;
  /** Thai short month name */
  monthShortThai: string;
}

export function useAgenda(): AgendaData {
  // Use today's real date — hook will be stateful for month navigation
  // We return stable data; for navigation use AgendaWidgets state
  const now = new Date();
  return buildAgendaData(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function buildAgendaData(
  displayYear: number,
  displayMonth: number,
  selectedDate: number,
  prevMonth?: () => void,
  nextMonth?: () => void,
  setSelectedDate?: (d: number) => void,
): AgendaData {
  const now = new Date();
  const todayDate = now.getDate();
  const todayMonth = now.getMonth() + 1;
  const todayYear = now.getFullYear();
  const todayDow = now.getDay();

  const calendarDays = buildCalendarDays(displayYear, displayMonth);
  const eventsByDateKey = getMockEvents(now);

  const getDateKey = (day: number) => {
    const m = String(displayMonth).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${displayYear}-${m}-${d}`;
  };

  const selectedDayEvents = eventsByDateKey[getDateKey(selectedDate)] || [];

  // Build upcoming events list from event map, sorted by date
  const allUpcoming: UpcomingEvent[] = Object.entries(eventsByDateKey)
    .filter(([key]) => key >= `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5)
    .flatMap(([key, events]) =>
      events.map((ev) => {
        const parts = key.split('-').map(Number);
        const evDate = new Date(parts[0], parts[1] - 1, parts[2]);
        const isToday = key === `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;
        const isTomorrow = (() => {
          const tom = new Date(now);
          tom.setDate(now.getDate() + 1);
          return key === `${tom.getFullYear()}-${String(tom.getMonth()+1).padStart(2,'0')}-${String(tom.getDate()).padStart(2,'0')}`;
        })();
        return {
          dateKey: key,
          month: THAI_MONTHS_SHORT[evDate.getMonth() + 1],
          day: evDate.getDate(),
          title: ev.title,
          time: ev.time,
          location: ev.location,
          color: ev.color,
          isToday,
          isTomorrow,
          tags: ev.tags,
        } satisfies UpcomingEvent;
      })
    );

  return {
    year: displayYear,
    month: displayMonth,
    todayDate,
    todayMonth,
    todayYear,
    todayDayName: THAI_DAYS_FULL[todayDow],
    monthNameThai: THAI_MONTHS[displayMonth],
    monthShortThai: THAI_MONTHS_SHORT[displayMonth],
    buddhistYear: toBuddhistYear(displayYear),
    calendarDays,
    daysOfWeek: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    eventsByDateKey,
    selectedDayEvents,
    upcomingEvents: allUpcoming,
    prevMonth: prevMonth ?? (() => undefined),
    nextMonth: nextMonth ?? (() => undefined),
    setSelectedDate: setSelectedDate ?? (() => undefined),
    selectedDate,
    getDateKey,
  };
}
