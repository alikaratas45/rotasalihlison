'use client';

import { useState, useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Loader2, MapPin, Image as ImageIcon } from 'lucide-react';
import type { Place } from '@/lib/definitions';
import { PlaceForm } from '@/components/admin/place-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deletePlace } from '@/firebase/firestore/place-service';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

export default function AdminPlacesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { language } = useLanguage();

  const placesQuery = useMemo(() => query(collection(firestore, 'places'), orderBy('name.tr')), [firestore]);
  const { data: places, loading, error } = useCollection<Place>(placesQuery);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleAdd = () => {
    setSelectedPlace(null);
    setIsFormOpen(true);
  };

  const handleEdit = (place: Place) => {
    setSelectedPlace(place);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (place: Place) => {
    setSelectedPlace(place);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPlace) {
      deletePlace(firestore, selectedPlace.id);
      toast({
        title: 'Yer Silindi',
        description: `${selectedPlace.name[language]} başarıyla silindi.`,
      });
    }
    setIsAlertOpen(false);
    setSelectedPlace(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedPlace(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Yerler</CardTitle>
            <CardDescription>Uygulamadaki yerleri yönetin.</CardDescription>
          </div>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Yer Ekle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
        {error && <div className="text-red-500">Hata: {error.message}</div>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Yer Adı (TR)</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {places?.map((place) => (
                <TableRow key={place.id}>
                  <TableCell className="font-medium">{place.name.tr}</TableCell>
                  <TableCell className="capitalize">{place.category}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menüyü aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(place)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Düzenle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteRequest(place)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Sil</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPlace ? 'Yeri Düzenle' : 'Yeni Yer Ekle'}</DialogTitle>
          </DialogHeader>
          <PlaceForm
            place={selectedPlace}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. "{selectedPlace?.name[language]}" yerini kalıcı olarak sileceksiniz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Card>
  );
}
