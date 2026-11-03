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

  const translatedTitle = title.startsWith('mock.') ? t(title) : title;
  const translatedAuthor = author.startsWith('mock.') ? t(author) : author;
  const translatedCategory = category.startsWith('categories.')
    ? t(category)
    : category;

  // Compact variant for "อ่านต่อ" (Read More) 4-column row
  if (compact) {
    return (
      <div
        onClick={() => navigate(`/articles/${id}`)}
        className="
          snap-start shrink-0 relative overflow-hidden
          bg-[#F7F8F9] rounded-[16px]
          shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.05),0px_4px_6px_-1px_rgba(0,0,0,0.1)]
          cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300
          w-full flex flex-col p-3.5 gap-3
        "
      >
        <div className="w-full h-[180px] sm:h-[200px] rounded-[12px] overflow-hidden bg-gray-100">
          <img
            src={imageUrl || mockImage}
            alt={translatedTitle}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = mockImage;
            }}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-sans font-normal text-[11px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-2.5 py-1 whitespace-nowrap truncate" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
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
        shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.05),0px_4px_6px_-1px_rgba(0,0,0,0.1)]
        cursor-pointer
        hover:shadow-lg hover:scale-[1.01] transition-all duration-300
        w-full max-w-[512px]
      "
    >
      {/* === MOBILE & TABLET LAYOUT (< xl) === */}
      <div className="flex flex-col p-4 w-full xl:hidden gap-3">
        {/* Cover Image */}
        <div className="w-full h-[220px] rounded-[12px] overflow-hidden bg-gray-100">
          <img
            src={imageUrl || mockImage}
            alt={translatedTitle}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = mockImage;
            }}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* Category badge + Bookmark row */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans font-normal text-[12px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3.5 py-1.5 whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
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
        <h3 className="font-serif text-[18px] font-bold leading-[24px] text-black line-clamp-2 break-words">
          {translatedTitle}
        </h3>

        {/* Author / Date */}
        <div className="flex flex-col gap-0.5 pt-1">
          <span className="font-serif text-[13px] font-bold text-[#6D6D6D] truncate">
            {t('written_by', { author: translatedAuthor })}
          </span>
          <span className="font-serif text-[12px] font-bold text-[#99999A]">
            {t('published', { date })}
          </span>
        </div>
      </div>

      {/* === DESKTOP LAYOUT (>= xl) - Figma Spec blog banner (new) === */}
      <div className="hidden xl:block relative h-[356px] w-[512px]">
        {/* IMG_8324 1 (left: 32px, top: 22px, width: 248px, height: 312px) */}
        <div className="absolute left-[32px] top-[22px] w-[248px] h-[312px] rounded-[12px] overflow-hidden bg-gray-100">
          <img
            src={imageUrl || mockImage}
            alt={translatedTitle}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = mockImage;
            }}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* Frame 6160: Category banner + Bookmark button (right: 22px, top: 22px, height: 40px, gap: 8px) */}
        <div className="absolute right-[22px] top-[22px] h-[40px] flex items-center gap-[8px]">
          {/* System banner */}
          <span className="h-[40px] px-5 bg-[#FCEFF4] text-[#DE5D8F] rounded-[11px] font-sans font-normal text-[14px] flex items-center justify-center whitespace-nowrap" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
            {translatedCategory}
          </span>
          {/* icon button */}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            aria-label="Bookmark article"
            className="w-[40px] h-[40px] rounded-[8px] bg-[#F8C135] flex items-center justify-center shrink-0 cursor-pointer border-none text-white hover:bg-[#DE5D8F] transition-colors"
          >
            <Bookmark
              size={20}
              fill={isBookmarked ? '#fff' : 'none'}
              stroke="#fff"
              strokeWidth={2}
            />
          </button>
        </div>

        {/* text container (left: 304px, top: 107px, width: 194px, gap: 17px) */}
        <div className="absolute left-[304px] top-[107px] w-[194px] flex flex-col gap-[17px]">
          {/* Title */}
          <h3 className="font-serif text-[20px] font-bold leading-[28px] text-black line-clamp-3 break-words m-0">
            {translatedTitle}
          </h3>

          {/* author / date */}
          <div className="flex flex-col justify-center items-start py-1 gap-1 rounded-[8px] bg-[rgba(255,255,255,0.26)]">
            <span className="font-serif text-[14px] font-bold leading-[20px] text-[#6D6D6D] truncate w-full">
              {t('written_by', { author: translatedAuthor })}
            </span>
            <span className="font-serif text-[14px] font-bold leading-[20px] text-[#99999A] truncate w-full">
              {t('published', { date })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
