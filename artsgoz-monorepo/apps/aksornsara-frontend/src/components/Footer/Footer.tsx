import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoImg, legacyLogo } from '@artsgoz/design-system';
import { SOCIAL_LINKS, FOOTER_COLUMN_GROUPS } from './footerData.js';
import { FooterColumn } from './FooterColumn.js';
import { FooterSocialLink } from './FooterSocialLink.js';

export function Footer() {
  const { t } = useTranslation('common');
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);

  // Flatten sections for mobile accordion list
  const allSections = FOOTER_COLUMN_GROUPS.flatMap((g) => g.sections);

  const toggleSection = (idx: number) => {
    setOpenSectionIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <footer className="w-full relative overflow-hidden bg-[#F2F2F2] select-none text-black">
      {/* Pink Radial Aura Blur Glow (Figma Node #7692:35384 - bottom left with ~20% visible) */}
      <div
        className="absolute -left-[380px] -bottom-[380px] w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none z-0"
        style={{
          backgroundColor: '#D23976',
          filter: 'blur(106px)',
        }}
      />

      {/* Corporate Legacy Logo Watermark Emblem (Figma Node #7692:35509 - bottom right) */}
      <div className="absolute right-[-60px] sm:right-[-40px] bottom-[-20px] pointer-events-none select-none z-0 opacity-20 sm:opacity-30">
        <img
          src={legacyLogo}
          alt=""
          className="w-[300px] sm:w-[544px] h-[200px] sm:h-[352px] object-contain"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[1282px] mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8 flex flex-col gap-8 sm:gap-12">
        {/* Top Section: Left Branding/Socials + Right Navigation */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16">
          {/* Left Column: Logo + Address + Social Links */}
          <div className="w-full lg:w-[320px] flex flex-col items-start shrink-0">
            <img
              src={logoImg}
              alt="Arts GOZ Logo"
              className="w-[200px] sm:w-[240px] h-[44px] sm:h-[52px] object-contain mb-4 sm:mb-6"
            />
            <p className="font-serif text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-black mb-6 whitespace-pre-line">
              {t('footer.address')}
            </p>

            {/* Desktop Social Links List */}
            <div className="hidden sm:flex flex-col gap-3.5 w-full">
              {SOCIAL_LINKS.map((link) => (
                <FooterSocialLink key={link.label} link={link} />
              ))}
            </div>

            {/* Mobile Social Links: Horizontal Icons Row */}
            <div className="flex sm:hidden items-center gap-3 w-full">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 rounded-full bg-white border border-[#E992B4]/40 flex items-center justify-center text-[#DE5D8F] hover:bg-[#DE5D8F] hover:text-white transition-all shadow-2xs"
                  aria-label={t(link.label)}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Navigation Column Groups (hidden on small mobile screens) */}
          <div className="hidden sm:grid w-full flex-1 grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 pt-2">
            {FOOTER_COLUMN_GROUPS.map((group, idx) => (
              <FooterColumn key={idx} group={group} />
            ))}
          </div>

          {/* Mobile Accordion Navigation Sections (< 640px) */}
          <div className="w-full sm:hidden flex flex-col divide-y divide-gray-300/60 border-t border-b border-gray-300/60 pt-1">
            {allSections.map((section, idx) => {
              const isOpen = openSectionIndex === idx;
              return (
                <div key={section.title} className="w-full py-2">
                  <button
                    type="button"
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center justify-between py-2 text-left bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    <span className="font-serif text-[18px] font-bold text-[#D23976]">
                      {t(section.title)}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#D23976] shrink-0"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-2 pt-1 pb-3 pl-1">
                          {section.links.map((link) =>
                            link.isExternal ? (
                              <a
                                key={link.label}
                                href={link.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-serif text-[15px] leading-[22px] font-normal text-black hover:text-[#D23976] transition-colors"
                              >
                                {t(link.label)}
                              </a>
                            ) : (
                              <Link
                                key={link.label}
                                to={link.path}
                                className="font-serif text-[15px] leading-[22px] font-normal text-black hover:text-[#D23976] transition-colors"
                              >
                                {t(link.label)}
                              </Link>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar & Copyright Row */}
        <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif text-[13px] sm:text-[14px] text-black">
          <span className="text-center sm:text-left no-underline border-none">
            @All Right Reserved, Arts Chula Student Committee 2026
          </span>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#D23976] transition-colors no-underline text-black"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#D23976] transition-colors no-underline text-black"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
