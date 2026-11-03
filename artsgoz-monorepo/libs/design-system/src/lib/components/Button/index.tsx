import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'error' | 'outline';
  size?: 'default' | 'icon';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle =
    size === 'icon'
      ? 'flex items-center justify-center rounded-[10px] cursor-pointer transition-colors duration-200 shrink-0'
      : 'relative overflow-hidden flex items-center justify-center gap-2 h-[52px] px-7 rounded-[10px] font-serif text-[16px] font-bold tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const motionProps = {
    whileHover: { scale: size === 'icon' ? 1.05 : 1.02 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
  };

  // Icon buttons — no wipe animation
  if (size === 'icon') {
    return (
      <motion.button
        className={`${baseStyle} ${className}`}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  // Variant config — all share the same white wipe animation on hover
  const variantConfig: Record<string, { wrapper: string; wipe: string }> = {
    primary: {
      wrapper:
        'group bg-[var(--color-background-primary-default,#E992B4)] border-2 border-[var(--color-background-primary-default,#E992B4)] text-white hover:text-[var(--color-background-primary-dark,#DE5D8F)] transition-colors duration-300',
      wipe: 'bg-white',
    },
    secondary: {
      wrapper:
        'group bg-[var(--color-background-secondary-default,#F8C135)] border-2 border-[var(--color-background-secondary-default,#F8C135)] text-white hover:text-[var(--color-background-secondary-dark,#B08926)] transition-colors duration-300',
      wipe: 'bg-white',
    },
    error: {
      wrapper:
        'group bg-[var(--color-background-error-default,#EE4F72)] border-2 border-[var(--color-background-error-default,#EE4F72)] text-white hover:text-[var(--color-background-error-dark,#EA234F)] transition-colors duration-300',
      wipe: 'bg-white',
    },
    outline: {
      wrapper:
        'group bg-[#E992B4] text-white border-2 border-[#E992B4] hover:text-[#DE5D8F] transition-colors duration-300',
      wipe: 'bg-white',
    },
  };

  const config = variantConfig[variant] ?? variantConfig.primary;

  return (
    <motion.button
      className={`${baseStyle} ${config.wrapper} ${className}`}
      {...motionProps}
      {...props}
    >
      {/* Unified left-to-right white wipe on hover — same for ALL variants */}
      <span
        className={`absolute inset-0 ${config.wipe} -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0`}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
