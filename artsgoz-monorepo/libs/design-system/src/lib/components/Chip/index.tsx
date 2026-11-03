import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Visual size of the chip. Matches Figma sizes. Default: 'large' */
  size?: 'small' | 'medium' | 'large';
  /** Whether the chip is in the selected/click state (pink bg + checkmark). */
  selected?: boolean;
}

// Size tokens straight from Figma layout specs
const sizeMap = {
  small: {
    height: '24px',
    padding: '0 8px',
    fontSize: '12px',
    lineHeight: '18px',
    checkSize: 12,
  },
  medium: {
    height: '32px',
    padding: '0 12px',
    fontSize: '14px',
    lineHeight: '20px',
    checkSize: 16,
  },
  large: {
    height: '40px',
    padding: '0 16px',
    fontSize: '16px',
    lineHeight: '24px',
    checkSize: 16,
  },
};

export function Chip({
  children,
  size = 'large',
  selected = false,
  className = '',
  disabled,
  ...props
}: ChipProps) {
  const s = sizeMap[size];

  // State → bg + text colours (from Figma fills)
  const bg = selected
    ? '#E992B4'            // Click state
    : disabled
    ? '#ECECEC'            // Disabled state
    : '#F7F8F9';           // Default state

  const color = selected || disabled ? '#FFFFFF' : '#6D6D6D';

  // Hover: #ECECEC bg (CSS handles it via onMouseEnter/Leave or pure CSS below)
  return (
    <button
      type="button"
      disabled={disabled}
      className={`group inline-flex flex-row items-center justify-center gap-[4px] shrink-0 whitespace-nowrap
        transition-all duration-150 cursor-pointer select-none
        disabled:cursor-not-allowed active:scale-95 disabled:active:scale-100
        ${className}`}
      style={{
        height: s.height,
        padding: s.padding,
        borderRadius: '9999px',
        border: 'none',
        backgroundColor: bg,
        color,
        fontFamily: 'ChulaCharasNew, serif',
        fontSize: s.fontSize,
        fontWeight: 700,
        lineHeight: s.lineHeight,
      }}
      onMouseEnter={(e) => {
        if (!selected && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ECECEC';
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!selected && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = bg;
        }
        props.onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
      {selected && (
        <Check
          size={s.checkSize}
          strokeWidth={2.5}
          style={{ color: '#FFFFFF', flexShrink: 0 }}
        />
      )}
    </button>
  );
}
