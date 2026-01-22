'use client';

import { useLanguage } from '@/hooks/use-language';

export default function LezzetlerPage() {
  const { t } = useLanguage();

  const mapQuery = "Salihli'deki restoranlar";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('cuisine.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('cuisine.description')}</p>
      </div>

      <div className="w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden shadow-lg border">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t('cuisine.title')}
        ></iframe>
      </div>
    </div>
  );
}
