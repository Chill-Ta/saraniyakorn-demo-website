import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronDown,
  Check,
  PenSquare,
  Trash2,
  ExternalLink,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';
import { articlesService, BackofficeArticle } from './services/articlesService';
import articleThumbFallback from '../../assets/article_thumb.png';

export function ArticlesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filter & Sort states
  const [titleSort, setTitleSort] = useState<'asc' | 'desc' | null>(null);
  const [authorSort, setAuthorSort] = useState<'asc' | 'desc' | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ทั้งหมด' | 'เผยแพร่แล้ว' | 'ร่างบทความ'>('ทั้งหมด');
  const [categoryFilter, setCategoryFilter] = useState<string>('ทั้งหมด');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest' | null>('newest');
  const [viewsSort, setViewsSort] = useState<'most' | 'least' | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<BackofficeArticle | null>(null);

  // Load articles from articlesService
  const [articlesList, setArticlesList] = useState<BackofficeArticle[]>(() => articlesService.getAll());

  useEffect(() => {
    articlesService.syncWithApi();
    return articlesService.subscribe(() => {
      setArticlesList(articlesService.getAll());
    });
  }, []);

  const categories = useMemo(() => {
    const set = new Set(articlesList.map((a) => a.category).filter(Boolean));
    return ['ทั้งหมด', ...Array.from(set)];
  }, [articlesList]);

  // Filtered & Sorted Articles
  const filtered = useMemo(() => {
    return articlesList.filter((item) => {
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.author.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === 'ทั้งหมด' || item.status === statusFilter;

      const matchCategory =
        categoryFilter === 'ทั้งหมด' || item.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    }).sort((a, b) => {
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
  }, [articlesList, search, statusFilter, categoryFilter, titleSort, authorSort, viewsSort, dateSort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleClearFilters = () => {
    setTitleSort(null);
    setAuthorSort(null);
    setStatusFilter('ทั้งหมด');
    setCategoryFilter('ทั้งหมด');
    setDateSort('newest');
    setViewsSort(null);
    setSearch('');
    setOpenDropdown(null);
    setCurrentPage(1);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    articlesService.delete(deleteTarget.id);
    setArticlesList(articlesService.getAll());
    setDeleteTarget(null);
  };

  return (
    <AksornsaraLayout
      showBackButton={false}
      searchValue={search}
      onSearchChange={(val) => {
        setSearch(val);
        setCurrentPage(1);
      }}
      searchPlaceholder="ค้นหาบทความ, ชื่อผู้แต่ง..."
    >
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 1040 }}>
        {/* ── Page Title & Action Bar ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="font-bold text-[#1A1C1C] text-[32px] md:text-[44px] leading-tight m-0 font-serif"
            >
              All Articles
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/aksornsara/create')}
            className="flex items-center gap-2 text-white font-bold cursor-pointer border-none shadow-sm hover:opacity-90 active:scale-95 transition-all font-serif"
            style={{
              fontSize: 14,
              backgroundColor: '#E992B4',
              borderRadius: 9999,
              height: 42,
              padding: '0 24px',
            }}
          >
            <Plus size={18} />
            <span>สร้างบทความใหม่</span>
          </button>
        </div>

        {/* ── Filter Dropdowns Bar ── */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 relative">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* 1. หมวดหมู่ Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('category')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-xs"
                style={{
                  border: categoryFilter !== 'ทั้งหมด' ? '1.5px solid #DE5D8F' : '1.5px solid #DFDFE0',
                  minWidth: 110,
                  height: 38,
                }}
              >
                <span className="font-bold text-[#1A1C1C] text-[14px] font-serif">
                  {categoryFilter !== 'ทั้งหมด' ? categoryFilter : 'หมวดหมู่'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'category' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[140px] max-h-[220px] overflow-y-auto"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { setCategoryFilter(cat); setOpenDropdown(null); setCurrentPage(1); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer font-serif"
                    >
                      <span>{cat}</span>
                      {categoryFilter === cat && <Check size={14} color="#DE5D8F" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. สถานะ Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('status')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-xs"
                style={{
                  border: statusFilter !== 'ทั้งหมด' ? '1.5px solid #DE5D8F' : '1.5px solid #DFDFE0',
                  minWidth: 100,
                  height: 38,
                }}
              >
                <span className="font-bold text-[#1A1C1C] text-[14px] font-serif">
                  {statusFilter !== 'ทั้งหมด' ? statusFilter : 'สถานะ'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'status' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[130px]"
                >
                  {(['ทั้งหมด', 'เผยแพร่แล้ว', 'ร่างบทความ'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => { setStatusFilter(st); setOpenDropdown(null); setCurrentPage(1); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer font-serif"
                    >
                      <span className={st === 'เผยแพร่แล้ว' ? 'text-[#3D940B]' : st === 'ร่างบทความ' ? 'text-[#0165F8]' : ''}>
                        {st}
                      </span>
                      {statusFilter === st && <Check size={14} color="#DE5D8F" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. ชื่อบทความ Sort */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('title')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-xs"
                style={{
                  border: titleSort ? '1.5px solid #DE5D8F' : '1.5px solid #DFDFE0',
                  minWidth: 108,
                  height: 38,
                }}
              >
                <span className="font-bold text-[#1A1C1C] text-[14px] font-serif">
                  {titleSort ? (titleSort === 'asc' ? 'ชื่อ (A-Z)' : 'ชื่อ (Z-A)') : 'ชื่อบทความ'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'title' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[130px]"
                >
                  <button
                    type="button"
                    onClick={() => { setTitleSort('asc'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer font-serif"
                  >
                    <span>เรียงจาก A-Z</span>
                    {titleSort === 'asc' && <Check size={14} color="#DE5D8F" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTitleSort('desc'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer font-serif"
                  >
                    <span>เรียงจาก Z-A</span>
                    {titleSort === 'desc' && <Check size={14} color="#DE5D8F" />}
                  </button>
                </div>
              )}
            </div>

            {/* 4. ยอดเข้าชม Sort */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('views')}
                className="flex items-center justify-between gap-2 bg-white px-3.5 py-1.5 rounded-[8px] cursor-pointer transition-colors shadow-xs"
                style={{
                  border: viewsSort ? '1.5px solid #DE5D8F' : '1.5px solid #DFDFE0',
                  minWidth: 108,
                  height: 38,
                }}
              >
                <span className="font-bold text-[#1A1C1C] text-[14px] font-serif">
                  {viewsSort ? (viewsSort === 'most' ? 'ยอดชม (มากสุด)' : 'ยอดชม (น้อยสุด)') : 'ยอดเข้าชม'}
                </span>
                <ChevronDown size={16} color="#1A1C1C" />
              </button>
              {openDropdown === 'views' && (
                <div
                  className="absolute left-0 top-full mt-1.5 bg-white rounded-[10px] border border-[#DFDFE0] shadow-lg py-1.5 z-30 min-w-[150px]"
                >
                  <button
                    type="button"
                    onClick={() => { setViewsSort('most'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer font-serif"
                  >
                    <span>ยอดเข้าชมมากสุด</span>
                    {viewsSort === 'most' && <Check size={14} color="#DE5D8F" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setViewsSort('least'); setOpenDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFF4] text-[13px] text-[#1A1C1C] flex items-center justify-between border-none bg-transparent cursor-pointer font-serif"
                  >
                    <span>ยอดเข้าชมน้อยสุด</span>
                    {viewsSort === 'least' && <Check size={14} color="#DE5D8F" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ล้างตัวกรอง */}
          {(categoryFilter !== 'ทั้งหมด' || statusFilter !== 'ทั้งหมด' || titleSort || authorSort || viewsSort || search) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[#DE5D8F] hover:text-[#CA5582] text-[13px] font-bold font-serif border-none bg-transparent cursor-pointer hover:underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>

        {/* ── Table Card ── */}
        <div
          className="bg-white rounded-[16px] border border-[#DFDFE0] overflow-hidden shadow-xs relative"
        >
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
                    วันที่
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
                  paginatedArticles.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FFF9FB] transition-colors border-b border-[#F0F0F0] last:border-none"
                    >
                      {/* Thumbnail + Title */}
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.coverImage || item.imageUrl || articleThumbFallback}
                            alt="thumbnail"
                            className="w-10 h-10 rounded-[6px] object-cover shrink-0 shadow-xs bg-gray-100 border border-gray-100"
                            onError={(e) => {
                              e.currentTarget.src = articleThumbFallback;
                            }}
                          />
                          <span
                            onClick={() => navigate(`/aksornsara/create?id=${item.id}`)}
                            className="font-bold text-[#1A1C1C] hover:text-[#DE5D8F] cursor-pointer transition-colors font-serif text-[15px] leading-[20px] line-clamp-2"
                            title={item.title}
                          >
                            {item.title}
                          </span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4">
                        <span className="text-[#1A1C1C] font-serif text-[14px]">
                          {item.author}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span
                          className="inline-block px-2.5 py-1 rounded-[6px] font-sans font-normal text-[12px] text-[#DE5D8F] bg-[#FCEFF4] whitespace-nowrap"
                          style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}
                        >
                          {item.category?.replace(/^ปี\s*/, '')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[13px] font-bold font-serif ${
                            item.status === 'เผยแพร่แล้ว'
                              ? 'text-[#3D940B]'
                              : 'text-[#0165F8]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Published Date */}
                      <td className="py-3 px-4">
                        <span className="text-gray-500 font-serif text-[13px] whitespace-nowrap">
                          {item.publishedAt || item.date}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-4 text-center">
                        <span className="text-[#1A1C1C] font-bold font-serif text-[14px]">
                          {(item.views || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/aksornsara/create?id=${item.id}`)}
                            className="p-1.5 rounded-[6px] hover:bg-[#FCEFF4] text-gray-500 hover:text-[#DE5D8F] transition-colors border-none bg-transparent cursor-pointer"
                            title="แก้ไขบทความ"
                          >
                            <PenSquare size={16} />
                          </button>

                          {/* View button */}
                          <a
                            href={
                              item.url ||
                              `http://localhost:4200/articles/${item.id}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-[6px] hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                            title="เปิดดูบทความ"
                          >
                            <ExternalLink size={16} />
                          </a>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-[6px] hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                            title="ลบบทความ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 font-serif text-[16px]">
                      ไม่พบบทความที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Table Footer & Pagination Bar ── */}
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
                    className={`w-8 h-8 rounded-[6px] font-serif font-bold text-[13px] border cursor-pointer transition-colors ${
                      currentPage === p
                        ? 'bg-[#E992B4] text-white border-[#E992B4]'
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-[20px] p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6 max-w-[440px] w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle size={24} />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-bold text-[#1A1C1C] text-[20px] font-serif m-0">
                ยืนยันการลบบทความ ?
              </h3>
              <p className="text-gray-500 font-serif text-[14px] m-0">
                คุณแน่ใจหรือไม่ว่าต้องการลบบทความ "{deleteTarget.title}" การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-[10px] border border-[#DFDFE0] bg-white font-serif font-bold text-[15px] cursor-pointer hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-[10px] bg-red-600 text-white font-serif font-bold text-[15px] cursor-pointer hover:bg-red-700 border-none shadow-sm"
              >
                ลบบทความ
              </button>
            </div>
          </div>
        </div>
      )}
    </AksornsaraLayout>
  );
}

export default ArticlesPage;
