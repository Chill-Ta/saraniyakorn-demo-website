import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { Button } from '@artsgoz/design-system';

interface YellowCardActionBarProps {
  onImport: () => void;
  onProcess: () => void;
}

export function YellowCardActionBar({ onImport, onProcess }: YellowCardActionBarProps) {
  const { t } = useTranslation('yellow_card');

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 min-w-0 w-full">
      {/* Import Button */}
      <Button
        type="button"
        onClick={onImport}
        variant="secondary"
        className="font-[ChulaCharasNew] text-[16px] px-5 h-[48px] rounded-[8px]"
      >
        <Sparkles size={18} />
        {t('action_bar.import_btn')}
      </Button>

      {/* Process Button */}
      <Button
        type="button"
        onClick={onProcess}
        variant="primary"
        className="font-[ChulaCharasNew] text-[17px] px-8 h-[48px] rounded-[8px] shrink-0"
      >
        {t('action_bar.process_btn')}
      </Button>
    </div>
  );
}
