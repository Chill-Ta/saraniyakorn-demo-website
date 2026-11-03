import { useTranslation } from 'react-i18next';
import type { Professor } from '../types.js';

interface ProfessorDetailPanelProps {
  professor: Professor;
  onBack: () => void;
}

export function ProfessorDetailPanel({ professor, onBack }: ProfessorDetailPanelProps) {
  const { t } = useTranslation('student_services');

  return (
    <div
      className="bg-white border border-[#D0D0D1] rounded-xl flex flex-col overflow-y-auto w-full min-w-0"
      style={{ gap: '10px' }}
    >
      {/* Back button header */}
      <div
        className="flex items-center border-b border-[#BBBBBB] shrink-0 px-4 sm:px-8 py-4 sm:py-6 min-h-[64px] sm:min-h-[100px]"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center border-none bg-transparent cursor-pointer"
          aria-label={t('professors.back')}
          style={{ width: '48px', height: '48px' }}
        >
          <svg
            width="12"
            height="24"
            viewBox="0 0 12 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 20L2 12L10 4"
              stroke="#DE5D8F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Content area */}
      <div className="flex flex-col px-4 sm:px-8 pb-8 min-w-0" style={{ gap: '10px' }}>
        {/* Photo + name */}
        <div
          className="flex items-center flex-col sm:flex-row gap-4 sm:gap-8 lg:gap-[94px] pt-4"
        >
          <div
            className="rounded-full shrink-0 bg-[#D9D9D9] w-28 h-28 sm:w-36 sm:h-36 lg:w-[192px] lg:h-[192px]"
          />
          <span
            className="font-[ChulaCharasNew] text-[#DE5D8F] break-words text-2xl sm:text-3xl lg:text-[32px] font-bold text-center sm:text-left max-w-full"
          >
            {t(professor.nameKey)}
          </span>
        </div>

        {/* Info table rows */}
        <div className="flex flex-col mt-4 min-w-0" style={{ gap: '16px' }}>
          <InfoRow label={t('professors.abbreviation_label')} value={t(professor.abbreviationKey)} />
          <InfoRow label={t('professors.department_agency_label')} value={t(professor.departmentKey)} />
          <InfoRow label={t('professors.location_label')} value={t(professor.locationKey)} />
        </div>

        {/* Achievements section */}
        <InfoSection
          title={t('professors.achievements_label')}
          items={professor.achievementsKeys}
        />

        {/* Qualifications section */}
        <InfoSection title={t('professors.qualifications_label')} items={professor.qualificationsKeys} />

        {/* Courses section */}
        <InfoSection title={t('professors.courses_label')} items={professor.coursesKeys} />
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-6 lg:gap-[35px] min-h-[36px]">
      <div className="flex items-center justify-start sm:justify-center shrink-0 min-w-0 sm:min-w-[189px]">
        <span
          className="font-[ChulaCharasNew] text-[#DE5D8F] font-bold break-words text-lg sm:text-xl lg:text-[24px]"
        >
          {label}
        </span>
      </div>
      <div className="flex items-center flex-1 min-w-0">
        <span
          className="font-[ChulaCharasNew] text-[#000000] break-words text-base sm:text-lg lg:text-[20px] font-normal"
        >
          {value}
        </span>
      </div>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  items: string[];
}

function InfoSection({ title, items }: InfoSectionProps) {
  const { t } = useTranslation('student_services');

  return (
    <div className="flex flex-col min-w-0" style={{ gap: '12px', marginTop: '10px' }}>
      <div className="flex items-center" style={{ minHeight: '30px' }}>
        <span
          className="font-[ChulaCharasNew] text-[#E57DA5] break-words text-lg sm:text-xl lg:text-[24px] font-bold"
        >
          {title}
        </span>
      </div>
      <div className="flex flex-col min-w-0" style={{ gap: '6px' }}>
        {items.map((itemKey, index) => (
          <div key={index} className="flex items-start" style={{ minHeight: '28px' }}>
            <span
              className="font-[ChulaCharasNew] text-[#000000] break-words text-base sm:text-lg lg:text-[20px] font-normal"
            >
              {t(itemKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
