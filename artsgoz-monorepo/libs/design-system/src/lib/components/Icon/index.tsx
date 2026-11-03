import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

interface IconProps extends Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'name'
> {
  name: IconName;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export function Icon({
  name,
  sizeVariant = 'md',
  className = '',
  ...props
}: IconProps) {
  const sizeStyles = {
    sm: 'w-size-400 h-size-400', // 16px
    md: 'w-size-500 h-size-500', // 20px
    lg: 'w-size-600 h-size-600', // 24px
  };

  const LucideIconComponent = LucideIcons[name] as React.ComponentType<{
    className?: string;
  }>;

  if (!LucideIconComponent) {
    console.warn(`Icon "${name}" ไม่พบในคลังของ Lucide Icons`);
    return null;
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${sizeStyles[sizeVariant]} ${className}`}
    >
      <LucideIconComponent {...props} className="w-full h-full" />
    </span>
  );
}
