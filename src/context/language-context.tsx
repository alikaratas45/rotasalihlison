"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import fr from '@/locales/fr.json';
import de from '@/locales/de.json';

export type Language = 'en' | 'tr' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
  isAudioGuideEnabled: boolean;
  toggleAudioGuide: () => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = { en, tr, fr, de };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');
  const [isAudioGuideEnabled, setIsAudioGuideEnabled] = useState(true);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const savedAudioPreference = localStorage.getItem('audioGuideEnabled');
    if (savedAudioPreference !== null) {
        setIsAudioGuideEnabled(JSON.parse(savedAudioPreference));
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
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
