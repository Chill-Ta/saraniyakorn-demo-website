import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Users, Bookmark, ListTodo, FileText, Search,
  GraduationCap, Globe, ClipboardList, Umbrella, Heart, Pill,
  Brain, HeartHandshake, Dumbbell, Smile, Bus, Lightbulb,
  X, Compass,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SectionHeading, Button } from '@artsgoz/design-system';
import { FeatureCard } from '../../../features/quick-access/index.js';
import { PATHS } from '../../paths';
import { Footer } from '../../../components/Footer/index.js';

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

interface CategoryGroup {
  id: string;
  titleKey: string;
  tag: string;
  subtitleKey: string;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: 'general', titleKey: 'student_services.categories.general.title', tag: 'general', subtitleKey: 'student_services.categories.general.subtitle' },
  { id: 'academic', titleKey: 'student_services.categories.academic.title', tag: 'academic', subtitleKey: 'student_services.categories.academic.subtitle' },
  { id: 'learning', titleKey: 'student_services.categories.learning.title', tag: 'learning', subtitleKey: 'student_services.categories.learning.subtitle' },
  { id: 'kos', titleKey: 'student_services.categories.kos.title', tag: 'kos', subtitleKey: 'student_services.categories.kos.subtitle' },
  { id: 'mental', titleKey: 'student_services.categories.mental.title', tag: 'mental', subtitleKey: 'student_services.categories.mental.subtitle' },
  { id: 'university', titleKey: 'student_services.categories.university.title', tag: 'university', subtitleKey: 'student_services.categories.university.subtitle' },
];

const SIDEBAR_ITEMS = [
  { id: 'all', labelKey: 'student_services.sidebar.all', tag: 'all' },
  { id: 'general', labelKey: 'student_services.sidebar.general', tag: 'general' },
  { id: 'academic', labelKey: 'student_services.sidebar.academic', tag: 'academic' },
  { id: 'learning', labelKey: 'student_services.sidebar.learning', tag: 'learning' },
  { id: 'kos', labelKey: 'student_services.sidebar.kos', tag: 'kos' },
  { id: 'mental', labelKey: 'student_services.sidebar.mental', tag: 'mental' },
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

export default function StudentServicesPage() {
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

  // Scrollspy effect to highlight the category link on scroll
  useEffect(() => {
    if (searchQuery) return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180;

      if (window.scrollY < 200) {
        setSelectedFilter('all');
        return;
      }

      let currentFilter = 'all';
      for (const group of CATEGORY_GROUPS) {
        const el = document.getElementById(`section-${group.id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentFilter = group.id;
            break;
          }
        }
      }
      setSelectedFilter(currentFilter);
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [searchQuery]);

  const renderServicesGrid = (groupServices: ServiceItem[]) => {
    const count = groupServices.length;

    if (count === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-2 w-full">
          <div className="md:row-span-2 h-full">
            <FeatureCard
              title={translateKey(groupServices[0].titleKey)}
              description={translateKey(groupServices[0].descriptionKey)}
              icon={groupServices[0].icon}
              href={groupServices[0].href}
              isExternal={groupServices[0].isExternal}
              size="lg"
            />
          </div>
          <div className="h-[180px] md:h-[189px]">
            <FeatureCard
              title={translateKey(groupServices[1].titleKey)}
              description={translateKey(groupServices[1].descriptionKey)}
              icon={groupServices[1].icon}
              href={groupServices[1].href}
              isExternal={groupServices[1].isExternal}
              size="sm"
            />
          </div>
          <div className="h-[180px] md:h-[189px]">
            <FeatureCard
              title={translateKey(groupServices[2].titleKey)}
              description={translateKey(groupServices[2].descriptionKey)}
              icon={groupServices[2].icon}
              href={groupServices[2].href}
              isExternal={groupServices[2].isExternal}
              size="sm"
            />
          </div>
        </div>
      );
    }

    if (count === 5) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-2 w-full">
          <div className="h-full">
            <FeatureCard
              title={translateKey(groupServices[0].titleKey)}
              description={translateKey(groupServices[0].descriptionKey)}
              icon={groupServices[0].icon}
              href={groupServices[0].href}
              isExternal={groupServices[0].isExternal}
              size="lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:gap-2">
            {groupServices.slice(1).map((service, index) => (
              <FeatureCard
                key={index}
                title={translateKey(service.titleKey)}
                description={translateKey(service.descriptionKey)}
                icon={service.icon}
                href={service.href}
                isExternal={service.isExternal}
                size="sm"
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-2 w-full">
        {groupServices.map((service, index) => (
          <FeatureCard
            key={index}
            title={translateKey(service.titleKey)}
            description={translateKey(service.descriptionKey)}
            icon={service.icon}
            href={service.href}
            isExternal={service.isExternal}
            size="sm"
          />
        ))}
      </div>
    );
  };

  const closeModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('service');
    setSearchParams(newParams);
  };

  const filteredServices = SERVICES_DATA.filter((service) => {
    const matchesSearch =
      translateKey(service.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      translateKey(service.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderGroups = CATEGORY_GROUPS;
  const modalData = activeService ? getModalContentConfig(activeService) : null;
  const ModalIcon = modalData?.icon;

  return (
    <div className="w-full bg-[#FFF] flex flex-col min-h-screen relative">
      <div className="flex-1 w-full bg-white flex flex-col pt-12 pb-16">
        <div className="max-w-[1282px] w-full mx-auto px-4 lg:px-6 flex-1 flex flex-col">
          <SectionHeading title={translateKey('title')} description={translateKey('desc')} />

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
                        if (item.tag === 'all') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          const el = document.getElementById(`section-${item.tag}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
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
                      onClick={() => {
                        setSelectedFilter(item.tag);
                        if (item.tag === 'all') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          const el = document.getElementById(`section-${item.tag}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
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

              <div className="space-y-[60px] w-full">
                {searchQuery ? (
                  <div>
                    <div className="flex items-baseline justify-between pb-3 mb-6">
                      <h3 className="text-[26px] font-bold text-gray-900 font-serif leading-none break-words">
                        {translateKey('search_results_for')}{searchQuery}"
                      </h3>
                      <span className="text-[13px] font-semibold text-gray-400 font-serif tracking-wide shrink-0">
                        {filteredServices.length} {translateKey('items_count')}
                      </span>
                    </div>
                    {filteredServices.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-2 w-full">
                        {filteredServices.map((service, index) => (
                          <FeatureCard
                            key={index}
                            title={translateKey(service.titleKey)}
                            description={translateKey(service.descriptionKey)}
                            icon={service.icon}
                            href={service.href}
                            isExternal={service.isExternal}
                            size="sm"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Search size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-[16px] font-[ChulaCharasNew] break-words">{translateKey('no_results')}</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-4 px-4 py-2 text-[14px] font-bold text-[#DE5D8F] border border-[#DE5D8F] rounded-lg hover:bg-[#DE5D8F]/10 transition-colors font-[ChulaCharasNew] cursor-pointer bg-transparent"
                        >
                          {translateKey('clear_search')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  renderGroups.map((group) => {
                    const groupServices = filteredServices.filter((s) => {
                      if (group.id === 'general') return s.category === 'general';
                      return s.tags.includes(group.id);
                    });
                    if (groupServices.length === 0) return null;

                    return (
                      <section
                        key={group.id}
                        id={`section-${group.id}`}
                        className="w-full scroll-mt-28"
                      >
                        <div className="flex items-baseline justify-between pb-3 mb-6 select-none flex-wrap gap-2">
                          <h3 className="text-[26px] font-bold text-gray-900 font-serif leading-none truncate max-w-full">
                            {translateKey(group.titleKey)}
                          </h3>
                          <span className="text-[13px] font-semibold text-gray-400 font-serif tracking-wide break-words max-w-full">
                            {translateKey(group.subtitleKey)}
                          </span>
                        </div>

                        {renderServicesGrid(groupServices)}
                      </section>
                    );
                  })
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
