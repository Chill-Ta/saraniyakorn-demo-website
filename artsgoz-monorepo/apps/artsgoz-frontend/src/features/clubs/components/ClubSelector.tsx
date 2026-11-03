import { useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_CLUBS } from '../constants.js';

export function ClubSelector() {
  const { t } = useTranslation('clubs');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get('id') || 'club-04'; // Default to Dance Club (club-04)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectClub = (id: string) => {
    setSearchParams(
      (prev) => {
        prev.set('id', id);
        return prev;
      },
      { replace: true }
    );
    const element = document.getElementById(`selector-item-${id}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full py-6 select-none">
      {/* Scroll controls */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 hover:scale-105 active:scale-95 transition-all text-gray-600 hover:text-black cursor-pointer hidden md:flex border-none"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {/* Fade Overlays mimicking Figma gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden md:block" />

      {/* Horizontal Strip */}
      <div
        ref={scrollContainerRef}
        className="
          flex flex-row gap-6 overflow-x-auto snap-x scroll-smooth pb-3 px-4 md:px-8 w-full
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {MOCK_CLUBS.map((club) => {
          const isActive = club.id === activeId;
          const translatedName = t(club.nameKey);
          return (
            <button
              key={club.id}
              id={`selector-item-${club.id}`}
              onClick={() => handleSelectClub(club.id)}
              className="flex flex-col items-center gap-2.5 shrink-0 snap-center cursor-pointer group focus:outline-none border-none bg-transparent"
              style={{ width: '80px' }}
            >
              {/* Circular Avatar */}
              <div
                className={`
                  w-20 h-20 rounded-full overflow-hidden transition-all duration-300 relative
                  ${
                    isActive
                      ? 'border-[4px] border-[#DE5D8F] scale-105 shadow-md shadow-pink-100'
                      : 'border-2 border-gray-200 group-hover:border-[#E992B4] group-hover:scale-102'
                  }
                `}
              >
                <div className="w-full h-full bg-[#D0D0D1]" />
                {isActive && (
                  <div className="absolute inset-0 bg-[#DE5D8F]/10 pointer-events-none" />
                )}
              </div>

              {/* Club Title */}
              <span
                className={`
                  text-[13px] text-center font-serif leading-tight w-full line-clamp-2 transition-colors duration-300
                  ${isActive ? 'text-[#DE5D8F] font-bold' : 'text-black group-hover:text-[#DE5D8F]'}
                `}
              >
                {translatedName}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 hover:scale-105 active:scale-95 transition-all text-gray-600 hover:text-black cursor-pointer hidden md:flex border-none"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
