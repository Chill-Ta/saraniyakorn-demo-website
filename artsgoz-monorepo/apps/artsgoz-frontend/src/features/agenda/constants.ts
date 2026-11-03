import { AgendaEvent, UpcomingEvent } from './types.js';

// ─── Calendar Helpers ──────────────────────────────────────────────────────────

/** Returns the number of days in a given month (1-based month) */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Returns the day-of-week index (0=Sun) for the 1st of a given month */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/** Builds a calendar grid (7 cols) with leading nulls for offset */
export function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const grid: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  // pad to complete last row
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

/** Thai month names (1-indexed) */
export const THAI_MONTHS = [
  '', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

/** Thai month short names */
export const THAI_MONTHS_SHORT = [
  '', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

/** Thai day-of-week full names (0=อาทิตย์) */
export const THAI_DAYS_FULL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

/** Thai day-of-week abbrev */
export const THAI_DAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/** Convert CE year to Buddhist Era (BE) */
export function toBuddhistYear(ceYear: number): number {
  return ceYear + 543;
}

// ─── Mock Events (keyed by ISO date string YYYY-MM-DD) ─────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  titleEn: string;
  time: string;
  location: string;
  color: string;
  tags: Array<'today' | 'tomorrow' | 'important' | 'dont-forget'>;
}

/** Mock events using real ISO date keys — replace values with real API data */
export function getMockEvents(refDate: Date): Record<string, CalendarEvent[]> {
  const y = refDate.getFullYear();
  const m = String(refDate.getMonth() + 1).padStart(2, '0');
  const today = refDate.getDate();

  const pad = (d: number) => String(d).padStart(2, '0');

  const todayKey = `${y}-${m}-${pad(today)}`;
  const tomorrowKey = `${y}-${m}-${pad(today + 1)}`;
  const day3Key = `${y}-${m}-${pad(today + 2)}`;
  const day5Key = `${y}-${m}-${pad(today + 4)}`;
  const day8Key = `${y}-${m}-${pad(today + 7)}`;

  return {
    [todayKey]: [
      {
        id: 'ev-today-1',
        title: 'วันเกิดน้องสมชายแสนสนุก ก.อศ.',
        titleEn: 'Birthday Celebration: Somchai',
        time: '13:00 – 15:00 น.',
        location: 'โถง MCS และโรงอาหารอักษร',
        color: '#DE5D8F',
        tags: ['today', 'important'],
      },
    ],
    [tomorrowKey]: [
      {
        id: 'ev-tmr-1',
        title: 'สัมมนาวิชาการระดับชาติ คณะอักษรศาสตร์',
        titleEn: 'National Academic Seminar, Faculty of Arts',
        time: '09:00 – 12:00 น.',
        location: 'ห้องประชุมอาคารมหาจักรีสิรินธร',
        color: '#4F46E5',
        tags: ['tomorrow', 'dont-forget'],
      },
      {
        id: 'ev-tmr-2',
        title: 'การซ้อมการแสดงชมรม Artsband',
        titleEn: 'Artsband Music Practice',
        time: '16:30 – 18:30 น.',
        location: 'ห้องชมรมดนตรีสากล',
        color: '#DE5D8F',
        tags: ['dont-forget'],
      },
    ],
    [day3Key]: [
      {
        id: 'ev-d3-1',
        title: 'ปฐมนิเทศฝึกงานภาคฤดูร้อน',
        titleEn: 'Summer Internship Orientation',
        time: '10:00 – 12:00 น.',
        location: 'ห้อง 708 อาคารมหาจักรีสิรินธร',
        color: '#D97706',
        tags: ['important'],
      },
      {
        id: 'ev-d3-2',
        title: 'เสวนาวิชาการภาษาและวรรณคดี',
        titleEn: 'Literature Discussion Panel',
        time: '13:00 – 15:00 น.',
        location: 'ห้องประชุมชั้น 3',
        color: '#059669',
        tags: ['important'],
      },
      {
        id: 'ev-d3-3',
        title: 'ประชุมฝ่ายสวัสดิการ ก.อศ.',
        titleEn: 'GOZ Welfare Team Meeting',
        time: '16:00 – 17:30 น.',
        location: 'ห้อง ก.อศ. ชั้น M1',
        color: '#DE5D8F',
        tags: ['dont-forget'],
      },
    ],
    [day5Key]: [
      {
        id: 'ev-d5-1',
        title: 'ประชุมคณะกรรมการนิสิตประจำภาควิชา',
        titleEn: 'Department Student Committee Meeting',
        time: '16:30 – 18:30 น.',
        location: 'ห้อง 148 ชั้น M1',
        color: '#059669',
        tags: ['dont-forget'],
      },
    ],
    [day8Key]: [
      {
        id: 'ev-d8-1',
        title: 'งานอักษรฯ เปิดบ้าน Arts Open House 2569',
        titleEn: 'Arts Open House 2026',
        time: '09:00 – 17:00 น.',
        location: 'คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย',
        color: '#DE5D8F',
        tags: ['important'],
      },
    ],
  };
}

// Legacy exports for backward compatibility
export const MOCK_UPCOMING_EVENTS: UpcomingEvent[] = [];
export const MOCK_CALENDAR_DAYS: (number | null)[] = [];
export const MOCK_EVENTS_BY_DATE: Record<number, AgendaEvent[]> = {};
export const DAYS_OF_WEEK = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
