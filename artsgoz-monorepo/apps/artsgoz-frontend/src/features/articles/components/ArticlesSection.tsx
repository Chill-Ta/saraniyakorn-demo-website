import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SectionHeading, Pagination, Button } from '@artsgoz/design-system';
import { ArticleCard } from './ArticleCard.js';
import { MOCK_ARTICLES } from '../constants.js';
import { PATHS } from '../../../routes/paths.js';

const ITEMS_PER_PAGE = 2;

export function ArticlesSection() {
  const { t } = useTranslation('articles');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(MOCK_ARTICLES.length / ITEMS_PER_PAGE);

  const paginatedArticles = MOCK_ARTICLES.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="w-full flex flex-col gap-8 lg:gap-10 relative select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
        <SectionHeading title={t('section_title')} description={t('section_desc')} />
        <Link to={PATHS.ARTICLES} className="shrink-0">
          <Button variant="outline">{t('view_all')}</Button>
        </Link>
      </div>

      {/* Mobile & Tablet (< xl / < 1244px): Horizontal Scroll Carousel */}
      <div className="
        xl:hidden
        flex flex-row gap-4 sm:gap-6
        overflow-x-auto snap-x snap-mandatory
        pb-3 w-full
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      ">
        {MOCK_ARTICLES.map((article) => (
          <div key={article.id} className="w-[300px] sm:w-[380px] shrink-0 snap-start">
            <ArticleCard
              id={article.id}
              title={article.title}
              author={article.author}
              date={article.date}
              category={article.category}
              imageUrl={article.imageUrl}
            />
          </div>
        ))}
      </div>

      {/* Desktop (>= xl / >= 1244px): 2-Card Row Layout with pagination */}
      <div className="hidden xl:flex flex-row items-center justify-center gap-8 w-full max-w-[1120px] mx-auto">
        {paginatedArticles.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            author={article.author}
            date={article.date}
            category={article.category}
            imageUrl={article.imageUrl}
          />
        ))}
      </div>

      {/* Pagination for Desktop */}
      {totalPages > 1 && (
        <div className="hidden xl:flex relative items-center justify-center w-full pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
}
