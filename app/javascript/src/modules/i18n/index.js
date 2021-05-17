/* istanbul ignore file */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
// import PhraseInContextEditorPostProcessor from 'i18next-phrase-in-context-editor-post-processor';

i18n
  .use(Backend)
  .use(initReactI18next)
  // .use(
  //   new PhraseInContextEditorPostProcessor({
  //     phraseEnabled: true,
  //     projectId: 'c6cc13fd16dfbacd426574fa4401d762'
  //   })
  // )
  .init({
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    },
    postProcess: ['phraseInContextEditor']
  });

export default i18n;
