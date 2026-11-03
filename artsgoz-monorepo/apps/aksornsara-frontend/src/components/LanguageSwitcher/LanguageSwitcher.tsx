import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  /** If true, renders a compact pill suitable for mobile sidebars. */
  compact?: boolean;
}

/**
 * LanguageSwitcher — toggles between Thai (th) and English (en).
 * Persists the user's choice to localStorage via i18next-browser-languagedetector.
 */
export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation('common');
  const currentLang = i18n.language?.startsWith('th') ? 'th' : 'en';

  const toggle = () => {
    i18n.changeLanguage(currentLang === 'th' ? 'en' : 'th');
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label="Toggle language"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 transition-all text-[13px] font-bold text-gray-600 select-none cursor-pointer shadow-sm"
      >
        <span className={currentLang === 'th' ? 'text-[#DE5D8F]' : 'text-gray-400'}>TH</span>
        <span className="text-gray-300">|</span>
        <span className={currentLang === 'en' ? 'text-[#DE5D8F]' : 'text-gray-400'}>EN</span>
      </button>
    );
  }

  return (
    <div
      className="relative flex items-center bg-gray-100/80 rounded-full p-[3px] select-none cursor-pointer"
      onClick={toggle}
      role="button"
      aria-label="Toggle language"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggle()}
    >
      {/* Sliding indicator */}
      <span
        className={`absolute top-[3px] w-[calc(50%-3px)] h-[calc(100%-6px)] rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          currentLang === 'th' ? 'left-[3px]' : 'left-[calc(50%)]'
        }`}
      />

      <span
        className={`relative z-10 px-2.5 py-0.5 text-[13px] font-bold transition-colors duration-300 rounded-full ${
          currentLang === 'th' ? 'text-[#DE5D8F]' : 'text-gray-400'
        }`}
      >
        TH
      </span>
      <span
        className={`relative z-10 px-2.5 py-0.5 text-[13px] font-bold transition-colors duration-300 rounded-full ${
          currentLang === 'en' ? 'text-[#DE5D8F]' : 'text-gray-400'
        }`}
      >
        EN
      </span>
    </div>
  );
}
