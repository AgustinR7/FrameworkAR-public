import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
};

i18n
  .use(LanguageDetector) // detecta el idioma del navegador
  .use(initReactI18next) // enlaza con react-i18next
  .init({
    resources,
    fallbackLng: 'es', // idioma por defecto si el detectado no está disponible
    interpolation: {
      escapeValue: false, // react ya protege contra XSS
    },
  });

export default i18n;
