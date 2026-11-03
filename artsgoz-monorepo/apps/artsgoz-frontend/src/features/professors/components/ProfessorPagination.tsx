import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProfessorPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination — matches Figma Component 14 / Component 15:
 *   - 326×48 total width, HORIZONTAL layout, gap:59, CENTER align
 *
 * Left button (button page l):
 *   - 48×48 rounded-full bg:#E992B4, padding:12
 *   - Icon: chevron-left 24×24 white fill
 *
 * Page numbers (Frame 6232):
 *   - 112×32, HORIZONTAL, gap:8
 *   - Active page: 32×32, bg:#FFFFFF, border:#4200FF, radius:4, text 12px w700 #4200FF
 *   - Inactive page: 32×32, bg:#FFFFFF, border:#DFE3E8, radius:4, text 18px w700 #212B36
 *
 * Right button (button page r):
 *   - Same as left but chevron-right
 */
export function ProfessorPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProfessorPaginationProps) {
  // Calculate which pages to show (max 3 visible)
  const getPageNumbers = (): number[] => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pages = getPageNumbers();

  return (
    /* Component 14/15 outer — VERTICAL gap:13, CENTER */
    <div className="flex flex-col items-center" style={{ gap: '13px' }}>
      {/* Frame 6237 — HORIZONTAL gap:59 CENTER */}
      <div className="flex items-center" style={{ gap: '59px' }}>
        {/* button page l — 48×48 rounded-full bg:#E992B4 */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center bg-[#E992B4] rounded-full disabled:opacity-50 transition-opacity"
          style={{ width: '48px', height: '48px', padding: '12px' }}
          aria-label="หน้าก่อนหน้า"
        >
          <ChevronLeft size={24} color="white" strokeWidth={2} />
        </button>

        {/* Frame 6232 — page number buttons, HORIZONTAL gap:8 */}
        <div className="flex items-center" style={{ gap: '8px' }}>
          {pages.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className="flex items-center justify-center bg-white transition-colors font-[ChulaCharasNew]"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  border: `1px solid ${isActive ? '#4200FF' : '#DFE3E8'}`,
                  fontSize: isActive ? '12px' : '18px',
                  fontWeight: 700,
                  color: isActive ? '#4200FF' : '#212B36',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* button page r — 48×48 rounded-full bg:#E992B4 */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center bg-[#E992B4] rounded-full disabled:opacity-50 transition-opacity"
          style={{ width: '48px', height: '48px', padding: '12px' }}
          aria-label="หน้าถัดไป"
        >
          <ChevronRight size={24} color="white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
