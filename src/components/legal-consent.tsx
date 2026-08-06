'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';

export function LegalConsent() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('rota_salihli_legal_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('rota_salihli_legal_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Çerez ve KVKK Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 bg-background/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-full duration-700">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="hidden sm:flex p-3 bg-primary/10 rounded-2xl text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium leading-relaxed max-w-2xl">
                {t('legal.cookieWarning')}{' '}
                <button 
                  onClick={() => setShowDetails(true)}
                  className="text-primary font-bold underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                  {t('legal.kvkkLink')}
                </button>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(true)}
              className="flex-1 md:flex-none h-11 rounded-xl font-bold"
            >
              {t('legal.details')}
            </Button>
            <Button 
              onClick={handleAccept}
              className="flex-[2] md:flex-none h-11 px-8 rounded-xl font-black bg-primary text-white shadow-lg shadow-primary/20"
            >
              {t('legal.accept')}
            </Button>
          </div>
        </div>
      </div>

      {/* KVKK Detay Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-0">
          <div className="p-8 md:p-10">
            <DialogHeader className="mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <Info className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-black font-headline text-primary uppercase tracking-tight">
                {t('legal.kvkkTitle')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="prose prose-slate max-w-none space-y-4 text-sm md:text-base leading-relaxed text-muted-foreground font-medium">
              <p className="text-foreground font-bold">{t('legal.kvkkIntro')}</p>
              
              <div className="space-y-4">
                <h4 className="text-primary font-black uppercase text-xs tracking-widest">{t('legal.section1Title')}</h4>
                <p>{t('legal.section1Text')}</p>
                
                <h4 className="text-primary font-black uppercase text-xs tracking-widest">{t('legal.section2Title')}</h4>
                <p>{t('legal.section2Text')}</p>
                
                <h4 className="text-primary font-black uppercase text-xs tracking-widest">{t('legal.section3Title')}</h4>
                <p>{t('legal.section3Text')}</p>
              </div>

              <div className="bg-muted/30 p-4 rounded-2xl border border-dashed mt-6">
                <p className="text-xs italic">
                  {t('legal.footerNote')}
                </p>
              </div>
            </div>

            <DialogFooter className="mt-8 pt-6 border-t">
              <Button onClick={() => setShowDetails(false)} className="w-full md:w-auto h-12 px-8 rounded-xl font-bold">
                {t('actions.close')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
