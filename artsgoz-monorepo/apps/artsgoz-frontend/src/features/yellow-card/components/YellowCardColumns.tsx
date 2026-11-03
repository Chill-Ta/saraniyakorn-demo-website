import { useTranslation } from 'react-i18next';
import type { YellowCardSubject } from '../types.js';
import { CATEGORIES_CONFIG } from '../constants.js';
import { CurriculumTable } from './CurriculumTable.js';
import { calculateTotalCredits } from '../utils/yellowCardUtils.js';

interface YellowCardColumnsProps {
  subjects: YellowCardSubject[];
  major: string;
  readOnly?: boolean;
  onUpdateSubject?: (updatedSubject: YellowCardSubject) => void;
  onAddSubject?: (groupName: string) => void;
  onDeleteSubject?: (id: string) => void;
}

export function YellowCardColumns({
  subjects,
  major,
  readOnly = false,
  onUpdateSubject,
  onAddSubject,
  onDeleteSubject,
}: YellowCardColumnsProps) {
  const { t } = useTranslation('yellow_card');
  const displayMajor = major && major !== 'เลือกวิชาเอก' && major !== 'credit_tracking.profile.select_major' 
    ? t(major) 
    : t('credit_tracking.majors.default');

  const rightColumnCredits = calculateTotalCredits(subjects, ['credit_tracking.categories.major', 'credit_tracking.categories.minor']);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8 min-w-0 w-full">
      {/* Left Column */}
      <div className="flex flex-col gap-6 min-w-0">
        <div className="w-full h-[60px] bg-[#E992B4] rounded-[8px] px-5 flex items-center shadow-xs min-w-0">
          <span className="text-black text-[18px] font-bold truncate">{t('credit_tracking.curriculum.title')}</span>
        </div>

        {/* Left Column Categories */}
        {CATEGORIES_CONFIG.filter((cat) =>
          ['credit_tracking.categories.basic', 'credit_tracking.categories.general', 'credit_tracking.categories.free'].includes(
            cat.category
          )
        ).map((catConfig, idx) => (
          <CurriculumTable
            key={`${catConfig.category}-${idx}`}
            category={catConfig.category}
            requiredCredits={catConfig.requiredCredits}
            groups={catConfig.groups}
            subjects={subjects}
            readOnly={readOnly}
            onUpdateSubject={onUpdateSubject}
            onAddSubject={onAddSubject}
            onDeleteSubject={onDeleteSubject}
          />
        ))}
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6 min-w-0">
        <div className="w-full h-[60px] bg-[#E992B4] rounded-[8px] px-5 flex items-center justify-between shadow-xs min-w-0 gap-4">
          <span className="text-black text-[18px] font-bold truncate">
            {t('credit_tracking.profile.major_label')}: {displayMajor}
          </span>
          <span className="text-black text-[16px] font-bold shrink-0">
            {t('credit_tracking.planner.total_credits', { credits: rightColumnCredits })}
          </span>
        </div>

        {/* Right Column Categories */}
        {CATEGORIES_CONFIG.filter((cat) =>
          ['credit_tracking.categories.major', 'credit_tracking.categories.minor'].includes(cat.category)
        ).map((catConfig, idx) => (
          <CurriculumTable
            key={`${catConfig.category}-${idx}`}
            category={catConfig.category}
            requiredCredits={catConfig.requiredCredits}
            groups={catConfig.groups}
            subjects={subjects}
            readOnly={readOnly}
            onUpdateSubject={onUpdateSubject}
            onAddSubject={onAddSubject}
            onDeleteSubject={onDeleteSubject}
          />
        ))}
      </div>
    </div>
  );
}
