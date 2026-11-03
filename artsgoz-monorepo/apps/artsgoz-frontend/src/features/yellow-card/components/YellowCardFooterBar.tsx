import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { Button } from '@artsgoz/design-system';

interface YellowCardFooterBarProps {
  onCancel: () => void;
  onSave: () => void;
}

export function YellowCardFooterBar({ onCancel, onSave }: YellowCardFooterBarProps) {
  const { t } = useTranslation('yellow_card');

  return (
    <div className="mt-10 flex flex-col md:flex-row items-center justify-between bg-[#F7F8F9] p-5 rounded-[16px] border border-[#D0D0D1]/30 shadow-sm gap-4 min-w-0 w-full">
      <div className="flex items-center gap-2 text-[#6D6D6D] text-[15px] min-w-0">
        <Info size={16} className="shrink-0" />
        <span className="break-words">{t('footer.disclaimer')}</span>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="text-[16px] font-bold text-[#6D6D6D] hover:text-black px-4 py-2 cursor-pointer transition-colors border-none bg-transparent"
        >
          {t('credit_tracking.planner.cancel')}
        </button>
        <Button
          type="button"
          onClick={onSave}
          variant="primary"
          className="font-[ChulaCharasNew] text-[17px] px-8 h-[48px] rounded-[8px]"
        >
          {t('footer.confirm_save')}
        </Button>
      </div>
    </div>
  );
}
