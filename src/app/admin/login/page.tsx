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

const formSchema = z.object({
  username: z.string().min(1, { message: 'Kullanıcı adı gereklidir.' }),
  password: z.string().min(1, { message: 'Şifre gereklidir.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    if (values.username !== 'admin') {
        toast({
            variant: 'destructive',
            title: 'Giriş Başarısız',
            description: 'Kullanıcı adı geçersiz.',
        });
        setIsSubmitting(false);
        return;
    }

    try {
      const user = await signInWithUsername(values.username, values.password);
      if (user) {
        toast({
          title: 'Giriş Başarılı',
          description: 'Yönetim paneline yönlendiriliyorsunuz...',
        });
        router.push('/admin');
      }
    } catch (error: any) {
      let description = 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.';
       if (error.code === 'auth/invalid-credential') {
         description =
           'Kimlik bilgileri geçersiz. Şifrenizin yanlış olmadığından ve Firebase projenizde yönetici kullanıcısının (admin@salihli.bel.tr) doğru şifreyle (salihliadmin) oluşturulduğundan emin olun.';
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
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Paneli</CardTitle>
          <CardDescription>Yönetim paneline erişmek için giriş yapın.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kullanıcı Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} />
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
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Giriş Yap
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
