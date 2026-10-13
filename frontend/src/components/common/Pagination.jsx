import React from 'react';

/**
 * Reusable Pagination component exactly matching the HEXA NEWS design specifications:
 * « < Prev 1 2 3 4 5 ... 62 Next > »
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current active page number (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback when a page is clicked: (newPage: number) => void
 * @param {string} [props.className] - Additional container CSS classes
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 0) return null;

  // Build page numbers array with ellipsis according to current page and total pages
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(totalPages);
    }
  };

  return (
    <nav
      className={`flex items-center justify-center gap-1.5 sm:gap-2 my-8 flex-wrap select-none ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* First Page Button: « */}
      <button
        type="button"
        onClick={handleFirst}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-slate-50 hover:border-slate-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#e2e8f0] transition-colors shadow-sm cursor-pointer"
        title="First page"
        aria-label="First page"
      >
        <span className="text-base font-bold leading-none">&laquo;</span>
      </button>

      {/* Previous Page Button: < Prev */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="h-10 px-3.5 sm:px-4 flex items-center justify-center gap-1 rounded-xl bg-white border border-[#e2e8f0] text-[#334155] font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#e2e8f0] transition-colors shadow-sm cursor-pointer"
        title="Previous page"
        aria-label="Previous page"
      >
        <i className="bi bi-chevron-left text-xs"></i>
        <span>Prev</span>
      </button>

      {/* Numbered Page Buttons & Ellipsis */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {pages.map((p, index) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-10 flex items-center justify-center text-[#64748b] font-bold text-sm tracking-wider select-none"
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;

          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange && onPageChange(p)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-w-[40px] h-10 px-3 flex items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer ${
                isActive
                  ? 'bg-[#c91f26] text-white border border-[#c91f26] shadow-md shadow-[#c91f26]/20'
                  : 'bg-white text-[#1e293b] border border-[#e2e8f0] hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Page Button: Next > */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-10 px-3.5 sm:px-4 flex items-center justify-center gap-1 rounded-xl bg-white border border-[#e2e8f0] text-[#334155] font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#e2e8f0] transition-colors shadow-sm cursor-pointer"
        title="Next page"
        aria-label="Next page"
      >
        <span>Next</span>
        <i className="bi bi-chevron-right text-xs"></i>
      </button>

      {/* Last Page Button: » */}
      <button
        type="button"
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-slate-50 hover:border-slate-300 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#e2e8f0] transition-colors shadow-sm cursor-pointer"
        title="Last page"
        aria-label="Last page"
      >
        <span className="text-base font-bold leading-none">&raquo;</span>
      </button>
    </nav>
  );
}
