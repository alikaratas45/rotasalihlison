
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dna, Mountain, Utensils, ShoppingBag, MapPinned, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { useMemo } from 'react';
import { Placeholders } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/lib/data/routes';

function PopularDestinations() {
    const { t, language } = useLanguage();
    const typedLanguage = language as Language;
    const firestore = useFirestore();

    const popularSlugs = ['sardes-ancient-city', 'kursunlu-thermal-springs', 'salihli-wood-meatballs'];

    const popularPlacesQuery = useMemo(() => {
        return query(collection(firestore, 'places'), where('slug.en', 'in', popularSlugs));
    }, [firestore]);

    const { data: popularDestinations, loading } = useCollection<Place>(popularPlacesQuery);

    if (loading) {
        return (
            <div className="grid md:grid-cols-3 gap-8 -mt-32 md:-mt-48 z-10 relative">
                {Array.from({ length: 3 }).map((_, i) => (
                     <Card key={i} className="overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            <Skeleton className="h-64 w-full" />
                             <div className="p-4 bg-card text-card-foreground md:hidden">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                             </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
    
    // Sort the results to match the order in popularSlugs
    const sortedDestinations = popularDestinations?.sort((a, b) => {
        return popularSlugs.indexOf(a.slug.en) - popularSlugs.indexOf(b.slug.en);
    }) || [];

    return (
        <div className="grid md:grid-cols-3 gap-8 -mt-32 md:-mt-48 z-10 relative">
            {sortedDestinations.map((place, index) => (
              <Card key={`${place.id}-${index}`} className="overflow-hidden group border-2 border-transparent hover:border-accent transition-all duration-300 shadow-xl">
                <CardContent className="p-0">
                  <Link href={`/yerler/${place.slug[typedLanguage]}`} className="block">
                    <div className="relative h-64 w-full">
                      <Image
                        src={place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`}
                        alt={place.name[typedLanguage]}
                        data-ai-hint={place.imageHint || 'landmark'}
                        fill
                        className="object-cover md:group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:from-black/60 md:to-transparent" />
                    </div>
                    <div className="absolute bottom-0 p-4 text-white hidden md:block">
                      <h3 className="text-2xl font-bold font-headline">{place.name[typedLanguage]}</h3>
                      <span className="text-green-400">{t('actions.seeDetails')}</span>
                    </div>
                     <div className="p-4 bg-card text-card-foreground md:hidden">
                        <h3 className="text-xl font-bold font-headline mb-1">{place.name[typedLanguage]}</h3>
                        <span className="text-sm font-semibold text-green-600">{t('actions.seeDetails')}</span>
                     </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
        </div>
    );
}


export default function Home() {
  const { t, language } = useLanguage();
  const heroImage = Placeholders.find(p => p.id === 'hero-main');

  const typedLanguage = language as Language;

  const thematicRoutes = routes.slice(0, 3);

  const experienceMenu = [
    { name: t('home.historyTrip'), icon: Dna, link: '/yerler?category=history' },
    { name: t('home.naturePeace'), icon: Mountain, link: '/yerler?category=nature' },
    { name: t('home.flavorStops'), icon: Utensils, link: '/lezzetler' },
    { name: t('home.shopping'), icon: ShoppingBag, link: '/yerler?category=shopping' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline drop-shadow-lg">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-4 text-lg md:text-2xl drop-shadow-md">
            {t('home.heroSubtitle')}
          </p>
          <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/yerler">{t('home.getStarted')}</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <PopularDestinations />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-2">{t('home.experienceTitle')}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{t('home.experienceSubtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {experienceMenu.map((item) => (
              <Link href={item.link} key={item.name} className="group">
                <Card className="p-6 flex flex-col items-center justify-center aspect-square bg-secondary/50 hover:bg-secondary transition-colors duration-300">
                  <item.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-center">{item.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline mb-2">{t('home.thematicRoutesTitle')}</h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">{t('home.thematicRoutesSubtitle')}</p>
            <Button asChild variant="outline">
                <Link href="/rotalar">{t('home.allRoutes')}</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {thematicRoutes.map(route => {
              let imageId = '';
              switch (route.slug.en) {
                case 'lydian-treasures-route':
                  imageId = 'gymnasium';
                  break;
                case 'gediz-valley-nature-route':
                  imageId = 'adala-volcanic-canyon';
                  break;
                case 'salihli-flavors-route':
                  imageId = 'salihli-wood-meatballs';
                  break;
                default:
                  imageId = route.id; // fallback
              }
              const placeholder = Placeholders.find(p => p.id === imageId);
              return (
              <Link href={`/rotalar/${route.slug[typedLanguage]}`} key={route.id} className="group">
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-48 w-full">
                      <Image
                        src={placeholder?.imageUrl || `https://picsum.photos/seed/${route.id}/600/400`}
                        alt={route.name[typedLanguage]}
                        data-ai-hint={placeholder?.imageHint || 'route map'}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold font-headline mb-2">{route.name[typedLanguage]}</h3>
                      <p className="text-muted-foreground text-sm flex-grow">{route.description[typedLanguage].substring(0, 100)}...</p>
                      <div className="flex items-center text-sm text-primary font-semibold mt-4">
                        <MapPinned className="w-4 h-4 mr-2"/>
                        <span>{route.stops.length} {t('home.stops', {count: route.stops.length})}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )})}
          </div>
        </div>
      </section>

    </div>
  );
}
