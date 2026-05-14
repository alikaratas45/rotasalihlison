'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithUsername } from '@/firebase/auth/auth-service';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons/logo';
import { Loader2 } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Kullanıcı adı gereklidir.' }),
  password: z.string().min(1, { message: 'Şifre gereklidir.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const user = await signInWithUsername(auth, firestore, values.username, values.password);
      if (user) {
        toast({
          title: 'Giriş Başarılı',
          description: 'Yönetim paneline yönlendiriliyorsunuz...',
        });
        router.push('/admin');
      }
    } catch (error: any) {
      let description = 'Giriş sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.';
      
      // Firebase hata kodlarına göre özel mesajlar
      if (
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' ||
        error.message === 'auth/invalid-credential'
      ) {
        description = 'Kullanıcı adı veya şifre geçersiz. Lütfen tekrar deneyin.';
      } else if (error.code === 'auth/too-many-requests') {
        description = 'Çok fazla başarısız deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
      }

      toast({
        variant: 'destructive',
        title: 'Giriş Başarısız',
        description,
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm border-none shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <div className="mb-4 flex justify-center">
            <Logo className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-black font-headline text-primary">Admin Paneli</CardTitle>
          <CardDescription className="font-medium text-slate-500">Yönetim paneline erişmek için bilgilerinizi girin.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Kullanıcı Adı</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="" 
                        {...field} 
                        className="rounded-xl h-12 focus:ring-2 focus:ring-primary/20 border-slate-200" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Şifre</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="rounded-xl h-12 focus:ring-2 focus:ring-primary/20 border-slate-200" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl font-black text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                Giriş Yap
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
