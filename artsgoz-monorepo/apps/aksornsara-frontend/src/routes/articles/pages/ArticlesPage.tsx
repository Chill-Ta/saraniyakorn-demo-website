import { useMemo, useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SearchInput, Pagination, Button } from '@artsgoz/design-system';
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Feather,
  Timer,
  Bookmark,
  BookmarkX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArticleCard,
  CategoryFilterBar,
  MOCK_ARTICLES,
  AKSORNSARA_CATEGORIES,
  getArticlesSummaryList,
  fetchRemoteArticles,
} from '../../../features/articles/index.js';
import { Footer } from '../../../components/Footer/index.js';
import { useClickOutside } from '../../../components/Navbar/useClickOutside.js';

const ITEMS_PER_PAGE = 8;

// Mock Saved Data for Internships & Reviews with i18n keys
const MOCK_SAVED_INTERNSHIPS = [
  {
    id: 'intern-01',
    company: 'LINE Man Wongnai',
    roleKey: 'articles.saved_internships.intern1.role',
    periodKey: 'articles.saved_internships.intern1.period',
    categoryKey: 'articles.saved_internships.intern1.category',
    authorKey: 'articles.saved_internships.intern1.author',
    date: '28/05/69',
    tagsKeys: ['articles.tags.wfh', 'articles.tags.allowance'],
  },
  {
    id: 'intern-02',
    company: 'Shopee Thailand',
    roleKey: 'articles.saved_internships.intern2.role',
    periodKey: 'articles.saved_internships.intern2.period',
    categoryKey: 'articles.saved_internships.intern2.category',
    authorKey: 'articles.saved_internships.intern2.author',
    date: '15/05/69',
    tagsKeys: ['articles.tags.hybrid', 'articles.tags.allowance'],
  },
];

const MOCK_SAVED_REVIEWS = [
  {
    id: 'rev-01',
    company: 'Agoda',
    roleKey: 'articles.saved_reviews.review1.role',
    rating: 5,
    excerptKey: 'articles.saved_reviews.review1.excerpt',
    categoryKey: 'articles.saved_reviews.review1.category',
    authorKey: 'articles.saved_reviews.review1.author',
    date: '10/05/69',
  },
  {
    id: 'rev-02',
    company: 'True Digital Group',
    roleKey: 'articles.saved_reviews.review2.role',
    rating: 4.5,
    excerptKey: 'articles.saved_reviews.review2.excerpt',
    categoryKey: 'articles.saved_reviews.review2.category',
    authorKey: 'articles.saved_reviews.review2.author',
    date: '02/05/69',
  },
];

// Helper to parse Thai date or year (e.g. '28/05/69' or '2026')
const parseDateToTimestamp = (dateStr: string) => {
  try {
    if (/^\d{4}$/.test(dateStr)) {
      return new Date(Number(dateStr), 0, 1).getTime();
    }
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(2000 + year - 43, month - 1, day).getTime();
  } catch {
    return 0;
  }
};

// Premium Horizontal Saved Card Component matching Figma spec
function SavedArticleCard({
  article,
  onUnbookmark,
}: {
  article: typeof MOCK_ARTICLES[0];
  onUnbookmark: () => void;
}) {
  const { t } = useTranslation('articles');
  const navigate = useNavigate();

  const title = article.title.startsWith('mock.') ? t(article.title) : article.title;
  const excerpt = article.excerpt.startsWith('mock.') ? t(article.excerpt) : article.excerpt;
  const category = article.category.startsWith('categories.')
    ? t(article.category)
    : article.category;
  const author = article.author.startsWith('mock.') ? t(article.author) : article.author;

  return (
    <div
      onClick={() => navigate(`/articles/${article.id}`)}
      className="w-full max-w-[1056px] rounded-2xl border border-gray-200 bg-white hover:bg-[#FDF8FA]/30 hover:border-[#E992B4]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-row items-center p-3.5 sm:p-4 md:p-0 cursor-pointer group gap-3 sm:gap-4 md:gap-0"
    >
      {/* Desktop Cover Image (left) */}
      <div className="hidden md:block md:w-[280px] lg:w-[320px] h-[220px] shrink-0 overflow-hidden relative">
        <img
          src={article.imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Info Content */}
      <div className="flex-1 md:p-6 flex flex-col justify-between gap-2 sm:gap-3 min-w-0">
        {/* Header line: Title / Excerpt */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <h3 className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[24px] font-bold text-[#404041] font-serif leading-snug group-hover:text-[#DE5D8F] transition-colors line-clamp-1 break-words">
              {title}
            </h3>
            <span className="text-[12px] sm:text-[13px] font-bold text-[#6D6D6D] font-serif truncate">
              {t('written_by', { author })}
            </span>
            <p className="text-[12px] sm:text-[14px] text-gray-500 font-serif leading-relaxed line-clamp-2 break-words">
              {excerpt}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 text-[12px] font-normal text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-sans whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
              {category}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnbookmark();
              }}
              className="w-8 h-8 rounded-lg bg-[#F8C135] text-white flex items-center justify-center hover:bg-[#DE5D8F] transition-colors cursor-pointer shadow-xs active:scale-95 border-none"
              aria-label="Remove bookmark"
            >
              <Bookmark size={15} fill="white" />
            </button>
          </div>
        </div>

        {/* Mobile Category Chip + Bookmark Row */}
        <div className="flex md:hidden items-center justify-between gap-2 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-normal text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-sans whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
              {category}
            </span>
            <span className="text-[11px] text-gray-400 font-serif">
              {article.date}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnbookmark();
            }}
            className="w-7 h-7 rounded-md bg-[#F8C135] text-white flex items-center justify-center hover:bg-[#DE5D8F] transition-colors cursor-pointer border-none shrink-0"
            aria-label="Remove bookmark"
          >
            <Bookmark size={13} fill="white" />
          </button>
        </div>

        {/* Desktop Bottom line: Author, Date, and Read CTA */}
        <div className="hidden md:flex items-center justify-between border-t border-gray-100 pt-4 text-[13px] text-gray-400 font-serif flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 min-w-0 truncate max-w-[150px] md:max-w-none">
              <Feather size={14} className="text-gray-350 shrink-0" />
              <span className="truncate">{t('written_by', { author })}</span>
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Timer size={14} className="text-gray-350 shrink-0" />
              {t('published', { date: article.date })}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[#DE5D8F] font-bold group-hover:translate-x-1 transition-transform shrink-0">
            {t('read_more')}
            <ArrowRight size={14} />
          </span>
        </div>
      </div>

      {/* Mobile Square Thumbnail */}
      <div className="w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] md:hidden shrink-0 rounded-xl overflow-hidden relative border border-gray-150 bg-gray-100">
        <img
          src={article.imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const { t } = useTranslation('articles');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const CATEGORIES = AKSORNSARA_CATEGORIES;

  // Sync state from URL parameters
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const currentPage = Number(searchParams.get('page')) || 1;
  const isSavedTab = searchParams.get('tab') === 'saved';

  // Articles state synced with backend API
  const [articlesList, setArticlesList] = useState(() => getArticlesSummaryList());

  useEffect(() => {
    fetchRemoteArticles().then((items) => {
      if (items && items.length > 0) {
        setArticlesList(items);
      }
    });
  }, []);

  // State for Saved Items page
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [savedTab, setSavedTab] = useState<'articles' | 'internships' | 'reviews'>('articles');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBySavedDate, setSortBySavedDate] = useState<'newest' | 'oldest'>('newest');
  const [sortByPostDate, setSortByPostDate] = useState<'newest' | 'oldest'>('newest');
  const savedFilterRef = useRef<HTMLDivElement>(null);

  useClickOutside(savedFilterRef, () => setIsFilterOpen(false));

  // Filter & Sort order for main articles view ('newest' = ใหม่ไปเก่า, 'oldest' = เก่าไปใหม่)
  const [articlesSortOrder, setArticlesSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isArticlesFilterOpen, setIsArticlesFilterOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(filterDropdownRef, () => setIsArticlesFilterOpen(false));

  const handleUnbookmark = (id: string) => {
    try {
      const updated = bookmarkedIds.filter((bid) => bid !== id);
      setBookmarkedIds(updated);
      localStorage.setItem('bookmarked_articles', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filter and Sort Saved Articles
  const savedArticles = useMemo(() => {
    let list = articlesList.filter((article) => bookmarkedIds.includes(article.id));

    if (savedSearchQuery.trim() !== '') {
      const query = savedSearchQuery.trim().toLowerCase();
      list = list.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query)
      );
    }

    if (sortBySavedDate === 'newest') {
      list = [...list].sort(
        (a, b) => bookmarkedIds.indexOf(b.id) - bookmarkedIds.indexOf(a.id)
      );
    } else {
      list = [...list].sort(
        (a, b) => bookmarkedIds.indexOf(a.id) - bookmarkedIds.indexOf(b.id)
      );
    }

    if (sortByPostDate === 'newest') {
      list = [...list].sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
    } else if (sortByPostDate === 'oldest') {
      list = [...list].sort((a, b) => parseDateToTimestamp(a.date) - parseDateToTimestamp(b.date));
    }

    return list;
  }, [bookmarkedIds, savedSearchQuery, sortBySavedDate, sortByPostDate, articlesList]);

  // Handler helpers to update URL params for main tab
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('search', value);
        } else {
          prev.delete('search');
        }
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  };

  const handleCategorySelect = (category: string) => {
    setSearchParams(
      (prev) => {
        if (category && category !== 'all' && category !== 'categories.all') {
          prev.set('category', category);
        } else {
          prev.delete('category');
        }
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  };

  const handlePageChange = (page: number) => {
    setSearchParams(
      (prev) => {
        prev.set('page', String(page));
        return prev;
      },
      { replace: true }
    );
  };

  const handleClearFilters = () => {
    setArticlesSortOrder('newest');
    setSearchParams(
      (prev) => {
        prev.delete('search');
        prev.delete('category');
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  };

  // Filter articles by category (year) + search query, and sort by date/year ('newest' or 'oldest')
  const filteredArticles = useMemo(() => {
    const allArticles = articlesList;
    const list = allArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === 'categories.all' ||
        article.category === selectedCategory ||
        article.year === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    return list.sort((a, b) => {
      const yrA = Number(a.year) || 0;
      const yrB = Number(b.year) || 0;
      if (articlesSortOrder === 'newest') {
        if (yrB !== yrA) return yrB - yrA;
        return b.id.localeCompare(a.id);
      } else {
        if (yrA !== yrB) return yrA - yrB;
        return a.id.localeCompare(b.id);
      }
    });
  }, [searchQuery, selectedCategory, articlesSortOrder, articlesList]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const currentArticles = useMemo(() => {
    return filteredArticles.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredArticles, currentPage]);

  // ── Render Saved Items View ──
  if (isSavedTab) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full py-12 md:py-20 flex flex-col gap-10">
          {/* Header Title Section */}
          <div className="flex flex-col gap-6 w-full relative">
            <div className="flex items-center gap-4">
              <Bookmark size={40} className="text-[#DE5D8F] shrink-0" fill="#DE5D8F" />
              <h1 className="text-[36px] md:text-[48px] font-bold text-[#404041] font-serif leading-none">
                {t('saved_title')}
              </h1>
            </div>

            {/* Search and Filters bar */}
            <div className="flex items-center gap-3 w-full relative">
              <div className="flex-1">
                <SearchInput
                  size="lg"
                  placeholder={t('search_saved_placeholder')}
                  value={savedSearchQuery}
                  onChange={(e) => setSavedSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Popover Toggle */}
              <div className="relative shrink-0" ref={savedFilterRef}>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="w-[52px] md:w-[55px] h-[52px] md:h-[55px] rounded-[14px] text-white hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm border-none"
                  style={{ backgroundColor: '#E992B4' }}
                  aria-label={t('filter_and_sort')}
                  title={t('filter_and_sort')}
                >
                  <SlidersHorizontal size={20} />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-[60px] w-[280px] sm:w-[320px] p-5 bg-white border border-gray-100 rounded-[16px] shadow-xl z-50 flex flex-col gap-4 font-serif"
                      style={{
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <h4 className="font-bold text-[16px] sm:text-[17px] text-[#404041] border-b border-gray-100 pb-2">
                        {t('filter_and_sort')}
                      </h4>

                      {/* Date Saved Sort */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[13px] font-bold text-gray-400">
                          {t('date_saved')}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <label className="flex items-center gap-2.5 cursor-pointer group text-gray-700 hover:text-[#DE5D8F] transition-colors p-1.5 rounded-lg hover:bg-pink-50/50">
                            <input
                              type="radio"
                              name="savedDate"
                              checked={sortBySavedDate === 'newest'}
                              onChange={() => setSortBySavedDate('newest')}
                              className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                            />
                            <span className="text-[14px] font-bold">{t('sort_newest')}</span>
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer group text-gray-700 hover:text-[#DE5D8F] transition-colors p-1.5 rounded-lg hover:bg-pink-50/50">
                            <input
                              type="radio"
                              name="savedDate"
                              checked={sortBySavedDate === 'oldest'}
                              onChange={() => setSortBySavedDate('oldest')}
                              className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                            />
                            <span className="text-[14px] font-bold">{t('sort_oldest')}</span>
                          </label>
                        </div>
                      </div>

                      {/* Date Posted Sort */}
                      <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                        <span className="text-[13px] font-bold text-gray-400">
                          {t('date_posted')}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <label className="flex items-center gap-2.5 cursor-pointer group text-gray-700 hover:text-[#DE5D8F] transition-colors p-1.5 rounded-lg hover:bg-pink-50/50">
                            <input
                              type="radio"
                              name="postedDate"
                              checked={sortByPostDate === 'newest'}
                              onChange={() => setSortByPostDate('newest')}
                              className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                            />
                            <span className="text-[14px] font-bold">{t('sort_newest')}</span>
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer group text-gray-700 hover:text-[#DE5D8F] transition-colors p-1.5 rounded-lg hover:bg-pink-50/50">
                            <input
                              type="radio"
                              name="postedDate"
                              checked={sortByPostDate === 'oldest'}
                              onChange={() => setSortByPostDate('oldest')}
                              className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                            />
                            <span className="text-[14px] font-bold">{t('sort_oldest')}</span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sub-tab Selectors */}
            <div className="flex items-center gap-8 border-b border-gray-150 pb-1 mt-4">
              <button
                onClick={() => setSavedTab('articles')}
                className={`pb-3 font-serif text-[18px] md:text-[20px] font-bold cursor-pointer relative transition-colors duration-200 focus:outline-none border-none bg-transparent ${
                  savedTab === 'articles' ? 'text-[#DE5D8F]' : 'text-[#AEAEAE] hover:text-[#7A7A7A]'
                }`}
              >
                {t('tab_articles')}
                {savedTab === 'articles' && (
                  <motion.div
                    layoutId="savedTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DE5D8F] rounded-full"
                  />
                )}
              </button>
              <button
                onClick={() => setSavedTab('internships')}
                className={`pb-3 font-serif text-[18px] md:text-[20px] font-bold cursor-pointer relative transition-colors duration-200 focus:outline-none border-none bg-transparent ${
                  savedTab === 'internships' ? 'text-[#DE5D8F]' : 'text-[#AEAEAE] hover:text-[#7A7A7A]'
                }`}
              >
                {t('tab_internships')}
                {savedTab === 'internships' && (
                  <motion.div
                    layoutId="savedTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DE5D8F] rounded-full"
                  />
                )}
              </button>
              <button
                onClick={() => setSavedTab('reviews')}
                className={`pb-3 font-serif text-[18px] md:text-[20px] font-bold cursor-pointer relative transition-colors duration-200 focus:outline-none border-none bg-transparent ${
                  savedTab === 'reviews' ? 'text-[#DE5D8F]' : 'text-[#AEAEAE] hover:text-[#7A7A7A]'
                }`}
              >
                {t('tab_reviews')}
                {savedTab === 'reviews' && (
                  <motion.div
                    layoutId="savedTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DE5D8F] rounded-full"
                  />
                )}
              </button>
            </div>
          </div>

          {/* ── Saved Items Lists ── */}
          <div className="flex flex-col gap-6 w-full items-center">
            {savedTab === 'articles' && (
              savedArticles.length > 0 ? (
                <div className="flex flex-col gap-6 w-full items-center">
                  {savedArticles.map((article) => (
                    <SavedArticleCard
                      key={article.id}
                      article={article}
                      onUnbookmark={() => handleUnbookmark(article.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-[#FDF8FA]/30 border border-dashed border-pink-200 rounded-[24px] w-full px-4">
                  <BookmarkX size={64} className="text-pink-300 mb-4" />
                  <h3 className="text-[20px] font-bold text-gray-700 font-serif mb-2">
                    {t('no_saved_articles')}
                  </h3>
                  <p className="text-gray-400 max-w-sm text-[15px] font-serif mb-6 leading-relaxed">
                    {t('no_saved_articles_desc')}
                  </p>
                  <button
                    onClick={() => navigate('/articles')}
                    className="px-6 py-2.5 bg-[#E992B4] hover:bg-[#DE5D8F] text-white font-bold rounded-xl transition-all cursor-pointer active:scale-95 font-serif text-[15px] border-none"
                  >
                    {t('explore_articles')}
                  </button>
                </div>
              )
            )}

            {savedTab === 'internships' && (
              <div className="flex flex-col gap-6 w-full items-center">
                {MOCK_SAVED_INTERNSHIPS.map((intern) => (
                  <div
                    key={intern.id}
                    className="w-full max-w-[1056px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-[13px] font-bold text-[#DE5D8F] font-serif truncate">
                          {intern.company}
                        </span>
                        <h3 className="text-[20px] md:text-[22px] font-bold text-[#404041] font-serif leading-tight truncate">
                          {t(intern.roleKey)}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {intern.tagsKeys.map((tagKey, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[11px] font-bold text-gray-500 bg-gray-100 rounded-sm font-sans"
                            >
                              {t(tagKey)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="px-3 py-1 text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-sans shrink-0 whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
                        {t(intern.categoryKey)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-[13px] text-gray-400 font-serif">
                      <div className="flex items-center gap-4">
                        <span>{t('period_label', { period: t(intern.periodKey) })}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/internships')}
                        className="text-[#DE5D8F] font-bold flex items-center gap-1 shrink-0 bg-transparent border-none cursor-pointer"
                      >
                        {t('more_details')}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {savedTab === 'reviews' && (
              <div className="flex flex-col gap-6 w-full items-center">
                {MOCK_SAVED_REVIEWS.map((rev) => (
                  <div
                    key={rev.id}
                    className="w-full max-w-[1056px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-[13px] font-bold text-gray-400 font-serif truncate">
                          {rev.company} • {t(rev.roleKey)}
                        </span>
                        <p className="text-[15px] text-[#404041] font-serif leading-relaxed line-clamp-2 mt-1 break-words">
                          &ldquo;{t(rev.excerptKey)}&rdquo;
                        </p>
                      </div>
                      <span className="px-3 py-1 text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-sans shrink-0 whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
                        {t(rev.categoryKey)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-[13px] text-gray-400 font-serif flex-wrap gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span>{t('written_by_author', { author: t(rev.authorKey) })}</span>
                        <span>•</span>
                        <span>{t('published_at', { date: rev.date })}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/internships/review')}
                        className="text-[#DE5D8F] font-bold flex items-center gap-1 shrink-0 bg-transparent border-none cursor-pointer"
                      >
                        {t('read_full_review')}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA to redirect back to standard Articles view */}
          <div className="flex justify-end w-full max-w-[1056px] mx-auto mt-6">
            <Button
              onClick={() => {
                setSearchParams((prev) => {
                  prev.delete('tab');
                  return prev;
                });
              }}
              variant="primary"
              className="px-8 h-[58px] rounded-xl font-serif text-[16px]"
            >
              {t('go_to_articles')}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Standard Articles Page View ──
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 w-full py-8 md:py-14 flex flex-col gap-8">
        {/* Page Title & Subtitle */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] sm:text-[34px] md:text-[36px] font-bold text-black font-serif leading-tight">
            {t('section_title', { defaultValue: 'บทความสาราณียกร (Aksornsara Archive)' })}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-gray-500 font-serif">
            คลังบทความ ข่าวสาร และผลงานสร้างสรรค์ทั้งหมด {MOCK_ARTICLES.length} บทความ จากชมรมสาราณียกร คณะอักษรศาสตร์ จุฬาฯ
          </p>
        </div>

        {/* Search + Filter Button + Category Filter */}
        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
              <SearchInput
                size="lg"
                placeholder={t('search_placeholder', { defaultValue: 'ค้นหาบทความ, ชื่อผู้เขียน, หรือเนื้อหา...' })}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative shrink-0" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsArticlesFilterOpen((prev) => !prev)}
                className="w-[52px] md:w-[55px] h-[52px] md:h-[55px] rounded-[14px] text-white hover:opacity-90 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm border-none"
                style={{ backgroundColor: '#E992B4' }}
                aria-label={t('filter_and_sort', { defaultValue: 'ตัวเลือกการกรองและจัดเรียง' })}
                title={t('filter_and_sort', { defaultValue: 'ตัวเลือกการกรองและจัดเรียง' })}
              >
                <SlidersHorizontal size={20} />
              </button>

              <AnimatePresence>
                {isArticlesFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[60px] w-[260px] sm:w-[280px] p-5 bg-white border border-gray-100 rounded-[16px] shadow-xl z-50 flex flex-col gap-4 font-serif"
                    style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h4 className="font-bold text-[16px] sm:text-[17px] text-[#404041] border-b border-gray-100 pb-2">
                      {t('filter_and_sort', { defaultValue: 'ตัวเลือกการกรองและจัดเรียง' })}
                    </h4>

                    {/* Date Posted Sort */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[13px] font-bold text-gray-400">
                        {t('date_posted', { defaultValue: 'วันที่โพสต์' })}
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-2.5 cursor-pointer group text-gray-700 hover:text-[#DE5D8F] transition-colors p-1.5 rounded-lg hover:bg-pink-50/50">
                          <input
                            type="radio"
                            name="articlesSortOrder"
                            checked={articlesSortOrder === 'newest'}
                            onChange={() => {
                              setArticlesSortOrder('newest');
                              handlePageChange(1);
                            }}
                            className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                          />
                          <span className="text-[14px] font-bold">
                            {t('sort_newest', { defaultValue: 'ใหม่ที่สุด' })}
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer group text-gray-700 hover:text-[#DE5D8F] transition-colors p-1.5 rounded-lg hover:bg-pink-50/50">
                          <input
                            type="radio"
                            name="articlesSortOrder"
                            checked={articlesSortOrder === 'oldest'}
                            onChange={() => {
                              setArticlesSortOrder('oldest');
                              handlePageChange(1);
                            }}
                            className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                          />
                          <span className="text-[14px] font-bold">
                            {t('sort_oldest', { defaultValue: 'เก่าที่สุด' })}
                          </span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Category / Year chips */}
          <CategoryFilterBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* Articles Count & Status */}
        <div className="flex items-center justify-between text-[14px] font-serif text-gray-500 border-b border-gray-100 pb-3">
          <span>
            พบทั้งหมด <strong>{filteredArticles.length}</strong> บทความ
            {selectedCategory !== 'all' && selectedCategory !== 'categories.all' && (
              <span> (ฉบับปี {selectedCategory})</span>
            )}
          </span>
          <span>
            หน้า {currentPage} จาก {Math.max(1, totalPages)}
          </span>
        </div>

        {/* Articles Grid (2 columns on desktop, 1 on mobile) */}
        {currentArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full justify-items-center">
            {currentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                author={article.author}
                date={article.date}
                category={article.category}
                imageUrl={article.imageUrl}
                onBookmarkChange={(id, bookmarked) => {
                  setBookmarkedIds((prev) => {
                    if (bookmarked) {
                      return prev.includes(id) ? prev : [...prev, id];
                    } else {
                      return prev.filter((bid) => bid !== id);
                    }
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#F7F8F9] rounded-[24px] border border-dashed border-gray-300 w-full">
            <Search size={64} className="text-gray-300 mb-4" />
            <h3 className="text-[20px] font-bold text-gray-700 font-serif mb-2">
              {t('no_results_title', { defaultValue: 'ไม่พบบทความที่ค้นหา' })}
            </h3>
            <p className="text-gray-500 max-w-md text-[16px] font-serif break-words">
              {t('no_results_desc', { query: searchQuery || (selectedCategory === 'all' ? '' : `ปี ${selectedCategory}`) })}
            </p>
            {(searchQuery || (selectedCategory !== 'all' && selectedCategory !== 'categories.all')) && (
              <Button
                onClick={handleClearFilters}
                variant="primary"
                className="mt-6 px-6 py-2.5 h-[42px] rounded-[9999px] font-serif text-[14px]"
              >
                {t('clear_filters', { defaultValue: 'ล้างตัวกรองทั้งหมด' })}
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center w-full mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
