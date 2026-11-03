import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SearchInput, Pagination, Button } from '@artsgoz/design-system';
import { Search, SlidersHorizontal, ArrowRight, Feather, Timer, Bookmark, BookmarkX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArticleCard,
  CategoryFilterBar,
  MOCK_ARTICLES,
  AKSORNSARA_CATEGORIES,
} from '../../../features/articles/index.js';
import { Footer } from '../../../components/Footer/index.js';

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
  }
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
    date: '10/05/69'
  },
  {
    id: 'rev-02',
    company: 'True Digital Group',
    roleKey: 'articles.saved_reviews.review2.role',
    rating: 4.5,
    excerptKey: 'articles.saved_reviews.review2.excerpt',
    categoryKey: 'articles.saved_reviews.review2.category',
    authorKey: 'articles.saved_reviews.review2.author',
    date: '02/05/69'
  }
];

// Helper to parse Thai date (e.g. '28/05/69' -> timestamp)
const parseThaiDate = (dateStr: string) => {
  try {
    const [day, month, year] = dateStr.split('/').map(Number);
    // year 69 is 2026 (BE 2569 is 2026, so 2000 + 69 - 43 = 2026)
    return new Date(2000 + year - 43, month - 1, day).getTime();
  } catch {
    return 0;
  }
};

// Premium Horizontal Saved Card Component matching Figma Desktop & Mobile Bookmark spec
function SavedArticleCard({
  article,
  onUnbookmark,
}: {
  article: typeof MOCK_ARTICLES[0];
  onUnbookmark: () => void;
}) {
  const { t } = useTranslation('articles');
  const navigate = useNavigate();

  const title = t(article.title);
  const excerpt = t(article.excerpt);
  const category = t(article.category);
  const author = t(article.author);

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
            <span className="px-3 py-1 text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-serif whitespace-nowrap">
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
            <span className="px-2.5 py-0.5 text-[11px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-serif whitespace-nowrap">
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

      {/* Mobile Square Thumbnail (right) matching Figma Mobile Bookmark */}
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
  const selectedCategory = searchParams.get('category') || 'categories.all';
  const currentPage = Number(searchParams.get('page')) || 1;
  const isSavedTab = searchParams.get('tab') === 'saved';

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
    let list = MOCK_ARTICLES.filter((article) => bookmarkedIds.includes(article.id));

    if (savedSearchQuery.trim() !== '') {
      const query = savedSearchQuery.trim().toLowerCase();
      list = list.filter(
        (article) =>
          t(article.title).toLowerCase().includes(query) ||
          t(article.excerpt).toLowerCase().includes(query) ||
          t(article.author).toLowerCase().includes(query)
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
      list = [...list].sort((a, b) => parseThaiDate(b.date) - parseThaiDate(a.date));
    } else if (sortByPostDate === 'oldest') {
      list = [...list].sort((a, b) => parseThaiDate(a.date) - parseThaiDate(b.date));
    }

    return list;
  }, [bookmarkedIds, savedSearchQuery, sortBySavedDate, sortByPostDate, t]);

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
        if (category && category !== 'categories.all') {
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

  // Filter articles by category + search query for main tab
  const filteredArticles = useMemo(() => {
    return MOCK_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'categories.all' || article.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        t(article.title).toLowerCase().includes(query) ||
        t(article.excerpt).toLowerCase().includes(query) ||
        t(article.author).toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, t]);

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
      <>
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
              <div className="flex flex-col md:flex-row gap-4 items-center w-full relative">
                <div className="flex-1 w-full">
                  <SearchInput
                    size="lg"
                    placeholder={t('search_saved_placeholder')}
                    value={savedSearchQuery}
                    onChange={(e) => setSavedSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Filter Popover Toggle */}
                <div className="relative w-full md:w-auto self-stretch md:self-auto flex">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center gap-2.5 px-6 h-[52px] rounded-[10px] border border-gray-250 font-serif text-[15px] font-bold transition-all cursor-pointer w-full md:w-auto ${
                      isFilterOpen ? 'bg-[#FCEFF4] text-[#DE5D8F] border-[#E992B4]' : 'bg-white hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    {t('filter')}
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-[60px] w-full md:w-[360px] p-6 bg-white border border-gray-200 rounded-2xl shadow-xl z-40 flex flex-col gap-6"
                      >
                        <h4 className="font-bold text-[18px] text-[#404041] font-serif border-b border-gray-100 pb-2">
                          {t('filter_and_sort')}
                        </h4>

                        {/* Date Saved Sort */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[15px] font-bold text-gray-500 font-serif">{t('date_saved')}</span>
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 cursor-pointer group text-gray-700 hover:text-black">
                              <input
                                type="radio"
                                name="savedDate"
                                checked={sortBySavedDate === 'newest'}
                                onChange={() => setSortBySavedDate('newest')}
                                className="w-4 h-4 accent-[#DE5D8F] border-gray-300"
                              />
                              <span className="text-[14px] font-serif">{t('sort_newest')}</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group text-gray-700 hover:text-black">
                              <input
                                type="radio"
                                name="savedDate"
                                checked={sortBySavedDate === 'oldest'}
                                onChange={() => setSortBySavedDate('oldest')}
                                className="w-4 h-4 accent-[#DE5D8F] border-gray-300"
                              />
                              <span className="text-[14px] font-serif">{t('sort_oldest')}</span>
                            </label>
                          </div>
                        </div>

                        {/* Date Posted Sort */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[15px] font-bold text-gray-500 font-serif">{t('date_posted')}</span>
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 cursor-pointer group text-gray-700 hover:text-black">
                              <input
                                type="radio"
                                name="postedDate"
                                checked={sortByPostDate === 'newest'}
                                onChange={() => setSortByPostDate('newest')}
                                className="w-4 h-4 accent-[#DE5D8F] border-gray-300"
                              />
                              <span className="text-[14px] font-serif">{t('sort_newest')}</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group text-gray-700 hover:text-black">
                              <input
                                type="radio"
                                name="postedDate"
                                checked={sortByPostDate === 'oldest'}
                                onChange={() => setSortByPostDate('oldest')}
                                className="w-4 h-4 accent-[#DE5D8F] border-gray-300"
                              />
                              <span className="text-[14px] font-serif">{t('sort_oldest')}</span>
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
              
              {/* Tab 1: Articles */}
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

              {/* Tab 2: Internships (Mock Data) */}
              {savedTab === 'internships' && (
                <div className="flex flex-col gap-6 w-full items-center">
                  {MOCK_SAVED_INTERNSHIPS.map((intern) => (
                    <div
                      key={intern.id}
                      className="w-full max-w-[1056px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between gap-4 shadow-xs"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <span className="text-[13px] font-bold text-[#DE5D8F] font-serif truncate">{intern.company}</span>
                          <h3 className="text-[20px] md:text-[22px] font-bold text-[#404041] font-serif leading-tight truncate">{t(intern.roleKey)}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {intern.tagsKeys.map((tagKey, i) => (
                              <span key={i} className="px-2 py-0.5 text-[11px] font-bold text-gray-500 bg-gray-100 rounded-sm font-sans">{t(tagKey)}</span>
                            ))}
                          </div>
                        </div>
                        <span className="px-3 py-1 text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-serif shrink-0 whitespace-nowrap">{t(intern.categoryKey)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-[13px] text-gray-400 font-serif">
                        <div className="flex items-center gap-4">
                          <span>{t('period_label', { period: t(intern.periodKey) })}</span>
                        </div>
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-[#DE5D8F] font-bold flex items-center gap-1 shrink-0">
                          {t('more_details')}
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Reviews (Mock Data) */}
              {savedTab === 'reviews' && (
                <div className="flex flex-col gap-6 w-full items-center">
                  {MOCK_SAVED_REVIEWS.map((rev) => (
                    <div
                      key={rev.id}
                      className="w-full max-w-[1056px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between gap-4 shadow-xs"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <span className="text-[13px] font-bold text-gray-400 font-serif truncate">{rev.company} • {t(rev.roleKey)}</span>
                          <p className="text-[15px] text-[#404041] font-serif leading-relaxed line-clamp-2 mt-1 break-words">
                            &ldquo;{t(rev.excerptKey)}&rdquo;
                          </p>
                        </div>
                        <span className="px-3 py-1 text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-serif shrink-0 whitespace-nowrap">{t(rev.categoryKey)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-[13px] text-gray-400 font-serif flex-wrap gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span>{t('written_by_author', { author: t(rev.authorKey) })}</span>
                          <span>•</span>
                          <span>{t('published_at', { date: rev.date })}</span>
                        </div>
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-[#DE5D8F] font-bold flex items-center gap-1 shrink-0">
                          {t('read_full_review')}
                          <ArrowRight size={14} />
                        </a>
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
        </div>
        <Footer />
      </>
    );
  }

  // ── Standard Articles Page View ──
  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 w-full py-8 md:py-14 flex flex-col gap-8">

          {/* Page Title */}
          <h1 className="text-[28px] sm:text-[34px] md:text-[36px] font-bold text-black font-serif leading-tight">
            {t('section_title')}
          </h1>

          {/* Search + Filter Button + Category Filter */}
          <div className="flex flex-col gap-5 w-full">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <SearchInput
                  size="lg"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (selectedCategory !== 'categories.all' || searchQuery) {
                    handleClearFilters();
                  }
                }}
                className="w-[52px] md:w-[55px] h-[52px] md:h-[55px] rounded-[14px] bg-[#DE5D8F] text-white hover:bg-[#CA5582] transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-sm border-none"
                aria-label="Filter"
              >
                <SlidersHorizontal size={22} />
              </button>
            </div>

            {/* Category chips */}
            <CategoryFilterBar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
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
                {t('no_results_title')}
              </h3>
              <p className="text-gray-500 max-w-md text-[16px] font-serif break-words">
                {t('no_results_desc', { query: searchQuery || t(selectedCategory) })}
              </p>
              {(searchQuery || selectedCategory !== 'categories.all') && (
                <Button
                  onClick={handleClearFilters}
                  variant="primary"
                  className="mt-6 px-6 py-2.5 h-[42px] rounded-[9999px] font-serif text-[14px]"
                >
                  {t('clear_filters')}
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center w-full mt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
