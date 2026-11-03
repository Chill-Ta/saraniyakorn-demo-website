import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

interface DropdownMenuContainerProps {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  id?: string;
  width?: number | string;
}

export function DropdownMenuContainer({
  label,
  value,
  options,
  placeholder,
  onChange,
  id,
  width,
}: DropdownMenuContainerProps) {
  const { t } = useTranslation('credit_tracking');
  const isEmpty = !value || value === placeholder;

  return (
    <div className="flex flex-col gap-[6px]" style={{ width: width ?? undefined, minWidth: width ? undefined : '180px' }}>
      {/* Label */}
      <span
        className="text-black leading-[24px] truncate"
        style={{ fontFamily: 'ChulaCharasNew, sans-serif', fontSize: '18px', fontWeight: 400 }}
      >
        {label}
      </span>

      {/* Select wrapper */}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[40px] pl-[18px] pr-10 bg-white appearance-none outline-none cursor-pointer transition-colors focus:border-[#DE5D8F] truncate"
          style={{
            border: '2px solid #8B8B8C',
            borderRadius: '8px',
            fontFamily: 'ChulaCharasNew, sans-serif',
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: '28px',
            color: isEmpty ? '#99999A' : '#000000',
          }}
        >
          <option value={placeholder} style={{ color: '#99999A' }}>
            {t(placeholder)}
          </option>
          {options
            .filter((opt) => opt !== placeholder)
            .map((opt) => (
              <option key={opt} value={opt} style={{ color: '#000000' }}>
                {t(opt)}
              </option>
            ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 24, height: 24, color: '#99999A' }}
        />
      </div>
    </div>
  );
}
