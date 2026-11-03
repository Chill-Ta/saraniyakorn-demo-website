import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const { t } = useTranslation('student_services');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFiltered = Boolean(value && !value.endsWith('.all'));
  const displayText = isFiltered ? t(value) : label;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between border rounded-2xl cursor-pointer transition-colors ${
          isFiltered
            ? 'bg-[#FCF0F4] border-[#DE5D8F]'
            : 'bg-white border-[#F5CDDC]'
        }`}
        style={{
          minWidth: '170px',
          maxWidth: '260px',
          height: '37px',
          paddingTop: '7px',
          paddingBottom: '7px',
          paddingLeft: '16px',
          paddingRight: '16px',
          gap: '8px',
        }}
        title={displayText}
      >
        <div className="flex items-center justify-between w-full min-w-0">
          <span
            className="font-[ChulaCharasNew] text-[#DE5D8F] whitespace-nowrap overflow-hidden text-ellipsis mr-1"
            style={{ fontSize: '15px', fontWeight: 700 }}
          >
            {displayText}
          </span>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="#DE5D8F"
              strokeWidth="1.68"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] right-0 z-50 bg-white border border-[#F5CDDC] rounded-xl shadow-md min-w-[200px] overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-[#FCF0F4] transition-colors border-none bg-transparent cursor-pointer whitespace-nowrap truncate"
              style={{
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontSize: '16px',
                fontWeight: value === option ? 700 : 400,
                color: value === option ? '#DE5D8F' : '#000000',
              }}
            >
              {t(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
