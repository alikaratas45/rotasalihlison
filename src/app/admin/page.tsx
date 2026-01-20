'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useEffect } from 'react';
import { addPlace, updatePlace, deletePlace, type PlaceFormData } from '@/firebase/firestore/places-service';
import { useCollection, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { seedPlaces } from '@/firebase/firestore/seed-service';
import { collection } from 'firebase/firestore';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, MoreHorizontal, FilePenLine, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Place } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';


const placeFormSchema = z.object({
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
  const [isAddSubmitting, setIsAddSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);

  const placesQuery = useMemo(() => collection(firestore, 'places'), [firestore]);
  const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);

  const addForm = useForm<PlaceFormData>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: {
      name_tr: '',
      slug_tr: '',
      description_tr: '',
      category: 'poi',
      lat: 38.48,
      lng: 28.14,
    },
  });

  const editForm = useForm<PlaceFormData>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: {
        name_tr: '',
        slug_tr: '',
        description_tr: '',
        category: 'poi',
        lat: 0,
        lng: 0,
    }
  });

  useEffect(() => {
    if (editingPlace) {
      editForm.reset({
        name_tr: editingPlace.name.tr,
        slug_tr: editingPlace.slug.tr,
        description_tr: editingPlace.description.tr,
        category: editingPlace.category,
        lat: editingPlace.coordinates.lat,
        lng: editingPlace.coordinates.lng,
      });
    }
  }, [editingPlace, editForm]);

  async function onAddSubmit(values: PlaceFormData) {
    setIsAddSubmitting(true);
    const randomSeed = Math.random().toString(36).substring(7);

    const newPlace = {
      name: { tr: values.name_tr, en: values.name_tr, fr: values.name_tr, de: values.name_tr, ja: values.name_tr },
      slug: { tr: values.slug_tr, en: values.slug_tr, fr: values.slug_tr, de: values.slug_tr, ja: values.slug_tr },
      description: { tr: values.description_tr, en: values.description_tr, fr: values.description_tr, de: values.description_tr, ja: values.description_tr },
      category: values.category,
      coordinates: { lat: values.lat, lng: values.lng },
      imageUrl: `https://picsum.photos/seed/${randomSeed}/600/400`,
      imageHint: 'landmark',
    };

    try {
      await addPlace(firestore, newPlace);
      toast({ title: 'Başarılı!', description: `"${values.name_tr}" başarıyla eklendi.` });
      addForm.reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata!', description: 'Yer eklenirken bir sorun oluştu.' });
    } finally {
      setIsAddSubmitting(false);
    }
  }

  async function onEditSubmit(values: PlaceFormData) {
    if (!editingPlace) return;
    setIsEditSubmitting(true);
    try {
      await updatePlace(firestore, editingPlace.id, values);
      toast({ title: 'Başarılı!', description: `"${values.name_tr}" başarıyla güncellendi.` });
      setEditingPlace(null);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata!', description: 'Yer güncellenirken bir sorun oluştu.' });
    } finally {
      setIsEditSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingPlace) return;
    try {
      await deletePlace(firestore, deletingPlace.id);
      toast({ title: 'Başarılı!', description: `"${deletingPlace.name.tr}" silindi.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata!', description: 'Yer silinirken bir sorun oluştu.' });
    } finally {
      setDeletingPlace(null);
    }
  }

  async function handleSeedDatabase() {
    setIsSeeding(true);
    try {
      const { addedCount, skippedCount } = await seedPlaces(firestore);
      toast({ title: 'Veritabanı Beslendi!', description: `${addedCount} yeni yer eklendi. ${skippedCount} yer zaten mevcuttu ve atlandı.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Hata!', description: 'Veritabanı beslenirken bir sorun oluştu. Lütfen konsolu kontrol edin.' });
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  }
  
  const categoryLabels: Record<Place['category'], string> = {
    history: 'Tarih',
    nature: 'Doğa',
    food: 'Lezzet',
    shopping: 'Alışveriş',
    poi: 'Önemli Nokta',
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Yer Ekle</CardTitle>
          <CardDescription>Formu doldurarak uygulamaya yeni bir mekan ekleyin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-8">
              <FormField
                control={addForm.control}
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
                control={addForm.control}
                name="slug_tr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>URL'de görünecek kısım. Örn: "sardes-antik-kenti"</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
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
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      {/* Using a native select element to avoid component conflicts */}
                      <select
                        {...field}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="history">Tarih</option>
                        <option value="nature">Doğa</option>
                        <option value="food">Lezzet</option>
                        <option value="shopping">Alışveriş</option>
                        <option value="poi">Önemli Nokta</option>
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
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
                  control={addForm.control}
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
              <Button type="submit" disabled={isAddSubmitting}>
                {isAddSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Yeni Yeri Ekle
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Veritabanı Yönetimi</CardTitle>
          <CardDescription>Uygulamanın başlangıç verilerini veritabanına yükleyin. Bu işlem sadece eksik olan başlangıç verilerini ekler, mevcut verilerinize dokunmaz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSeedDatabase} disabled={isSeeding}>
            {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Başlangıç Verilerini Yükle
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Yerler</CardTitle>
          <CardDescription>Kayıtlı tüm yerleri buradan yönetebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead className="hidden md:table-cell">Kategori</TableHead>
                  <TableHead className="text-right">Eylemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placesLoading && (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                )}
                {!placesLoading && places?.map((place) => (
                  <TableRow key={place.id}>
                    <TableCell className="font-medium">{place.name.tr}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{categoryLabels[place.category] || 'Diğer'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menü</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditingPlace(place)}>
                            <FilePenLine className="mr-2" /> Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setDeletingPlace(place)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2" /> Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!placesLoading && places?.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">Henüz hiç yer eklenmemiş.</div>
          )}
        </CardContent>
      </Card>
      
       <Dialog open={!!editingPlace} onOpenChange={(open) => !open && setEditingPlace(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Yeri Düzenle</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6 py-4">
              <FormField
                control={editForm.control}
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
                control={editForm.control}
                name="slug_tr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
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
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                       {/* Using a native select element to avoid component conflicts */}
                        <select
                          {...field}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="history">Tarih</option>
                          <option value="nature">Doğa</option>
                          <option value="food">Lezzet</option>
                          <option value="shopping">Alışveriş</option>
                          <option value="poi">Önemli Nokta</option>
                        </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">İptal</Button>
                </DialogClose>
                <Button type="submit" disabled={isEditSubmitting}>
                  {isEditSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Değişiklikleri Kaydet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingPlace} onOpenChange={(open) => !open && setDeletingPlace(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingPlace?.name.tr}" adlı yeri kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
