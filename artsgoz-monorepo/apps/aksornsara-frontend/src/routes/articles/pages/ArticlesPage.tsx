import { useMemo, useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SearchInput, Pagination } from '@artsgoz/design-system';
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Feather,
  Timer,
  Bookmark,
  BookmarkX,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArticleCard,
  CategoryFilterBar,
  MOCK_ARTICLES,
  AKSORNSARA_CATEGORIES,
  getArticlesSummaryList,
  ArticleBannerMock,
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
    if (!dateStr) return 0;
    if (/^\d{4}$/.test(dateStr.trim())) {
      return new Date(Number(dateStr.trim()), 0, 1).getTime();
    }
    const cleanStr = dateStr.replace(/[^0-9/]/g, '');
    const parts = cleanStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      const fullYear = year < 100 ? (year > 40 ? 2500 + year - 543 : 2000 + year) : (year > 2400 ? year - 543 : year);
      return new Date(fullYear, month - 1, day).getTime();
    }
    const parsed = Date.parse(dateStr);
    return isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
};

// 100% Figma Spec Matching Saved Article Card (blog banner - 1056x328px)
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
  const category = article.category.startsWith('categories.')
    ? t(article.category)
    : (article.category || 'หมวดหมู่');
  const author = article.author.startsWith('mock.') ? t(article.author) : (article.author || 'ชมรมสาราณียกร');
  const dateStr = article.date || 'วว/ดด/ปป';

  return (
    <div
      onClick={() => navigate(`/articles/${article.id}`)}
      className="w-full max-w-[1056px] h-[280px] sm:h-[300px] md:h-[328px] rounded-[16px] relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group shrink-0"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #E992B4 100%)',
      }}
    >
      {/* Background Image & Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={article.imageUrl || ArticleBannerMock}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
        />
        {/* Layered Gradient Overlay for Figma faithful contrast & readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0.78) 100%), linear-gradient(90deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 55%, rgba(0, 0, 0, 0.05) 100%)',
          }}
        />
      </div>

      {/* Top Right: Frame 6160 (Category chip + Yellow Bookmark Button) */}
      <div className="absolute top-[14px] right-[24px] z-10 flex items-center gap-[8px]">
        {/* System banner chip */}
        <div
          className="h-[40px] px-6 rounded-[11px] bg-[#FCEFF4] flex items-center justify-center shadow-xs"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-[16px] font-normal text-[#DE5D8F] whitespace-nowrap leading-none">
            {category}
          </span>
        </div>

        {/* Yellow Bookmark button: 40x40px, #F8C135, rounded 8px */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUnbookmark();
          }}
          className="w-[40px] h-[40px] rounded-[8px] bg-[#F8C135] hover:bg-[#e6b12f] active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer border-none"
          aria-label="Remove bookmark"
          title="ยกเลิกการบันทึก"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Bottom Left: text container */}
      <div className="absolute left-[24px] sm:left-[36px] md:left-[49px] bottom-[20px] md:bottom-[28px] z-10 flex flex-col items-start gap-[14px] md:gap-[17px] max-w-[90%] sm:max-w-[75%] md:max-w-[620px]">
        {/* ชื่อบทความ */}
        <h2
          className="text-[24px] sm:text-[30px] md:text-[36px] font-bold text-white leading-[32px] sm:leading-[40px] md:leading-[48px] line-clamp-2 m-0"
          style={{
            fontFamily: "'ChulaCharasNew', serif",
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          {title}
        </h2>

        {/* author / date bar */}
        <div
          className="h-[38px] md:h-[42px] px-[10px] py-[5px] rounded-[8px] flex items-center gap-[11px]"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.26)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          {/* Author */}
          <div className="flex items-center gap-[8px] md:gap-[11px]">
            <div className="w-[28px] md:w-[32px] h-[28px] md:h-[32px] rounded-full bg-[#E57DA5] flex items-center justify-center shrink-0">
              <Feather size={15} className="text-white" />
            </div>
            <span
              className="text-[13px] md:text-[14px] font-bold text-white leading-[20px] truncate max-w-[140px] md:max-w-[180px]"
              style={{ fontFamily: "'ChulaCharasNew', serif" }}
            >
              {author}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-[8px] md:gap-[11px]">
            <div className="w-[28px] md:w-[32px] h-[28px] md:h-[32px] rounded-full bg-[#E57DA5] flex items-center justify-center shrink-0">
              <Timer size={15} className="text-white" />
            </div>
            <span
              className="text-[13px] md:text-[14px] font-bold text-white leading-[20px] whitespace-nowrap"
              style={{ fontFamily: "'ChulaCharasNew', serif" }}
            >
              {dateStr}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const { t } = useTranslation('articles');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const CATEGORIES = AKSORNSARA_CATEGORIES;

  // Sync state from URL parameters
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const currentPage = Number(searchParams.get('page')) || 1;
  const isSavedTab = searchParams.get('tab') === 'saved' || location.pathname === '/saved';

  // State for Saved Items page
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [savedTab, setSavedTab] = useState<'articles' | 'internships' | 'reviews'>('articles');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    // Initialize with 5 mock articles matching the 5 cards in the Figma mockup
    const initial = ['art-001', 'art-002', 'art-003', 'art-004', 'art-005'];
    try {
      localStorage.setItem('bookmarked_articles', JSON.stringify(initial));
    } catch {}
    return initial;
  });

  // Filter & Sort state for Saved Items (Frame 6463)
  const [savedSortBy, setSavedSortBy] = useState<
    'saved_newest' | 'saved_oldest' | 'post_newest' | 'post_oldest'
  >('saved_newest');

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
    let list = MOCK_ARTICLES.filter((article) => bookmarkedIds.includes(article.id));

    if (savedSearchQuery.trim() !== '') {
      const query = savedSearchQuery.trim().toLowerCase();
      list = list.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
      );
    }

    if (savedSortBy === 'saved_newest') {
      list = [...list].sort(
        (a, b) => bookmarkedIds.indexOf(b.id) - bookmarkedIds.indexOf(a.id)
      );
    } else if (savedSortBy === 'saved_oldest') {
      list = [...list].sort(
        (a, b) => bookmarkedIds.indexOf(a.id) - bookmarkedIds.indexOf(b.id)
      );
    } else if (savedSortBy === 'post_newest') {
      list = [...list].sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
    } else if (savedSortBy === 'post_oldest') {
      list = [...list].sort((a, b) => parseDateToTimestamp(a.date) - parseDateToTimestamp(b.date));
    }

    return list;
  }, [bookmarkedIds, savedSearchQuery, savedSortBy]);

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
    const allArticles = getArticlesSummaryList();
    const list = allArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === 'categories.all' ||
        selectedCategory === 'ทั้งหมด' ||
        article.category === selectedCategory ||
        (article.tags && article.tags.includes(selectedCategory));

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
  }, [searchQuery, selectedCategory, articlesSortOrder]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const currentArticles = useMemo(() => {
    return filteredArticles.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredArticles, currentPage]);

  // ── Render Saved Items View (100% Figma Spec Matching) ──
  if (isSavedTab) {
    return (
      <div className="bg-white min-h-screen flex flex-col justify-between">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[112px] pt-[24px] md:pt-[36px] pb-[60px] flex flex-col gap-[36px]">
          {/* Header Row: Frame 6311 (left) + Frame 6463 Filter Box (right) */}
          <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-6">
            {/* Left Column: Frame 6311 */}
            <div className="flex flex-col items-start gap-[24px] md:gap-[27px] w-full max-w-[485px]">
              {/* Frame 6307: Bookmark Ribbon Icon + Title */}
              <div className="flex items-center gap-[24px] h-[64px]">
                {/* Pink Bookmark ribbon icon matching Figma Vector */}
                <div className="w-[46px] h-[46px] flex items-center justify-center shrink-0">
                  <svg
                    width="46"
                    height="46"
                    viewBox="0 0 46 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6C10 4.89543 10.8954 4 12 4H34C35.1046 4 36 4.89543 36 6V42L23 33.5L10 42V6Z"
                      fill="#E57DA5"
                    />
                  </svg>
                </div>
                {/* ที่บันทึกไว้ */}
                <h1
                  className="text-[40px] md:text-[48px] font-bold text-black leading-[64px] tracking-tight m-0"
                  style={{ fontFamily: "'ChulaCharasNew', serif" }}
                >
                  ที่บันทึกไว้
                </h1>
              </div>

              {/* Search Fields: Pill with 2px solid #8B8B8C */}
              <div
                className="w-full h-[41px] bg-white rounded-full flex items-center justify-between px-5 transition-all"
                style={{ border: '2px solid #8B8B8C' }}
              >
                <input
                  type="text"
                  value={savedSearchQuery}
                  onChange={(e) => setSavedSearchQuery(e.target.value)}
                  placeholder="ค้นหาสิ่งที่บันทึกไว้"
                  className="w-full bg-transparent border-none outline-none text-[18px] md:text-[20px] text-black placeholder-[#99999A]"
                  style={{ fontFamily: "'ChulaCharasNew', serif" }}
                />
                <Search size={20} className="text-[#33363F] shrink-0 ml-2" strokeWidth={2} />
              </div>

              {/* Frame 6310: Tabs (บทความ, ฝึกงาน, รีวิวฝึกงาน) */}
              <div
                className="flex items-center gap-6 sm:gap-10 lg:gap-[110px] w-full"
                style={{ height: '36px' }}
              >
                <button
                  type="button"
                  onClick={() => setSavedTab('articles')}
                  className="bg-transparent border-none p-0 cursor-pointer transition-colors"
                >
                  <span
                    className={`text-[24px] md:text-[28px] font-bold leading-[36px] ${
                      savedTab === 'articles' ? 'text-black' : 'text-[#AEAEAE] hover:text-[#555]'
                    }`}
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    บทความ
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSavedTab('internships')}
                  className="bg-transparent border-none p-0 cursor-pointer transition-colors"
                >
                  <span
                    className={`text-[24px] md:text-[28px] font-bold leading-[36px] ${
                      savedTab === 'internships' ? 'text-black' : 'text-[#AEAEAE] hover:text-[#555]'
                    }`}
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    ฝึกงาน
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSavedTab('reviews')}
                  className="bg-transparent border-none p-0 cursor-pointer transition-colors"
                >
                  <span
                    className={`text-[24px] md:text-[28px] font-bold leading-[36px] ${
                      savedTab === 'reviews' ? 'text-black' : 'text-[#AEAEAE] hover:text-[#555]'
                    }`}
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    รีวิวฝึกงาน
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Frame 6463 (Filter Card) */}
            <div
              className="w-full sm:w-[432px] h-[175px] bg-white rounded-[16px] p-[16px_32px] flex flex-col justify-between shrink-0"
              style={{
                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Title: ตัวกรอง */}
              <h3
                className="text-[24px] font-bold text-black text-center leading-[30px] m-0"
                style={{ fontFamily: "'ChulaCharasNew', serif" }}
              >
                ตัวกรอง
              </h3>

              {/* Frame 6469: Two Columns */}
              <div className="flex flex-row justify-between items-start gap-4 sm:gap-[60px] w-full">
                {/* Col 1: วันที่บันทึก */}
                <div className="flex flex-col items-start gap-[9px] min-w-[126px]">
                  <span
                    className="text-[20px] font-bold text-black text-center w-full leading-[28px]"
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    วันที่บันทึก
                  </span>

                  <button
                    type="button"
                    onClick={() => setSavedSortBy('saved_newest')}
                    className="flex items-center gap-[11px] cursor-pointer bg-transparent border-none p-0 group"
                  >
                    <div
                      className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${
                        savedSortBy === 'saved_newest'
                          ? 'bg-[#E57DA5] border-[#E57DA5]'
                          : 'bg-[#F7F8F9] border-[#545455]'
                      }`}
                    >
                      {savedSortBy === 'saved_newest' && (
                        <Check size={14} className="text-white stroke-[3]" />
                      )}
                    </div>
                    <span
                      className="text-[16px] text-black leading-[24px]"
                      style={{ fontFamily: "'ChulaCharasNew', serif" }}
                    >
                      เรียงจากใหม่ที่สุด
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSavedSortBy('saved_oldest')}
                    className="flex items-center gap-[11px] cursor-pointer bg-transparent border-none p-0 group"
                  >
                    <div
                      className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${
                        savedSortBy === 'saved_oldest'
                          ? 'bg-[#E57DA5] border-[#E57DA5]'
                          : 'bg-[#F7F8F9] border-[#545455]'
                      }`}
                    >
                      {savedSortBy === 'saved_oldest' && (
                        <Check size={14} className="text-white stroke-[3]" />
                      )}
                    </div>
                    <span
                      className="text-[16px] text-black leading-[24px]"
                      style={{ fontFamily: "'ChulaCharasNew', serif" }}
                    >
                      เรียงจากเก่าที่สุด
                    </span>
                  </button>
                </div>

                {/* Col 2: วันที่โพสต์ */}
                <div className="flex flex-col items-start gap-[9px] min-w-[126px]">
                  <span
                    className="text-[20px] font-bold text-black text-center w-full leading-[28px]"
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    วันที่โพสต์
                  </span>

                  <button
                    type="button"
                    onClick={() => setSavedSortBy('post_newest')}
                    className="flex items-center gap-[11px] cursor-pointer bg-transparent border-none p-0 group"
                  >
                    <div
                      className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${
                        savedSortBy === 'post_newest'
                          ? 'bg-[#E57DA5] border-[#E57DA5]'
                          : 'bg-[#F7F8F9] border-[#545455]'
                      }`}
                    >
                      {savedSortBy === 'post_newest' && (
                        <Check size={14} className="text-white stroke-[3]" />
                      )}
                    </div>
                    <span
                      className="text-[16px] text-black leading-[24px]"
                      style={{ fontFamily: "'ChulaCharasNew', serif" }}
                    >
                      เรียงจากใหม่ที่สุด
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSavedSortBy('post_oldest')}
                    className="flex items-center gap-[11px] cursor-pointer bg-transparent border-none p-0 group"
                  >
                    <div
                      className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${
                        savedSortBy === 'post_oldest'
                          ? 'bg-[#E57DA5] border-[#E57DA5]'
                          : 'bg-[#F7F8F9] border-[#545455]'
                      }`}
                    >
                      {savedSortBy === 'post_oldest' && (
                        <Check size={14} className="text-white stroke-[3]" />
                      )}
                    </div>
                    <span
                      className="text-[16px] text-black leading-[24px]"
                      style={{ fontFamily: "'ChulaCharasNew', serif" }}
                    >
                      เรียงจากเก่าที่สุด
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards List: Frame blog banner (1056px wide, 44px gap) */}
          <div className="w-full flex flex-col gap-[44px] items-center">
            {savedTab === 'articles' && (
              savedArticles.length > 0 ? (
                <div className="w-full flex flex-col gap-[44px] items-center">
                  {savedArticles.map((article) => (
                    <SavedArticleCard
                      key={article.id}
                      article={article}
                      onUnbookmark={() => handleUnbookmark(article.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-[#FDF8FA]/30 border border-dashed border-pink-200 rounded-[24px] w-full max-w-[1056px] px-4">
                  <BookmarkX size={64} className="text-pink-300 mb-4" />
                  <h3
                    className="text-[24px] font-bold text-gray-700 mb-2"
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    ยังไม่มีบทความที่บันทึกไว้
                  </h3>
                  <p
                    className="text-gray-400 max-w-sm text-[16px] mb-6 leading-relaxed"
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    คุณสามารถบันทึกบทความที่สนใจเพื่อกลับมาอ่านภายหลังได้
                  </p>
                  <button
                    onClick={() => {
                      if (searchParams.get('tab') === 'saved') {
                        setSearchParams((prev) => {
                          prev.delete('tab');
                          return prev;
                        });
                      } else {
                        navigate('/articles');
                      }
                    }}
                    className="px-6 py-2.5 bg-[#DE5D8F] hover:bg-[#d44d80] text-white font-bold rounded-lg transition-all cursor-pointer active:scale-95 text-[18px] border-none shadow-sm"
                    style={{ fontFamily: "'ChulaCharasNew', serif" }}
                  >
                    สำรวจบทความ
                  </button>
                </div>
              )
            )}

            {savedTab === 'internships' && (
              <div className="w-full flex flex-col gap-[24px] items-center">
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
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-sans shrink-0 whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
                          {t(intern.categoryKey)}
                        </span>
                        <button
                          type="button"
                          className="w-[36px] h-[36px] rounded-[8px] bg-[#F8C135] flex items-center justify-center border-none cursor-pointer"
                        >
                          <Bookmark size={16} className="text-white fill-white" />
                        </button>
                      </div>
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
              <div className="w-full flex flex-col gap-[24px] items-center">
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
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-[12px] font-bold text-[#DE5D8F] bg-[#FCEFF4] rounded-full font-sans shrink-0 whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
                          {t(rev.categoryKey)}
                        </span>
                        <button
                          type="button"
                          className="w-[36px] h-[36px] rounded-[8px] bg-[#F8C135] flex items-center justify-center border-none cursor-pointer"
                        >
                          <Bookmark size={16} className="text-white fill-white" />
                        </button>
                      </div>
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

          {/* Bottom Action Button: ไปที่หน้าบทความ (Frame button matching Figma) */}
          <div className="w-full max-w-[1056px] mx-auto flex justify-end mt-[20px]">
            <button
              type="button"
              onClick={() => {
                if (searchParams.get('tab') === 'saved') {
                  setSearchParams((prev) => {
                    prev.delete('tab');
                    return prev;
                  });
                } else {
                  navigate('/articles');
                }
              }}
              className="w-[253px] min-w-[158px] h-[58px] rounded-[8px] bg-[#DE5D8F] hover:bg-[#d44d80] active:scale-98 transition-all flex items-center justify-center gap-[8px] cursor-pointer border-none shadow-sm group"
            >
              <span
                className="text-[28px] font-bold text-white leading-[36px]"
                style={{ fontFamily: "'ChulaCharasNew', serif" }}
              >
                ไปที่หน้าบทความ
              </span>
              <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // ── Standard Articles Page View ──
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 w-full py-8 md:py-14 flex flex-col gap-8">
        {/* Page Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] sm:text-[34px] md:text-[36px] font-bold text-black font-serif leading-tight">
            {t('section_title', { defaultValue: 'บทความสาราณียกร (Aksornsara Archive)' })}
          </h1>
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
                            name="articleSortDate"
                            checked={articlesSortOrder === 'newest'}
                            onChange={() => setArticlesSortOrder('newest')}
                            className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                          />
                          <span className="text-[14px] font-bold">
                            {t('sort_newest', { defaultValue: 'เรียงจากใหม่ที่สุด' })}
                          </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer group text-gray-700 hover:text-[#DE5D8F] transition-colors p-1.5 rounded-lg hover:bg-pink-50/50">
                          <input
                            type="radio"
                            name="articleSortDate"
                            checked={articlesSortOrder === 'oldest'}
                            onChange={() => setArticlesSortOrder('oldest')}
                            className="w-4 h-4 accent-[#DE5D8F] border-gray-300 cursor-pointer"
                          />
                          <span className="text-[14px] font-bold">
                            {t('sort_oldest', { defaultValue: 'เรียงจากเก่าที่สุด' })}
                          </span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <CategoryFilterBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* Articles List / Grid */}
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
                    const updated = bookmarked
                      ? (prev.includes(id) ? prev : [...prev, id])
                      : prev.filter((bid) => bid !== id);
                    try {
                      localStorage.setItem('bookmarked_articles', JSON.stringify(updated));
                    } catch {}
                    return updated;
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#F7F8F9] rounded-[24px] border border-dashed border-gray-300 w-full">
            <Search size={64} className="text-gray-300 mb-4" />
            <h3 className="text-[20px] font-bold text-gray-700 font-serif mb-2">
              {t('no_results_title', { defaultValue: 'ไม่พบบทความ' })}
            </h3>
            <p className="text-gray-500 max-w-md text-[16px] font-serif break-words">
              {t('no_results_desc', { defaultValue: 'ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น' })}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#E992B4] hover:bg-[#DE5D8F] text-white text-[14px] font-serif border-none cursor-pointer transition-colors shadow-xs"
              >
                {t('clear_filters', { defaultValue: 'ล้างตัวกรอง' })}
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-8 border-t border-gray-150">
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
