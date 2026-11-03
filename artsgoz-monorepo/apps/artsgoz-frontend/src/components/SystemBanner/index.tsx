import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, BookPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SystemBannerProps {
  emphasis?: 'outlined' | 'subtle' | 'solid';
  type?: 'success' | 'warning' | 'error' | 'danger' | 'info' | 'primary' | 'mono';
  title?: React.ReactNode;
  message: React.ReactNode;
  
  // Icon configuration
  hasIcon?: boolean;
  icon?: React.ComponentType<{ className?: string; size?: number }>; // Custom icon component override
  
  // Actions
  onClose?: () => void; // Show close "x" button if present
  
  // Link button ("Learn More" style)
  moreText?: string;
  moreHref?: string;
  onMoreClick?: () => void;
  
  // Action/Cancel button
  cancelText?: string;
  onCancel?: () => void;
  
  // Action/Continue button
  actionText?: string;
  onAction?: () => void;
  
  // Styling overrides
  className?: string;
}

const typeStyles = {
  success: {
    bgSubtle: 'bg-[#ECF4E7]',
    borderSubtle: 'border-[#64A93C]/20',
    bgSolid: 'bg-[#64A93C]',
    textTheme: 'text-[#2E6A08]',
    borderOutlined: 'border-[#64A93C]',
    iconColor: 'text-[#38870A]',
    btnContinue: 'bg-[#64A93C] hover:bg-[#528f2e] text-white',
    btnContinueSolid: 'bg-white hover:bg-white/90 text-[#38870A]',
    defaultIcon: CheckCircle2,
  },
  warning: {
    bgSubtle: 'bg-[#FDF0E9]',
    borderSubtle: 'border-[#EA6D24]/20',
    bgSolid: 'bg-[#EA6D24]',
    textTheme: 'text-[#B54D12]',
    borderOutlined: 'border-[#EA6D24]',
    iconColor: 'text-[#EA6D24]',
    btnContinue: 'bg-[#EA6D24] hover:bg-[#c95919] text-white',
    btnContinueSolid: 'bg-white hover:bg-white/90 text-[#B54D12]',
    defaultIcon: AlertTriangle,
  },
  error: {
    bgSubtle: 'bg-[#FDE9ED]',
    borderSubtle: 'border-[#EA234F]/20',
    bgSolid: 'bg-[#EA234F]',
    textTheme: 'text-[#BD1436]',
    borderOutlined: 'border-[#EA234F]',
    iconColor: 'text-[#EA234F]',
    btnContinue: 'bg-[#EA234F] hover:bg-[#c8193f] text-white',
    btnContinueSolid: 'bg-white hover:bg-white/90 text-[#BD1436]',
    defaultIcon: AlertCircle,
  },
  danger: {
    bgSubtle: 'bg-[#FFC2C3]',
    borderSubtle: 'border-[#C00F0C]/20',
    bgSolid: 'bg-[#C00F0C]',
    textTheme: 'text-[#94070B]',
    borderOutlined: 'border-[#C00F0C]',
    iconColor: 'text-[#C00F0C]',
    btnContinue: 'bg-[#C00F0C] hover:bg-[#a10b0a] text-white',
    btnContinueSolid: 'bg-white hover:bg-white/90 text-[#94070B]',
    defaultIcon: AlertCircle,
  },
  info: {
    bgSubtle: 'bg-[#E6F0FE]',
    borderSubtle: 'border-[#0165F8]/20',
    bgSolid: 'bg-[#0165F8]',
    textTheme: 'text-[#0156D2]',
    borderOutlined: 'border-[#0165F8]',
    iconColor: 'text-[#0165F8]',
    btnContinue: 'bg-[#0165F8] hover:bg-[#0152cb] text-white',
    btnContinueSolid: 'bg-white hover:bg-white/90 text-[#0156D2]',
    defaultIcon: Info,
  },
  primary: {
    bgSubtle: 'bg-[#FCEFF4]',
    borderSubtle: 'border-[#DE5D8F]/20',
    bgSolid: 'bg-[#DE5D8F]',
    textTheme: 'text-[#AF3C6C]',
    borderOutlined: 'border-[#DE5D8F]',
    iconColor: 'text-[#DE5D8F]',
    btnContinue: 'bg-[#DE5D8F] hover:bg-[#ca5582] text-white',
    btnContinueSolid: 'bg-white hover:bg-white/90 text-[#AF3C6C]',
    defaultIcon: BookPlus,
  },
  mono: {
    bgSubtle: 'bg-[#F7F8F9]',
    borderSubtle: 'border-[#6D6D6D]/20',
    bgSolid: 'bg-[#6D6D6D]',
    textTheme: 'text-[#454545]',
    borderOutlined: 'border-[#6D6D6D]',
    iconColor: 'text-[#6D6D6D]',
    btnContinue: 'bg-[#6D6D6D] hover:bg-[#5a5a5a] text-white',
    btnContinueSolid: 'bg-white hover:bg-white/90 text-[#454545]',
    defaultIcon: Info,
  },
};

export function SystemBanner({
  emphasis = 'subtle',
  type = 'info',
  title,
  message,
  hasIcon = true,
  icon: CustomIcon,
  onClose,
  moreText,
  moreHref,
  onMoreClick,
  cancelText,
  onCancel,
  actionText,
  onAction,
  className = '',
}: SystemBannerProps) {
  const styles = typeStyles[type];
  const IconComponent = CustomIcon || styles.defaultIcon;

  // Determine container styles
  let containerClasses = 'w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:py-3.5 md:px-6 rounded-[11px] border text-[16px] transition-all duration-200 ';
  
  if (emphasis === 'subtle') {
    containerClasses += `${styles.bgSubtle} ${styles.borderSubtle} ${styles.textTheme}`;
  } else if (emphasis === 'outlined') {
    containerClasses += `bg-white ${styles.borderOutlined} ${styles.textTheme}`;
  } else {
    // solid
    containerClasses += `${styles.bgSolid} border-transparent text-white`;
  }

  // Handle CTA buttons or link
  const hasActions = moreText || cancelText || actionText || onClose;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${containerClasses} ${className}`}
      role="alert"
    >
      {/* Left side: Icon + Content */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {hasIcon && (
          <IconComponent
            size={20}
            className={`shrink-0 mt-0.5 ${emphasis === 'solid' ? 'text-white' : styles.iconColor}`}
          />
        )}
        <div className="flex flex-col flex-1 min-w-0">
          {title && (
            <h4 className={`font-bold text-[18px] leading-tight mb-0.5 ${emphasis === 'solid' ? 'text-white' : 'text-black'}`}>
              {title}
            </h4>
          )}
          <div className={`text-[16px] leading-relaxed ${emphasis === 'solid' ? 'text-white/95' : 'text-inherit'}`}>
            {message}
          </div>
        </div>
      </div>

      {/* Right side: Action triggers */}
      {hasActions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap self-end md:self-center">
          {/* Learn More link */}
          {moreText && (
            moreHref ? (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={moreHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[14px] font-bold hover:underline px-3 py-1.5 cursor-pointer inline-block ${
                  emphasis === 'solid' ? 'text-white' : 'text-[#6D6D6D] hover:text-black'
                }`}
              >
                {moreText}
              </motion.a>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onMoreClick}
                className={`text-[14px] font-bold hover:underline px-3 py-1.5 cursor-pointer ${
                  emphasis === 'solid' ? 'text-white' : 'text-[#6D6D6D] hover:text-black'
                }`}
              >
                {moreText}
              </motion.button>
            )
          )}

          {/* Cancel button */}
          {cancelText && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              className={`text-[14px] font-bold rounded-[8px] px-4 h-[36px] transition-colors cursor-pointer flex items-center justify-center ${
                emphasis === 'solid'
                  ? 'text-white/90 hover:bg-white/10'
                  : 'text-[#545455] hover:bg-black/[0.04]'
              }`}
            >
              {cancelText}
            </motion.button>
          )}

          {/* Continue button */}
          {actionText && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98, y: 0 }}
              type="button"
              onClick={onAction}
              className={`text-[14px] font-bold rounded-[8px] px-5 h-[36px] transition-colors cursor-pointer shadow-sm flex items-center justify-center ${
                emphasis === 'solid' ? styles.btnContinueSolid : styles.btnContinue
              }`}
            >
              {actionText}
            </motion.button>
          )}

          {/* Close button */}
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                emphasis === 'solid'
                  ? 'text-white hover:bg-white/10'
                  : 'text-[#6D6D6D] hover:bg-black/[0.04]'
              }`}
              aria-label="Close alert"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

