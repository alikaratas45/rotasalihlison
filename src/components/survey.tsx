
'use client';

import { useState, useEffect } from 'react';
import { Star, Loader2, CheckCircle2, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { collection, serverTimestamp, doc, updateDoc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

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
  
  // States
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
  const [existingDocId, setExistingDocId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);

  // Check for previous submission on this device
  useEffect(() => {
    const savedSubmission = localStorage.getItem(`survey_v1_${placeId}`);
    if (savedSubmission) {
      setExistingDocId(savedSubmission);
    }
  }, [placeId]);

  const handleRatingChange = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const handleExtraChange = (id: string, value: string) => {
    setExtraAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleEditClick = () => {
    if (!existingDocId || !firestore) return;
    
    setIsLoadingPrevious(true);
    const docRef = doc(firestore, 'feedbacks', existingDocId);
    
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRatings({
            cleanliness: data.cleanliness || 0,
            accessibility: data.accessibility || 0,
            satisfaction: data.satisfaction || 0,
          });
          setExtraAnswers({
            withTour: data.withTour || '',
            guided: data.guided || '',
            infoBoards: data.infoBoards || '',
          });
          setIsEditing(true);
        } else {
          localStorage.removeItem(`survey_v1_${placeId}`);
          setExistingDocId(null);
          setIsEditing(true);
        }
        setIsLoadingPrevious(false);
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
        setIsLoadingPrevious(false);
      });
  };

  const handleSubmit = () => {
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
    const payload = {
      placeId,
      placeName,
      ...ratings,
      ...extraAnswers,
      updatedAt: serverTimestamp(),
    };

    if (existingDocId) {
      const docRef = doc(firestore, 'feedbacks', existingDocId);
      updateDoc(docRef, payload)
        .then(() => {
          setIsSubmitted(true);
          setIsEditing(false);
          setIsSubmitting(false);
          toast({
            title: t('survey.successTitle'),
            description: t('survey.successDescription'),
          });
        })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: payload,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
          setIsSubmitting(false);
        });
    } else {
      const feedbacksCol = collection(firestore, 'feedbacks');
      const newDocRef = doc(feedbacksCol);
      const newId = newDocRef.id;
      const createPayload = {
        ...payload,
        createdAt: serverTimestamp(),
      };

      setDoc(newDocRef, createPayload)
        .then(() => {
          localStorage.setItem(`survey_v1_${placeId}`, newId);
          setExistingDocId(newId);
          setIsSubmitted(true);
          setIsEditing(false);
          setIsSubmitting(false);
          toast({
            title: t('survey.successTitle'),
            description: t('survey.successDescription'),
          });
        })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: newDocRef.path,
            operation: 'create',
            requestResourceData: createPayload,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
          setIsSubmitting(false);
        });
    }
  };

  if (isSubmitted) {
    return (
      <Card className="mt-8 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
          <h3 className="text-xl font-bold font-headline">{t('survey.thankYouTitle')}</h3>
          <p className="text-muted-foreground mt-2">{t('survey.thankYouDescription')}</p>
          <Button variant="outline" className="mt-6" onClick={() => setIsSubmitted(false)}>
            <FileEdit className="mr-2 h-4 w-4" />
            {t('survey.editButton')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (existingDocId && !isEditing) {
    return (
      <Card className="mt-8 border-primary/10 bg-secondary/5">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-xl font-bold font-headline">{t('survey.alreadySubmitted')}</h3>
          <p className="text-muted-foreground mt-2">{t('survey.description')}</p>
          <Button 
            variant="default" 
            className="mt-6" 
            onClick={handleEditClick}
            disabled={isLoadingPrevious}
          >
            {isLoadingPrevious ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileEdit className="mr-2 h-4 w-4" />}
            {t('survey.editButton')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-md border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {isEditing ? t('survey.editButton') : t('survey.title')}
        </CardTitle>
        <CardDescription>{t('survey.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
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

        <div className="flex gap-4">
          {isEditing && (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)} 
              className="flex-1 h-14 text-xl"
            >
              İptal
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="flex-[2] h-14 text-xl font-bold shadow-lg"
          >
            {isSubmitting && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
            {isEditing ? t('survey.updateButton') : t('survey.submitButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
