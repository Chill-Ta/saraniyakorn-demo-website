import { ReactNode } from 'react';

export type AgendaBadgeVariant = 'today' | 'tomorrow' | 'important' | 'dont-forget' | 'default';

interface AgendaBadgeProps {
  variant?: AgendaBadgeVariant;
  children: ReactNode;
  className?: string;
}

export function AgendaBadge({ variant, children, className = '' }: AgendaBadgeProps) {
  // Auto-detect variant from children if variant is not explicitly provided
  let resolvedVariant: AgendaBadgeVariant = variant || 'default';
  
  if (!variant && typeof children === 'string') {
    const text = children.trim();
    if (text === 'วันนี้') resolvedVariant = 'today';
    else if (text === 'พรุ่งนี้') resolvedVariant = 'tomorrow';
    else if (text === 'สำคัญ') resolvedVariant = 'important';
    else if (text === 'ห้ามลืม') resolvedVariant = 'dont-forget';
  }

  // Solid borderless chip-like fills matching Chula design system visual weights
  const variantClasses: Record<AgendaBadgeVariant, string> = {
    today: 'bg-[#E992B4] text-white', 
    tomorrow: 'bg-[#EEF2FF] text-[#4338CA]', 
    important: 'bg-[#FEF2F2] text-[#B91C1C]', 
    'dont-forget': 'bg-[#FFFBEB] text-[#B45309]', 
    default: 'bg-[#F7F8F9] text-[#6D6D6D]', 
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-serif text-[12px] font-bold px-3 h-[24px] rounded-full uppercase select-none transition-all duration-200 border-none ${variantClasses[resolvedVariant]} ${className}`}
      style={{
        lineHeight: '18px',
      }}
    >
      {children}
    </span>
  );
}
