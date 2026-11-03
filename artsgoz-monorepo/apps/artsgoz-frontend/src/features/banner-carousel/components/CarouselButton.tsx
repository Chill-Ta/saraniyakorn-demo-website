import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export function CarouselButton({ direction, onClick }: CarouselButtonProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const positionClass = direction === 'left' ? 'left-4' : 'right-4';
  const label = direction === 'left' ? 'Previous Slide' : 'Next Slide';

  return (
    <button
      onClick={onClick}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 hover:bg-white text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md active:scale-95 flex items-center justify-center cursor-pointer border-none z-20`}
      aria-label={label}
    >
      <Icon size={24} />
    </button>
  );
}
