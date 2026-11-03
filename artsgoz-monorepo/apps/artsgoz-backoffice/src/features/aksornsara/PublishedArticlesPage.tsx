import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Download,
  SlidersHorizontal,
  PenSquare,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService } from './services/articlesService';
import articleThumbFallback from '../../assets/article_thumb.png';

interface RadioOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function RadioOption({ label, checked, onChange }: RadioOptionProps) {
  return (
    <div
      onClick={onChange}
      className="flex items-center gap-2 cursor-pointer transition-colors select-none group"
    >
      <div
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all shrink-0"
        style={{
          border: '1.5px solid #DE5D8F',
          backgroundColor: '#FFFFFF',
        }}
      >
        {checked && (
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#DE5D8F' }}
          />
        )}
      </div>
      <span
        className="text-[#404041] group-hover:text-[#1A1C1C] transition-colors font-serif"
        style={{
          fontSize: 14,
          lineHeight: '18px',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function PublishedArticlesPage() {
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState<string | null>('เผยแพร่แล้ว');

  // Sorting States
  const [titleSort, setTitleSort] = useState<'asc' | 'desc' | null>(null);
  const [authorSort, setAuthorSort] = useState<'asc' | 'desc' | null>(null);
  const [dateSort, setDateSort] = useState<'newest' | 'oldest' | null>('newest');
  const [viewsSort, setViewsSort] = useState<'most' | 'least' | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const navigate = useNavigate();

  // Load from service & sync from backend
  const [articlesList, setArticlesList] = useState(() => articlesService.getAll());

  useEffect(() => {
    articlesService.syncFromBackend().then((items) => {
      setArticlesList(items);
    });
  }, []);

  const categories = useMemo(() => {
    const set = new Set(articlesList.map((a) => a.category).filter(Boolean));
    return ['ทั้งหมด', ...Array.from(set)];
  }, [articlesList]);

  // Combined search term
  const effectiveSearch = (localSearch || search).trim().toLowerCase();

  // Filter & Sort
  const filtered = useMemo(() => {
    return articlesList
      .filter((article) => {
        const matchesCategory =
          selectedCategory === 'ทั้งหมด' ||
          article.category === selectedCategory;

        const matchesStatus =
          !selectedStatus || article.status === selectedStatus;

        const matchesSearch =
          !effectiveSearch ||
          article.title.toLowerCase().includes(effectiveSearch) ||
          article.author.toLowerCase().includes(effectiveSearch) ||
          article.category.toLowerCase().includes(effectiveSearch);

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (titleSort === 'asc') return a.title.localeCompare(b.title, 'th');
        if (titleSort === 'desc') return b.title.localeCompare(a.title, 'th');
        if (authorSort === 'asc') return a.author.localeCompare(b.author, 'th');
        if (authorSort === 'desc') return b.author.localeCompare(a.author, 'th');
        if (viewsSort === 'most') return (b.views || 0) - (a.views || 0);
        if (viewsSort === 'least') return (a.views || 0) - (b.views || 0);
        if (dateSort === 'newest') return b.id.localeCompare(a.id);
        if (dateSort === 'oldest') return a.id.localeCompare(b.id);
        return 0;
      });
  }, [articlesList, selectedCategory, selectedStatus, effectiveSearch, titleSort, authorSort, viewsSort, dateSort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategory('ทั้งหมด');
    setSelectedStatus('เผยแพร่แล้ว');
    setTitleSort(null);
    setAuthorSort(null);
    setDateSort('newest');
    setViewsSort(null);
    setLocalSearch('');
    setSearch('');
    setCurrentPage(1);
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `published_articles_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <AksornsaraLayout
      showBackButton={false}
      searchValue={search}
      onSearchChange={(val) => {
        setSearch(val);
        setCurrentPage(1);
      }}
      searchPlaceholder="ค้นหาบทความ..."
    >
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 1040 }}>
        {/* ── Page Title & Action Bar ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="font-bold text-[#1A1C1C] text-[32px] md:text-[44px] leading-tight m-0 font-serif"
            >
              Published Articles
            </h1>
            <p className="text-gray-500 font-serif text-[15px] m-0 mt-1">
              บทความที่เผยแพร่แล้วทั้งหมด ({filtered.length} รายการ)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/aksornsara/create')}
              className="flex items-center gap-2 text-white font-bold cursor-pointer border-none shadow-sm hover:opacity-90 active:scale-95 transition-all font-serif"
              style={{
                fontSize: 14,
                backgroundColor: '#DE5D8F',
                borderRadius: 9999,
                height: 42,
                padding: '0 24px',
              }}
            >
              <Plus size={18} />
              <span>สร้างบทความใหม่</span>
            </button>

            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 text-[#404041] font-bold cursor-pointer border border-[#DFDFE0] bg-white hover:bg-gray-50 active:scale-95 transition-all font-serif"
              style={{
                fontSize: 13,
                borderRadius: 9999,
                height: 42,
                padding: '0 20px',
              }}
            >
              <Download size={14} />
              <span>ส่งออกข้อมูล</span>
            </button>
          </div>
        </div>

        {/* ── Toolbar: Search & Filter ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Local Search Input */}
          <div
            className="flex items-center gap-2.5 bg-white rounded-[9999px] border border-[#DFDFE0] px-4 py-2.5 shadow-xs"
            style={{ width: 280 }}
          >
            <Search size={16} color="#8B8B8C" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาชื่อ, ผู้แต่ง, หมวดหมู่"
              className="border-none outline-none bg-transparent w-full text-[14px] text-[#1A1C1C] font-serif"
            />
          </div>

          {/* Filter Button & Popup */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-white rounded-[9999px] border border-[#DFDFE0] px-4 py-2.5 text-[#404041] font-bold text-[14px] cursor-pointer hover:bg-gray-50 transition-colors shadow-xs font-serif"
            >
              <SlidersHorizontal size={16} />
              <span>ตัวกรองและเรียงลำดับ</span>
            </button>

            {/* Filter Dropdown Popup */}
            {filterOpen && (
              <div
                className="absolute right-0 top-full mt-2 bg-white rounded-[16px] border border-[#DFDFE0] shadow-xl p-6 z-40 flex flex-col gap-5"
                style={{ width: 440 }}
              >
                <div className="flex items-center justify-between border-b border-[#DFDFE0] pb-3">
                  <span className="font-bold text-[#1A1C1C] text-[16px] font-serif">
                    ตัวกรองบทความ
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="text-gray-400 hover:text-black border-none bg-transparent cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Category Filter */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#1A1C1C] text-[15px] font-serif">
                      หมวดหมู่
                    </span>
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                      {categories.map((cat) => (
                        <RadioOption
                          key={cat}
                          label={cat}
                          checked={selectedCategory === cat}
                          onChange={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#1A1C1C] text-[15px] font-serif">
                      เรียงตาม
                    </span>
                    <div className="flex flex-col gap-2">
                      <RadioOption
                        label="ล่าสุดก่อน"
                        checked={dateSort === 'newest'}
                        onChange={() => {
                          setDateSort('newest');
                          setViewsSort(null);
                        }}
                      />
                      <RadioOption
                        label="เก่าที่สุดก่อน"
                        checked={dateSort === 'oldest'}
                        onChange={() => {
                          setDateSort('oldest');
                          setViewsSort(null);
                        }}
                      />
                      <RadioOption
                        label="ยอดเข้าชมมากสุด"
                        checked={viewsSort === 'most'}
                        onChange={() => {
                          setViewsSort('most');
                          setDateSort(null);
                        }}
                      />
                      <RadioOption
                        label="ชื่อ (A-Z)"
                        checked={titleSort === 'asc'}
                        onChange={() => {
                          setTitleSort(titleSort === 'asc' ? null : 'asc');
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-[#DFDFE0] pt-3">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-gray-500 hover:text-[#DE5D8F] text-[13px] font-bold font-serif underline border-none bg-transparent cursor-pointer"
                  >
                    ล้างค่าทั้งหมด
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="px-4 py-1.5 rounded-[8px] bg-[#DE5D8F] text-white font-serif font-bold text-[13px] border-none cursor-pointer"
                  >
                    นำไปใช้
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: 880 }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid #DFDFE0',
                    backgroundColor: '#F7F8F9',
                  }}
                >
                  <th className="py-4 px-6 font-bold text-[#1A1C1C] font-serif text-[15px] w-[36%]">
                    ชื่อบทความ
                  </th>
                  <th className="py-4 px-4 font-bold text-[#1A1C1C] font-serif text-[15px]">
                    ผู้แต่ง
                  </th>
                  <th className="py-4 px-4 font-bold text-[#1A1C1C] font-serif text-[15px]">
                    หมวดหมู่
                  </th>
                  <th className="py-4 px-4 font-bold text-[#1A1C1C] font-serif text-[15px]">
                    สถานะ
                  </th>
                  <th className="py-4 px-4 font-bold text-[#1A1C1C] font-serif text-[15px]">
                    วันที่เผยแพร่
                  </th>
                  <th className="py-4 px-4 font-bold text-[#1A1C1C] font-serif text-[15px] text-center">
                    ยอดเข้าชม
                  </th>
                  <th className="py-4 px-6 font-bold text-[#1A1C1C] font-serif text-[15px] text-center">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-[#FFF9FB] transition-colors border-b border-[#F0F0F0] last:border-none"
                    >
                      {/* Thumbnail + Title */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.coverImage || article.imageUrl || articleThumbFallback}
                            alt={article.title}
                            className="w-10 h-10 rounded-[6px] object-cover shrink-0 shadow-xs bg-gray-100 border border-gray-100"
                            onError={(e) => {
                              e.currentTarget.src = articleThumbFallback;
                            }}
                          />
                          <span
                            onClick={() => navigate(`/aksornsara/create?id=${article.id}`)}
                            className="font-bold text-[#1A1C1C] hover:text-[#DE5D8F] cursor-pointer transition-colors font-serif text-[15px] leading-[20px] line-clamp-2"
                            title={article.title}
                          >
                            {article.title}
                          </span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 font-serif text-[14px] text-[#1A1C1C]">
                        {article.author}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-[6px] font-serif font-bold text-[12px] text-[#DE5D8F] bg-[#FCEFF4] whitespace-nowrap">
                          {article.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="text-[13px] font-bold font-serif text-[#3D940B]">
                          {article.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-serif text-[13px] text-gray-500 whitespace-nowrap">
                        {article.publishedAt || article.date}
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-center font-bold font-serif text-[14px] text-gray-800">
                        {(article.views || 0).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/aksornsara/create?id=${article.id}`)}
                            className="p-1.5 rounded-[6px] hover:bg-[#FCEFF4] text-gray-500 hover:text-[#DE5D8F] transition-colors border-none bg-transparent cursor-pointer"
                            title="แก้ไขบทความ"
                          >
                            <PenSquare size={16} />
                          </button>

                          <a
                            href={
                              article.url ||
                              `${import.meta.env.VITE_AKSORNSARA_FRONTEND_URL || 'http://localhost:4201'}/articles/${article.id}?mock=${encodeURIComponent(
                                JSON.stringify(article)
                              )}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-[6px] hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                            title="เปิดดูบทความ"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 font-serif text-[16px]">
                      ไม่พบบทความที่เผยแพร่แล้ว
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Table Footer & Pagination ── */}
        <div
          className="bg-white rounded-[16px] border border-[#DFDFE0] py-3.5 px-6 flex flex-wrap justify-between items-center shadow-xs gap-4"
        >
          <span className="text-[#6D6D6D] text-[14px] font-bold font-serif">
            แสดงทั้งหมด {filtered.length} บทความ (หน้า {currentPage} จาก {Math.max(1, totalPages)})
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-[6px] border border-[#DFDFE0] flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  p = currentPage - 2 + i;
                  if (p > totalPages) p = totalPages - 4 + i;
                }
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-[6px] font-serif font-bold text-[13px] border cursor-pointer transition-colors ${currentPage === p
                        ? 'bg-[#DE5D8F] text-white border-[#DE5D8F]'
                        : 'bg-white text-gray-700 border-[#DFDFE0] hover:bg-gray-50'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-[6px] border border-[#DFDFE0] flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default PublishedArticlesPage;
