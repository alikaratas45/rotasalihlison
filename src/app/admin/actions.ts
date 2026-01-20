'use server';

import { ai } from '@/ai';
import { Language, languages, languageMap } from '@/lib/language-config';

async function doTranslate(text: string, targetLanguage: Language): Promise<string> {
    if (!text) return '';
    
    const targetLangName = languageMap[targetLanguage];

    const prompt = `Translate the following Turkish text to ${targetLangName}. Respond with only the translated text, without any additional explanations or context.\n\nText to translate: "${text}"`;

    try {
        const response = await ai.generate({
            model: 'googleai/gemini-pro',
            prompt: prompt,
            config: {
                temperature: 0.3,
            }
        });

        return response.text;
    } catch (error) {
        console.error(`Error translating to ${targetLangName}:`, error);
        if (error instanceof Error) {
            if (error.message.includes('Generative Language API has not been enabled') || error.message.includes('403 Forbidden')) {
                 throw new Error(`Google Generative AI API'si henüz tam olarak aktifleşmemiş olabilir. Lütfen birkaç dakika bekleyip tekrar deneyin. Eğer sorun devam ederse, Google Cloud projenizde "Generative Language API"nin etkin olduğundan emin olun.`);
            }
            throw new Error(`Çeviri sırasında bir hata oluştu: ${error.message}`);
        }
        throw new Error(`Bilinmeyen bir çeviri hatası oluştu.`);
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
