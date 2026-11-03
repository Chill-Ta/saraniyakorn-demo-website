import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
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
      className="flex items-center gap-2.5 cursor-pointer select-none group py-1"
    >
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0"
        style={{
          border: '1.5px solid #E992B4',
          backgroundColor: '#FFFFFF',
        }}
      >
        {checked && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#E992B4' }}
          />
        )}
      </div>
      <span
        className="transition-colors text-[#404041] group-hover:text-[#1A1C1C]"
        style={{
          fontFamily: 'ChulaCharasNew, sans-serif',
          fontSize: 16,
          lineHeight: '22px',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function formatThaiShortDate(dateStr?: string): string {
  if (!dateStr) return '1 ม.ค. 69';
  if (/ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\./.test(dateStr)) {
    return dateStr;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return dateStr;
  }
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = (d.getFullYear() + 543) % 100;
  return `${day} ${month} ${year}`;
}

const CATEGORY_OPTIONS = [
  'ทั้งหมด',
  'ศิลปะ',
  'วรรณกรรม',
  'ภาษา',
  'วัฒนธรรม',
  'ปรัชญา',
  'วิจารณ์',
  'ทั่วไป',
];

const SORT_OPTIONS: { id: string; label: string }[] = [
  { id: 'newest', label: 'ล่าสุดก่อน' },
  { id: 'oldest', label: 'เก่าที่สุดก่อน' },
  { id: 'views-most', label: 'ยอดเข้าชมมากสุด' },
  { id: 'views-least', label: 'ยอดเข้าชมน้อยสุด' },
  { id: 'title-asc', label: 'ชื่อ (ก-ฮ)' },
];

export function PublishedArticlesPage() {
  const [topSearch, setTopSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter & Sort States
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [selectedSort, setSelectedSort] = useState<string>('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const navigate = useNavigate();
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

  const [version, setVersion] = useState(0);

  useEffect(() => {
    articlesService.syncWithApi();
    return articlesService.subscribe(() => setVersion((v) => v + 1));
  }, []);

  // Load articles
  const articlesList = useMemo(() => articlesService.getAll(), [version]);

  // Combined search term
  const effectiveSearch = (localSearch || topSearch).trim().toLowerCase();

  const displayCategory = (cat?: string) => {
    if (!cat) return 'ทั่วไป';
    return cat.replace(/^ปี\s*/, '');
  };

  // Filter & Sort
  const filtered = useMemo(() => {
    return articlesList
      .filter((article) => {
        // Category check
        const cleanCat = displayCategory(article.category);
        const matchesCategory =
          selectedCategory === 'ทั้งหมด' ||
          cleanCat === selectedCategory ||
          article.category === selectedCategory;

        // Search check
        const matchesSearch =
          !effectiveSearch ||
          article.title.toLowerCase().includes(effectiveSearch) ||
          article.author.toLowerCase().includes(effectiveSearch) ||
          cleanCat.toLowerCase().includes(effectiveSearch);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (selectedSort === 'title-asc') {
          return a.title.localeCompare(b.title, 'th');
        }
        if (selectedSort === 'views-most') {
          return (b.views || 0) - (a.views || 0);
        }
        if (selectedSort === 'views-least') {
          return (a.views || 0) - (b.views || 0);
        }
        if (selectedSort === 'oldest') {
          return a.id.localeCompare(b.id);
        }
        // Default newest
        return b.id.localeCompare(a.id);
      });
  }, [articlesList, selectedCategory, effectiveSearch, selectedSort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategory('ทั้งหมด');
    setSelectedSort('newest');
    setLocalSearch('');
    setTopSearch('');
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
      showBackButton={true}
      searchValue={topSearch}
      onSearchChange={(val) => {
        setTopSearch(val);
        setCurrentPage(1);
      }}
      searchPlaceholder="ค้นหา..."
    >
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 980 }}>
        {/* ── Page Header: Title + Export Button ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontWeight: 700,
              fontSize: 48,
              lineHeight: '64px',
              color: '#1A1C1C',
              margin: 0,
            }}
          >
            บทความที่เผยแพร่แล้ว
          </h1>

          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center justify-center cursor-pointer transition-transform hover:opacity-90 active:scale-95 border-none"
            style={{
              width: 129,
              height: 40,
              backgroundColor: '#E992B4',
              borderRadius: 9999,
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              padding: '8px 24px',
              gap: 6,
            }}
          >
            <Download size={14} color="#FFFFFF" strokeWidth={2.5} />
            <span
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              ส่งออกข้อมูล
            </span>
          </button>
        </div>

        {/* ── Controls (Search & Filter) ── */}
        <div
          className="w-full flex items-center justify-between gap-4"
          style={{
            height: 81,
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E3F4',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
            borderRadius: 8,
            padding: '16px 20px',
          }}
        >
          {/* Search Input Pill */}
          <div
            className="flex-1 flex items-center justify-between"
            style={{
              height: 41,
              backgroundColor: '#FFFFFF',
              border: '2px solid #8B8B8C',
              borderRadius: 9999,
              padding: '0 24px',
              gap: 16,
            }}
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาบทความ..."
              className="w-full bg-transparent border-none outline-none"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontWeight: 400,
                fontSize: 20,
                lineHeight: '28px',
                color: '#1A1C1C',
              }}
            />
            <Search size={20} color="#33363F" strokeWidth={2} style={{ flexShrink: 0 }} />
          </div>

          {/* Filter Button & Popover */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className="flex items-center justify-center cursor-pointer transition-transform hover:opacity-90 active:scale-95"
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#E992B4',
                borderRadius: 8,
                border: 'none',
              }}
              title="ตัวกรองและเรียงลำดับ"
            >
              <SlidersHorizontal size={20} color="#FFFFFF" strokeWidth={2} />
            </button>

            {/* Filter Popover (Figma node 8070-48917) */}
            {filterOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] bg-white rounded-[16px] border border-[#DFDFE0] shadow-2xl p-6 z-50 flex flex-col gap-5"
                style={{ width: 420 }}
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b border-[#DFDFE0] pb-3">
                  <span
                    className="font-bold text-[#1A1C1C]"
                    style={{
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontSize: 18,
                      lineHeight: '24px',
                    }}
                  >
                    ตัวเลือกการกรองและจัดเรียง
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="text-gray-400 hover:text-black border-none bg-transparent cursor-pointer p-1"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Popover Content (2 Columns) */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Category Filter */}
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="font-bold text-[#1A1C1C] mb-1"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                      }}
                    >
                      หมวดหมู่
                    </span>
                    <div className="flex flex-col gap-1">
                      {CATEGORY_OPTIONS.map((cat) => (
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
                  <div className="flex flex-col gap-1.5">
                    <span
                      className="font-bold text-[#1A1C1C] mb-1"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 16,
                      }}
                    >
                      เรียงตาม
                    </span>
                    <div className="flex flex-col gap-1">
                      {SORT_OPTIONS.map((opt) => (
                        <RadioOption
                          key={opt.id}
                          label={opt.label}
                          checked={selectedSort === opt.id}
                          onChange={() => {
                            setSelectedSort(opt.id);
                            setCurrentPage(1);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popover Footer */}
                <div className="flex justify-between items-center border-t border-[#DFDFE0] pt-4 mt-1">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[#545455] hover:text-[#E992B4] underline border-none bg-transparent cursor-pointer transition-colors"
                    style={{
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    ล้างค่าทั้งหมด
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="px-5 py-1.5 rounded-[8px] text-white border-none cursor-pointer transition-opacity hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: '#E992B4',
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    นำไปใช้
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Data Table Card ── */}
        <div
          className="w-full bg-white overflow-hidden"
          style={{
            borderRadius: 8,
            border: '1px solid #ECECEC',
            boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.05), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: 880 }}>
              <thead>
                <tr
                  style={{
                    height: 50,
                    backgroundColor: '#F7F8F9',
                    borderBottom: '1px solid #ECECEC',
                  }}
                >
                  <th
                    className="px-6"
                    style={{
                      width: '36%',
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: '28px',
                      color: '#1A1C1C',
                    }}
                  >
                    ชื่อบทความ
                  </th>
                  <th
                    className="px-4 text-center"
                    style={{
                      width: '14%',
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: '28px',
                      color: '#1A1C1C',
                    }}
                  >
                    ผู้แต่ง
                  </th>
                  <th
                    className="px-4 text-center"
                    style={{
                      width: '13%',
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: '28px',
                      color: '#1A1C1C',
                    }}
                  >
                    หมวดหมู่
                  </th>
                  <th
                    className="px-4 text-center"
                    style={{
                      width: '13%',
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: '28px',
                      color: '#1A1C1C',
                    }}
                  >
                    สถานะ
                  </th>
                  <th
                    className="px-4 text-center"
                    style={{
                      width: '14%',
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: '28px',
                      color: '#1A1C1C',
                    }}
                  >
                    วันที่เผยแพร่
                  </th>
                  <th
                    className="px-6 text-center"
                    style={{
                      width: '10%',
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: '28px',
                      color: '#1A1C1C',
                    }}
                  >
                    ยอดเข้าชม
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <tr
                      key={article.id}
                      onClick={() => navigate(`/aksornsara/create?id=${article.id}`)}
                      className="hover:bg-[#FFF9FB] transition-colors border-b border-[#F0F0F0] last:border-none cursor-pointer"
                      style={{ height: 60 }}
                    >
                      {/* Thumbnail + Title */}
                      <td className="px-6 py-2">
                        <div className="flex items-center gap-4">
                          <img
                            src={article.coverImage || article.imageUrl || articleThumbFallback}
                            alt={article.title}
                            className="rounded-[4px] object-cover shrink-0"
                            style={{
                              width: 48,
                              height: 48,
                              backgroundColor: '#E2E2E2',
                            }}
                            onError={(e) => {
                              e.currentTarget.src = articleThumbFallback;
                            }}
                          />
                          <span
                            className="line-clamp-1"
                            style={{
                              fontFamily: 'ChulaCharasNew, sans-serif',
                              fontWeight: 400,
                              fontSize: 18,
                              lineHeight: '24px',
                              color: '#1A1C1C',
                            }}
                            title={article.title}
                          >
                            {article.title}
                          </span>
                        </div>
                      </td>

                      {/* Author */}
                      <td
                        className="px-4 py-2 text-center"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: '24px',
                          color: '#1A1C1C',
                        }}
                      >
                        {article.author}
                      </td>

                      {/* Category */}
                      <td
                        className="px-4 py-2 text-center"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: '24px',
                          color: '#1A1C1C',
                        }}
                      >
                        {displayCategory(article.category)}
                      </td>

                      {/* Status */}
                      <td
                        className="px-4 py-2 text-center"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: '24px',
                          color: '#64A93C',
                        }}
                      >
                        {article.status || 'เผยแพร่แล้ว'}
                      </td>

                      {/* Date */}
                      <td
                        className="px-4 py-2 text-center"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: '24px',
                          color: '#1A1C1C',
                        }}
                      >
                        {formatThaiShortDate(article.publishedAt || article.date)}
                      </td>

                      {/* Views */}
                      <td
                        className="px-6 py-2 text-center"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: '24px',
                          color: '#1A1C1C',
                        }}
                      >
                        {(article.views ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 18,
                        color: '#99999A',
                      }}
                    >
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
          className="w-full bg-white flex items-center justify-between gap-4 flex-wrap"
          style={{
            height: 57,
            borderRadius: 8,
            border: '1px solid #D9E3F4',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            padding: '16px 24px',
          }}
        >
          {/* Pagination buttons */}
          <div className="flex items-center gap-1.5">
            {totalPages > 1 && (
              <>
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
                      className={`w-8 h-8 rounded-[6px] font-bold text-[14px] border cursor-pointer transition-colors ${
                        currentPage === p
                          ? 'bg-[#E992B4] text-white border-[#E992B4]'
                          : 'bg-white text-gray-700 border-[#DFDFE0] hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
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
              </>
            )}
          </div>

          {/* Total Count (Figma: ทั้งหมด 100 รายการ) */}
          <span
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              lineHeight: '24px',
              color: '#504444',
            }}
          >
            ทั้งหมด {filtered.length} รายการ
          </span>
        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default PublishedArticlesPage;
