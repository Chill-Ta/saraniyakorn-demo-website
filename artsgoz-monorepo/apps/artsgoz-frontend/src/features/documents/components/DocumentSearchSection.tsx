import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ListFilter } from 'lucide-react';
import { MOCK_DOCUMENTS, DOCUMENTS_PER_PAGE } from '../constants.js';
import { DocumentCard } from './DocumentCard.js';
import { DocumentPagination } from './DocumentPagination.js';
import { DOCUMENT_CATEGORIES } from '../types.js';

export function DocumentSearchSection() {
  const { t } = useTranslation('student_services');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bookmarked_documents');
        if (saved) {
          return new Set(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load bookmarks', e);
      }
    }
    return new Set();
  });

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('bookmarked_documents', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error('Failed to save bookmark', e);
      }
      return next;
    });
  };

  // Filter documents based on search query and category selection
  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      // Search matches file name or details
      const matchesSearch =
        !searchQuery ||
        t(doc.nameKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(doc.detailsKey).toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      let matchesCategory = true;
      if (activeCategory === 'documents.categories.saved') {
        matchesCategory = bookmarkedIds.has(doc.id);
      } else if (activeCategory) {
        matchesCategory = doc.categoryKey === activeCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, bookmarkedIds, t]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / DOCUMENTS_PER_PAGE));

  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * DOCUMENTS_PER_PAGE;
    return filteredDocuments.slice(start, start + DOCUMENTS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Title */}
      <h1 className="font-[ChulaCharasNew] text-black font-bold text-[32px] mb-6 select-none truncate max-w-full">
        {t('documents.title')}
      </h1>

      {/* Search & Filter Container (Frame 6175) */}
      <div className="w-full max-w-[1086px] flex items-center gap-[11px] mb-8">
        {/* Search Fields Input (Pill shape) */}
        <div className="flex-1 relative flex items-center bg-white border border-[#DE5D8F]/30 hover:border-[#DE5D8F]/60 focus-within:border-[#DE5D8F] focus-within:ring-1 focus-within:ring-[#DE5D8F] transition-all h-[41px] px-4 rounded-[9999px] shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('documents.search_placeholder')}
            className="w-full h-full bg-transparent text-[#DE5D8F] font-[ChulaCharasNew] font-normal text-[16px] outline-none placeholder-[#DE5D8F]/65 pr-8"
          />
          <Search className="absolute right-4 w-5 h-5 text-[#DE5D8F] pointer-events-none" />
        </div>

        {/* Filter Icon Button */}
        <button
          type="button"
          className="flex items-center justify-center bg-[#E992B4] hover:bg-[#DE5D8F] text-white rounded-[8px] transition-colors duration-200 w-8 h-8 cursor-pointer shrink-0 border-none"
          aria-label={t('documents.filter_label')}
        >
          <ListFilter size={16} />
        </button>
      </div>

      {/* Category Chips (Frame 6238) */}
      <div className="w-full max-w-[1086px] flex flex-wrap items-center md:justify-end gap-2 md:gap-[32px] mb-8 overflow-x-auto pb-2 scrollbar-none">
        {DOCUMENT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`font-[ChulaCharasNew] font-bold rounded-full md:rounded-[9999px] cursor-pointer transition-all shrink-0 border border-transparent whitespace-nowrap
                text-[10px] md:text-[14px] 
                h-[20px] md:h-[32px]
                px-2 md:px-4
                ${
                  isActive
                    ? 'bg-[#FCEFF4] text-[#DE5D8F] border-[#DE5D8F]/30'
                    : 'bg-[#F7F8F9] text-[#6D6D6D] hover:bg-[#ECECEC]'
                }`}
            >
              {t(category)}
            </button>
          );
        })}
      </div>

      {/* Document Row Cards Listing */}
      <div className="w-full max-w-[908px] mx-auto flex flex-col gap-[6px] md:gap-[9px] mb-10 min-w-0">
        {paginatedDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isBookmarked={bookmarkedIds.has(doc.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}

        {paginatedDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center font-[ChulaCharasNew] text-[#6D6D6D] w-full px-4">
            <span className="text-[20px] font-bold break-words">{t('documents.no_results_title')}</span>
            <span className="text-[16px] mt-1 opacity-70 break-words">{t('documents.no_results_desc')}</span>
          </div>
        )}
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center mt-6">
          <DocumentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
