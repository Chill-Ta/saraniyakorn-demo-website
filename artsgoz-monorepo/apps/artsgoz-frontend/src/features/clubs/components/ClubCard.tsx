import { useTranslation } from 'react-i18next';
import { Club } from '../types.js';

interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  const { t } = useTranslation('clubs');
  const isLink = !!club.instagram;
  const cardClassName =
    'flex flex-col items-start w-[268px] h-[370px] pt-[230px] px-[12px] pb-[16px] gap-[10px] shrink-0 rounded-[16px] bg-[#ECECEC] bg-cover bg-no-repeat bg-center relative overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer';

  const content = (
    <div className="flex flex-col items-start w-[244px] h-[124px] p-[16px] gap-[6px] shrink-0 rounded-[8px] bg-[var(--color-background-subtler,#F7F8F9)] z-10 shadow-sm min-w-0">
      <h3 className="text-black font-serif text-[18px] font-bold leading-[24px] line-clamp-1 w-full truncate">
        {t(club.nameKey)}
      </h3>
      <p className="text-[var(--color-text-subtle,#6D6D6D)] font-serif text-[13px] font-normal leading-[18px] line-clamp-3 overflow-hidden break-words w-full">
        {t(club.descriptionKey)}
      </p>
    </div>
  );

  if (isLink) {
    return (
      <a
        href={`https://instagram.com/${club.instagram}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
        style={{ backgroundImage: `url(${club.imageUrl})` }}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={cardClassName}
      style={{ backgroundImage: `url(${club.imageUrl})` }}
    >
      {content}
    </div>
  );
}
