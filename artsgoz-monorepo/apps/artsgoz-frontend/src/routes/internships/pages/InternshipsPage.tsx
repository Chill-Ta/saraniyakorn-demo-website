import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@artsgoz/design-system';

export default function InternshipsPage() {
  const { t } = useTranslation('internships');

  return (
    <div className="max-w-[1282px] mx-auto px-4 lg:px-6 w-full py-16">
      <SectionHeading 
        title={t('quick_access.menus.internship_review_title')} 
        description={t('quick_access.menus.internship_review_desc')} 
      />
    </div>
  );
}
