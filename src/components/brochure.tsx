'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Brochure, LocalizedString } from '@/lib/definitions';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';


interface BrochureViewerProps {
  brochure: Brochure;
}

export function BrochureViewer({ brochure }: BrochureViewerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { language } = useLanguage();
  const typedLanguage = language as Language;

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const totalPages = brochure.pages.length;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {brochure.pages.map((page, index) => (
            <div className="relative flex-shrink-0 flex-grow-0 basis-full min-w-0" key={index}>
              <div className="relative w-full aspect-[9/16] md:aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-gray-900">
                <Image
                  src={page.imageUrl}
                  alt={`Brochure page ${index + 1}`}
                  data-ai-hint={page.imageHint}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                  {page.title && (
                    <h3 className="text-2xl md:text-3xl font-bold font-headline mb-2 text-shadow">
                      {page.title[typedLanguage]}
                    </h3>
                  )}
                  {page.text && (
                    <p className="text-sm md:text-base text-shadow-md">
                      {page.text[typedLanguage]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button onClick={scrollPrev} disabled={!prevBtnEnabled} variant="outline">
          <ChevronLeft className="mr-2" />
          Önceki
        </Button>
        <span className="text-muted-foreground font-medium">
          Sayfa {selectedIndex + 1} / {totalPages}
        </span>
        <Button onClick={scrollNext} disabled={!nextBtnEnabled} variant="outline">
          Sonraki
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
