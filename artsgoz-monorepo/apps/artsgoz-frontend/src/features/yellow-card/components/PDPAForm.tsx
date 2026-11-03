import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@artsgoz/design-system';

interface PDPAFormProps {
  onConfirm: () => void;
}

export function PDPAForm({ onConfirm }: PDPAFormProps) {
  const { t } = useTranslation('yellow_card');
  const [acknowledged, setAcknowledged] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (acknowledged) {
      onConfirm();
    }
  };

  return (
    <div className="w-full max-w-[680px] mx-auto bg-white border border-[#D0D0D1]/30 rounded-[16px] shadow-lg p-6 md:p-10 font-[ChulaCharasNew] my-8 select-none">
      <h2 className="text-[#DE5D8F] text-[24px] md:text-[32px] font-bold text-center mb-6 leading-tight">
        {t('pdpa.title')}
      </h2>

      <div className="text-[#404041] text-[16px] md:text-[18px] font-normal leading-relaxed space-y-4 mb-8">
        <p className="indent-8 text-justify">
          {t('pdpa.desc1')}
        </p>
        <p className="indent-8 text-justify">
          {t('pdpa.desc2')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        {/* Checkbox Group */}
        <label className="flex items-center gap-3 cursor-pointer group text-[18px] font-bold text-[#404041]">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="w-5 h-5 rounded border border-[#D0D0D1] text-[#DE5D8F] focus:ring-[#DE5D8F] transition-all cursor-pointer group-hover:border-[#DE5D8F]"
          />
          <span>{t('pdpa.agree')}</span>
        </label>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={!acknowledged}
          variant="primary"
          className="w-full max-w-[200px] h-[48px] rounded-[8px] font-bold text-[18px]"
        >
          {t('pdpa.submit')}
        </Button>
      </form>
    </div>
  );
}
