import { 
  ListTodo, 
  BookUser, 
  GraduationCap, 
  ClipboardPen, 
  BookOpen, 
  Briefcase,
  Sparkles,
  Link2,
  HelpCircle,
  Phone,
  Calendar,
  MapPin,
  MessageSquare,
  Heart,
  Users,
  Bookmark,
  FileText,
  Compass,
  Globe,
  ClipboardList,
  Umbrella,
  Pill,
  Brain,
  HeartHandshake,
  Dumbbell,
  Smile,
  Bus,
  Lightbulb,
  LucideIcon
} from 'lucide-react';
import { FeatureMenu } from './types.js';
import { PATHS } from '../../routes/paths.js';

export const ICON_MAP: Record<string, LucideIcon> = {
  ListTodo,
  BookUser,
  GraduationCap,
  ClipboardPen,
  BookOpen,
  Briefcase,
  Sparkles,
  Link2,
  HelpCircle,
  Phone,
  Calendar,
  MapPin,
  MessageSquare,
  Heart,
  Users,
  Bookmark,
  FileText,
  Compass,
  Globe,
  ClipboardList,
  Umbrella,
  Pill,
  Brain,
  HeartHandshake,
  Dumbbell,
  Smile,
  Bus,
  Lightbulb
};

export const DEFAULT_SERIALIZABLE_MENUS = [
  {
    title: 'quick_access.menus.credit_tracker_title',
    description: 'quick_access.menus.credit_tracker_desc',
    iconName: 'ListTodo',
    href: PATHS.CREDIT_TRACKING,
  },
  {
    title: 'quick_access.menus.professor_search_title',
    description: 'quick_access.menus.professor_search_desc',
    iconName: 'BookUser',
    href: PATHS.PROFESSORS,
  },
  {
    title: 'quick_access.menus.student_services_title',
    description: 'quick_access.menus.student_services_desc',
    iconName: 'GraduationCap',
    href: PATHS.STUDENT_SERVICES,
  },
  {
    title: 'quick_access.menus.forms_title',
    description: 'quick_access.menus.forms_desc',
    iconName: 'ClipboardPen',
    href: PATHS.FORMS,
  },
  {
    title: 'quick_access.menus.curriculum_title',
    description: 'quick_access.menus.curriculum_desc',
    iconName: 'BookOpen',
    href: PATHS.CURRICULUM,
  },
  {
    title: 'quick_access.menus.internship_review_title',
    description: 'quick_access.menus.internship_review_desc',
    iconName: 'Briefcase',
    href: PATHS.INTERNSHIPS,
  },
];

export const ALL_EXISTING_SERVICES = [
  { 
    title: 'quick_access.menus.articles_title', 
    description: 'quick_access.menus.articles_desc', 
    iconName: 'BookOpen', 
    href: PATHS.ARTICLES 
  },
  { 
    title: 'quick_access.menus.clubs_title', 
    description: 'quick_access.menus.clubs_desc', 
    iconName: 'Users', 
    href: PATHS.CLUBS 
  },
  { 
    title: 'quick_access.menus.saved_title', 
    description: 'quick_access.menus.saved_desc', 
    iconName: 'Bookmark', 
    href: `${PATHS.ARTICLES}?tab=saved` 
  },
  { 
    title: 'quick_access.menus.credit_tracking_title', 
    description: 'quick_access.menus.credit_tracking_desc', 
    iconName: 'ListTodo', 
    href: PATHS.CREDIT_TRACKING 
  },
  { 
    title: 'quick_access.menus.yellow_card_title', 
    description: 'quick_access.menus.yellow_card_desc', 
    iconName: 'FileText', 
    href: PATHS.YELLOW_CARD 
  },
  { 
    title: 'quick_access.menus.professor_name_search_title', 
    description: 'quick_access.menus.professor_name_search_desc', 
    iconName: 'Compass', 
    href: PATHS.PROFESSORS 
  },
  { 
    title: 'quick_access.menus.curriculum_departments_title', 
    description: 'quick_access.menus.curriculum_departments_desc', 
    iconName: 'GraduationCap', 
    href: PATHS.CURRICULUM 
  },
  { 
    title: 'quick_access.menus.scholarship_title', 
    description: 'quick_access.menus.scholarship_desc', 
    iconName: 'Globe', 
    href: PATHS.INTERNSHIPS 
  },
  { 
    title: 'quick_access.menus.documents_forms_title', 
    description: 'quick_access.menus.documents_forms_desc', 
    iconName: 'ClipboardList', 
    href: PATHS.FORMS 
  },
  { 
    title: 'quick_access.menus.umbrella_title', 
    description: 'quick_access.menus.umbrella_desc', 
    iconName: 'Umbrella', 
    href: `${PATHS.STUDENT_SERVICES}?service=umbrella` 
  },
  { 
    title: 'quick_access.menus.sanitary_pads_title', 
    description: 'quick_access.menus.sanitary_pads_desc', 
    iconName: 'Heart', 
    href: `${PATHS.STUDENT_SERVICES}?service=sanitary-pads` 
  },
  { 
    title: 'quick_access.menus.medicine_title', 
    description: 'quick_access.menus.medicine_desc', 
    iconName: 'Pill', 
    href: `${PATHS.STUDENT_SERVICES}?service=medicine` 
  },
  { 
    title: 'quick_access.menus.mindspace_title', 
    description: 'quick_access.menus.mindspace_desc', 
    iconName: 'Brain', 
    href: 'https://chula.wellness.in.th/', 
    isExternal: true 
  },
  { 
    title: 'quick_access.menus.health_center_title', 
    description: 'quick_access.menus.health_center_desc', 
    iconName: 'HeartHandshake', 
    href: 'https://www.chula.ac.th/about/student-life/health-services/', 
    isExternal: true 
  },
  { 
    title: 'quick_access.menus.sports_center_title', 
    description: 'quick_access.menus.sports_center_desc', 
    iconName: 'Dumbbell', 
    href: 'https://www.cusports.chula.ac.th/', 
    isExternal: true 
  },
  { 
    title: 'quick_access.menus.mental_health_title', 
    description: 'quick_access.menus.mental_health_desc', 
    iconName: 'Smile', 
    href: 'https://chula.wellness.in.th/', 
    isExternal: true 
  },
  { 
    title: 'quick_access.menus.cu_pop_bus_title', 
    description: 'quick_access.menus.cu_pop_bus_desc', 
    iconName: 'Bus', 
    href: 'https://www.chula.ac.th/about/student-life/cu-pop-bus/', 
    isExternal: true 
  },
  { 
    title: 'quick_access.menus.innovation_center_title', 
    description: 'quick_access.menus.innovation_center_desc', 
    iconName: 'Lightbulb', 
    href: 'https://lic.chula.ac.th/', 
    isExternal: true 
  },
];

export const QUICK_ACCESS_MENUS: FeatureMenu[] = [
  {
    title: 'quick_access.menus.credit_tracker_title',
    description: 'quick_access.menus.credit_tracker_desc',
    icon: ListTodo,
    href: PATHS.CREDIT_TRACKING,
  },
  {
    title: 'quick_access.menus.professor_search_title',
    description: 'quick_access.menus.professor_search_desc',
    icon: BookUser,
    href: PATHS.PROFESSORS,
  },
  {
    title: 'quick_access.menus.student_services_title',
    description: 'quick_access.menus.student_services_desc',
    icon: GraduationCap,
    href: PATHS.STUDENT_SERVICES,
  },
  {
    title: 'quick_access.menus.forms_title',
    description: 'quick_access.menus.forms_desc',
    icon: ClipboardPen,
    href: PATHS.FORMS,
  },
  {
    title: 'quick_access.menus.curriculum_title',
    description: 'quick_access.menus.curriculum_desc',
    icon: BookOpen,
    href: PATHS.CURRICULUM,
  },
  {
    title: 'quick_access.menus.internship_review_title',
    description: 'quick_access.menus.internship_review_desc',
    icon: Briefcase,
    href: PATHS.INTERNSHIPS,
  },
];
