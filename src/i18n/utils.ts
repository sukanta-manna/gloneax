// src/i18n/utils.ts
import { ui, languages } from './ui';

const defaultLang = 'en';

export function getLangFromUrl(url: URL) {
  const [, , prefix] = url.pathname.split('/');
  if (prefix in ui) return prefix as keyof typeof ui;
  
  // Alternative for root or default locale detection
  const firstSegment = url.pathname.split('/')[1];
  if (firstSegment in ui) return firstSegment as keyof typeof ui;
  
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    const langDict = ui[lang] as Record<keyof typeof ui[typeof defaultLang], string>;
    return langDict[key] || ui[defaultLang][key];
  };
}

// Helper to format URLs to include the correct language prefix automatically
export function useLocalizedPath(lang: keyof typeof ui) {
  return function translatePath(path: string) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return lang === defaultLang ? cleanPath : `/${lang}${cleanPath}`;
  };
}