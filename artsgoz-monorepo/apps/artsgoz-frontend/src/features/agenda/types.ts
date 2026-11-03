/**
 * Represents a single calendar event.
 * This interface is designed to be compatible with Google Calendar API event objects.
 * @see https://developers.google.com/calendar/api/v3/reference/events
 */
export interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  colorClass: string;
}

/** Full calendar event with location and tag metadata */
export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  color: string;
  tags: Array<'today' | 'tomorrow' | 'important' | 'dont-forget'>;
}

/** Upcoming event row data for the UpcomingEventsCard */
export interface UpcomingEvent {
  dateKey: string;        // ISO date YYYY-MM-DD
  month: string;
  day: number;
  dayLabel?: string;
  dayLabels?: string[];
  title: string;
  time: string;
  location: string;
  color: string;
  isToday: boolean;
  isTomorrow: boolean;
  tags: Array<'today' | 'tomorrow' | 'important' | 'dont-forget'>;
}
