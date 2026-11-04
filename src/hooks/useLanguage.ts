import { useEffect, useState } from 'react';
import type { Language } from '../data/clinic';
import { translations } from '../data/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('clinic-language') === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = `${t.name} | ${t.doctor}`;
    for (const [selector, content] of [
      ['meta[name="description"]', t.intro],
      ['meta[property="og:title"]', `${t.name} | ${t.doctor}`],
      ['meta[property="og:description"]', t.intro],
    ]) {
      document.querySelector(selector)?.setAttribute('content', content);
    }
    try {
      localStorage.setItem('clinic-language', language);
    } catch {
      /* Language switching still works without storage. */
    }
  }, [language, t]);

  return {
    language,
    t,
    toggleLanguage: () =>
      setLanguage((current) => (current === 'ar' ? 'en' : 'ar')),
  };
}
