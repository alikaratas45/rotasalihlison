'use client';

import { useLanguage } from '@/hooks/use-language';

export default function BisikletRotalariPage() {
  const { t } = useLanguage();

  const mapQuery = "bisiklet parkuru"; // 'bicycle track' için arama yap
  const salihliCoords = "38.48,28.14"; // Salihli'nin merkezi
  const zoomLevel = 13; 

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&ll=${salihliCoords}&z=${zoomLevel}&output=embed&hl=${t('header.routes') === 'Routen' ? 'de' : t('header.routes') === 'Itinéraires' ? 'fr' : t('header.routes') === 'ルート' ? 'ja' : t('header.routes') === 'Routes' ? 'en' : 'tr'}`;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('bicycleRoutes.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('bicycleRoutes.description')}</p>
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
          title={t('bicycleRoutes.title')}
        ></iframe>
      </div>
    </div>
  );
}
