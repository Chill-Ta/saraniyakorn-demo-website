import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Bookmark, ExternalLink, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@artsgoz/design-system';
import {
  getArticleDetail,
  fetchArticleDetail,
  recordArticleView,
  ARTICLES_SUMMARY,
  ArticleBannerMock,
  saveMockArticleToSession,
} from '../constants.js';
import { ArticleCard } from './ArticleCard.js';

export function ArticleDetailSection() {
  const { t } = useTranslation('articles');
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [remoteArticle, setRemoteArticle] = useState<any>(null);

  useEffect(() => {
    const targetId = id || 'art-001';
    recordArticleView(targetId);
    fetchArticleDetail(targetId).then((data) => {
      if (data) {
        setRemoteArticle(data);
      }
    });
  }, [id]);

  const baseArticle = useMemo(() => {
    // If mock data is passed in URL query param from backoffice, ingest and return
    const mockDataStr = searchParams.get('mock');
    if (mockDataStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(mockDataStr));
        if (parsed && parsed.id) {
          saveMockArticleToSession(parsed);
          return {
            ...parsed,
            imageUrl: parsed.imageUrl || parsed.coverImage || ArticleBannerMock,
            href: `/articles/${parsed.id}`,
          };
        }
      } catch (err) {
        console.warn('Failed to parse mock article from URL', err);
      }
    }
    return (id ? getArticleDetail(id) : undefined) || getArticleDetail('art-001');
  }, [id, searchParams]);

  const article = remoteArticle || baseArticle;

  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      if (saved && article?.id) {
        const ids = JSON.parse(saved) as string[];
        return ids.includes(article.id);
      }
    } catch (e) {
      console.error('Failed to parse bookmarked_articles', e);
    }
    return false;
  });

  const [readMorePage, setReadMorePage] = useState(1);

  // Other articles for "อ่านต่อ" (prefer articles from the same year)
  const otherArticles = useMemo(() => {
    if (!article) return [];
    const sameYear = ARTICLES_SUMMARY.filter(
      (a) => a.id !== article.id && a.year === article.year
    );
    const diffYear = ARTICLES_SUMMARY.filter(
      (a) => a.id !== article.id && a.year !== article.year
    );
    return [...sameYear, ...diffYear];
  }, [article]);

  const READ_MORE_PER_PAGE = 4;
  const totalReadMorePages = Math.ceil(otherArticles.length / READ_MORE_PER_PAGE);
  const currentReadMoreArticles = otherArticles.slice(
    (readMorePage - 1) * READ_MORE_PER_PAGE,
    readMorePage * READ_MORE_PER_PAGE
  );

  const handleBookmarkToggle = () => {
    if (!article) return;
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

  if (!article) {
    return null;
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-8 md:py-14 flex flex-col gap-10">

        {/* Back navigation */}
        <button
          onClick={() => navigate('/articles')}
          className="group flex items-center gap-2 text-[#DE5D8F] hover:text-[#CA5582] font-serif font-bold text-[16px] transition-colors cursor-pointer w-fit border-none bg-transparent"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('detail.back_to_articles', { defaultValue: 'กลับไปหน้ารวมบทความ' })}</span>
        </button>

        {/* ── Top Hero Poster ── */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[360px] sm:max-w-[440px] md:max-w-[500px] aspect-square rounded-[20px] overflow-hidden shadow-md border border-gray-100 bg-gray-50">
            <img
              src={article.imageUrl || ArticleBannerMock}
              alt={article.title}
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = ArticleBannerMock;
              }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── Article Header & Meta ── */}
        <div className="flex flex-col gap-3 w-full border-b border-gray-100 pb-6">
          {/* Title Row with Bookmark Button */}
          <div className="flex items-start justify-between gap-4 w-full">
            <h1 className="font-serif text-[26px] sm:text-[32px] md:text-[38px] font-bold leading-tight text-[#2B2B2B] flex-1 break-words">
              {article.title}
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

          {/* Badges: Category & Read Time */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-sans font-normal text-[13px] sm:text-[14px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3.5 py-1.5 w-fit" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
              {article.year}
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1.5 font-serif text-[13px] font-bold text-gray-500 bg-gray-100 rounded-[11px] px-3 py-1.5">
                <Clock size={14} className="text-gray-400" />
                ใช้เวลาอ่านประมาณ {article.readTime}
              </span>
            )}
          </div>

          {/* Author and Published Info */}
          <div className="text-[14px] sm:text-[15px] font-serif font-bold text-[#6D6D6D] flex flex-wrap items-center gap-2 pt-1">
            <span>{t('written_by', { author: article.author })}</span>
            {article.proofreader && (
              <>
                <span>•</span>
                <span>พิสูจน์อักษร: {article.proofreader}</span>
              </>
            )}
            {article.illustrator && (
              <>
                <span>•</span>
                <span>ภาพประกอบ: {article.illustrator}</span>
              </>
            )}
            <span>|</span>
            <span className="text-[#99999A]">สาราณียกร ฉบับปี {article.year}</span>
          </div>
        </div>

        {/* ── Article Body Text ── */}
        <article className="flex flex-col gap-6 w-full text-[16px] md:text-[18px] leading-[32px] text-[#2B2B2B] font-serif">
          {article.contentHtml ? (
            <div
              className="tiptap-content flex flex-col gap-4 font-serif"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          ) : article.content && article.content.length > 0 ? (
            article.content.map((paragraph: string, index: number) => (
              <p key={index} className="indent-8 text-justify break-words">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="indent-8 text-justify break-words">
              {article.excerpt}
            </p>
          )}
        </article>

        {/* ── Link to Original Article on Aksornsara.com ── */}
        {article.url && (
          <div className="flex items-center justify-end w-full pt-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-serif font-bold text-[#DE5D8F] hover:text-[#CA5582] hover:underline transition-colors"
            >
              <span>อ่านบทความต้นฉบับบน Aksornsara.com</span>
              <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        )}

        {/* ── References Section ("รายการอ้างอิง") ── */}
        {article.references && article.references.length > 0 && (
          <div className="flex flex-col gap-4 w-full pt-6 border-t border-gray-200">
            <h2 className="font-serif font-bold text-[22px] sm:text-[26px] md:text-[28px] text-black">
              {t('detail.references', { defaultValue: 'รายการอ้างอิง' })}
            </h2>
            <div className="flex flex-col gap-2.5 font-serif text-[14px] sm:text-[15px] leading-[26px] text-[#4A4A4A] pl-4 border-l-2 border-[#DE5D8F]/30">
              {article.references.map((ref: string, idx: number) => (
                <p key={idx} className="break-words">
                  {ref}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── "อ่านต่อ" (Read More) Section ── */}
        <div className="flex flex-col gap-6 w-full pt-8 border-t border-gray-200">
          <h2 className="font-serif font-bold text-[22px] sm:text-[26px] md:text-[28px] text-black">
            {t('detail.read_more', { defaultValue: 'อ่านต่อบทความอื่น ๆ' })}
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
