export type Language = 'en' | 'tr' | 'fr' | 'de' | 'ja';

export const languageMap: Record<Language, string> = {
    tr: 'Turkish',
    en: 'English',
    fr: 'French',
    de: 'German',
    ja: 'Japanese'
};

export const languages: { code: Language; name: string }[] = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
];
