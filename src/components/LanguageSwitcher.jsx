import { useTranslation } from 'react-i18next'

// const API_KEY = 'AIzaSyAyhElk_yaEKMQ_JUDerR724FIRxiDmWUk'
const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;


export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

const translate = async (lang) => {
  const cacheKey = `translations_${lang}`;
  localStorage.removeItem(cacheKey); // Optional: clear cache for testing

  console.log('Language selected:', lang);

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    console.log('Loading cached translation for:', lang);
    i18n.addResourceBundle(lang, 'translation', JSON.parse(cached), true, true);
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    return;
  }

  const englishText = i18n.store?.data?.en?.translation;
  if (!englishText) {
    console.warn('❌ English base translations not loaded');
    return;
  }

  const keys = Object.keys(englishText);
  const values = keys.map(k => englishText[k]);

  try {
    const result = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: values,
          target: lang,
          format: 'text',
        }),
      }
    );

    if (!result.ok) {
      throw new Error(`API Error: ${result.status} ${result.statusText}`);
    }

    const { data } = await result.json();
    const newTranslations = {};
    keys.forEach((key, i) => {
      newTranslations[key] = data.translations[i]?.translatedText || englishText[key];
    });

    localStorage.setItem(cacheKey, JSON.stringify(newTranslations));
    localStorage.setItem('lang', lang);
    i18n.addResourceBundle(lang, 'translation', newTranslations, true, true);
    i18n.changeLanguage(lang);
  } catch (err) {
    console.error('❌ Translation failed:', err);
  }
};

  

  return (
    <select
      onChange={(e) => translate(e.target.value)}
      value={i18n.language}
      className="p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
    >
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="fr">French</option>
      <option value="es">Spanish</option>
    </select>
  )
}
