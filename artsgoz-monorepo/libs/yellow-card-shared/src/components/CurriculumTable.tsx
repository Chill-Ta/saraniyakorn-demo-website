import { useTranslation } from 'react-i18next';
import type { YellowCardSubject, YellowCardCategory } from '../types.js';
import { GradeReportInteractive } from './GradeReportInteractive.js';
import { GradeReportPaperAction } from './GradeReportPaperAction.js';
import { GradeReportPaperReadonly } from './GradeReportPaperReadonly.js';

interface CurriculumTableProps {
  category: YellowCardCategory;
  requiredCredits: number;
  groups: string[];
  subjects: YellowCardSubject[];
  readOnly?: boolean;
  onUpdateSubject?: (updatedSubject: YellowCardSubject) => void;
  onAddSubject?: (groupName: string) => void;
  onDeleteSubject?: (id: string) => void;
}

export function CurriculumTable({
  category,
  requiredCredits,
  groups,
  subjects,
  readOnly = false,
  onUpdateSubject,
  onAddSubject,
  onDeleteSubject,
}: CurriculumTableProps) {
  const { t } = useTranslation('yellow_card');

  const getCategoryCompletedCredits = () => {
    return subjects
      .filter((s) => s.category === category && s.grade && s.grade !== 'F' && s.grade !== 'U')
      .reduce((sum, s) => sum + (parseFloat(s.credits) || 0), 0);
  };

  const completedCredits = getCategoryCompletedCredits();

  return (
    <div className="w-full flex flex-col gap-6 select-none font-[ChulaCharasNew] mb-8 min-w-0">
      {/* Category Header Bar */}
      <div className="w-full h-[60px] bg-[#F5CDDC] rounded-[8px] px-5 flex items-end justify-between pb-3 min-w-0 gap-4">
        <span className="text-black text-[18px] font-bold truncate">{t(category)}</span>
        <span className="text-black text-[18px] font-bold shrink-0">
          {t('curriculum_table.completed_progress', { completed: completedCredits, required: requiredCredits })}
        </span>
      </div>

      {/* Description / Instructions under the category header bar (Interactive mode only) */}
      {!readOnly && category === 'credit_tracking.categories.basic' && (
        <div className="text-[16px] text-[#404041] flex flex-col gap-1.5 px-5 font-bold leading-relaxed mt-1">
          <p>{t('credit_tracking.planner.instructions.basic1')}</p>
          <p>{t('credit_tracking.planner.instructions.basic2')}</p>
        </div>
      )}

      {/* Table Headers Row aligned with sub-items columns */}
      {readOnly ? (
        <div className="grid grid-cols-[80px_1fr_100px_52px_52px] gap-4 items-center text-black font-bold text-[16px] px-4 mb-1 min-w-[320px]">
          <span className="text-left">{t('credit_tracking.planner.col_code')}</span>
          <span className="text-left">{t('credit_tracking.planner.col_name')}</span>
          <span className="text-center">{t('grade_report.term_year')}</span>
          <span className="text-center">{t('credit_tracking.planner.col_credits')}</span>
          <span className="text-center">{t('grade_report.grade')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-[20px_80px_1fr_100px_52px_52px_32px] gap-2 items-center text-black font-bold text-[16px] px-5 mb-1 min-w-[320px]">
          <span></span>
          <span className="text-left">{t('credit_tracking.planner.col_code')}</span>
          <span className="text-left">{t('credit_tracking.planner.col_name')}</span>
          <span className="text-center">{t('grade_report.term_year')}</span>
          <span className="text-center">{t('credit_tracking.planner.col_credits')}</span>
          <span className="text-center">{t('grade_report.grade')}</span>
          <span></span>
        </div>
      )}

      {/* Render each sub-group under this category using interactive accordions */}
      <div className="flex flex-col gap-4 min-w-0">
        {groups.map((groupName) => {
          const groupSubjects = subjects.filter((s) => s.group === groupName);

          return (
            <GradeReportInteractive
              key={groupName}
              topicName={t(groupName)}
              readOnly={readOnly}
              onAddSubject={onAddSubject ? () => onAddSubject(groupName) : undefined}
            >
              {groupSubjects.map((subject) =>
                readOnly ? (
                  <GradeReportPaperReadonly key={subject.id} subject={subject} />
                ) : (
                  <GradeReportPaperAction
                    key={subject.id}
                    subject={subject}
                    onUpdate={onUpdateSubject!}
                    onDelete={() => onDeleteSubject!(subject.id)}
                  />
                )
              )}

              {groupSubjects.length === 0 && (
                <p className="text-center text-[#99999A] py-3 text-[14px] italic break-words px-4">
                  {t('curriculum_table.empty_group')}
                </p>
              )}
            </GradeReportInteractive>
          );
        })}
      </div>
    </div>
  );
}
