'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';

// Services
import { addPlace, updatePlace, deletePlace, updateSubPoints } from '@/firebase/firestore/places-service';
import { seedDatabase, undoLastOperation } from '@/firebase/firestore/seed-service';

// UI Components
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, MoreHorizontal, FilePenLine, Trash2, History, RefreshCw, Plus, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Definitions
import type { Place, ExperienceItem, Feedback, SubPoint } from '@/lib/definitions';

// --- ZOD Schemas ---
const localizedStringSchema = z.object({
  tr: z.string().min(1, 'Bu alan gereklidir.'),
  en: z.string().min(1, 'Bu alan gereklidir.'),
  fr: z.string().optional().or(z.literal('')),
  de: z.string().optional().or(z.literal('')),
  ja: z.string().optional().or(z.literal('')),
});

const placeFormSchema = z.object({
  name: localizedStringSchema,
  slug: localizedStringSchema,
  description: localizedStringSchema,
  category: z.enum(['history', 'nature', 'food', 'shopping', 'poi']),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  imageUrl: z.string().url({ message: 'Lütfen geçerli bir URL girin.' }).optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

const subPointFormSchema = z.object({
    name: localizedStringSchema,
    description: localizedStringSchema,
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
});

const languageNames: Record<string, string> = { tr: 'Türkçe', en: 'English', fr: 'Français', de: 'Deutsch', ja: '日本語' };
const languages = ['tr', 'en', 'fr', 'de', 'ja'] as const;
const categoryLabels: Record<string, string> = { history: 'Tarih', nature: 'Doğa', food: 'Lezzet', shopping: 'Alışveriş', poi: 'Önemli Nokta' };

export default function AdminPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDatabaseActionLoading, setIsDatabaseActionLoading] = useState(false);
    const [feedbackPlaceFilter, setFeedbackPlaceFilter] = useState('all');

    const [editingPlace, setEditingPlace] = useState<Place | null>(null);
    const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
    const [managingSubPointsPlace, setManagingSubPointsPlace] = useState<Place | null>(null);
    
    const { data: places, loading: placesLoading } = useCollection<Place>(useMemo(() => query(collection(firestore, 'places')), [firestore]));
    const { data: experienceItems } = useCollection<ExperienceItem>(useMemo(() => query(collection(firestore, 'experience-items'), orderBy('order')), [firestore]));
    const { data: feedbacks } = useCollection<Feedback>(useMemo(() => query(collection(firestore, 'feedbacks'), orderBy('createdAt', 'desc')), [firestore]));

    const sortedPlaces = useMemo(() => {
        if (!places) return [];
        return [...places].sort((a, b) => a.name.tr.localeCompare(b.name.tr, 'tr'));
    }, [places]);

    const addPlaceForm = useForm({ resolver: zodResolver(placeFormSchema), defaultValues: { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14 } as any });
    const editPlaceForm = useForm({ resolver: zodResolver(placeFormSchema) });
    const subPointForm = useForm({ resolver: zodResolver(subPointFormSchema), defaultValues: { name: { tr: '', en: '' }, description: { tr: '', en: '' }, lat: 38.48, lng: 28.14 } as any });

    useEffect(() => { 
        if (editingPlace) {
            editPlaceForm.reset({ 
                name: editingPlace.name,
                slug: editingPlace.slug,
                description: editingPlace.description,
                category: editingPlace.category,
                lat: editingPlace.coordinates.lat, 
                lng: editingPlace.coordinates.lng,
                imageUrl: editingPlace.imageUrl,
                imageHint: editingPlace.imageHint
            }); 
        }
    }, [editingPlace, editPlaceForm]);

    const handleAddPlaceSubmit = (values: any) => {
        setIsSubmitting(true);
        const randomSeed = Math.random().toString(36).substring(7);
        const newPlace = { ...values, coordinates: { lat: values.lat, lng: values.lng }, imageUrl: values.imageUrl || `https://picsum.photos/seed/${randomSeed}/600/400`, imageHint: values.imageHint || 'landmark', subPoints: [] };
        addPlace(firestore, newPlace, { 
            onSuccess: () => { toast({ title: 'Eklendi' }); addPlaceForm.reset(); setIsSubmitting(false); }, 
            onError: () => setIsSubmitting(false) 
        });
    };

    const handleEditPlaceSubmit = (values: any) => {
        if (!editingPlace?.id) return;
        setIsSubmitting(true);
        updatePlace(firestore, editingPlace.id, values, { 
            onSuccess: () => { toast({ title: 'Güncellendi' }); setEditingPlace(null); setIsSubmitting(false); }, 
            onError: () => setIsSubmitting(false) 
        });
    };

    const handleAddSubPointSubmit = (values: any) => {
        if (!managingSubPointsPlace) return;
        setIsSubmitting(true);
        const newSubPoint: SubPoint = { id: Math.random().toString(36).substring(7), name: values.name, description: values.description, coordinates: { lat: values.lat, lng: values.lng } };
        const updatedSubPoints = [...(managingSubPointsPlace.subPoints || []), newSubPoint];
        updateSubPoints(firestore, managingSubPointsPlace.id, updatedSubPoints, { 
            onSuccess: () => { 
                toast({ title: 'Alt Başlık Eklendi' }); 
                subPointForm.reset(); 
                setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: updatedSubPoints }); 
                setIsSubmitting(false); 
            }, 
            onError: () => setIsSubmitting(false) 
        });
    };

    const handleSeedAction = async (mode: 'SAFE' | 'UPDATE') => {
        setIsDatabaseActionLoading(true);
        try {
            const results = await seedDatabase(firestore, mode);
            toast({ title: 'Tamamlandı', description: `${results.places.added + results.experienceItems.added} yeni öğe işlendi.` });
        } catch (error: any) { toast({ variant: 'destructive', title: 'Hata', description: error.message }); }
        setIsDatabaseActionLoading(false);
    };

    const handleUndoAction = async () => {
        setIsDatabaseActionLoading(true);
        try { await undoLastOperation(firestore); toast({ title: 'Geri Alındı' }); } 
        catch (error: any) { toast({ variant: 'destructive', title: 'Hata', description: error.message }); }
        setIsDatabaseActionLoading(false);
    };

    const renderLocalizedFields = (form: any, fieldNames: string[], prefix = "") => (
        <Accordion type="multiple" defaultValue={['tr', 'en']} className="w-full space-y-4">
            {languages.map((lang) => (
                <AccordionItem value={lang} key={`lang-acc-${lang}`}>
                    <AccordionTrigger>{languageNames[lang]}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        {fieldNames.includes('name') && <FormField control={form.control} name={`${prefix}name.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>İsim ({lang})</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                        {fieldNames.includes('slug') && <FormField control={form.control} name={`${prefix}slug.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Link Metni ({lang})</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                        {fieldNames.includes('description') && <FormField control={form.control} name={`${prefix}description.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Açıklama ({lang})</FormLabel><FormControl><Textarea rows={5} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );

    return (
        <div className="space-y-8">
            <Tabs defaultValue="places">
                <div className="flex justify-center">
                    <TabsList>
                        <TabsTrigger value="places">Yerler</TabsTrigger>
                        <TabsTrigger value="experiences">Deneyim Menüsü</TabsTrigger>
                        <TabsTrigger value="feedbacks">Anketler</TabsTrigger>
                        <TabsTrigger value="database">Veritabanı</TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="places">
                    <Card>
                        <CardHeader><CardTitle>Yeni Yer Ekle</CardTitle></CardHeader>
                        <CardContent>
                            <Form {...addPlaceForm}>
                                <form onSubmit={addPlaceForm.handleSubmit(handleAddPlaceSubmit)} className="space-y-8">
                                    {renderLocalizedFields(addPlaceForm, ['name', 'slug', 'description'])}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <FormField control={addPlaceForm.control} name="category" render={({ field }) => (
                                            <FormItem><FormLabel>Kategori</FormLabel><select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option><option value="shopping">Alışveriş</option><option value="poi">Önemli Nokta</option></select></FormItem>
                                        )}/>
                                        <FormField control={addPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                        <FormField control={addPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                    </div>
                                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="animate-spin mr-2" />} Ekle</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                    <Card className="mt-8">
                        <CardHeader><CardTitle>Mevcut Yerler</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>İsim</TableHead><TableHead>Kategori</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {placesLoading ? (<TableRow><TableCell colSpan={3}><Skeleton className="h-20 w-full" /></TableCell></TableRow>) : sortedPlaces.map((place) => (
                                        <TableRow key={place.id}>
                                            <TableCell>{place.name.tr}</TableCell>
                                            <TableCell><Badge variant="secondary">{categoryLabels[place.category]}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setEditingPlace(place)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setManagingSubPointsPlace(place)}><Layers className="mr-2" /> Alt Başlıkları Yönet</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDeletingPlace(place)} className="text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="experiences">
                    <Card>
                        <CardHeader><CardTitle>Deneyim Menüsü Sıralaması</CardTitle><CardDescription>Menü öğeleri 'order' değerine göre ana sayfada listelenir.</CardDescription></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Sıra (Order)</TableHead><TableHead>İsim</TableHead><TableHead className="text-right">Durum</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {experienceItems?.map((item) => (
                                        <TableRow key={item.id}><TableCell className="font-bold text-primary">{item.order}</TableCell><TableCell>{item.name.tr}</TableCell><TableCell className="text-right"><Badge variant="outline">Aktif</Badge></TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="feedbacks">
                    <div className="flex gap-4 mb-4"><div className="w-64"><Label>Mekan Filtresi</Label><Select value={feedbackPlaceFilter} onValueChange={setFeedbackPlaceFilter}><SelectTrigger><SelectValue placeholder="Tüm Yerler" /></SelectTrigger><SelectContent><SelectItem value="all">Tüm Yerler</SelectItem>{sortedPlaces.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name.tr}</SelectItem>))}</SelectContent></Select></div></div>
                    <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Mekan</TableHead><TableHead>Tarih</TableHead><TableHead>Puan</TableHead></TableRow></TableHeader><TableBody>{feedbacks?.filter(f => feedbackPlaceFilter === 'all' || f.placeId === feedbackPlaceFilter).map((f) => (<TableRow key={f.id}><TableCell>{f.placeName}</TableCell><TableCell>{f.createdAt?.toDate ? format(f.createdAt.toDate(), 'd MMM HH:mm', { locale: trLocale }) : '---'}</TableCell><TableCell>{f.satisfaction}/5</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
                </TabsContent>

                <TabsContent value="database">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card><CardHeader><CardTitle className="text-primary flex items-center gap-2"><RefreshCw /> Güvenli Mod</CardTitle><CardDescription>Sadece veritabanında olmayan yeni yerleri ekler.</CardDescription></CardHeader><CardContent><Button onClick={() => handleSeedAction('SAFE')} disabled={isDatabaseActionLoading} className="w-full" variant="secondary">Eksikleri Tamamla</Button></CardContent></Card>
                        <Card className="border-orange-200 bg-orange-50/10"><CardHeader><CardTitle className="text-orange-600 flex items-center gap-2"><RefreshCw /> Akıllı Güncelleme</CardTitle><CardDescription>Sıralama ve yeni özellikler gibi kod güncellemelerini mevcut verilerle birleştirir.</CardDescription></CardHeader><CardContent><Button onClick={() => handleSeedAction('UPDATE')} disabled={isDatabaseActionLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">Verileri Kod ile Güncelle</Button></CardContent></Card>
                        <Card className="md:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><History /> Geri Yükle</CardTitle><CardDescription>Son işlemi geri alarak verileri önceki haline döndürün.</CardDescription></CardHeader><CardContent className="flex justify-center"><Button onClick={handleUndoAction} disabled={isDatabaseActionLoading} variant="outline" size="lg">Son İşlemi Geri Al (Undo)</Button></CardContent></Card>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={!!managingSubPointsPlace} onOpenChange={(o) => !o && setManagingSubPointsPlace(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{managingSubPointsPlace?.name.tr} - Alt Başlık Yönetimi</DialogTitle></DialogHeader>
                    <div className="space-y-8">
                        <div className="border p-4 rounded-lg bg-muted/20">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><Plus className="h-4 w-4" /> Yeni Alt Başlık</h3>
                            <Form {...subPointForm}>
                                <form onSubmit={subPointForm.handleSubmit(handleAddSubPointSubmit)} className="space-y-4">
                                    {renderLocalizedFields(subPointForm, ['name', 'description'])}
                                    <div className="grid grid-cols-2 gap-4"><FormField control={subPointForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/><FormField control={subPointForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/></div>
                                    <Button type="submit" disabled={isSubmitting} className="w-full">Kaydet</Button>
                                </form>
                            </Form>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2"><Layers className="h-4 w-4" /> Mevcut Alt Başlıklar</h3>
                            <div className="space-y-2">
                                {managingSubPointsPlace?.subPoints?.map((s) => (
                                    <div key={s.id} className="flex justify-between items-center p-3 border rounded-lg bg-background"><div><p className="font-bold">{s.name.tr}</p><p className="text-xs text-muted-foreground">{s.coordinates.lat}, {s.coordinates.lng}</p></div><Button variant="ghost" size="icon" className="text-destructive" onClick={() => { const updated = managingSubPointsPlace.subPoints?.filter(x => x.id !== s.id) || []; updateSubPoints(firestore, managingSubPointsPlace.id, updated, { onSuccess: () => setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: updated }) }); }}><Trash2 /></Button></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingPlace} onOpenChange={(open) => !open && setEditingPlace(null)}>
                <DialogContent className="max-w-xl"><DialogHeader><DialogTitle>Yeri Düzenle</DialogTitle></DialogHeader><Form {...editPlaceForm}><form onSubmit={editPlaceForm.handleSubmit(handleEditPlaceSubmit)} className="space-y-4">{renderLocalizedFields(editPlaceForm, ['name', 'slug', 'description'])}<DialogFooter><Button type="submit" disabled={isSubmitting}>Güncelle</Button></DialogFooter></form></Form></DialogContent>
            </Dialog>

            <AlertDialog open={!!deletingPlace} onOpenChange={(o) => !o && setDeletingPlace(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{deletingPlace?.name.tr}" silinecek.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => { if (deletingPlace?.id) deletePlace(firestore, deletingPlace.id, { onSuccess: () => setDeletingPlace(null) }); }}>Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
