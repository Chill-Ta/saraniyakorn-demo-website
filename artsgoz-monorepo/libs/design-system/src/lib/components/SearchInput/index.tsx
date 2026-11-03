// packages/design-system/src/lib/components/SearchInput/index.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputClassName?: string;
  /** 'default' = original compact bar (296 x 41px). 'lg' = full-width, taller bar (100% x 55px). */
  size?: 'default' | 'lg';
}

export function SearchInput({
  className = '',
  inputClassName = '',
  size = 'default',
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isLg = size === 'lg';

  return (
    <div
      className={`flex items-center bg-[#FFF] transition-all duration-200 ${isLg ? 'w-full' : 'shrink-0'} ${className}`}
      style={{
        width: isLg ? '100%' : '296px',
        height: isLg ? '55px' : '41px',
        padding: isLg ? '0 20px' : '0 12px',
        gap: isLg ? '16px' : '40px',
        borderRadius: '9999px',
        border: isFocused
          ? `${isLg ? '2px' : '1px'} solid #545455`
          : `${isLg ? '2px' : '1px'} solid #8B8B8C`,
      }}
    >
      <input
        type="text"
        className={`flex-1 self-stretch bg-transparent border-none min-w-0 font-serif leading-none placeholder:text-[#DE5D8F] ${isLg ? 'text-[18px]' : 'text-[16px]'} ${inputClassName}`}
        style={{ color: '#DE5D8F', outline: 'none' }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      <Search
        size={isLg ? 24 : 20}
        color="#33363F"
        strokeWidth={2}
        className="shrink-0"
      />
    </div>
  );
}

