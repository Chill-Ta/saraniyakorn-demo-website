import { useTranslation } from 'react-i18next';
import { SocialLinkData } from './footerData.js';

interface FooterSocialLinkProps {
  link: SocialLinkData;
}

export function FooterSocialLink({ link }: FooterSocialLinkProps) {
  const { t } = useTranslation('common');
  const linkProps = link.isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      href={link.href}
      className="flex items-center gap-3 font-serif text-[16px] leading-[24px] font-bold text-[#DE5D8F] hover:text-[#D23976] transition-colors group w-fit"
      {...linkProps}
    >
      {link.icon}
      <span>{t(link.label)}</span>
    </a>
  );
}

export default FooterSocialLink;
