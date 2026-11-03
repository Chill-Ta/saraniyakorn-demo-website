import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'th',
    supportedLngs: ['th', 'en'],
    ns: [
      'yellow_card',
      'credit_tracking',
    ],
    defaultNS: 'yellow_card',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'artsgoz_lang',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
