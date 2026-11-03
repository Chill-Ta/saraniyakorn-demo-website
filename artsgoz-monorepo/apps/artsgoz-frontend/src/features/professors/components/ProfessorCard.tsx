import { useTranslation } from 'react-i18next';
import type { Professor } from '../types.js';

interface ProfessorCardProps {
  professor: Professor;
  isSelected?: boolean;
  onClick: (professor: Professor) => void;
}

export function ProfessorCard({ professor, isSelected = false, onClick }: ProfessorCardProps) {
  const { t } = useTranslation('student_services');

  return (
    <button
      type="button"
      onClick={() => onClick(professor)}
      className="w-full text-left border-none bg-transparent p-0 cursor-pointer"
    >
      {/* Frame 6184 — 72px tall, white bg, rounded-lg, shadow */}
      <div
        className="w-full bg-white rounded-lg flex items-center px-6 py-4 gap-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] min-w-0"
        style={{ minHeight: '72px' }}
      >
        {/* Frame 6317 — full width row, space-between */}
        <div className="flex items-center justify-between w-full gap-0 min-w-0">
          {/* Frame 6316 — avatar + name/email */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Ellipse 124 — 40×40 grey circle avatar placeholder */}
            <div
              className="rounded-full shrink-0 bg-[#626262]"
              style={{ width: '40px', height: '40px' }}
            />

            {/* Frame 5876 — name and email stacked vertically, gap:3 */}
            <div className="flex flex-col justify-center min-w-0" style={{ gap: '3px' }}>
              {/* list item (this is body) — 16px w400 #000000 */}
              <span
                className="font-[ChulaCharasNew] text-[#000000] leading-[1.5] truncate"
                style={{ fontSize: '16px', fontWeight: 400 }}
              >
                {t(professor.nameKey)}
              </span>
              {/* this is the description — 14px w400 #6D6D6D */}
              <span
                className="font-[ChulaCharasNew] text-[#6D6D6D] leading-[1.5] truncate"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {professor.email}
              </span>
            </div>
          </div>

          {/* Frame 5878 — right icons (chevron-right) */}
          <div className="flex items-center gap-4 opacity-0 shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="#636363"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
