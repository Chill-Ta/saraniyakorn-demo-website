import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Users, Bookmark, ListTodo, FileText, Search,
  GraduationCap, Globe, ClipboardList, Umbrella, Heart, Pill,
  Brain, HeartHandshake, Dumbbell, Smile, Bus, Lightbulb,
  X, Compass
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SectionHeading, Button } from '@artsgoz/design-system';
import { PATHS } from '../../paths';
import { Footer } from '../../../components/Footer/index.js';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ServiceItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  href: string;
  category: 'general' | 'academic' | 'kos' | 'university';
  tags: string[];
  isExternal?: boolean;
}

// ── Data ───────────────────────────────────────────────────────────────────────
const SERVICES_DATA: ServiceItem[] = [
  { id: 'articles', titleKey: 'quick_access.menus.articles_title', descriptionKey: 'quick_access.menus.articles_desc', icon: BookOpen, href: PATHS.ARTICLES, category: 'general', tags: ['general'] },
  { id: 'clubs', titleKey: 'quick_access.menus.clubs_title', descriptionKey: 'quick_access.menus.clubs_desc', icon: Users, href: PATHS.CLUBS, category: 'general', tags: ['general'] },
  { id: 'saved', titleKey: 'quick_access.menus.saved_title', descriptionKey: 'quick_access.menus.saved_desc', icon: Bookmark, href: `${PATHS.ARTICLES}?tab=saved`, category: 'general', tags: ['general'] },
  { id: 'tracking', titleKey: 'quick_access.menus.credit_tracking_title', descriptionKey: 'quick_access.menus.credit_tracking_desc', icon: ListTodo, href: PATHS.CREDIT_TRACKING, category: 'academic', tags: ['academic', 'learning'] },
  { id: 'yellow-card', titleKey: 'quick_access.menus.yellow_card_title', descriptionKey: 'quick_access.menus.yellow_card_desc', icon: FileText, href: PATHS.YELLOW_CARD, category: 'academic', tags: ['academic', 'learning'] },
  { id: 'professors', titleKey: 'quick_access.menus.professor_name_search_title', descriptionKey: 'quick_access.menus.professor_name_search_desc', icon: Compass, href: PATHS.PROFESSORS, category: 'academic', tags: ['academic', 'learning'] },
  { id: 'curriculum', titleKey: 'quick_access.menus.curriculum_departments_title', descriptionKey: 'quick_access.menus.curriculum_departments_desc', icon: GraduationCap, href: PATHS.CURRICULUM, category: 'academic', tags: ['academic', 'learning'] },
  { id: 'scholarships', titleKey: 'quick_access.menus.scholarship_title', descriptionKey: 'quick_access.menus.scholarship_desc', icon: Globe, href: PATHS.INTERNSHIPS, category: 'academic', tags: ['academic'] },
  { id: 'forms', titleKey: 'quick_access.menus.documents_forms_title', descriptionKey: 'quick_access.menus.documents_forms_desc', icon: ClipboardList, href: PATHS.FORMS, category: 'academic', tags: ['academic', 'learning'] },
  { id: 'umbrella', titleKey: 'quick_access.menus.umbrella_title', descriptionKey: 'quick_access.menus.umbrella_desc', icon: Umbrella, href: '?service=umbrella', category: 'kos', tags: ['kos'] },
  { id: 'sanitary-pads', titleKey: 'quick_access.menus.sanitary_pads_title', descriptionKey: 'quick_access.menus.sanitary_pads_desc', icon: Heart, href: '?service=sanitary-pads', category: 'kos', tags: ['kos'] },
  { id: 'medicine', titleKey: 'quick_access.menus.medicine_title', descriptionKey: 'quick_access.menus.medicine_desc', icon: Pill, href: '?service=medicine', category: 'kos', tags: ['kos'] },
  { id: 'mindspace', titleKey: 'quick_access.menus.mindspace_title', descriptionKey: 'quick_access.menus.mindspace_desc', icon: Brain, href: 'https://chula.wellness.in.th/', category: 'university', tags: ['university', 'mental'], isExternal: true },
  { id: 'health-center', titleKey: 'quick_access.menus.health_center_title', descriptionKey: 'quick_access.menus.health_center_desc', icon: HeartHandshake, href: 'https://www.chula.ac.th/about/student-life/health-services/', category: 'university', tags: ['university', 'mental'], isExternal: true },
  { id: 'sports', titleKey: 'quick_access.menus.sports_center_title', descriptionKey: 'quick_access.menus.sports_center_desc', icon: Dumbbell, href: 'https://www.cusports.chula.ac.th/', category: 'university', tags: ['university'], isExternal: true },
  { id: 'mental-tips', titleKey: 'quick_access.menus.mental_health_title', descriptionKey: 'quick_access.menus.mental_health_desc', icon: Smile, href: 'https://chula.wellness.in.th/', category: 'university', tags: ['university', 'mental'], isExternal: true },
  { id: 'popbus', titleKey: 'quick_access.menus.cu_pop_bus_title', descriptionKey: 'quick_access.menus.cu_pop_bus_desc', icon: Bus, href: 'https://www.chula.ac.th/about/student-life/cu-pop-bus/', category: 'university', tags: ['university'], isExternal: true },
  { id: 'learning-center', titleKey: 'quick_access.menus.innovation_center_title', descriptionKey: 'quick_access.menus.innovation_center_desc', icon: Lightbulb, href: 'https://lic.chula.ac.th/', category: 'university', tags: ['university'], isExternal: true },
];

const SIDEBAR_ITEMS = [
  { id: 'all',        labelKey: 'student_services.sidebar.all', tag: 'all' },
  { id: 'general',    labelKey: 'student_services.sidebar.general',  tag: 'general' },
  { id: 'academic',   labelKey: 'student_services.sidebar.academic', tag: 'academic' },
  { id: 'learning',   labelKey: 'student_services.sidebar.learning', tag: 'learning' },
  { id: 'kos',        labelKey: 'student_services.sidebar.kos', tag: 'kos' },
  { id: 'mental',     labelKey: 'student_services.sidebar.mental',      tag: 'mental' },
  { id: 'university', labelKey: 'student_services.sidebar.university', tag: 'university' },
];

interface ModalContentDetails {
  titleKey: string;
  icon: LucideIcon;
  descKey: string;
  locationLabelKey: string;
  locationKey: string;
  timeLabelKey?: string;
  timeKey?: string;
  rulesLabelKey?: string;
  rulesKeys?: string[];
  medsLabelKey?: string;
  medsKey?: string;
}

function getModalContentConfig(serviceName: string): ModalContentDetails | null {
  switch (serviceName) {
    case 'umbrella':
      return {
        titleKey: 'student_services.umbrella.modal_title',
        icon: Umbrella,
        descKey: 'student_services.umbrella.modal_desc',
        locationLabelKey: 'student_services.location_label',
        locationKey: 'student_services.umbrella.location',
        timeLabelKey: 'student_services.time_label',
        timeKey: 'student_services.umbrella.time',
        rulesLabelKey: 'student_services.rules_label',
        rulesKeys: [
          'student_services.umbrella.rule1',
          'student_services.umbrella.rule2',
          'student_services.umbrella.rule3',
        ],
      };
    case 'sanitary-pads':
      return {
        titleKey: 'student_services.pads.modal_title',
        icon: Heart,
        descKey: 'student_services.pads.modal_desc',
        locationLabelKey: 'student_services.location_label_pads',
        locationKey: 'student_services.pads.location',
        rulesLabelKey: 'student_services.rules_label_pads',
        rulesKeys: [
          'student_services.pads.rule1',
          'student_services.pads.rule2',
          'student_services.pads.rule3',
        ],
      };
    case 'medicine':
      return {
        titleKey: 'student_services.medicine.modal_title',
        icon: Pill,
        descKey: 'student_services.medicine.modal_desc',
        locationLabelKey: 'student_services.location_label',
        locationKey: 'student_services.medicine.location',
        medsLabelKey: 'student_services.medicine.meds_label',
        medsKey: 'student_services.medicine.meds_list',
        timeLabelKey: 'student_services.time_label_medicine',
        timeKey: 'student_services.medicine.time',
      };
    default:
      return null;
  }
}

// ── Bento Card Component ───────────────────────────────────────────────────────
function BentoCard({ service }: { service: ServiceItem }) {
  const { t } = useTranslation(['student_services', 'home']);
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const translateKey = (key: string): string => {
    if (!key) return '';
    if (key.startsWith('quick_access.')) {
      return t(key, { ns: 'home' });
    }
    const cleanKey = key.replace(/^student_services\./, '');
    return t(cleanKey);
  };

  const handleCardClick = () => {
    if (service.isExternal) {
      window.open(service.href, '_blank', 'noopener,noreferrer');
    } else if (service.href.startsWith('?')) {
      const params = new URLSearchParams(service.href);
      setSearchParams(params);
    } else {
      navigate(service.href);
    }
  };

  const serviceTitle = translateKey(service.titleKey);
  const serviceDescription = translateKey(service.descriptionKey);

  // Render specific layout based on service.id
  switch (service.id) {
    case 'clubs': // 2x2
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 md:col-span-2 row-span-2 bg-gradient-to-br from-pink-50/70 via-purple-50/40 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-pink-100/80 rounded-2xl p-6 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-pink-100 text-pink-700 rounded-2xl">
                <Users size={32} />
              </div>
              <span className="bg-pink-100 text-pink-700 text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                {t('bento.recommended_clubs')}
              </span>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-[22px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-[#DE5D8F] transition-colors leading-snug truncate">
                {serviceTitle}
              </h3>
              <p className="text-[13px] text-gray-500 mt-1 font-sans break-words line-clamp-2">
                {serviceDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-white/90 hover:bg-white text-gray-700 border border-pink-100 text-[12px] px-3 py-1.5 rounded-lg shadow-sm transition-colors font-sans whitespace-nowrap">
                {t('bento.drama_club')}
              </span>
              <span className="bg-white/90 hover:bg-white text-gray-700 border border-purple-100 text-[12px] px-3 py-1.5 rounded-lg shadow-sm transition-colors font-sans whitespace-nowrap">
                {t('bento.music_club')}
              </span>
              <span className="bg-white/90 hover:bg-white text-gray-700 border border-indigo-100 text-[12px] px-3 py-1.5 rounded-lg shadow-sm transition-colors font-sans whitespace-nowrap">
                {t('bento.magazine_club')}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 shrink-0">
                <div className="w-7 h-7 rounded-full bg-pink-300 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold font-sans">A</div>
                <div className="w-7 h-7 rounded-full bg-purple-300 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold font-sans">B</div>
                <div className="w-7 h-7 rounded-full bg-indigo-300 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold font-sans">C</div>
              </div>
              <span className="text-[12px] text-gray-400 font-medium font-sans truncate max-w-[150px]">
                {t('bento.joined_count')}
              </span>
            </div>
            <span className="text-[13px] font-bold text-[#DE5D8F] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
              {t('bento.view_all_clubs')}
            </span>
          </div>
        </div>
      );

    case 'yellow-card': // 2x2
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 md:col-span-2 row-span-2 bg-gradient-to-br from-yellow-50/70 via-amber-50/40 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-amber-100/80 rounded-2xl p-6 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                <FileText size={32} />
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                {t('bento.online_course')}
              </span>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-[22px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-amber-600 transition-colors leading-snug truncate">
                {serviceTitle}
              </h3>
              <p className="text-[13px] text-gray-500 mt-1 font-sans break-words line-clamp-2">
                {serviceDescription}
              </p>
            </div>
            <div className="relative flex flex-col gap-4 mt-5 pl-1.5 font-sans min-w-0">
              <div className="absolute left-[13px] top-2 bottom-2 w-[2px] bg-amber-200/50 z-0" />
              <div className="flex items-center gap-3 relative z-10 min-w-0">
                <div className="w-[18px] h-[18px] rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-gray-700 leading-none truncate">{t('bento.submit_blue_card')}</p>
                  <p className="text-[9px] text-gray-400">12 มิ.ย. 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10 min-w-0">
                <div className="w-[18px] h-[18px] rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-gray-700 leading-none truncate">{t('bento.advisor_approved')}</p>
                  <p className="text-[9px] text-gray-400">14 มิ.ย. 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10 min-w-0">
                <div className="w-[18px] h-[18px] rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center text-[8px] font-bold relative shrink-0">
                  <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-25" />
                  ●
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-amber-700 leading-none truncate">{t('bento.processing_registrar')}</p>
                  <p className="text-[9px] text-amber-500/80">{t('bento.pending')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
            <span className="text-[13px] font-bold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
              {t('bento.submit_request')}
            </span>
          </div>
        </div>
      );

    case 'health-center': // 2x2
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 md:col-span-2 row-span-2 bg-gradient-to-br from-blue-50/70 via-cyan-50/40 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-blue-100/80 rounded-2xl p-6 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                <HeartHandshake size={32} />
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                {t('bento.health_nursing')}
              </span>
            </div>
            <div className="mt-4 min-w-0">
              <h3 className="text-[22px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-blue-600 transition-colors leading-snug truncate">
                {serviceTitle}
              </h3>
              <p className="text-[13px] text-gray-500 mt-1 font-sans break-words line-clamp-2">
                {serviceDescription}
              </p>
            </div>
            <div className="space-y-2 mt-4 text-[13px] font-sans min-w-0">
              <div className="flex items-center gap-2 text-gray-600 min-w-0">
                <span className="shrink-0">🕒</span>
                <span className="truncate">{t('bento.open_hours')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 min-w-0">
                <span className="shrink-0">📍</span>
                <span className="truncate">{t('bento.location_chula9')}</span>
              </div>
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2 rounded-lg mt-3 w-fit max-w-full">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-bold truncate">{t('bento.emergency_hotline')}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
            <span className="text-[13px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
              {t('bento.visit_website')}
            </span>
          </div>
        </div>
      );

    case 'tracking': // 2x1
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-indigo-50/70 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-indigo-100/80 rounded-2xl p-5 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shrink-0">
                <ListTodo size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[18px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-indigo-600 transition-colors leading-tight truncate">
                  {serviceTitle}
                </h4>
                <p className="text-[12px] text-gray-500 font-sans mt-0.5 truncate">
                  {serviceDescription}
                </p>
              </div>
            </div>
            <span className="text-[18px] font-bold text-indigo-600 font-sans shrink-0">
              77%
            </span>
          </div>
          <div className="mt-2 w-full">
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: '77%' }} />
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px] text-gray-400 font-sans flex-wrap gap-2">
              <span className="truncate">{t('bento.collected_credits')}</span>
              <span className="truncate">{t('bento.required_credits')}</span>
            </div>
          </div>
        </div>
      );

    case 'umbrella': // 2x1
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-rose-50/80 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-rose-100/80 rounded-2xl p-5 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-pink-100 text-pink-750 rounded-xl shrink-0">
                <Umbrella size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[18px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-pink-600 transition-colors leading-tight truncate">
                  {serviceTitle}
                </h4>
                <p className="text-[12px] text-gray-500 font-sans mt-0.5 truncate">
                  {serviceDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-250/50 text-[11px] font-bold px-2 py-1 rounded-full font-sans shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="whitespace-nowrap">{t('bento.umbrellas_available')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-sans mt-2 flex-wrap gap-2">
            <span className="truncate max-w-[200px] md:max-w-none">{t('bento.kos_room')}</span>
            <span className="text-pink-600 font-bold group-hover:translate-x-1 transition-transform shrink-0">
              {t('bento.borrow_umbrella_online')}
            </span>
          </div>
        </div>
      );

    case 'articles': // 2x1
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-amber-50/70 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-amber-100/80 rounded-2xl p-5 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-amber-100 text-amber-750 rounded-xl shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[18px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-amber-600 transition-colors leading-tight truncate">
                  {serviceTitle}
                </h4>
                <p className="text-[12px] text-gray-500 font-sans mt-0.5 truncate">
                  {serviceDescription}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded-md font-sans shrink-0 whitespace-nowrap">
              {t('bento.new_update')}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] text-gray-650 font-sans bg-amber-50/40 p-2 rounded-lg border border-amber-100/30 mt-2 min-w-0 flex-wrap gap-2">
            <span className="truncate max-w-[200px] md:max-w-[280px]">{t('bento.recent_article')}</span>
            <span className="text-[10px] text-gray-400 shrink-0">{t('bento.read_time')}</span>
          </div>
        </div>
      );

    case 'forms': // 2x1
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-teal-50/70 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-teal-100/80 rounded-2xl p-5 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl shrink-0">
                <ClipboardList size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[18px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-teal-650 transition-colors leading-tight truncate">
                  {serviceTitle}
                </h4>
                <p className="text-[12px] text-gray-500 font-sans mt-0.5 truncate">
                  {serviceDescription}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 text-[11px] text-gray-600 font-sans mt-2 flex-wrap md:flex-nowrap">
            <div className="flex-1 bg-white border border-teal-100/60 hover:border-teal-300 p-2 rounded-lg flex items-center justify-between transition-colors shadow-sm min-w-0">
              <span className="truncate text-gray-700">{t('bento.general_form')}</span>
              <span className="teal-650 font-bold shrink-0 ml-1">{t('bento.download')}</span>
            </div>
            <div className="flex-1 bg-white border border-teal-100/60 hover:border-teal-300 p-2 rounded-lg flex items-center justify-between transition-colors shadow-sm min-w-0">
              <span className="truncate text-gray-700">{t('bento.withdraw_form')}</span>
              <span className="teal-650 font-bold shrink-0 ml-1">{t('bento.download')}</span>
            </div>
          </div>
        </div>
      );

    case 'mindspace': // 1x2 (vertical)
      return (
        <div
          onClick={handleCardClick}
          className="col-span-1 row-span-2 bg-gradient-to-br from-purple-50/70 via-indigo-50/30 to-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-purple-100/80 rounded-2xl p-5 flex flex-col justify-between cursor-pointer group min-w-0"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                <Brain size={24} />
              </div>
              <span className="bg-purple-155/30 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                {t('bento.mental_health')}
              </span>
            </div>
            <div className="mt-4 min-w-0">
              <h4 className="text-[18px] font-bold text-gray-800 font-[ChulaCharasNew] group-hover:text-purple-600 transition-colors leading-tight truncate">
                {serviceTitle}
              </h4>
              <p className="text-[12px] text-gray-500 font-sans mt-1 break-words line-clamp-2">
                {serviceDescription}
              </p>
            </div>
            <div className="bg-white/80 border border-purple-100/50 rounded-xl p-3 mt-4 text-[12px] text-purple-900 leading-relaxed font-sans shadow-sm min-w-0">
              <span className="block text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-0.5 truncate">
                {t('bento.today_quote')}
              </span>
              <p className="break-words line-clamp-4">{t('bento.quote_content')}</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-4">
            <span className="text-[12px] font-bold text-purple-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
              {t('bento.book_consultation')}
            </span>
          </div>
        </div>
      );

    default: { // 1x1 Standard Cards
      const getColorConfig = (id: string) => {
        switch (id) {
          case 'saved':
            return {
              bg: 'bg-gradient-to-br from-orange-50/60 to-white hover:from-orange-100/60 hover:to-white/90 border-orange-100/70',
              iconBg: 'bg-orange-100 text-orange-700',
            };
          case 'professors':
            return {
              bg: 'bg-gradient-to-br from-blue-50/60 to-white hover:from-blue-100/60 hover:to-white/90 border-blue-100/70',
              iconBg: 'bg-blue-100 text-blue-700',
            };
          case 'curriculum':
            return {
              bg: 'bg-gradient-to-br from-violet-50/60 to-white hover:from-violet-100/60 hover:to-white/90 border-violet-100/70',
              iconBg: 'bg-violet-100 text-violet-750',
            };
          case 'scholarships':
            return {
              bg: 'bg-gradient-to-br from-sky-50/60 to-white hover:from-sky-100/60 hover:to-white/90 border-sky-100/70',
              iconBg: 'bg-sky-100 text-sky-700',
            };
          case 'sanitary-pads':
            return {
              bg: 'bg-gradient-to-br from-rose-50/60 to-white hover:from-rose-100/60 hover:to-white/90 border-rose-100/70',
              iconBg: 'bg-rose-100 text-rose-700',
            };
          case 'medicine':
            return {
              bg: 'bg-gradient-to-br from-emerald-50/60 to-white hover:from-emerald-100/60 hover:to-white/90 border-emerald-100/70',
              iconBg: 'bg-emerald-100 text-emerald-700',
            };
          case 'sports':
            return {
              bg: 'bg-gradient-to-br from-slate-50/60 to-white hover:from-slate-100/60 hover:to-white/90 border-slate-100/70',
              iconBg: 'bg-slate-100 text-slate-700',
            };
          case 'mental-tips':
            return {
              bg: 'bg-gradient-to-br from-amber-50/60 to-white hover:from-amber-100/60 hover:to-white/90 border-amber-100/70',
              iconBg: 'bg-amber-100 text-amber-700',
            };
          case 'popbus':
            return {
              bg: 'bg-gradient-to-br from-cyan-50/60 to-white hover:from-cyan-100/60 hover:to-white/90 border-cyan-100/70',
              iconBg: 'bg-cyan-100 text-cyan-700',
            };
          case 'learning-center':
            return {
              bg: 'bg-gradient-to-br from-lime-50/60 to-white hover:from-lime-100/60 hover:to-white/90 border-lime-100/70',
              iconBg: 'bg-lime-100 text-lime-800',
            };
          default:
            return {
              bg: 'bg-gradient-to-br from-gray-50/60 to-white hover:from-gray-100/60 hover:to-white/90 border-gray-200/70',
              iconBg: 'bg-gray-150 text-gray-650',
            };
        }
      };

      const colors = getColorConfig(service.id);
      const Icon = service.icon;

      // Provide custom titles and short subtexts to fit the 1x1 cells perfectly
      const getDisplayInfoKeys = (id: string) => {
        switch (id) {
          case 'saved': return { titleKey: 'student_services.bento.saved.title', descKey: 'student_services.bento.saved.desc' };
          case 'professors': return { titleKey: 'student_services.bento.professors.title', descKey: 'student_services.bento.professors.desc' };
          case 'curriculum': return { titleKey: 'student_services.bento.curriculum.title', descKey: 'student_services.bento.curriculum.desc' };
          case 'scholarships': return { titleKey: 'student_services.bento.scholarships.title', descKey: 'student_services.bento.scholarships.desc' };
          case 'sanitary-pads': return { titleKey: 'student_services.bento.pads.title', descKey: 'student_services.bento.pads.desc' };
          case 'medicine': return { titleKey: 'student_services.bento.medicine.title', descKey: 'student_services.bento.medicine.desc' };
          case 'sports': return { titleKey: 'student_services.bento.sports.title', descKey: 'student_services.bento.sports.desc' };
          case 'mental-tips': return { titleKey: 'student_services.bento.mental_tips.title', descKey: 'student_services.bento.mental_tips.desc' };
          case 'popbus': return { titleKey: 'student_services.bento.popbus.title', descKey: 'student_services.bento.popbus.desc' };
          case 'learning-center': return { titleKey: 'student_services.bento.learning_center.title', descKey: 'student_services.bento.learning_center.desc' };
          default: return { titleKey: service.titleKey, descKey: service.descriptionKey };
        }
      };

      const display = getDisplayInfoKeys(service.id);

      return (
        <div
          onClick={handleCardClick}
          className={`col-span-1 row-span-1 ${colors.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border rounded-2xl p-4 flex flex-col justify-between cursor-pointer group min-w-0`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl ${colors.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0`}>
              <Icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 font-sans tracking-wide uppercase shrink-0">
              {t('bento.service_label')}
            </span>
          </div>
          <div className="min-w-0">
            <h4 className="text-[15px] font-bold text-gray-800 leading-tight font-[ChulaCharasNew] group-hover:text-[#DE5D8F] transition-colors truncate">
              {t(display.titleKey)}
            </h4>
            <p className="text-[11px] text-gray-400 truncate mt-0.5 font-sans">
              {t(display.descKey)}
            </p>
          </div>
        </div>
      );
    }
  }
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function StudentServicesPage2() {
  const { t } = useTranslation(['student_services', 'home']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const translateKey = (key: string): string => {
    if (!key) return '';
    if (key.startsWith('quick_access.')) {
      return t(key, { ns: 'home' });
    }
    const cleanKey = key.replace(/^student_services\./, '');
    return t(cleanKey);
  };

  const activeService = searchParams.get('service');

  const closeModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('service');
    setSearchParams(newParams);
  };

  const filteredServices = SERVICES_DATA.filter((service) => {
    const matchesSearch =
      translateKey(service.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      translateKey(service.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const finalBentoServices = filteredServices.filter((service) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'general') return service.category === 'general';
    return service.tags.includes(selectedFilter);
  });

  const modalData = activeService ? getModalContentConfig(activeService) : null;
  const ModalIcon = modalData?.icon;

  return (
    <div className="w-full bg-[#FFF] flex flex-col min-h-screen relative">
      <div className="flex-1 w-full bg-white flex flex-col pt-12 pb-16">
        <div className="max-w-[1282px] w-full mx-auto px-4 lg:px-6 flex-1 flex flex-col">
          <SectionHeading title={translateKey('title') + " (Bento Grid)"} description={translateKey('desc')} />

          <div className="mt-8 pb-8 w-full">
            <div className="relative max-w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DE5D8F] pointer-events-none" />
              <input
                type="text"
                placeholder={translateKey('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-full border border-[#8B8B8C] bg-white text-[16px] font-[ChulaCharasNew] text-[#DE5D8F] placeholder:text-[#DE5D8F] focus:outline-none focus:ring-2 focus:ring-[#DE5D8F]/30 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8C] hover:text-[#DE5D8F] cursor-pointer transition-colors border-none bg-transparent">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 mt-10 flex-1">
            <nav className="hidden lg:block w-[320px] shrink-0">
              <div className="sticky top-28 flex flex-col gap-4 select-none">
                {SIDEBAR_ITEMS.map((item) => {
                  const isActive = selectedFilter === item.tag;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedFilter(item.tag);
                      }}
                      className={`text-left text-[19px] font-bold font-[ChulaCharasNew] transition-all duration-200 cursor-pointer w-full py-2 bg-transparent focus:outline-none border-none ${
                        isActive 
                          ? 'text-[#DE5D8F]' 
                          : 'text-gray-500 hover:text-[#DE5D8F]/80'
                      }`}
                    >
                      {translateKey(item.labelKey)}
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="flex-1 min-w-0">
              <div className="w-full lg:hidden overflow-x-auto flex gap-6 pb-4 scrollbar-none snap-x mb-6">
                {SIDEBAR_ITEMS.map((item) => {
                  const isActive = selectedFilter === item.tag;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFilter(item.tag)}
                      className={`py-2 text-[16px] font-bold transition-all whitespace-nowrap snap-center cursor-pointer font-[ChulaCharasNew] border-none bg-transparent focus:outline-none ${
                        isActive 
                          ? 'text-[#DE5D8F]' 
                          : 'text-gray-500 hover:text-[#DE5D8F]/80'
                      }`}
                    >
                      {translateKey(item.labelKey)}
                    </button>
                  );
                })}
              </div>

              <div className="w-full">
                {finalBentoServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid-flow-row-dense auto-rows-[160px] w-full">
                    {finalBentoServices.map((service) => (
                      <BentoCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-[16px] font-[ChulaCharasNew] break-words">
                      {translateKey('no_results')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30">
        <Footer />
      </div>

      {/* Modal for KOS services */}
      {activeService && modalData && (
        <div
          className="fixed inset-0 bg-[#000]/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl border border-[#D0D0D1] shadow-2xl max-w-lg w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#F5CDDC] px-6 py-4 flex items-center justify-between border-b border-[#D0D0D1]">
              <h3 className="text-[20px] font-bold text-[#404041] font-[ChulaCharasNew] flex items-center gap-3 truncate pr-4">
                {ModalIcon && <ModalIcon className="text-[#DE5D8F] shrink-0" size={24} />}
                <span className="truncate">{translateKey(modalData.titleKey)}</span>
              </h3>
              <button onClick={closeModal} className="text-[#404041] hover:text-[#DE5D8F] transition-colors p-1.5 rounded-full hover:bg-white/50 cursor-pointer border-none bg-transparent">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-[#404041] leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                <p className="break-words">{translateKey(modalData.descKey)}</p>
                <div>
                  <strong className="text-[#DE5D8F] block mb-1 break-words">{translateKey(modalData.locationLabelKey)}</strong>
                  <p className="break-words">{translateKey(modalData.locationKey)}</p>
                </div>
                {modalData.timeLabelKey && modalData.timeKey && (
                  <div>
                    <strong className="text-[#DE5D8F] block mb-1 break-words">{translateKey(modalData.timeLabelKey)}</strong>
                    <p className="break-words">{translateKey(modalData.timeKey)}</p>
                  </div>
                )}
                {modalData.medsLabelKey && modalData.medsKey && (
                  <div>
                    <strong className="text-[#DE5D8F] block mb-1 break-words">{translateKey(modalData.medsLabelKey)}</strong>
                    <p className="break-words">{translateKey(modalData.medsKey)}</p>
                  </div>
                )}
                {modalData.rulesLabelKey && modalData.rulesKeys && (
                  <div>
                    <strong className="text-[#DE5D8F] block mb-1 break-words">{translateKey(modalData.rulesLabelKey)}</strong>
                    <ul className="list-disc pl-5 space-y-1">
                      {modalData.rulesKeys.map((rKey, i) => (
                        <li key={i} className="break-words">{translateKey(rKey)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-end">
              <Button
                onClick={closeModal}
                variant="primary"
                className="px-6 py-2.5 h-[40px] rounded-lg font-[ChulaCharasNew] text-[14px] font-bold"
              >
                {translateKey('modal_ok')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
