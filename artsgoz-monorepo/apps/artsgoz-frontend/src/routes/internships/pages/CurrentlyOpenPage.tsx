import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Bookmark, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '../../../components/Footer/index.js';
import { MOCK_OPEN_INTERNSHIPS, LANGUAGE_FILTER_TAGS } from '../internshipsData.js';

// Hero images
import hero1 from '../../../assets/internships/internship_hero_1.png';
import hero2 from '../../../assets/internships/internship_hero_2.png';
import hero3 from '../../../assets/internships/internship_hero_3.png';

const HERO_IMAGES = [hero1, hero2, hero3];

const SORT_OPTIONS = [
  { key: 'newest', labelKey: 'internships.sort.newest' },
  { key: 'oldest', labelKey: 'internships.sort.oldest' },
];

export default function CurrentlyOpenPage() {
  const { t } = useTranslation('internships');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredInternships = useMemo(() => {
    let list = MOCK_OPEN_INTERNSHIPS.filter(item => {
      const matchesSearch =
        !searchQuery ||
        t(item.positionKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(item.companyKey).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag === 'all' ||
        t(item.languageTagKey).toLowerCase() === t(`tags.${selectedTag}`).toLowerCase();
      return matchesSearch && matchesTag;
    });
    if (sortOrder === 'oldest') list = [...list].reverse();
    return list;
  }, [searchQuery, selectedTag, sortOrder, t]);

  const selectedSortLabel = t(SORT_OPTIONS.find(o => o.key === sortOrder)?.labelKey ?? SORT_OPTIONS[0].labelKey);

  return (
    <>
      <div className="w-full bg-white min-h-screen font-[ChulaCharasNew]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-10 pb-16">

          {/* ── Hero Section ── */}
          <div className="relative flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-10">

            {/* Left: Title */}
            <div className="lg:w-[38%] flex flex-col justify-end pb-2 sm:pb-4">
              <h1 className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold text-[#404041] leading-[1.15] font-serif">
                {t('open.title')}
              </h1>
            </div>

            {/* Right: 3 Stacked Photo Cards */}
            <div className="lg:flex-1 flex flex-row gap-2 sm:gap-3 h-[140px] sm:h-[220px] md:h-[280px]">
              {HERO_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-[10px] sm:rounded-[12px] overflow-hidden relative"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {/* Pink gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[66%] to-[#DE5D8F]/80" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Search & Filter Panel ── */}
          <div
            className="rounded-[15px] p-4 sm:p-6 md:p-8 mb-8 shadow-md"
            style={{ backgroundColor: 'rgba(233, 146, 180, 0.2)' }}
          >
            {/* Search Bar */}
            <div className="relative flex items-center bg-white border border-[#8B8B8C] rounded-full px-4 h-[41px] mb-4 sm:mb-5 focus-within:border-[#DE5D8F] focus-within:ring-1 focus-within:ring-[#DE5D8F] transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('open.search_placeholder')}
                className="flex-1 bg-transparent text-[#404041] text-[15px] sm:text-[16px] outline-none placeholder-[#99999A] font-[ChulaCharasNew]"
              />
              <Search size={18} className="text-[#8B8B8C] shrink-0" />
            </div>

            {/* Language Category Dropdown Chips Row */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5">
              {LANGUAGE_FILTER_TAGS.map(tag => (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => setSelectedTag(tag.key)}
                  className={`px-3 sm:px-4 h-[30px] sm:h-[34px] rounded-full text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer border ${
                    selectedTag === tag.key
                      ? 'bg-[#DE5D8F] text-white border-[#DE5D8F]'
                      : 'bg-white text-[#6D6D6D] border-[#D0D0D1] hover:border-[#DE5D8F] hover:text-[#DE5D8F]'
                  }`}
                >
                  {t(tag.labelKey)}
                </button>
              ))}
            </div>

            {/* Sort Row */}
            <div className="flex items-center gap-3">
              <span className="text-[14px] md:text-[16px] font-bold text-[#404041]">
                {t('sort.label')}
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between gap-3 px-4 h-[32px] bg-[#ECECEC] text-[#404041] text-[14px] font-normal rounded-[5px] border-none cursor-pointer shadow-sm min-w-[140px]"
                >
                  <span>{selectedSortLabel}</span>
                  <ChevronDown size={14} className={`text-[#636363] transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-[36px] z-30 bg-white border border-gray-200 rounded-[8px] shadow-lg overflow-hidden min-w-[140px]"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => { setSortOrder(opt.key); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#FCEFF4] hover:text-[#DE5D8F] transition-colors cursor-pointer border-none bg-transparent ${sortOrder === opt.key ? 'text-[#DE5D8F] font-bold' : 'text-[#404041]'}`}
                        >
                          {t(opt.labelKey)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Section Title ── */}
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-[24px] sm:text-[28px] md:text-[36px] font-bold text-[#404041] font-serif">
              {t('open.listing_title')}
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#FCEFF4] text-[#DE5D8F] text-[13px] sm:text-[14px] font-bold">
              {filteredInternships.length}
            </span>
          </div>

          {/* ── Internship Card List ── */}
          <div className="flex flex-col gap-4">
            {filteredInternships.length > 0 ? (
              filteredInternships.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="w-full bg-white border border-[#E6E6E6] rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row sm:items-center p-4 md:p-6 gap-3 sm:gap-4 relative hover:border-[#DE5D8F]/30 transition-colors"
                >
                  {/* Top Mobile Row: Logo + Position + Bookmark */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Company Logo Placeholder */}
                    <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] shrink-0 rounded-[9px] border border-[#D6D6D6] bg-gradient-to-br from-[#FCEFF4] to-[#F5CDDC] flex items-center justify-center">
                      <span className="text-[#DE5D8F] font-bold text-[16px] sm:text-[18px] md:text-[22px] tracking-wider">
                        {item.logoPlaceholder}
                      </span>
                    </div>

                    {/* Title + Company on mobile */}
                    <div className="flex-1 min-w-0 sm:hidden flex flex-col gap-0.5">
                      <h3 className="text-[16px] font-bold text-[#404041] font-serif leading-tight truncate">
                        {t(item.positionKey)}
                      </h3>
                      <p className="text-[14px] font-bold text-[#6D6D6D] truncate">
                        {t(item.companyKey)}
                      </p>
                    </div>

                    {/* Bookmark on mobile top-right */}
                    <div className="sm:hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(item.id)}
                        className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors cursor-pointer border-none ${
                          bookmarkedIds.has(item.id) ? 'bg-[#E992B4] text-white' : 'bg-[#F7F8F9] text-[#E992B4]'
                        }`}
                        aria-label={bookmarkedIds.has(item.id) ? 'Remove bookmark' : 'Bookmark'}
                      >
                        <Bookmark size={15} fill={bookmarkedIds.has(item.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Content on Tablet/Desktop */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <h3 className="hidden sm:block text-[18px] md:text-[22px] font-bold text-[#404041] font-serif leading-tight truncate">
                      {t(item.positionKey)}
                    </h3>
                    <p className="hidden sm:block text-[16px] md:text-[18px] font-bold text-[#404041] truncate">
                      {t(item.companyKey)}
                    </p>
                    <p className="text-[13px] md:text-[14px] text-[#626262] leading-relaxed line-clamp-2 font-[ChulaCharasNew]">
                      {t(item.detailKey)}
                    </p>
                    {/* Mobile language tag row */}
                    <div className="flex sm:hidden items-center justify-between mt-1 pt-2 border-t border-gray-100">
                      <span className="px-3 py-0.5 rounded-full bg-[#F4FDDF] text-[#404041] text-[12px] font-medium">
                        {t(item.languageTagKey)}
                      </span>
                    </div>
                  </div>

                  {/* Language Tag + Bookmark on Desktop */}
                  <div className="hidden sm:flex flex-col items-end gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(item.id)}
                      className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors cursor-pointer border-none ${
                        bookmarkedIds.has(item.id) ? 'bg-[#E992B4] text-white' : 'bg-[#F7F8F9] text-[#E992B4]'
                      }`}
                      aria-label={bookmarkedIds.has(item.id) ? 'Remove bookmark' : 'Bookmark'}
                    >
                      <Bookmark size={16} fill={bookmarkedIds.has(item.id) ? 'currentColor' : 'none'} />
                    </button>

                    <span className="px-4 py-1 rounded-full bg-[#F4FDDF] text-[#404041] text-[13px] font-medium whitespace-nowrap">
                      {t(item.languageTagKey)}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search size={56} className="text-gray-300 mb-4" />
                <p className="text-[18px] text-gray-500 font-serif">{t('no_results')}</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
