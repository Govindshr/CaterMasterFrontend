import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const en = {
  welcome: 'Welcome to Catermaster!',
  submit: 'Submit',
  cancel: 'Cancel',
  search: 'Search',
  appTitle: 'Welcome to Catermaster!',
}

  

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en
    }
  },
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
