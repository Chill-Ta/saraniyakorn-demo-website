import { useTranslation, Trans } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { SystemBanner } from '../../../components/SystemBanner/index.js';

interface YellowCardWarningBannerProps {
  onClose: () => void;
}

export function YellowCardWarningBanner({ onClose }: YellowCardWarningBannerProps) {
  useTranslation('yellow_card');

  return (
    <SystemBanner
      type="warning"
      emphasis="outlined"
      message={
        <span className="text-black font-bold break-words">
          <Trans
            i18nKey="yellow_card.warning_banner.message"
            components={{
              a: (
                <a
                  href="https://www.reg.chula.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#DE5D8F] hover:underline font-bold inline-flex items-center gap-0.5"
                />
              ),
              icon: <ExternalLink size={12} className="inline-block shrink-0" />,
            }}
          />
        </span>
      }
      onClose={onClose}
      className="mb-8 font-[ChulaCharasNew]"
    />
  );
}
