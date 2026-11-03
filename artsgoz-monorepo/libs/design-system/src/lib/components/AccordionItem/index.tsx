// packages/design-system/src/lib/components/AccordionItem/index.tsx
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export interface AccordionItemProps {
  title: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  iconType?: 'chevron' | 'plus-minus';
  alignItems?: 'start' | 'center';
  className?: string;
  buttonClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
  iconType = 'chevron',
  alignItems = 'center',
  className = 'py-1',
  buttonClassName = 'py-5',
  titleClassName = 'text-[20px] md:text-[24px] leading-none',
  contentClassName = 'pb-6 pt-2',
}: AccordionItemProps) {
  const alignClass = alignItems === 'center' ? 'items-center' : 'items-start';

  return (
    <div className={`w-full border-b border-[#ECECEC] overflow-hidden ${className}`}>
      <button
        onClick={onToggle}
        className={`w-full flex justify-between ${alignClass} cursor-pointer bg-transparent text-[#404041] hover:text-[#DE5D8F] transition-colors duration-200 text-left focus:outline-none group border-none ${buttonClassName}`}
      >
        <span className={`font-bold font-serif leading-tight transition-colors duration-200 group-hover:text-[#DE5D8F] ${titleClassName}`}>
          {title}
        </span>

        {iconType === 'chevron' ? (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#DE5D8F] shrink-0 ml-4"
          >
            <ChevronDown size={24} />
          </motion.div>
        ) : (
          <span className="shrink-0 mt-1 ml-4 text-[#404041] group-hover:text-[#DE5D8F] transition-colors duration-200">
            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={contentClassName}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
