import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GradeReportInteractiveProps {
  topicName: string;
  description?: string;
  hasDescription?: boolean;
  onAddSubject?: () => void;
  readOnly?: boolean;
  children: React.ReactNode;
}

export function GradeReportInteractive({
  topicName,
  description,
  hasDescription = false,
  onAddSubject,
  readOnly = false,
  children,
}: GradeReportInteractiveProps) {
  const { t } = useTranslation('yellow_card');
  const [isOpen, setIsOpen] = useState(true);

  const containerClass = isOpen 
    ? "w-full bg-[#F7F8F9] rounded-[12px] p-5 flex flex-col gap-2 transition-all duration-300 select-none min-w-0"
    : "w-full bg-transparent px-5 py-2.5 border-b border-[#D0D0D1]/20 last:border-b-0 flex flex-col gap-2 transition-all duration-300 select-none min-w-0";

  return (
    <div className={containerClass}>
      {/* Header / Toggle Accordion */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group py-2 min-w-0"
      >
        <div className="flex-1 flex flex-col min-w-0 pr-4">
          <span className="text-[16px] font-bold text-black group-hover:text-[#DE5D8F] transition-colors leading-snug break-words">
            {topicName}
          </span>
          {hasDescription && description && (
            <span className="text-[14px] text-[#6D6D6D] mt-0.5 leading-normal break-words">
              {description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ChevronDown
            size={20}
            className="text-black shrink-0 transition-transform duration-300 ease-in-out"
            style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
          />
        </div>
      </div>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full overflow-hidden"
          >
            <div className="mt-2 flex flex-col gap-1.5 pb-2 min-w-0">
              {/* Subject Rows */}
              <div className="flex flex-col gap-0.5 min-w-0">
                {children}
              </div>

              {/* Round Plus Add Button (Hidden in ReadOnly mode) */}
              {!readOnly && onAddSubject && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddSubject(); }}
                  className="w-[44px] h-[44px] bg-[#E992B4] hover:bg-[#DE5D8F] text-white rounded-full flex items-center justify-center cursor-pointer transition-all mx-auto mt-4 border-none"
                  title={t('credit_tracking.planner.add_course_title')}
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
