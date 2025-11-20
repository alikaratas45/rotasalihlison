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
  const totalSpreads = Math.ceil(brochure.pages.length / 2);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalSpreads - 1, prev + 1));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="relative w-full max-w-4xl aspect-[2/1] perspective-1000"
      >
        {Array.from({ length: totalSpreads }).map((_, index) => {
          const leftPageIndex = index * 2;
          const rightPageIndex = index * 2 + 1;
          const leftPage = brochure.pages[leftPageIndex];
          const rightPage = brochure.pages[rightPageIndex];

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
                transform: isPast ? 'translateX(-100%) rotateY(-180deg)' : 'translateX(0) rotateY(0deg)',
              }}
            >
              <div className="absolute w-1/2 h-full left-0 origin-right transform-style-3d backface-hidden">
                {leftPage && (
                    <Image
                        src={leftPage.imageUrl}
                        alt={`Brochure page ${leftPageIndex + 1}`}
                        data-ai-hint={leftPage.imageHint}
                        fill
                        className="object-cover rounded-l-md shadow-md"
                    />
                )}
              </div>
              <div className="absolute w-1/2 h-full right-0 origin-left transform-style-3d backface-hidden">
                {rightPage && (
                    <Image
                        src={rightPage.imageUrl}
                        alt={`Brochure page ${rightPageIndex + 1}`}
                        data-ai-hint={rightPage.imageHint}
                        fill
                        className="object-cover rounded-r-md shadow-md"
                    />
                )}
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
          Sayfa {currentPage + 1} / {totalSpreads}
        </span>
        <Button onClick={goToNextPage} disabled={currentPage >= totalSpreads - 1} variant="outline">
          Sonraki
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
