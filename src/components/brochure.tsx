'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Brochure } from '@/lib/definitions';

interface BrochureViewerProps {
  brochure: Brochure;
}

export function BrochureViewer({ brochure }: BrochureViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = brochure.pages.length;

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="relative w-full max-w-md aspect-[3/4] perspective-1000"
      >
        {brochure.pages.map((page, index) => {
          const isCurrent = index === currentPage;
          const isPast = index < currentPage;
          
          return (
            <div
              key={index}
              className={cn(
                "absolute w-full h-full transition-transform duration-700 transform-style-3d",
                isCurrent ? 'z-10' : 'z-0',
                !isCurrent && 'pointer-events-none'
              )}
              style={{
                transform: isPast ? 'translateX(-100%)' : 'translateX(0)',
                opacity: isCurrent ? 1 : 0,
              }}
            >
              <div className="w-full h-full">
                <Image
                    src={page.imageUrl}
                    alt={`Brochure page ${index + 1}`}
                    data-ai-hint={page.imageHint}
                    fill
                    className="object-cover rounded-md shadow-lg"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button onClick={goToPrevPage} disabled={currentPage === 0} variant="outline">
          <ChevronLeft className="mr-2" />
          Önceki
        </Button>
        <span className="text-muted-foreground font-medium">
          Sayfa {currentPage + 1} / {totalPages}
        </span>
        <Button onClick={goToNextPage} disabled={currentPage >= totalPages - 1} variant="outline">
          Sonraki
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
