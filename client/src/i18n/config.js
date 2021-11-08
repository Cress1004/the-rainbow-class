import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

i18n.use(reactI18nextModule).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {
      translations: require('./locales/en/translations.json')
    },
    vi: {
      translations: require('./locales/vi/translations.json')
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = ['en', 'vi'];

export default i18n;