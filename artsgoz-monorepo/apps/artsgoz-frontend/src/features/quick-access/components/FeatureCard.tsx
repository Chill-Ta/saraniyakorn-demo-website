import { Link } from 'react-router';
import { LucideIcon, X } from 'lucide-react';
import { useRef, useCallback } from 'react';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  size?: 'sm' | 'lg';
  isExternal?: boolean;
  isManageMode?: boolean;
  onDelete?: () => void;
}

export function FeatureCard({
  title,
  description,
  icon: IconComponent,
  href,
  size = 'sm',
  isExternal = false,
  isManageMode = false,
  onDelete,
}: FeatureCardProps) {
  const isLarge = size === 'lg';
  const cardRef = useRef<HTMLAnchorElement | HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    if (isManageMode) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Max tilt 10deg
    const rotateX = -dy * 10;
    const rotateY = dx * 10;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  }, [isManageMode]);

  const handleMouseLeave = useCallback(() => {
    if (isManageMode) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, [isManageMode]);

  const content = (
    <div className="relative z-10 flex flex-col items-center justify-center w-full">
      <IconComponent
        size={isLarge ? 56 : 38}
        strokeWidth={isLarge ? 1.25 : 1.5}
        className="text-[#E992B4] transition-colors duration-200 shrink-0"
      />
      <span
        className={`text-[#404041] font-bold font-serif leading-tight text-center max-w-full line-clamp-2 mt-2 ${
          isLarge ? 'text-[18px] sm:text-[20px] md:text-[24px]' : 'text-[14px] sm:text-[16px] md:text-[18px]'
        }`}
      >
        {title}
      </span>
      {description && (
        <p
          className={`text-[#6D6D6D] text-center leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden w-full line-clamp-3 mt-1.5 ${
            isLarge
              ? 'text-[12px] md:text-[14px] group-hover:max-h-[80px]'
              : 'text-[11px] group-hover:max-h-[50px]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );

  const commonProps = {
    ref: cardRef as any,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: `group relative flex flex-col items-center justify-center w-full rounded-lg border border-[#D0D0D1]/60 bg-white overflow-hidden p-3.5 sm:p-5 md:p-6 text-center cursor-pointer ${
      isLarge
        ? 'h-full min-h-[300px] sm:min-h-[350px] md:min-h-[394px] shadow-[2px_3px_12px_0_rgba(0,0,0,0.15)]'
        : 'h-[160px] sm:h-[180px] md:h-[195px] shadow-[2px_3px_8px_0_rgba(0,0,0,0.12)]'
    }`,
    style: {
      transition: 'transform 0.15s ease-out, box-shadow 0.2s ease, border-color 0.2s ease',
      willChange: 'transform' as const,
      animation: isManageMode ? 'wiggle 0.28s ease-in-out infinite alternate' : 'none',
    },
  };

  if (isManageMode) {
    return (
      <div {...commonProps}>
        {content}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete?.();
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-[#ea234f] hover:bg-[#d52048] hover:scale-110 text-white rounded-full flex items-center justify-center shadow-md transition-all z-30 cursor-pointer focus:outline-none"
          aria-label="Delete shortcut"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
        <style>{`
          @keyframes wiggle {
            0% { transform: rotate(0.8deg); }
            100% { transform: rotate(-0.8deg); }
          }
        `}</style>
      </div>
    );
  }

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} {...commonProps}>
      {content}
    </Link>
  );
}
