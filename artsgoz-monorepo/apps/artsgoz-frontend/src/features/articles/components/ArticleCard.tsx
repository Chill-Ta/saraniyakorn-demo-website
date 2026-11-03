import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import mockImage from '../../../assets/ArticleBannerMock.jpg';

interface ArticleCardProps {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  compact?: boolean;
  onBookmarkChange?: (id: string, bookmarked: boolean) => void;
}

export function ArticleCard({
  id,
  title,
  author,
  date,
  category,
  imageUrl,
  compact = false,
  onBookmarkChange,
}: ArticleCardProps) {
  const { t } = useTranslation('articles');
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        return ids.includes(id);
      }
    } catch (e) {
      console.error('Failed to parse bookmarked_articles', e);
    }
    return false;
  });

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      let ids: string[] = [];
      if (saved) {
        ids = JSON.parse(saved) as string[];
      }
      if (nextState) {
        if (!ids.includes(id)) ids.push(id);
      } else {
        ids = ids.filter((savedId) => savedId !== id);
      }
      localStorage.setItem('bookmarked_articles', JSON.stringify(ids));
      if (onBookmarkChange) {
        onBookmarkChange(id, nextState);
      }
    } catch (err) {
      console.error('Failed to update bookmarked_articles', err);
    }
  };

  const translatedTitle = t(title);
  const translatedAuthor = t(author);
  const translatedCategory = t(category);

  // Compact variant for "อ่านต่อ" (Read More) 4-column row
  if (compact) {
    return (
      <div
        onClick={() => navigate(`/articles/${id}`)}
        className="
          snap-start shrink-0 relative overflow-hidden
          bg-[#F7F8F9] rounded-[16px]
          border border-gray-100 shadow-xs
          cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300
          w-full flex flex-col p-3.5 gap-3
        "
      >
        <div className="w-full h-[180px] sm:h-[200px] rounded-[12px] overflow-hidden">
          <img
            src={imageUrl || mockImage}
            alt={translatedTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-serif font-bold text-[11px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-2.5 py-1 whitespace-nowrap truncate">
            {translatedCategory}
          </span>
          <button
            type="button"
            onClick={handleBookmarkToggle}
            aria-label="Bookmark article"
            className="w-7 h-7 rounded-[8px] bg-[#F8C135] flex items-center justify-center shrink-0 cursor-pointer border-none text-white hover:bg-[#DE5D8F] transition-colors"
          >
            <Bookmark
              size={14}
              fill={isBookmarked ? '#fff' : 'none'}
              stroke="#fff"
              strokeWidth={2}
            />
          </button>
        </div>

        <h4 className="font-serif text-[15px] sm:text-[16px] font-bold leading-[22px] text-black line-clamp-2 break-words">
          {translatedTitle}
        </h4>

        <div className="flex flex-col gap-0.5 text-[12px] font-serif font-bold text-[#6D6D6D]">
          <span className="truncate">{t('written_by', { author: translatedAuthor })}</span>
          <span className="text-[#99999A]">{t('published', { date })}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/articles/${id}`)}
      className="
        snap-start shrink-0 relative overflow-hidden
        bg-[#F7F8F9] rounded-[16px]
        border border-gray-100 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.06)]
        cursor-pointer
        hover:shadow-lg hover:scale-[1.01] transition-all duration-300
        w-full max-w-[530px]
      "
    >
      {/* === MOBILE & TABLET LAYOUT (< xl) === */}
      <div className="flex flex-col p-4 w-full xl:hidden gap-3">
        {/* Cover Image */}
        <div className="w-full h-[220px] rounded-[12px] overflow-hidden">
          <img
            src={imageUrl || mockImage}
            alt={translatedTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* Category badge + Bookmark row */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-serif font-bold text-[12px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3 py-1 whitespace-nowrap">
            {translatedCategory}
          </span>
          <button
            type="button"
            onClick={handleBookmarkToggle}
            aria-label="Bookmark article"
            className="w-8 h-8 rounded-[8px] bg-[#F8C135] flex items-center justify-center shrink-0 cursor-pointer border-none text-white hover:bg-[#DE5D8F] transition-colors"
          >
            <Bookmark
              size={16}
              fill={isBookmarked ? '#fff' : 'none'}
              stroke="#fff"
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[18px] font-bold leading-[24px] text-black line-clamp-2 break-words">
          {translatedTitle}
        </h3>

        {/* Author / Date */}
        <div className="flex flex-col gap-0.5 pt-1 border-t border-gray-200/60">
          <span className="font-serif text-[13px] font-bold text-[#6D6D6D] truncate">
            {t('written_by', { author: translatedAuthor })}
          </span>
          <span className="font-serif text-[12px] font-bold text-[#99999A]">
            {t('published', { date })}
          </span>
        </div>
      </div>

      {/* === DESKTOP LAYOUT (>= xl) === */}
      <div className="hidden xl:flex flex-row p-[22px] gap-[24px] h-[356px] w-full items-stretch">
        {/* Image left panel */}
        <div className="w-[248px] h-[312px] rounded-[12px] overflow-hidden shrink-0">
          <img
            src={imageUrl || mockImage}
            alt={translatedTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          {/* Top row: Category badge + Bookmark */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-serif font-bold text-[12px] leading-[18px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3 py-1.5 whitespace-nowrap">
              {translatedCategory}
            </span>
            <button
              type="button"
              onClick={handleBookmarkToggle}
              aria-label="Bookmark article"
              className="w-9 h-9 rounded-[8px] bg-[#F8C135] flex items-center justify-center shrink-0 cursor-pointer border-none text-white hover:bg-[#DE5D8F] transition-colors"
            >
              <Bookmark
                size={18}
                fill={isBookmarked ? '#fff' : 'none'}
                stroke="#fff"
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-serif text-[20px] font-bold leading-[28px] text-black line-clamp-3 break-words my-auto">
            {translatedTitle}
          </h3>

          {/* Author and Date in subtle container */}
          <div className="bg-white/70 rounded-[8px] p-2.5 flex flex-col gap-1 border border-gray-100">
            <span className="font-serif text-[14px] text-[#6D6D6D] font-bold leading-[20px] truncate">
              {t('written_by', { author: translatedAuthor })}
            </span>
            <span className="font-serif text-[13px] text-[#99999A] font-bold leading-[18px] truncate">
              {t('published', { date })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
