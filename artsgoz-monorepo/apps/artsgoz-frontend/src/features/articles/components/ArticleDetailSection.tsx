import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@artsgoz/design-system';
import { MOCK_ARTICLES } from '../constants.js';
import { ArticleCard } from './ArticleCard.js';
import defaultPoster from '../../../assets/ArticleBannerMock.jpg';

export function ArticleDetailSection() {
  const { t } = useTranslation('articles');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      if (saved && id) {
        const ids = JSON.parse(saved) as string[];
        return ids.includes(id);
      }
    } catch (e) {
      console.error('Failed to parse bookmarked_articles', e);
    }
    return false;
  });

  const [readMorePage, setReadMorePage] = useState(1);

  const article = MOCK_ARTICLES.find((a) => a.id === id) || MOCK_ARTICLES[0];
  const otherArticles = MOCK_ARTICLES.filter((a) => a.id !== article.id);

  // Pagination for "อ่านต่อ" (4 cards per page)
  const READ_MORE_PER_PAGE = 4;
  const totalReadMorePages = Math.ceil(otherArticles.length / READ_MORE_PER_PAGE);
  const currentReadMoreArticles = otherArticles.slice(
    (readMorePage - 1) * READ_MORE_PER_PAGE,
    readMorePage * READ_MORE_PER_PAGE
  );

  const handleBookmarkToggle = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      let ids: string[] = [];
      if (saved) {
        ids = JSON.parse(saved) as string[];
      }
      if (nextState) {
        if (!ids.includes(article.id)) ids.push(article.id);
      } else {
        ids = ids.filter((bid) => bid !== article.id);
      }
      localStorage.setItem('bookmarked_articles', JSON.stringify(ids));
    } catch (err) {
      console.error('Failed to update bookmarked_articles', err);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-8 md:py-14 flex flex-col gap-10">

        {/* Back navigation */}
        <button
          onClick={() => navigate('/articles')}
          className="group flex items-center gap-2 text-[#DE5D8F] hover:text-[#CA5582] font-serif font-bold text-[16px] transition-colors cursor-pointer w-fit border-none bg-transparent"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('detail.back_to_articles', { defaultValue: 'กลับไปหน้าบทความ' })}</span>
        </button>

        {/* ── Top Hero Poster (Figma: Centered vertical poster) ── */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] aspect-[3/4] rounded-[16px] overflow-hidden shadow-lg border border-gray-100">
            <img
              src={article.imageUrl || defaultPoster}
              alt={t(article.title)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── Article Header & Meta ── */}
        <div className="flex flex-col gap-3 w-full border-b border-gray-100 pb-6">
          {/* Title Row with Bookmark Button */}
          <div className="flex items-start justify-between gap-4 w-full">
            <h1 className="font-serif text-[28px] sm:text-[34px] md:text-[38px] font-bold leading-tight text-black flex-1 break-words">
              {t(article.title)}
            </h1>

            <button
              type="button"
              onClick={handleBookmarkToggle}
              aria-label="Bookmark article"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[8px] bg-[#F8C135] text-white flex items-center justify-center shrink-0 cursor-pointer border-none hover:bg-[#DE5D8F] transition-colors shadow-xs"
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? '#fff' : 'none'}
                stroke="#fff"
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Category Chip */}
          <span className="font-serif font-bold text-[13px] sm:text-[14px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3.5 py-1.5 w-fit">
            {t(article.category)}
          </span>

          {/* Author and Published Date */}
          <div className="text-[14px] sm:text-[15px] font-serif font-bold text-[#6D6D6D] flex flex-wrap items-center gap-2 pt-1">
            <span>{t('written_by', { author: t(article.author) })}</span>
            <span>|</span>
            <span className="text-[#99999A]">{t('published', { date: article.date })}</span>
          </div>
        </div>

        {/* ── Article Body Text ── */}
        <article className="flex flex-col gap-6 w-full text-[16px] md:text-[18px] leading-[30px] text-[#2B2B2B] font-serif">
          {article.content && article.content.length > 0 ? (
            article.content.map((paragraph, index) => (
              <p key={index} className="indent-8 text-justify break-words">
                {t(paragraph)}
              </p>
            ))
          ) : (
            <p className="indent-8 text-justify break-words">
              {t(article.excerpt)}
            </p>
          )}
        </article>

        {/* ── References Section ("รายการอ้างอิง") ── */}
        <div className="flex flex-col gap-4 w-full pt-6 border-t border-gray-200">
          <h2 className="font-serif font-bold text-[22px] sm:text-[26px] md:text-[28px] text-black">
            {t('detail.references', { defaultValue: 'รายการอ้างอิง' })}
          </h2>
          <div className="flex flex-col gap-2 font-serif text-[14px] sm:text-[15px] leading-[26px] text-[#4A4A4A]">
            <p>1. คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย. (2567). <em>วารสารอักษรศาสตร์บูรณาการ</em>. กรุงเทพฯ: สำนักพิมพ์จุฬาลงกรณ์มหาวิทยาลัย.</p>
            <p>2. ชมรมสาราณียกร คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย. (2569). <em>สาราณียกรนิเทศ ฉบับพิเศษ: เหมียวครองโลกและศิลปะแห่งชีวิต</em>. กรุงเทพฯ: ชมรมสาราณียกร.</p>
          </div>
        </div>

        {/* ── "อ่านต่อ" (Read More) Section ── */}
        <div className="flex flex-col gap-6 w-full pt-8 border-t border-gray-200">
          <h2 className="font-serif font-bold text-[22px] sm:text-[26px] md:text-[28px] text-black">
            {t('detail.read_more', { defaultValue: 'อ่านต่อ' })}
          </h2>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {currentReadMoreArticles.map((a) => (
              <ArticleCard
                key={a.id}
                id={a.id}
                title={a.title}
                author={a.author}
                date={a.date}
                category={a.category}
                imageUrl={a.imageUrl}
                compact={true}
              />
            ))}
          </div>

          {/* Pagination for "อ่านต่อ" */}
          {totalReadMorePages > 1 && (
            <div className="flex justify-center items-center w-full mt-4">
              <Pagination
                currentPage={readMorePage}
                totalPages={totalReadMorePages}
                onPageChange={(page) => setReadMorePage(page)}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
