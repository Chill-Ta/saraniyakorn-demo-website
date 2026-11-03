import { useTranslation } from 'react-i18next';
import type { YellowCardSubject } from '../types.js';

interface GradeReportPaperReadonlyProps {
  subject: YellowCardSubject;
}

export function GradeReportPaperReadonly({ subject }: GradeReportPaperReadonlyProps) {
  const { t } = useTranslation('yellow_card');
  const subjectName = subject.nameKey
    ? (t(subject.nameKey) !== subject.nameKey ? t(subject.nameKey) : subject.nameKey)
    : '';

  return (
    <div className="grid grid-cols-[80px_1fr_100px_52px_52px] gap-4 items-center py-2.5 px-4 text-[16px] border-b border-[#D0D0D1]/20 last:border-b-0 min-w-0 font-serif">
      <span className="font-mono text-black text-[15px]">{subject.code || '-'}</span>
      <span className="text-black font-normal truncate">{subjectName || '-'}</span>
      <span className="text-center text-gray-700">{subject.semester || '-'}</span>
      <span className="text-center font-mono text-black font-semibold">{subject.credits || '-'}</span>
      <span className="text-center font-bold text-[#D23976]">{subject.grade || '-'}</span>
    </div>
  );
}

export default GradeReportPaperReadonly;
