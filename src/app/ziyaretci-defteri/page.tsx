
'use client';

import { FeedbackSystem } from '@/components/feedback-system';
import { useLanguage } from '@/hooks/use-language';
import { MessageSquare } from 'lucide-react';

export default function GuestbookPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-slate-900 mb-4">
            {t('guestbook.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('guestbook.description')}
          </p>
        </div>

        <FeedbackSystem />
      </div>
    </div>
  );
}
