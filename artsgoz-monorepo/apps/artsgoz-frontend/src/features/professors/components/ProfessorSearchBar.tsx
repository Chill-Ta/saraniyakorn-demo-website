import { useTranslation } from 'react-i18next';

interface ProfessorSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  /** Width mode: 'full' for page 1 state (1086px wide), 'compact' for page 2 state (391px wide) */
  mode?: 'full' | 'compact';
}

export function ProfessorSearchBar({
  value,
  onChange,
  onSearch,
  mode = 'full',
}: ProfessorSearchBarProps) {
  const { t } = useTranslation('student_services');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="flex items-center" style={{ gap: '11px' }}>
      {/* Search Fields — pill shape, border #8B8B8C, radius:9999 */}
      <div
        className="flex items-center bg-white border border-[#8B8B8C] flex-1"
        style={{
          borderRadius: '9999px',
          padding: '12px',
          gap: '40px',
          height: '41px',
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('professors.search_placeholder')}
          className="flex-1 bg-transparent outline-none font-[ChulaCharasNew] text-[#DE5D8F] placeholder:text-[#DE5D8F]"
          style={{ fontSize: '16px', fontWeight: 400 }}
        />
        <button
          type="button"
          onClick={onSearch}
          className="shrink-0 flex items-center justify-center border-none bg-transparent cursor-pointer"
          aria-label={t('professors.search_btn')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8.5" cy="8.5" r="6" stroke="#33363F" strokeWidth="2" />
            <path
              d="M13.5 13.5L17 17"
              stroke="#33363F"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* icon button (filter) — 32×32 bg:#E992B4 radius:8 */}
      <button
        type="button"
        className="flex items-center justify-center bg-[#E992B4] shrink-0 border-none cursor-pointer"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          padding: '8px',
        }}
        aria-label={t('professors.filter_btn')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 4H14M4 8H12M6 12H10"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
