"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import fr from '@/locales/fr.json';
import de from '@/locales/de.json';
import ja from '@/locales/ja.json';

export type Language = 'en' | 'tr' | 'fr' | 'de' | 'ja';

export const languages: { code: Language; name: string }[] = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
  isAudioGuideEnabled: boolean;
  toggleAudioGuide: () => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = { en, tr, fr, de, ja };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');
  const [isAudioGuideEnabled, setIsAudioGuideEnabled] = useState(true);

  // This effect runs only on the client, after the initial render, to sync with browser settings.
  useEffect(() => {
    // Set language from browser settings
    const browserLang = navigator.language.split('-')[0] as Language;
    if (['tr', 'en', 'fr', 'de', 'ja'].includes(browserLang)) {
      setLanguageState(browserLang);
    }

    // Set audio guide preference from localStorage
    const savedAudioPreference = localStorage.getItem('audioGuideEnabled');
    if (savedAudioPreference !== null) {
      setIsAudioGuideEnabled(JSON.parse(savedAudioPreference));
    }
  }, []); // Empty dependency array ensures it runs only once on the client mount.

  // This effect synchronizes the document's lang attribute whenever the language state changes.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleAudioGuide = useCallback(() => {
    setIsAudioGuideEnabled(prev => {
        const newState = !prev;
        localStorage.setItem('audioGuideEnabled', JSON.stringify(newState));
        if (!newState) {
            window.speechSynthesis.cancel();
        }
        return newState;
    });
  }, []);

  const t = useCallback((key: string, ...args: any[]): string => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if(fallbackResult === undefined) return key;
        }
        result = fallbackResult;
        break;
      }
    }
    
    if (typeof result === 'string' && args.length > 0 && args[0].count !== undefined) {
       if (language === 'tr') {
         // No pluralization for Turkish
         return result;
       }
       const count = args[0].count;
       return count === 1 ? result : (translations[language][key + '_plural'] || `${result}s`);
    }

    if (typeof result === 'string' && args.length > 0) {
      return result.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
      });
    }

    return result || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAudioGuideEnabled, toggleAudioGuide }}>
      {children}
    </LanguageContext.Provider>
  );
};
