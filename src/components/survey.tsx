'use client';

import { useState } from 'react';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SurveyProps {
  placeId: string;
  placeName: string;
}

const CRITERIA = [
  { id: 'cleanliness', labelKey: 'survey.cleanliness' },
  { id: 'accessibility', labelKey: 'survey.accessibility' },
  { id: 'satisfaction', labelKey: 'survey.satisfaction' },
];

export function Survey({ placeId, placeName }: SurveyProps) {
  const { t } = useLanguage();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, number>>({
    cleanliness: 0,
    accessibility: 0,
    satisfaction: 0,
  });
  const [extraAnswers, setExtraAnswers] = useState<Record<string, string>>({
    withTour: '',
    guided: '',
    infoBoards: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingChange = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const handleExtraChange = (id: string, value: string) => {
    setExtraAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const isComplete = Object.values(ratings).every(r => r > 0) && 
                       extraAnswers.withTour !== '' && 
                       extraAnswers.guided !== '' && 
                       extraAnswers.infoBoards !== '';

    if (!isComplete) {
      toast({
        variant: 'destructive',
        title: t('survey.errorTitle'),
        description: t('survey.errorDescription'),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'feedbacks'), {
        placeId,
        placeName,
        ...ratings,
        ...extraAnswers,
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      toast({
        title: t('survey.successTitle'),
        description: t('survey.successDescription'),
      });
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: 'destructive',
        title: t('survey.submitErrorTitle'),
        description: error.message || t('survey.submitErrorDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="mt-8 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
          <h3 className="text-xl font-bold font-headline">{t('survey.thankYouTitle')}</h3>
          <p className="text-muted-foreground mt-2">{t('survey.thankYouDescription')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-md border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{t('survey.title')}</CardTitle>
        <CardDescription>{t('survey.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* Star Rating Criteria */}
        <div className="space-y-8">
          {CRITERIA.map((criterion) => (
            <div key={criterion.id} className="space-y-4">
              <p className="font-semibold text-base md:text-lg text-foreground">{t(criterion.labelKey)}</p>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(criterion.id, star)}
                    className="transition-transform active:scale-90 hover:scale-110 focus:outline-none"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={cn(
                        "h-10 w-10 md:h-12 md:w-12 transition-all duration-200",
                        ratings[criterion.id] >= star
                          ? "fill-yellow-400 text-yellow-600 stroke-[2px]"
                          : "fill-muted/20 text-muted-foreground/40 stroke-[1.5px] hover:text-yellow-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Yes/No Extra Questions */}
        <div className="space-y-8 pt-4 border-t border-muted">
          <div className="space-y-4">
            <p className="font-semibold text-base md:text-lg text-foreground">{t('survey.withTour')}</p>
            <RadioGroup 
              onValueChange={(val) => handleExtraChange('withTour', val)} 
              className="flex gap-6"
              value={extraAnswers.withTour}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="tour-yes" />
                <Label htmlFor="tour-yes" className="cursor-pointer text-base">{t('survey.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="tour-no" />
                <Label htmlFor="tour-no" className="cursor-pointer text-base">{t('survey.no')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-base md:text-lg text-foreground">{t('survey.guided')}</p>
            <RadioGroup 
              onValueChange={(val) => handleExtraChange('guided', val)} 
              className="flex gap-6"
              value={extraAnswers.guided}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="guided-yes" />
                <Label htmlFor="guided-yes" className="cursor-pointer text-base">{t('survey.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="guided-no" />
                <Label htmlFor="guided-no" className="cursor-pointer text-base">{t('survey.no')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-base md:text-lg text-foreground">{t('survey.infoBoards')}</p>
            <RadioGroup 
              onValueChange={(val) => handleExtraChange('infoBoards', val)} 
              className="flex gap-6"
              value={extraAnswers.infoBoards}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="info-yes" />
                <Label htmlFor="info-yes" className="cursor-pointer text-base">{t('survey.yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="info-no" />
                <Label htmlFor="info-no" className="cursor-pointer text-base">{t('survey.no')}</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="w-full mt-6 h-14 text-xl font-bold shadow-lg"
        >
          {isSubmitting && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
          {t('survey.submitButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
