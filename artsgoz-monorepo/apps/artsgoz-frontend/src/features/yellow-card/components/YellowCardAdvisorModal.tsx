import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

interface YellowCardAdvisorModalProps {
  onConfirm: () => void;
  onGoToTracker: () => void;
  onClose: () => void;
}

export function YellowCardAdvisorModal({
  onConfirm,
  onGoToTracker,
  onClose,
}: YellowCardAdvisorModalProps) {
  const { t } = useTranslation('yellow_card');

  return (
    <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in font-[ChulaCharasNew]">
      <div className="bg-white border border-[#D0D0D1]/30 rounded-[16px] shadow-2xl p-6 md:p-8 max-w-[500px] w-full select-none text-black">
        <div className="flex items-center gap-3 text-[#E2B030] mb-4">
          <AlertTriangle size={28} />
          <h3 className="text-black text-[22px] font-bold">{t('advisor_modal.warning_title')}</h3>
        </div>

        <p className="text-[#404041] text-[16px] md:text-[17px] leading-relaxed mb-6 break-words">
          {t('advisor_modal.warning_desc')}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-[#E992B4] hover:bg-[#DE5D8F] text-white font-bold text-[16px] h-[44px] rounded-[8px] cursor-pointer transition-colors border-none"
          >
            {t('advisor_modal.confirm_send')}
          </button>

          <button
            type="button"
            onClick={onGoToTracker}
            className="w-full bg-[#FCEFF4] hover:bg-[#FCEFF4]/80 text-[#DE5D8F] border border-[#DE5D8F]/20 font-bold text-[16px] h-[44px] rounded-[8px] cursor-pointer transition-colors"
          >
            {t('advisor_modal.go_to_tracker')}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-[#6D6D6D] hover:text-black text-[15px] font-bold py-1.5 cursor-pointer text-center border-none bg-transparent"
          >
            {t('advisor_modal.continue_filling')}
          </button>
        </div>
      </div>
    </div>
  );
}
