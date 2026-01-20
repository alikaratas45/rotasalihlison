'use server';

import { ai } from '@/ai';
import { Language, languages } from '@/context/language-context';

async function doTranslate(text: string, targetLanguage: Language): Promise<string> {
    if (!text) return '';
    
    const langMap: Record<Language, string> = {
        tr: 'Turkish',
        en: 'English',
        fr: 'French',
        de: 'German',
        ja: 'Japanese'
    };

    const targetLangName = langMap[targetLanguage];

    const prompt = `Translate the following Turkish text to ${targetLangName}. Respond with only the translated text, without any additional explanations or context.\n\nText to translate: "${text}"`;

    try {
        const response = await ai.generate({
            model: 'googleai/gemini-1.5-flash-latest',
            prompt: prompt,
            config: {
                temperature: 0.3,
            }
        });

        return response.text;
    } catch (error) {
        console.error(`Error translating to ${targetLangName}:`, error);
        return `Error: Could not translate.`;
    }
}

type TranslationResult = Record<Exclude<Language, 'tr'>, string>;

export async function translateAll(text: string, fieldType: 'slug' | 'text'): Promise<TranslationResult> {
    const targetLanguages = languages.filter(l => l.code !== 'tr').map(l => l.code);
    
    const translations = await Promise.all(
        targetLanguages.map(lang => doTranslate(text, lang))
    );

    const result: Partial<TranslationResult> = {};
    targetLanguages.forEach((lang, index) => {
        let translatedText = translations[index];
        if (fieldType === 'slug' && translatedText) {
            // For slugs, convert to lowercase and replace spaces/special chars with hyphens
            translatedText = translatedText
                .toLowerCase()
                .replace(/\s+/g, '-') // replace spaces with -
                .replace(/[^\w\-]+/g, '') // remove all non-word chars except -
                .replace(/\-\-+/g, '-') // replace multiple - with single -
                .replace(/^-+/, '') // trim - from start of text
                .replace(/-+$/, ''); // trim - from end of text
        }
        result[lang as Exclude<Language, 'tr'>] = translatedText;
    });

    return result as TranslationResult;
}
