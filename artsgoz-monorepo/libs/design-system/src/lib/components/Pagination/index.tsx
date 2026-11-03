import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../IconButton/index.js';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getPageButtonClass = (isActive: boolean) => {
    const stateStyle = isActive
      ? 'border-[var(--color-background-primary-dark,#DE5D8F)] bg-white text-[var(--color-text-primary,#DE5D8F)]'
      : 'border-[#DFE3E8] bg-white text-[#212B36]';

    return `flex items-center justify-center w-[32px] h-[32px] rounded-[4px] border shrink-0 cursor-pointer transition-colors text-center font-[family:var(--font-mobile-heading-lg,ChulaCharasNew)] text-[16px] font-bold leading-none ${stateStyle}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full mt-8">
      {/* Left Chevron Button */}
      <IconButton
        icon={<ChevronLeft size={16} />}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-[32px] h-[32px] p-0 flex items-center justify-center"
        aria-label="Previous page"
      />

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={getPageButtonClass(page === currentPage)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Right Chevron Button */}
      <IconButton
        icon={<ChevronRight size={16} />}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-[32px] h-[32px] p-0 flex items-center justify-center"
        aria-label="Next page"
      />
    </div>
  );
}
