import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SectionHeading, Pagination, Button } from '@artsgoz/design-system';
import { ClubCard } from './ClubCard.js';
import { MOCK_CLUBS } from '../constants.js';
import { PATHS } from '../../../routes/paths.js';

const ITEMS_PER_PAGE = 4;

export function ClubsSection() {
  const { t } = useTranslation('clubs');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(MOCK_CLUBS.length / ITEMS_PER_PAGE);
  const currentClubs = MOCK_CLUBS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );



  return (
    <section className="w-full flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
        <SectionHeading title={t('section_title')} description={t('section_desc')} />
        <Link to={PATHS.CLUBS} className="shrink-0">
          <Button variant="outline">{t('view_all')}</Button>
        </Link>
      </div>
      
      {/* Mobile & Tablet (< xl): horizontal scroll row */}
      <div className="
        xl:hidden
        flex flex-row gap-4
        overflow-x-auto snap-x snap-mandatory
        pb-3
        w-full
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      ">
        {MOCK_CLUBS.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>

      {/* Desktop (>= xl): paginated wrap grid */}
      <div className="hidden xl:flex flex-row flex-wrap justify-center gap-6 w-full">
        {currentClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>

      <div className="hidden xl:flex relative items-center justify-center w-full">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
