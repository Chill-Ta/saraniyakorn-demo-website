import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@artsgoz/design-system';
import { ClubSelector, ClubDetail } from '../../../features/clubs/index.js';
import { Footer } from '../../../components/Footer/index.js';

export default function ClubsPage() {
  const { t } = useTranslation('clubs');
  const [searchParams] = useSearchParams();
  const activeClubId = searchParams.get('id') || 'club-04';

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full py-12 md:py-16 flex flex-col gap-10">
          {/* Page Title */}
          <SectionHeading
            title={t('page_title')}
            description={t('page_desc')}
          />

          {/* Club Selector Badge Bar */}
          <ClubSelector />

          <hr className="border-gray-100 w-full" />

          {/* Club Detail Panel */}
          <ClubDetail clubId={activeClubId} />
        </div>
      </div>
      <Footer />
    </>
  );
}
