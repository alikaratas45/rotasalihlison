
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { tr, enUS, fr, de, ja } from 'date-fns/locale';
import { useLanguage } from '@/hooks/use-language';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { addFeedbackComment, likeFeedback, addFeedbackReply } from '@/firebase/firestore/feedback-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, ThumbsUp, MessageSquare, Send, CornerDownRight } from 'lucide-react';
import type { CommentFeedback } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const locales: Record<string, any> = { tr, en: enUS, fr, de, ja };

const feedbackSchema = z.object({
  name: z.string().max(50).optional(),
  message: z.string().min(3, 'Mesaj en az 3 karakter olmalıdır.').max(500),
});

const replySchema = z.object({
  name: z.string().min(2, 'İsim gereklidir.').max(50),
  message: z.string().min(2, 'Mesaj gereklidir.').max(300),
});

export function FeedbackSystem() {
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: comments, loading } = useCollection<CommentFeedback>(
    useMemo(() => query(collection(firestore, 'feedback'), orderBy('createdAt', 'desc')), [firestore])
  );

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { name: '', message: '' },
  });

  const onSubmit = (values: z.infer<typeof feedbackSchema>) => {
    setIsSubmitting(true);
    addFeedbackComment(firestore, { 
      name: values.name || t('guestbook.anonymous'), 
      message: values.message 
    }, {
      onSuccess: () => {
        form.reset();
        setIsSubmitting(false);
        toast({ title: t('guestbook.success') });
      },
      onError: () => setIsSubmitting(false)
    });
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* 1. COMMENTS LIST (NOW AT THE TOP) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline border-b pb-4 flex items-center gap-2">
            <MessageSquare className="text-primary" />
            {t('guestbook.diaryTitle')} ({comments?.length || 0})
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : comments?.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">{t('guestbook.noFeedback')}</div>
        ) : (
          comments?.map((comment) => (
            <FeedbackItem key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* 2. SUBMISSION FORM (NOW AT THE BOTTOM) */}
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{t('guestbook.leaveMessage')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Input placeholder={t('guestbook.namePlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl><Textarea rows={4} placeholder={t('guestbook.messagePlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-5 w-5" />}
                {t('guestbook.submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackItem({ comment }: { comment: CommentFeedback }) {
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const liked = JSON.parse(localStorage.getItem('liked_feedbacks') || '[]');
    return liked.includes(comment.id);
  });

  const handleLike = () => {
    if (isLiked) return;
    likeFeedback(firestore, comment.id, {
      onSuccess: () => {
        setIsLiked(true);
        const liked = JSON.parse(localStorage.getItem('liked_feedbacks') || '[]');
        localStorage.setItem('liked_feedbacks', JSON.stringify([...liked, comment.id]));
      }
    });
  };

  const timeAgo = comment.createdAt?.toDate 
    ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: locales[language] || tr })
    : '...';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="border-none shadow-md overflow-hidden bg-card/50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/5 text-primary font-bold">
                {(comment.name || 'Z').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{comment.name}</span>
                <span className="text-xs text-muted-foreground italic">{timeAgo}</span>
              </div>
              <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">{comment.message}</p>
              
              <div className="flex items-center gap-6 pt-2">
                <button 
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium transition-colors",
                    isLiked ? "text-primary cursor-default" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
                  {comment.likes || 0}
                </button>
                <button 
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t('guestbook.reply')}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
        {showReplyForm && (
          <div className="px-6 pb-6 border-t pt-4 bg-muted/20">
            <ReplyForm 
              feedbackId={comment.id} 
              onSuccess={() => setShowReplyForm(false)} 
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 md:ml-16 space-y-4">
          {comment.replies.map((reply, idx) => (
            <div key={idx} className="flex gap-3 items-start animate-in slide-in-from-left-2 duration-300">
               <CornerDownRight className="h-5 w-5 text-muted-foreground/40 shrink-0 mt-2" />
               <div className="bg-muted p-4 rounded-xl flex-1 shadow-sm border border-black/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-primary">{reply.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      {reply.createdAt?.toDate ? formatDistanceToNow(reply.createdAt.toDate(), { addSuffix: true, locale: locales[language] || tr }) : ''}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{reply.message}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReplyForm({ feedbackId, onSuccess, onCancel }: { feedbackId: string; onSuccess: () => void; onCancel: () => void }) {
  const { t } = useLanguage();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: { name: '', message: '' },
  });

  const onSubmit = (values: z.infer<typeof replySchema>) => {
    setLoading(true);
    addFeedbackReply(firestore, feedbackId, {
      name: values.name,
      message: values.message
    }, {
      onSuccess: () => {
        setLoading(false);
        onSuccess();
      },
      onError: () => setLoading(false)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl><Input placeholder={t('guestbook.namePlaceholder')} className="h-9 text-sm" {...field} /></FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                    )}
                />
            </div>
            <div className="sm:col-span-2">
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl><Input placeholder={t('guestbook.replyPlaceholder', 'Yanıtınız...')} className="h-9 text-sm" {...field} /></FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                    )}
                />
            </div>
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>İptal</Button>
            <Button type="submit" size="sm" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : t('guestbook.submit')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
