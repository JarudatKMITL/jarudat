// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules'; // นำเข้า polyfill สำหรับ Intl.PluralRules
import en from '../locales/en.json';
import th from '../locales/th.json';

i18n
  .use(initReactI18next) // บอกให้ i18next ใช้งานร่วมกับ react-i18next
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
    },
    lng: 'en', // ตั้งค่าเริ่มต้นเป็นภาษาอังกฤษ
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
