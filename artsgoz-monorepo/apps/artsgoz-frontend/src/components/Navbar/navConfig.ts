import { PATHS } from '../../routes/paths.js';
import type { MegaMenuCategory } from './MegaMenu.js';

export interface NavItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
  hasDropdown?: boolean;
  hasMegaMenu?: boolean;
  megaMenu?: MegaMenuCategory[];
}

export interface DropdownItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
}

export interface MegaMenuItem {
  label: string;
  path: string;
  isExternal?: boolean;
}

// ─── Mega-menu for "บริการนิสิต" (All functions from StudentServicesPage) ───

/** Mega-menu used for "บริการนิสิต" — 6 full categories matching StudentServicesPage */
const STUDENT_SERVICES_MEGA_MENU: MegaMenuCategory[] = [
  {
    label: 'บริการวิชาการ',
    items: [
      { label: 'ติดตามหน่วยกิต', path: PATHS.CREDIT_TRACKING },
      { label: 'ใบเหลืองใบฟ้าออนไลน์', path: PATHS.YELLOW_CARD },
      { label: 'ค้นหาชื่ออาจารย์', path: PATHS.PROFESSORS },
      { label: 'หลักสูตรจากภาคต่าง ๆ', path: PATHS.CURRICULUM },
      { label: 'ทุนการศึกษา/แลกเปลี่ยน', path: PATHS.INTERNSHIPS },
      { label: 'เอกสารและแบบฟอร์ม', path: PATHS.FORMS },
    ],
  },
  {
    label: 'บริการทั่วไป',
    items: [
      { label: 'บทความจากชมรมสาราณียกร', path: PATHS.ARTICLES },
      { label: 'ชมรมคณะอักษรฯ', path: PATHS.CLUBS },
      { label: 'ที่บันทึกไว้', path: `${PATHS.ARTICLES}?tab=saved` },
    ],
  },
  {
    label: 'การเรียนรู้',
    items: [
      { label: 'ติดตามหน่วยกิต', path: PATHS.CREDIT_TRACKING },
      { label: 'ใบเหลืองใบฟ้าออนไลน์', path: PATHS.YELLOW_CARD },
      { label: 'ค้นหาชื่ออาจารย์', path: PATHS.PROFESSORS },
      { label: 'หลักสูตรจากภาคต่าง ๆ', path: PATHS.CURRICULUM },
      { label: 'เอกสารและแบบฟอร์ม', path: PATHS.FORMS },
    ],
  },
  {
    label: 'สวัสดิการ ก.อศ.',
    items: [
      { label: 'บริการยืมร่ม', path: `${PATHS.STUDENT_SERVICES}?service=umbrella` },
      { label: 'บริการผ้าอนามัยฟรี', path: `${PATHS.STUDENT_SERVICES}?service=sanitary-pads` },
      { label: 'บริการยาสามัญฟรี', path: `${PATHS.STUDENT_SERVICES}?service=medicine` },
    ],
  },
  {
    label: 'ดูแลใจ',
    items: [
      { label: 'MindSpace', path: 'https://chula.wellness.in.th/', isExternal: true },
      { label: 'ศูนย์บริการสุขภาพ', path: 'https://www.chula.ac.th/about/student-life/health-services/', isExternal: true },
      { label: 'ตัวช่วยสุขภาพจิตดี', path: 'https://chula.wellness.in.th/', isExternal: true },
    ],
  },
  {
    label: 'บริการส่วนกลางมหาวิทยาลัย',
    items: [
      { label: 'ศูนย์กีฬาแห่งจุฬาฯ', path: 'https://www.cusports.chula.ac.th/', isExternal: true },
      { label: 'ตาราง CU POP BUS', path: 'https://www.chula.ac.th/about/student-life/cu-pop-bus/', isExternal: true },
      { label: 'ศูนย์นวัตกรรมการเรียนรู้', path: 'https://lic.chula.ac.th/', isExternal: true },
    ],
  },
];

// ─── Nav items ────────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'navbar.home',             path: PATHS.ROOT },
  {
    label: 'navbar.student_services',
    path: PATHS.STUDENT_SERVICES,
    hasMegaMenu: true,
    megaMenu: STUDENT_SERVICES_MEGA_MENU,
  },
  { label: 'navbar.help',        path: PATHS.HELP },
  { label: 'navbar.internships', path: PATHS.INTERNSHIPS, hasDropdown: true },
  { label: 'navbar.curriculum',  path: PATHS.CURRICULUM },
];

export const DROPDOWN_ITEMS: DropdownItem[] = [
  { label: 'navbar.internships_dropdown_review', path: PATHS.INTERNSHIPS },
  { label: 'navbar.internships_dropdown_open',   path: PATHS.INTERNSHIPS_OPEN },
];
