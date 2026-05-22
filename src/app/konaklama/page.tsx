
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Bed, MapPin, Phone, ExternalLink, ArrowLeft, Thermometer, Navigation, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Place } from '@/lib/definitions';

export default function KonaklamaPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  // Fetch accommodation category places from Firestore
  const accommodationQuery = useMemo(() => 
    query(collection(firestore, 'places'), where('category', '==', 'accommodation'), orderBy('order')), 
    [firestore]
  );
  const { data: dynamicHotels, loading } = useCollection<Place>(accommodationQuery);

  const handleOpenMaps = () => {
    const searchQuery = encodeURIComponent("Salihli'deki Oteller");
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  // Kurşunlu Kaplıcaları Slugları
  const kursunluSlug: Record<string, string> = {
    tr: 'kursunlu-kaplicalari',
    en: 'kursunlu-thermal-springs',
    fr: 'sources-thermales-de-kursunlu',
    de: 'thermalquellen-von-kursunlu',
    ja: 'kursunlu-thermal-springs-ja'
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
            <Button asChild variant="ghost" size="sm">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t('header.home')}
                </Link>
            </Button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Bed className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-slate-900 mb-4">
            {t('accommodation.title', 'Konaklama')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('accommodation.description', 'Salihli seyahatinizde konaklayabileceğiniz konforlu oteller ve tesisler.')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-20">
          
          {/* KURŞUNLU KAPLICALARI ÖZEL BÖLÜM */}
          <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <Image 
                  src="https://i.imgur.com/n7fioom.jpeg" 
                  alt="Kurşunlu Kaplıcaları" 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  data-ai-hint="thermal hotel"
                  sizes="600px"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-primary/90 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-xl">
                    Belediye İşletmesi
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center bg-primary/5">
                <div className="flex items-center gap-3 text-primary mb-4">
                  <Thermometer className="h-6 w-6" />
                  <span className="font-black text-sm uppercase tracking-tighter">Termal & Sağlık</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black font-headline text-slate-900 mb-4 leading-tight">
                    Kurşunlu Kaplıcaları & Konaklama Tesisleri
                </h2>
                <p className="text-slate-600 font-medium text-lg leading-relaxed mb-8">
                    Doğanın kalbinde, şifalı sular ve kuş sesleri eşliğinde huzurlu bir konaklama deneyimi. Apart evler ve otel seçenekleriyle Salihli'nin en gözde tesisi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="rounded-xl h-14 font-black text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                    <Link href={`/yerler/${kursunluSlug[typedLanguage] || kursunluSlug.tr}`}>
                        <Info className="mr-2 h-5 w-5" />
                        Detayları İncele
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-xl h-14 font-black text-base bg-white border-primary/20 text-primary" onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=38.4487,28.1144', '_blank')}>
                    <Navigation className="mr-2 h-5 w-5" />
                    Yol Tarifi Al
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* DİNAMİK KONAKLAMA LİSTESİ */}
          <div className="space-y-8">
             <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-3xl font-black font-headline text-slate-800">Öne Çıkan İşletmeler</h2>
                {loading ? <Skeleton className="h-6 w-20" /> : <Badge variant="secondary" className="font-bold">{dynamicHotels?.length || 0} Tesis</Badge>}
             </div>

             {loading ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-[2rem]" />)}
                </div>
             ) : dynamicHotels && dynamicHotels.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {dynamicHotels.map((hotel) => (
                        <Link href={`/yerler/${hotel.slug[typedLanguage]}`} key={hotel.id} className="group">
                            <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl border-none ring-1 ring-black/5 rounded-[2rem]">
                                <div className="relative h-56 w-full overflow-hidden">
                                    <Image
                                        src={hotel.imageUrl || `https://picsum.photos/seed/${hotel.id}/600/400`}
                                        alt={hotel.name[typedLanguage]} 
                                        data-ai-hint="hotel building" 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="500px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-6">
                                        <Badge className="bg-white/90 text-primary font-bold">{hotel.name[typedLanguage]}</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6">
                                        {hotel.description[typedLanguage]}
                                    </p>
                                    <div className="text-sm font-black text-primary flex items-center uppercase tracking-wider">
                                        Detayları Gör
                                        <ChevronRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"/>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
             ) : (
                <p className="text-center py-12 text-muted-foreground italic bg-white/50 rounded-2xl border-2 border-dashed">
                    Henüz özel konaklama işletmesi eklenmemiş.
                </p>
             )}
          </div>

          {/* DİĞER OTELLER GENEL KART */}
          <Card className="hover:shadow-xl transition-all duration-500 border-primary/10 bg-secondary/30 rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="text-center pt-12">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner transition-transform duration-500 group-hover:scale-110">
                  <MapPin className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline font-black text-slate-800">Tüm Konaklama Tesisleri</CardTitle>
              <CardDescription className="mt-4 text-lg max-w-md mx-auto font-medium text-slate-600">
                  Salihli merkezinde ve termal bölgelerde yer alan tüm otel ve pansiyonları harita üzerinde görüntüleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-12">
              <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-16 gap-3 h-16 text-xl font-black rounded-2xl shadow-2xl hover:scale-105 transition-all bg-primary text-white" 
                  onClick={handleOpenMaps}
              >
                  Otelleri Haritada Gör
                  <ExternalLink className="h-5 w-5 opacity-70" />
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
