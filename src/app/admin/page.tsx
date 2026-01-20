'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { addPlace } from '@/firebase/firestore/places-service';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Sadece Türkçe giriş alanlarını içeren yeni şema
const formSchema = z.object({
  name_tr: z.string().min(1, 'İsim gerekli.'),
  slug_tr: z.string().min(1, 'Link gerekli.'),
  description_tr: z.string().min(1, 'Açıklama gerekli.'),
  category: z.enum(['history', 'nature', 'food', 'shopping', 'poi']),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export default function AdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_tr: '',
      slug_tr: '',
      description_tr: '',
      category: 'poi',
      lat: 38.48,
      lng: 28.14,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Diğer diller için Türkçe verileri geçici olarak kullanıyoruz.
    const newPlace = {
      name: {
        tr: values.name_tr,
        en: values.name_tr,
        fr: values.name_tr,
        de: values.name_tr,
      },
      slug: {
        tr: values.slug_tr,
        en: values.slug_tr,
        fr: values.slug_tr,
        de: values.slug_tr,
      },
      description: {
        tr: values.description_tr,
        en: values.description_tr,
        fr: values.description_tr,
        de: values.description_tr,
      },
      category: values.category,
      coordinates: {
        lat: values.lat,
        lng: values.lng,
      },
    };

    try {
      await addPlace(firestore, newPlace);
      toast({
        title: 'Başarılı!',
        description: `"${values.name_tr}" başarıyla eklendi.`,
      });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Yer eklenirken bir sorun oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Yer Ekle</CardTitle>
        <CardDescription>
          Formu doldurarak uygulamaya yeni bir mekan ekleyin. Diğer diller için
          girişler otomatik olarak Türkçe metin üzerinden atanacaktır.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name_tr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug_tr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      URL'de görünecek kısım. Örn: "sardes-antik-kenti"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description_tr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="history">Tarih</SelectItem>
                        <SelectItem value="nature">Doğa</SelectItem>
                        <SelectItem value="food">Lezzet</SelectItem>
                        <SelectItem value="shopping">Alışveriş</SelectItem>
                        <SelectItem value="poi">Önemli Nokta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yeni Yeri Ekle
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
