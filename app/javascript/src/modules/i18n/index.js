/* istanbul ignore file */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';

// Disabled the in-context editor integration for now 
// import PhraseInContextEditorPostProcessor from 'i18next-phrase-in-context-editor-post-processor';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
