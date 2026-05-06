"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import fr from '@/locales/fr.json';
import de from '@/locales/de.json';
import ja from '@/locales/ja.json';
import { type Language, languages } from '@/lib/language-config';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
  isAudioGuideEnabled: boolean;
  toggleAudioGuide: () => void;
  mounted: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = { en, tr, fr, de, ja };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // CRITICAL: Initialize language to 'tr' to match server-side default and prevent hydration mismatch
  const [language, setLanguageState] = useState<Language>('tr');
  const [isAudioGuideEnabled, setIsAudioGuideEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only after mount, detect preferred language
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && languages.some(l => l.code === savedLang)) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (languages.some(l => l.code === (browserLang as any))) {
        setLanguageState(browserLang as Language);
      }
    }

    const savedAudioPreference = localStorage.getItem('audioGuideEnabled');
    if (savedAudioPreference !== null) {
      setIsAudioGuideEnabled(JSON.parse(savedAudioPreference));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  }, []);

  const toggleAudioGuide = useCallback(() => {
    setIsAudioGuideEnabled(prev => {
        const newState = !prev;
        localStorage.setItem('audioGuideEnabled', JSON.stringify(newState));
        
        if (!newState) {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        }
        return newState;
    });
  }, []);

  const t = useCallback((key: string, ...args: any[]): string => {
    // FORCE 'tr' during initial hydration to match server-rendered output
    const activeLanguage = mounted ? language : 'tr';
    
    const keys = key.split('.');
    let result = translations[activeLanguage];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
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
       if (activeLanguage === 'tr') return result;
       const count = args[0].count;
       return count === 1 ? result : (translations[activeLanguage][key + '_plural'] || `${result}s`);
    }

    if (typeof result === 'string' && args.length > 0) {
      return result.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
      });
    }

    return result || key;
  }, [language, mounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAudioGuideEnabled, toggleAudioGuide, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
};
