import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BookPlus } from 'lucide-react';
import { SystemBanner } from './SystemBanner.js';
import type { YellowCardSubject, GPATermData } from '../types.js';

interface GPATableProps {
  subjects: YellowCardSubject[];
}

// Convert grade string to numeric value for GPA calculation
const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0,
};

export function GPATable({ subjects }: GPATableProps) {
  const { t } = useTranslation('yellow_card');

  // Normalize and group courses by semester
  const termCalculations = useMemo<(GPATermData & { hasData?: boolean })[]>(() => {
    const termMap: Record<string, YellowCardSubject[]> = {};

    // Group subjects by semester field (normalized)
    subjects.forEach((sub) => {
      const sem = String(sub.semester || '').trim();
      if (!sem) return;

      termMap[sem] = termMap[sem] || [];
      termMap[sem].push(sub);
    });

    const semesters = Object.keys(termMap);
    if (semesters.length === 0) {
      // Return 8 default empty terms if no data entered yet to match Figma visual style
      const defaultTerms: (GPATermData & { hasData?: boolean })[] = [];
      for (let i = 0; i < 8; i++) {
        defaultTerms.push({
          semester: i % 2 === 0 
            ? t('gpa_table.term_first_placeholder') 
            : t('gpa_table.term_second_placeholder'),
          ca: 0,
          cg: 0,
          gpa: 0,
          cax: 0,
          cgx: 0,
          gpax: 0,
          hasData: false,
        });
      }
      return defaultTerms;
    }

    // Helper to sort semesters chronologically
    const parseSemesterSortKey = (semStr: string) => {
      const parts = semStr.split('/');
      if (parts.length === 2) {
        const term = parseInt(parts[0]) || 0;
        let year = parseInt(parts[1]) || 0;
        if (year < 100) {
          year += 2500;
        }
        return year * 10 + term;
      }

      if (semStr.includes('ภาคต้น') || semStr.includes('First') || semStr.includes('First Semester')) {
        const yr = parseInt(semStr.replace(/[^0-9]/g, '')) || 0;
        return yr * 10 + 1;
      }
      if (semStr.includes('ภาคปลาย') || semStr.includes('Second') || semStr.includes('Second Semester')) {
        const yr = parseInt(semStr.replace(/[^0-9]/g, '')) || 0;
        return yr * 10 + 2;
      }
      if (semStr.includes('ภาคฤดูร้อน') || semStr.includes('Summer') || semStr.includes('Summer Semester')) {
        const yr = parseInt(semStr.replace(/[^0-9]/g, '')) || 0;
        return yr * 10 + 3;
      }

      return 999999;
    };

    const sortedSemesters = semesters.sort((a, b) => parseSemesterSortKey(a) - parseSemesterSortKey(b));

    const calculatedTerms: (GPATermData & { hasData?: boolean })[] = [];
    let cumulativeGradePointsSum = 0;
    let cumulativeCaSum = 0;
    let cumulativeCgSum = 0;

    for (const sem of sortedSemesters) {
      const termSubjects = termMap[sem];
      let termCa = 0;
      let termCg = 0;
      let termGradePoints = 0;

      termSubjects.forEach((sub) => {
        const credit = parseFloat(sub.credits) || 0;
        const grade = String(sub.grade || '').trim().toUpperCase();

        if (!grade) return;

        if (GRADE_POINTS[grade] !== undefined) {
          termCa += credit;
          termGradePoints += credit * GRADE_POINTS[grade];
          if (grade !== 'F') {
            termCg += credit;
          }
        } else if (grade === 'S') {
          termCg += credit;
        }
      });

      const termGpa = termCa > 0 ? termGradePoints / termCa : 0;

      cumulativeCaSum += termCa;
      cumulativeCgSum += termCg;
      cumulativeGradePointsSum += termGradePoints;

      const cumulativeGpax = cumulativeCaSum > 0 ? cumulativeGradePointsSum / cumulativeCaSum : 0;

      // Render readable semester label matching Figma spacing and prefix
      let displayLabel: string;
      const parts = sem.split('/');
      if (parts.length === 2) {
        const term = parts[0];
        let year = parseInt(parts[1]) || 0;
        if (year < 100) year += 2500;
        displayLabel = term === '1' 
          ? t('gpa_table.term_first_prefix', { year }) 
          : term === '2' 
            ? t('gpa_table.term_second_prefix', { year }) 
            : t('gpa_table.term_summer_prefix', { year });
      } else {
        const hasPrefix = sem.trim().startsWith('1.');
        const leadingSpaces = sem.startsWith(' ') ? '' : '  ';
        const prefix = hasPrefix ? '' : '1. ';
        displayLabel = `${leadingSpaces}${prefix}${sem.trim()}`;
      }

      calculatedTerms.push({
        semester: displayLabel,
        ca: termCa,
        cg: termCg,
        gpa: termGpa,
        cax: cumulativeCaSum,
        cgx: cumulativeCgSum,
        gpax: cumulativeGpax,
        hasData: true,
      });
    }

    // Pad up to exactly 8 rows
    const paddedTerms = [...calculatedTerms];
    while (paddedTerms.length < 8) {
      const idx = paddedTerms.length;
      paddedTerms.push({
        semester: idx % 2 === 0 
          ? t('gpa_table.term_first_placeholder') 
          : t('gpa_table.term_second_placeholder'),
        ca: 0,
        cg: 0,
        gpa: 0,
        cax: 0,
        cgx: 0,
        gpax: 0,
        hasData: false,
      });
    }

    return paddedTerms;
  }, [subjects, t]);

  return (
    <div className="w-full bg-white border border-[#D0D0D1]/30 rounded-[16px] p-6 shadow-xs font-[ChulaCharasNew] mb-8 select-none min-w-0">
      {/* Header Tab */}
      <div 
        className="w-full h-[60px] bg-[#E992B4] rounded-[8px] px-5 flex items-center justify-between shadow-xs mb-6 min-w-0"
      >
        <span className="text-white text-[18px] font-bold truncate">{t('gpa_table.title')}</span>
      </div>

      {/* Warning Banner */}
      <SystemBanner
        type="warning"
        emphasis="solid"
        icon={BookPlus}
        message={t('gpa_table.warning_note')}
        className="w-fit max-w-full mb-6 font-[ChulaCharasNew] bg-[#EE8A50] border-transparent"
      />

      {/* Grade Table Grid Container */}
      <div className="w-full overflow-x-auto rounded-[12px] border border-[#D0D0D1]/30">
        <table className="w-full min-w-[1058px] table-fixed border-collapse text-center text-[15px]">
          <thead>
            <tr className="border-b border-[#D0D0D1]/30 font-bold text-center text-[16px]">
              <th className="py-3 px-4 text-left text-white w-[221px] border-r border-white/20" style={{ backgroundColor: '#E992B4' }}>{t('grade_report.term_year')}</th>
              <th className="py-3 px-4 w-[84px] text-white border-r border-white/20" style={{ backgroundColor: '#E992B4' }}>CA</th>
              <th className="py-3 px-4 w-[84px] text-white border-r border-white/20" style={{ backgroundColor: '#E992B4' }}>CG</th>
              <th className="py-3 px-4 w-[84px] text-white border-r border-white/20" style={{ backgroundColor: '#E992B4' }}>GPA</th>
              <th className="py-3 px-4 w-[84px] text-white border-r border-white/20" style={{ backgroundColor: '#E992B4' }}>CAX</th>
              <th className="py-3 px-4 w-[84px] text-white border-r border-white/20" style={{ backgroundColor: '#E992B4' }}>CGX</th>
              <th className="py-3 px-4 w-[84px] text-white border-r border-white/20" style={{ backgroundColor: '#E992B4' }}>GPAX</th>
              <th className="py-3 px-4 w-[333px] text-black font-bold" style={{ backgroundColor: '#D0D0D1' }}>{t('gpa_table.col_remark')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0D0D1]/20">
            {termCalculations.map((calc, index) => {
              const hasData = calc.hasData !== false && (calc.ca > 0 || calc.cg > 0);
              return (
                <tr key={index} className="hover:bg-[#FCEFF4]/5 transition-colors">
                  <td className="py-3.5 px-4 text-left font-bold text-black border-r border-[#D0D0D1]/30 whitespace-pre truncate">{calc.semester}</td>
                  <td className="py-3.5 px-4 font-mono text-black border-r border-[#D0D0D1]/30">
                    {hasData ? calc.ca.toFixed(2) : '..........'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-black border-r border-[#D0D0D1]/30">
                    {hasData ? calc.cg.toFixed(2) : '..........'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#DE5D8F] border-r border-[#D0D0D1]/30">
                    {hasData && calc.ca > 0 ? calc.gpa.toFixed(2) : '..........'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-black border-r border-[#D0D0D1]/30">
                    {hasData ? calc.cax.toFixed(2) : '..........'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-black border-r border-[#D0D0D1]/30">
                    {hasData ? calc.cgx.toFixed(2) : '..........'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#DE5D8F] border-r border-[#D0D0D1]/30">
                    {hasData && calc.cax > 0 ? calc.gpax.toFixed(2) : '..........'}
                  </td>
                  <td className="py-3.5 px-4 text-center text-black font-mono select-none">
                    .............................
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
