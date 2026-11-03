import { useTranslation } from 'react-i18next';

export function YellowCardTitleHeader() {
  const { t } = useTranslation('yellow_card');

  return (
    <div className="mb-8 text-center min-w-0 w-full">
      <h1 className="text-black text-[26px] md:text-[30px] font-bold leading-normal max-w-[800px] mx-auto font-[ChulaCharasNew] break-words">
        {t('title')}
      </h1>
    </div>
  );
}
