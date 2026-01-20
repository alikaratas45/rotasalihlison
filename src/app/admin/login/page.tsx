'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInWithEmail } from '@/firebase/auth/auth-service';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(1, 'Kullanıcı adı gereklidir.'),
  password: z.string().min(1, 'Şifre gereklidir.'),
});

export default function AdminLoginPage() {
  useAuthRedirect({ to: '/admin', condition: (user) => !!user });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // As requested, map username 'ali' to the admin email.
    if (values.username !== 'ali') {
      toast({
        variant: 'destructive',
        title: 'Giriş Başarısız',
        description: 'Kullanıcı adı hatalı.',
      });
      return;
    }

    try {
      // Use the designated admin email with the provided password.
      // Firebase will handle the password validation.
      await signInWithEmail('alikarataskula@gmail.com', values.password);
      toast({
        title: 'Giriş Başarılı',
        description: 'Yönetim paneline yönlendiriliyorsunuz.',
      });
    } catch (error: any) {
      let description = 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      if (error.code === 'auth/invalid-credential') {
        description = 'Kimlik bilgileri geçersiz. Firebase konsolunda yönetici kullanıcısını (alikarataskula@gmail.com) oluşturduğunuzdan ve şifrenin doğru olduğundan (salihli) emin olun.';
      }
      toast({
        variant: 'destructive',
        title: 'Giriş Başarısız',
        description: description,
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <CardDescription>
            Giriş yapmak için yönetici bilgilerinizi girin.
          </CardDescription>
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
                      <Input
                        placeholder="ali"
                        {...field}
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
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Giriş Yap
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
