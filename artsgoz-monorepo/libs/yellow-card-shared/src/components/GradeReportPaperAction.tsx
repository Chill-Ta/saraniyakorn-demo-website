import { useTranslation } from 'react-i18next';
import { Trash2, Check } from 'lucide-react';
import type { YellowCardSubject } from '../types.js';

interface GradeReportPaperActionProps {
  subject: YellowCardSubject;
  onUpdate: (updatedSubject: YellowCardSubject) => void;
  onDelete: () => void;
}

export function GradeReportPaperAction({
  subject,
  onUpdate,
  onDelete,
}: GradeReportPaperActionProps) {
  const { t } = useTranslation('yellow_card');
  const gradeOptions = ['', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'S', 'U'];
  const isCompleted = subject.grade !== '';

  const handleToggle = () => {
    if (isCompleted) {
      // Clear grade and semester if unchecked
      onUpdate({ ...subject, grade: '', semester: '' });
    } else {
      // Default to A and semester 1/67 if checked
      onUpdate({ ...subject, grade: 'A', semester: subject.semester || '1/67' });
    }
  };

  const subjectName = subject.nameKey ? t(subject.nameKey) : '';

  return (
    <div className={`grid grid-cols-[20px_80px_1fr_100px_52px_52px_32px] gap-2 items-center py-2.5 hover:bg-black/[0.01] rounded-[6px] px-1 transition-all text-[16px] border-b border-[#D0D0D1]/20 last:border-b-0 min-w-0 ${
      !isCompleted ? 'opacity-65' : ''
    }`}>
      {/* Checkbox Toggle Button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); handleToggle(); }}
        className={`w-[20px] h-[20px] shrink-0 border rounded flex items-center justify-center transition-all cursor-pointer ${
          isCompleted
            ? 'bg-white border-[#8B8B8C] text-black'
            : 'border-[#D0D0D1] bg-white hover:border-[#DE5D8F]'
        }`}
        aria-label={isCompleted ? t('grade_report.unmark') : t('grade_report.mark')}
      >
        {isCompleted && <Check size={12} strokeWidth={3} className="text-black" />}
      </button>

      {/* Code */}
      <input
        type="text"
        value={subject.code}
        onChange={(e) => onUpdate({ ...subject, code: e.target.value })}
        placeholder="............."
        className="w-full text-black bg-transparent font-mono text-[16px] placeholder:text-[#BBBBBB] border-b border-transparent hover:border-[#D0D0D1]/40 focus:border-[#DE5D8F] focus:outline-none focus:ring-0 px-1 py-0.5 transition-all text-left"
        aria-label={t('credit_tracking.planner.col_code')}
      />

      {/* Name */}
      <input
        type="text"
        value={subjectName}
        onChange={(e) => onUpdate({ ...subject, nameKey: e.target.value })}
        placeholder="................................................"
        className="w-full text-black bg-transparent font-normal text-[16px] placeholder:text-[#BBBBBB] border-b border-transparent hover:border-[#D0D0D1]/40 focus:border-[#DE5D8F] focus:outline-none focus:ring-0 px-1 py-0.5 transition-all text-left"
        aria-label={t('credit_tracking.planner.col_name')}
      />

      {/* Semester */}
      <input
        type="text"
        value={subject.semester}
        onChange={(e) => onUpdate({ ...subject, semester: e.target.value })}
        placeholder="....."
        className="w-full text-black bg-transparent text-[16px] placeholder:text-[#BBBBBB] border-b border-transparent hover:border-[#D0D0D1]/40 focus:border-[#DE5D8F] focus:outline-none focus:ring-0 px-1 py-0.5 transition-all text-center"
        aria-label={t('grade_report.term_year')}
      />

      {/* Credits */}
      <input
        type="text"
        value={subject.credits}
        onChange={(e) => onUpdate({ ...subject, credits: e.target.value })}
        placeholder="..."
        className="w-full text-black bg-transparent font-mono text-[16px] placeholder:text-[#BBBBBB] border-b border-transparent hover:border-[#D0D0D1]/40 focus:border-[#DE5D8F] focus:outline-none focus:ring-0 px-1 py-0.5 transition-all text-center"
        aria-label={t('credit_tracking.planner.col_credits')}
      />

      {/* Grade */}
      <div className="relative w-full">
        <select
          value={subject.grade}
          onChange={(e) => onUpdate({ ...subject, grade: e.target.value })}
          className="w-full text-black bg-transparent font-normal text-[16px] border-b border-transparent hover:border-[#D0D0D1]/40 focus:border-[#DE5D8F] focus:outline-none focus:ring-0 px-1 py-0.5 transition-all text-center cursor-pointer appearance-none bg-white"
          aria-label={t('grade_report.grade')}
        >
          {gradeOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-white text-black font-normal">
              {opt === '' ? '...' : opt}
            </option>
          ))}
        </select>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="text-[#6D6D6D] hover:text-[#ea234f] transition-colors cursor-pointer flex items-center justify-center p-1 border-none bg-transparent"
        title={t('credit_tracking.planner.btn_delete')}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
