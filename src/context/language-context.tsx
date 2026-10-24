
"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import fr from '@/locales/fr.json';
import de from '@/locales/de.json';
import ja from '@/locales/ja.json';
import { type Language } from '@/lib/language-config';
export type { Language };

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
  // Sunucu tarafında veya ilk renderda varsayılan olarak 'tr' başlasın (Türkiye odaklı proje olduğu için)
  // Ancak istemci tarafında anında cihaz diline göre güncellenecek.
  const [language, setLanguageState] = useState<Language>('tr');
  const [isAudioGuideEnabled, setIsAudioGuideEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sadece mount olduktan sonra tarayıcı ayarlarını oku
    const savedLang = localStorage.getItem('language') as Language;
    const supportedLanguages: Language[] = ['en', 'tr', 'fr', 'de', 'ja'];
    
    if (savedLang && supportedLanguages.includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // Tarayıcı/Cihaz dilini al (en-US -> en)
      const browserLang = navigator.language.split('-')[0] as Language;
      
      if (supportedLanguages.includes(browserLang)) {
        setLanguageState(browserLang);
      } else {
        // Eğer bu 5 dilin dışında bir dil ise İngilizce açılsın.
        setLanguageState('en');
      }
    }

    const savedAudioPreference = localStorage.getItem('audioGuideEnabled');
    if (savedAudioPreference !== null) {
      setIsAudioGuideEnabled(JSON.parse(savedAudioPreference));
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
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
    // İstemci tarafında algılanan dil henüz yerleşmediyse TR, yerleştiyse algılanan dili kullan
    const activeLanguage = mounted ? language : 'tr';
    
    const keys = key.split('.');
    let result = translations[activeLanguage];
    
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // İngilizceye fallback yap
        let fallbackResult = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if(fallbackResult === undefined) return key;
        }
        result = fallbackResult;
        break;
      }
    }
    
    // Çoğul ekleri yönetimi
    if (typeof result === 'string' && args.length > 0 && args[0].count !== undefined) {
       if (activeLanguage === 'tr') return result;
       const count = args[0].count;
       return count === 1 ? result : (translations[activeLanguage][key + '_plural'] || `${result}s`);
    }

    // Değişken yerleştirme
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
