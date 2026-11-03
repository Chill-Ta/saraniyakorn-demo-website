import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FooterColumnGroupData } from './footerData.js';

interface FooterColumnProps {
  group: FooterColumnGroupData;
}

export function FooterColumn({ group }: FooterColumnProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-start gap-8">
      {group.sections.map((section) => (
        <div key={section.title} className="flex flex-col items-start gap-2">
          {/* Header in Bold 20px #D23976 */}
          <h4 className="font-serif text-[20px] leading-[28px] font-bold text-[#D23976] mb-1">
            {t(section.title)}
          </h4>

          {/* Unlined Links */}
          {section.links.map((link) => {
            if (link.isExternal) {
              return (
                <a
                  key={link.label}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-[16px] leading-[24px] font-normal text-black hover:text-[#D23976] transition-colors"
                >
                  {t(link.label)}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.path}
                className="font-serif text-[16px] leading-[24px] font-normal text-black hover:text-[#D23976] transition-colors"
              >
                {t(link.label)}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default FooterColumn;
