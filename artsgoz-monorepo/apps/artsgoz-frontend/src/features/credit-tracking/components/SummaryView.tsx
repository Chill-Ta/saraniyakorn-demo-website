import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import type { Subject, SubjectCategory, AcademicProfile } from '../types.js';
import { SystemBanner } from '../../../components/SystemBanner/index.js';

interface SummaryViewProps {
  subjects: Subject[];
  profile: AcademicProfile;
  lastSavedTime: string;
}

export function SummaryView({ subjects, profile, lastSavedTime }: SummaryViewProps) {
  const { t } = useTranslation('credit_tracking');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const translateKey = (key: string): string => {
    if (!key) return '';
    const cleanKey = key.replace(/^credit_tracking\./, '');
    return t(cleanKey);
  };

  // Requirements configuration using i18n keys
  const categories: { category: SubjectCategory; required: number }[] = [
    { category: 'categories.basic', required: 27 },
    { category: 'categories.general', required: 30 },
    { category: 'categories.free', required: 6 },
    { category: 'categories.major', required: 48 },
    { category: 'categories.minor', required: 18 },
  ];

  const handleSaveImage = () => {
    setSuccessBanner(t('summary.save_image_success'));
    setTimeout(() => setSuccessBanner(null), 4000);

    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full font-[ChulaCharasNew] pb-20 text-black animate-fade-in min-w-0">
      {/* Success Notification */}
      {successBanner && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 shadow-lg animate-fade-in min-w-[320px] md:min-w-[480px]">
          <SystemBanner
            type="success"
            emphasis="subtle"
            message={successBanner}
          />
        </div>
      )}

      {/* Top Header Row with Save Image button */}
      <div className="w-full flex items-center justify-between border-b border-[#D0D0D1]/30 pb-6 mb-8 print:hidden gap-4 flex-wrap md:flex-nowrap min-w-0">
        <div className="min-w-0">
          <h3 className="text-black text-[28px] font-bold truncate">{t('summary.title')}</h3>
          <p className="text-[#6D6D6D] text-[18px] break-words">
            {lastSavedTime ? t('summary.saved_time_label', { time: lastSavedTime }) : t('summary.unsaved_label')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveImage}
          className="flex items-center justify-center bg-[#64A93C] hover:bg-[#528f2e] text-white rounded-[8px] h-[52px] px-6 gap-2 text-[16px] font-bold shadow-md cursor-pointer transition-all shrink-0 border-none"
        >
          <span>{t('summary.save_image_btn')}</span>
          <Download size={20} />
        </button>
      </div>

      {/* Main Print Wrapper Container */}
      <div className="w-full flex flex-col gap-10 max-w-[1061px] mx-auto bg-white print:p-0 min-w-0">
        {/* Main Header Card */}
        <div className="w-full h-[60px] bg-[#E992B4] rounded-[8px] px-5 flex items-end justify-between pb-3 min-w-0 gap-4">
          <span className="text-black text-[18px] font-bold truncate">{t('curriculum.title')}</span>
          <span className="text-black text-[16px] font-bold truncate">
            {t('profile.major_label')}: {profile.major && profile.major !== 'profile.select_major' && profile.major !== 'credit_tracking.profile.select_major' ? translateKey(profile.major) : t('majors.default')}
          </span>
        </div>

        {/* Categories Progress Panels */}
        <div className="flex flex-col gap-12 pl-0 min-w-0">
          {categories.map((catConfig) => {
            const catSubjects = subjects.filter(
              (s) => (s.category === catConfig.category || s.category === `credit_tracking.${catConfig.category}`) && s.completed
            );
            const completedCredits = catSubjects.reduce((sum, s) => sum + s.credits, 0);
            const isCompleted = completedCredits >= catConfig.required;
            const diffCredits = catConfig.required - completedCredits;

            return (
              <div key={catConfig.category} className="w-full flex flex-col gap-6 min-w-0">
                {/* Soft Pink Header */}
                <div className="w-full h-[60px] bg-[#F5CDDC] rounded-[8px] px-5 flex items-end justify-between pb-3 min-w-0 gap-4">
                  <span className="text-black text-[18px] font-bold truncate">{translateKey(catConfig.category)}</span>
                  <span className="text-black text-[18px] font-bold shrink-0">
                    {t('curriculum.credits_val', { count: catConfig.required })}
                  </span>
                </div>

                {/* Status Indicator Banners */}
                <div className="w-full min-w-0">
                  {isCompleted ? (
                    <SystemBanner
                      type="success"
                      emphasis="subtle"
                      message={t('summary.completed_credits')}
                    />
                  ) : (
                    <SystemBanner
                      type="warning"
                      emphasis="subtle"
                      message={t('summary.missing_credits', { count: diffCredits })}
                    />
                  )}
                </div>

                {/* Enrolled Subjects List */}
                <div className="flex flex-col gap-4 min-w-0">
                  <h4 className="text-black text-[20px] font-bold truncate">{t('summary.completed_courses_label')}</h4>

                  {catSubjects.length > 0 ? (
                    <div className="w-full flex flex-col gap-1 min-w-0 overflow-auto">
                      {/* Grid Header */}
                      <div className="grid grid-cols-[90px_1fr_60px] gap-x-6 items-center text-black font-bold text-[18px] pb-2.5 border-b border-[#D0D0D1]/30 min-w-[320px]">
                        <span className="text-left">{t('planner.col_code')}</span>
                        <span className="text-left">{t('planner.col_name')}</span>
                        <span className="text-right pr-2">{t('planner.col_credits')}</span>
                      </div>

                      {/* Subject Rows */}
                      <div className="flex flex-col gap-1 mt-2 min-w-[320px]">
                        {catSubjects.map((sub) => (
                          <div
                            key={sub.id}
                            className="grid grid-cols-[90px_1fr_60px] gap-x-6 items-start py-3.5 hover:bg-black/[0.01] rounded-[6px] text-[16px] border-b border-[#D0D0D1]/10"
                          >
                            <span className="font-mono text-black text-[16px] pt-0.5 shrink-0">
                              {sub.code}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className="text-black text-[16px] font-normal leading-snug break-words">
                                {sub.nameKey}
                              </span>
                            </div>
                            <span className="text-right font-mono text-black text-[16px] pt-0.5 pr-2 shrink-0">
                              {sub.credits}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#EA6D24] text-[16px] italic leading-normal break-words">
                      {t('summary.no_courses_in_category')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
