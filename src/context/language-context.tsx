
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
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = { en, tr, fr, de, ja };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');
  const [isAudioGuideEnabled, setIsAudioGuideEnabled] = useState(true);

  // Bu effect, istemci tarafında ilk render'dan sonra çalışarak dil ve sesli rehber tercihlerini geri yükler.
  useEffect(() => {
    // 1. Önce localStorage'da kayıtlı dil var mı kontrol et
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && languages.some(l => l.code === savedLang)) {
      setLanguageState(savedLang);
    } else {
      // 2. Yoksa tarayıcı ayarlarına bak
      const browserLang = navigator.language.split('-')[0] as Language;
      if (languages.some(l => l.code === browserLang)) {
        setLanguageState(browserLang);
      }
    }

    // Sesli rehber tercihini geri yükle
    const savedAudioPreference = localStorage.getItem('audioGuideEnabled');
    if (savedAudioPreference !== null) {
      setIsAudioGuideEnabled(JSON.parse(savedAudioPreference));
    }
  }, []);

  // Dil değiştiğinde HTML lang niteliğini güncelle
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang); // Seçimi kaydet
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
        // Çeviri eksikse İngilizceye düş
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
