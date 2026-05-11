
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';

// Services
import { addPlace, updatePlace, deletePlace, updateSubPoints } from '@/firebase/firestore/places-service';
import { addRoute, updateRoute, deleteRoute } from '@/firebase/firestore/routes-service';
import { addExperienceItem, updateExperienceItem, deleteExperienceItem } from '@/firebase/firestore/experience-menu-service';
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
import { Loader2, MoreHorizontal, FilePenLine, Trash2, Star, Download, History, DatabaseBackup, RefreshCw, Plus, MapPin, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Definitions
import type { Place, Route, ExperienceItem, Feedback, SubPoint } from '@/lib/definitions';

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
type PlaceFormData = z.infer<typeof placeFormSchema>;

const subPointFormSchema = z.object({
    name: localizedStringSchema,
    description: localizedStringSchema,
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
});
type SubPointFormData = z.infer<typeof subPointFormSchema>;

const routeFormSchema = z.object({
  name: localizedStringSchema,
  slug: localizedStringSchema,
  description: localizedStringSchema,
  stops: z.array(z.string()).min(1, 'En az bir durak seçmelisiniz.'),
});
type RouteFormData = z.infer<typeof routeFormSchema>;

const experienceItemFormSchema = z.object({
    name: localizedStringSchema,
    icon: z.string().min(1, 'Ikon adı gereklidir.'),
    link: z.string().min(1, 'Link gereklidir.'),
    order: z.coerce.number(),
});
type ExperienceItemFormData = z.infer<typeof experienceItemFormSchema>;

const languageNames: Record<string, string> = { tr: 'Türkçe', en: 'English', fr: 'Français', de: 'Deutsch', ja: '日本語' };
const languages = ['tr', 'en', 'fr', 'de', 'ja'] as const;
const categoryLabels: Record<string, string> = { history: 'Tarih', nature: 'Doğa', food: 'Lezzet', shopping: 'Alışveriş', poi: 'Önemli Nokta' };

// --- Helper Components ---
function LocalizedFormFields({ form, fieldNames, prefix = "" }: { form: any, fieldNames: Array<'name' | 'slug' | 'description'>, prefix?: string }) {
  return (
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
}

export default function AdminPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    // --- State Management ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDatabaseActionLoading, setIsDatabaseActionLoading] = useState(false);
    const [feedbackPlaceFilter, setFeedbackPlaceFilter] = useState<string>('all');

    const [editingPlace, setEditingPlace] = useState<Place | null>(null);
    const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
    const [managingSubPointsPlace, setManagingSubPointsPlace] = useState<Place | null>(null);
    
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);
    const [deletingRoute, setDeletingRoute] = useState<Route | null>(null);

    const [editingExperienceItem, setEditingExperienceItem] = useState<ExperienceItem | null>(null);
    const [deletingExperienceItem, setDeletingExperienceItem] = useState<ExperienceItem | null>(null);

    // --- Data Fetching ---
    const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
    const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);
    
    const routesQuery = useMemo(() => query(collection(firestore, 'routes')), [firestore]);
    const { data: routes, loading: routesLoading } = useCollection<Route>(routesQuery);

    const experienceItemsQuery = useMemo(() => query(collection(firestore, 'experience-items'), orderBy('order')), [firestore]);
    const { data: experienceItems, loading: experienceItemsLoading } = useCollection<ExperienceItem>(experienceItemsQuery);

    const feedbacksQuery = useMemo(() => query(collection(firestore, 'feedbacks'), orderBy('createdAt', 'desc')), [firestore]);
    const { data: feedbacks, loading: feedbacksLoading } = useCollection<Feedback>(feedbacksQuery);

    const sortedPlaces = useMemo(() => {
        if (!places) return [];
        return [...places].sort((a, b) => a.name.tr.localeCompare(b.name.tr, 'tr'));
    }, [places]);

    // --- Form Definitions ---
    const defaultPlaceValues: PlaceFormData = { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14, imageUrl: '', imageHint: '' };
    const addPlaceForm = useForm<PlaceFormData>({ resolver: zodResolver(placeFormSchema), defaultValues: defaultPlaceValues });
    const editPlaceForm = useForm<PlaceFormData>({ resolver: zodResolver(placeFormSchema) });

    const subPointForm = useForm<SubPointFormData>({ 
        resolver: zodResolver(subPointFormSchema),
        defaultValues: { name: { tr: '', en: '' }, description: { tr: '', en: '' }, lat: 38.48, lng: 28.14 }
    });

    const defaultRouteValues: RouteFormData = { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, stops: [] };
    const addRouteForm = useForm<RouteFormData>({ resolver: zodResolver(routeFormSchema), defaultValues: defaultRouteValues });
    const editRouteForm = useForm<RouteFormData>({ resolver: zodResolver(routeFormSchema) });
    
    const defaultExperienceItemValues: ExperienceItemFormData = { name: { tr: '', en: '' }, icon: '', link: '', order: 0 };
    const addExperienceItemForm = useForm<ExperienceItemFormData>({ resolver: zodResolver(experienceItemFormSchema), defaultValues: defaultExperienceItemValues });
    const editExperienceItemForm = useForm<ExperienceItemFormData>({ resolver: zodResolver(experienceItemFormSchema) });

    // --- Effects for Populating Edit Forms ---
    useEffect(() => { if (editingPlace) editPlaceForm.reset({ ...editingPlace, lat: editingPlace.coordinates.lat, lng: editingPlace.coordinates.lng }); }, [editingPlace, editPlaceForm]);
    useEffect(() => { if (editingRoute) editRouteForm.reset(editingRoute); }, [editingRoute, editRouteForm]);
    useEffect(() => { if (editingExperienceItem) editExperienceItemForm.reset(editingExperienceItem); }, [editingExperienceItem, editExperienceItemForm]);

    // --- Submission Handlers ---
    const createApiCallbacks = (entityName: string, successCallback?: () => void) => ({
        onSuccess: () => {
            toast({ title: 'Başarılı!', description: `${entityName} başarıyla kaydedildi.` });
            setIsSubmitting(false);
            successCallback?.();
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: 'Hata!', description: `${entityName} kaydedilirken bir hata oluştu: ${error.message}` });
            setIsSubmitting(false);
        }
    });

    function onAddPlaceSubmit(values: PlaceFormData) {
        setIsSubmitting(true);
        const randomSeed = Math.random().toString(36).substring(7);
        const newPlace = { ...values, coordinates: { lat: values.lat, lng: values.lng }, imageUrl: values.imageUrl || `https://picsum.photos/seed/${randomSeed}/600/400`, imageHint: values.imageHint || 'landmark', subPoints: [] };
        addPlace(firestore, newPlace, createApiCallbacks("Yer", () => addPlaceForm.reset(defaultPlaceValues)));
    }
    function onEditPlaceSubmit(values: PlaceFormData) {
        if (!editingPlace?.id) return;
        setIsSubmitting(true);
        updatePlace(firestore, editingPlace.id, values, createApiCallbacks("Yer", () => setEditingPlace(null)));
    }

    function onAddSubPointSubmit(values: SubPointFormData) {
        if (!managingSubPointsPlace) return;
        setIsSubmitting(true);
        const newSubPoint: SubPoint = {
            id: Math.random().toString(36).substring(7),
            name: values.name,
            description: values.description,
            coordinates: { lat: values.lat, lng: values.lng }
        };
        const updatedSubPoints = [...(managingSubPointsPlace.subPoints || []), newSubPoint];
        updateSubPoints(firestore, managingSubPointsPlace.id, updatedSubPoints, {
            onSuccess: () => {
                toast({ title: 'Alt Başlık Eklendi' });
                subPointForm.reset();
                setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: updatedSubPoints });
                setIsSubmitting(false);
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Hata', description: err.message });
                setIsSubmitting(false);
            }
        });
    }

    const handleDeleteSubPoint = (subId: string) => {
        if (!managingSubPointsPlace) return;
        const updatedSubPoints = (managingSubPointsPlace.subPoints || []).filter(s => s.id !== subId);
        updateSubPoints(firestore, managingSubPointsPlace.id, updatedSubPoints, {
            onSuccess: () => {
                toast({ title: 'Alt Başlık Silindi' });
                setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: updatedSubPoints });
            }
        });
    };

    function onAddRouteSubmit(values: RouteFormData) { setIsSubmitting(true); addRoute(firestore, values, createApiCallbacks("Rota", () => addRouteForm.reset(defaultRouteValues))); }
    function onEditRouteSubmit(values: RouteFormData) { if (!editingRoute?.id) return; setIsSubmitting(true); updateRoute(firestore, editingRoute.id, values, createApiCallbacks("Rota", () => setEditingRoute(null))); }
    function onAddExperienceItemSubmit(values: ExperienceItemFormData) { setIsSubmitting(true); addExperienceItem(firestore, values, createApiCallbacks("Deneyim Öğesi", () => addExperienceItemForm.reset(defaultExperienceItemValues))); }
    function onEditExperienceItemSubmit(values: ExperienceItemFormData) { if (!editingExperienceItem?.id) return; setIsSubmitting(true); updateExperienceItem(firestore, editingExperienceItem.id, values, createApiCallbacks("Deneyim Öğesi", () => setEditingExperienceItem(null))); }

    const handleDeleteItem = (entity: any, deleteFn: any, setDeletingEntity: any) => {
        if (!entity?.id) return;
        deleteFn(firestore, entity.id, {
            onSuccess: () => { toast({ title: 'Silindi', description: `"${entity.name.tr}" silindi.` }); setDeletingEntity(null); },
            onError: (err: any) => toast({ variant: 'destructive', title: 'Hata', description: err.message })
        });
    };

    async function handleSeed(mode: 'SAFE' | 'UPDATE') {
        setIsDatabaseActionLoading(true);
        try {
            const results = await seedDatabase(firestore, mode);
            toast({ title: mode === 'SAFE' ? 'Eksikler Tamamlandı' : 'Veriler Güncellendi', description: `${results.places.added + results.routes.added + results.experienceItems.added} yeni öğe eklendi.`, });
        } catch (error: any) { toast({ variant: 'destructive', title: 'Hata!', description: error.message }); } finally { setIsDatabaseActionLoading(false); }
    }

    async function handleUndo() {
        setIsDatabaseActionLoading(true);
        try { await undoLastOperation(firestore); toast({ title: 'Geri Yüklendi', description: 'Veritabanı son işlemden önceki haline döndürüldü.' }); } catch (error: any) { toast({ variant: 'destructive', title: 'Hata', description: error.message }); } finally { setIsDatabaseActionLoading(false); }
    }

    return (
        <div className="space-y-8">
            <Tabs defaultValue="places">
                <div className="flex justify-center"><TabsList><TabsTrigger value="places">Yerler</TabsTrigger><TabsTrigger value="routes">Rotalar</TabsTrigger><TabsTrigger value="experiences">Deneyim Menüsü</TabsTrigger><TabsTrigger value="feedbacks">Anketler</TabsTrigger><TabsTrigger value="database">Veritabanı</TabsTrigger></TabsList></div>
                
                <TabsContent value="places">
                    <Card>
                        <CardHeader><CardTitle>Yeni Yer Ekle</CardTitle><CardDescription>Formu doldurarak uygulamaya yeni bir mekan ekleyin.</CardDescription></CardHeader>
                        <CardContent>
                          <Form {...addPlaceForm}><form onSubmit={addPlaceForm.handleSubmit(onAddPlaceSubmit)} className="space-y-8">
                              <LocalizedFormFields form={addPlaceForm} fieldNames={['name', 'slug', 'description']} />
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                 <FormField control={addPlaceForm.control} name="category" render={({ field }) => (
                                    <FormItem><FormLabel>Kategori</FormLabel><select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option><option value="shopping">Alışveriş</option><option value="poi">Önemli Nokta</option></select><FormMessage /></FormItem>
                                 )}/>
                                 <FormField control={addPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                 <FormField control={addPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                              </div>
                              <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Yeni Yeri Ekle</Button>
                            </form></Form>
                        </CardContent>
                    </Card>
                    <Card className="mt-8">
                        <CardHeader><CardTitle>Mevcut Yerler</CardTitle></CardHeader>
                        <CardContent>
                          <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>İsim</TableHead><TableHead className="hidden md:table-cell">Kategori</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                              <TableBody>
                                {placesLoading ? Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-5 w-3/4" /></TableCell><TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell></TableRow>))
                                : sortedPlaces.map((place) => (
                                  <TableRow key={place.id}>
                                    <TableCell className="font-medium">{place.name.tr}</TableCell>
                                    <TableCell className="hidden md:table-cell"><Badge variant="secondary">{categoryLabels[place.category] || 'Diğer'}</Badge></TableCell>
                                    <TableCell className="text-right">
                                      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => setEditingPlace(place)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => setManagingSubPointsPlace(place)}><Layers className="mr-2" /> Alt Başlıkları Yönet</DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => setDeletingPlace(place)} className="text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem>
                                        </DropdownMenuContent></DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}</TableBody></Table></div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Diğer tab içerikleri (routes, experiences, feedbacks, database) mevcut yapısını koruyor... */}
                <TabsContent value="routes">
                    <Card>
                        <CardHeader><CardTitle>Yeni Rota Ekle</CardTitle></CardHeader>
                        <CardContent>
                            <Form {...addRouteForm}><form onSubmit={addRouteForm.handleSubmit(onAddRouteSubmit)} className="space-y-8">
                                <LocalizedFormFields form={addRouteForm} fieldNames={['name', 'slug', 'description']} />
                                <FormField control={addRouteForm.control} name="stops" render={({ field }) => (
                                    <FormItem><FormLabel>Duraklar</FormLabel><ScrollArea className="h-72 w-full rounded-md border p-4">
                                        {sortedPlaces.map((place) => (
                                            <FormItem key={place.id} className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                                                <FormControl><Checkbox checked={field.value?.includes(place.id)} onCheckedChange={(checked) => checked ? field.onChange([...field.value, place.id]) : field.onChange(field.value?.filter((v: string) => v !== place.id))} /></FormControl>
                                                <FormLabel className="font-normal">{place.name.tr}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </ScrollArea><FormMessage /></FormItem>
                                )} /><Button type="submit" disabled={isSubmitting}>Ekle</Button>
                            </form></Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="experiences">
                    <Card><CardHeader><CardTitle>Deneyim Menüsü</CardTitle></CardHeader><CardContent><div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>Sıra</TableHead><TableHead>İsim</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader><TableBody>
                        {experienceItemsLoading ? Array.from({ length: 4 }).map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-5 w-4" /></TableCell><TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell></TableRow>))
                        : experienceItems?.map((item) => (
                            <TableRow key={item.id}><TableCell>{item.order}</TableCell><TableCell>{item.name.tr}</TableCell><TableCell className="text-right">
                                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setEditingExperienceItem(item)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem><DropdownMenuItem onClick={() => setDeletingExperienceItem(item)} className="text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                            </TableCell></TableRow>
                        ))}</TableBody></Table></div></CardContent></Card>
                </TabsContent>
                <TabsContent value="feedbacks">
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end"><div className="w-full md:w-64"><Label>Mekan Filtresi</Label><Select value={feedbackPlaceFilter} onValueChange={setFeedbackPlaceFilter}><SelectTrigger><SelectValue placeholder="Tüm Mekanlar" /></SelectTrigger><SelectContent><SelectItem value="all">Tüm Mekanlar</SelectItem>{sortedPlaces.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name.tr}</SelectItem>))}</SelectContent></Select></div><Button variant="outline" onClick={() => {}}><Download className="mr-2 h-4 w-4" /> Rapor İndir</Button></div>
                    {feedbacksLoading ? <Skeleton className="h-64 w-full" /> : (<div className="rounded-md border bg-card"><Table><TableHeader><TableRow><TableHead>Mekan</TableHead><TableHead>Tarih</TableHead><TableHead>Memnuniyet</TableHead></TableRow></TableHeader><TableBody>{feedbacks?.filter(f => feedbackPlaceFilter === 'all' || f.placeId === feedbackPlaceFilter).map((f) => (<TableRow key={f.id}><TableCell>{f.placeName}</TableCell><TableCell>{f.createdAt?.toDate ? format(f.createdAt.toDate(), 'd MMM HH:mm', { locale: trLocale }) : '---'}</TableCell><TableCell>{f.satisfaction}</TableCell></TableRow>))}</TableBody></Table></div>)}
                </TabsContent>
                <TabsContent value="database">
                    <div className="grid gap-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><DatabaseBackup className="h-5 w-5" /> Veritabanı Yönetimi</CardTitle><CardDescription>Uygulamanın verilerini yönetin. Her işlemden önce otomatik yedek alınır.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="border rounded-lg p-4 space-y-3"><h3 className="font-bold flex items-center gap-2 text-primary"><RefreshCw className="h-4 w-4" /> Güvenli Mod</h3><p className="text-sm text-muted-foreground">Sadece veritabanında hiç olmayan yeni yerleri ekler.</p><Button onClick={() => handleSeed('SAFE')} disabled={isDatabaseActionLoading} className="w-full" variant="secondary">{isDatabaseActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Eksikleri Tamamla</Button></div><div className="border rounded-lg p-4 space-y-3 border-orange-200 bg-orange-50/20"><h3 className="font-bold flex items-center gap-2 text-orange-600"><RefreshCw className="h-4 w-4" /> Akıllı Güncelleme</h3><p className="text-sm text-muted-foreground">Kod üzerindeki yeni bilgileri mevcut mekanlarınıza ekler.</p><Button onClick={() => handleSeed('UPDATE')} disabled={isDatabaseActionLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">{isDatabaseActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Verileri Kod ile Güncelle</Button></div></div><div className="pt-6 border-t flex flex-col items-center gap-4"><div className="p-3 bg-muted rounded-full"><History className="h-8 w-8 text-muted-foreground" /></div><div className="text-center"><h3 className="font-bold">Geri Yükle</h3><p className="text-sm text-muted-foreground">Son işlemi geri alarak verileri bir önceki haline döndürün.</p></div><Button onClick={handleUndo} disabled={isDatabaseActionLoading} variant="outline">Son İşlemi Geri Al (Undo)</Button></div></CardContent></Card></div>
                </TabsContent>
            </Tabs>
      
            {/* Alt Başlıkları Yönetme Diyaloğu */}
            <Dialog open={!!managingSubPointsPlace} onOpenChange={(o) => !o && setManagingSubPointsPlace(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                    <DialogHeader><DialogTitle>{managingSubPointsPlace?.name.tr} - Alt Başlıkları Yönet</DialogTitle></DialogHeader>
                    <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary"><Plus className="h-5 w-5" /> Yeni Alt Başlık Ekle</h3>
                            <Form {...subPointForm}><form onSubmit={subPointForm.handleSubmit(onAddSubPointSubmit)} className="space-y-6 border p-4 rounded-lg bg-muted/20">
                                <LocalizedFormFields form={subPointForm} fieldNames={['name', 'description']} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={subPointForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                    <FormField control={subPointForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <Loader2 className="animate-spin" /> : 'Alt Başlığı Kaydet'}</Button>
                            </form></Form>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-primary"><Layers className="h-5 w-5" /> Mevcut Alt Başlıklar</h3>
                            {managingSubPointsPlace?.subPoints?.length ? (
                                <div className="space-y-3">
                                    {managingSubPointsPlace.subPoints.map((s) => (
                                        <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg bg-background shadow-sm">
                                            <div>
                                                <p className="font-bold">{s.name.tr}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.coordinates.lat}, {s.coordinates.lng}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSubPoint(s.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-muted-foreground text-sm italic">Henüz alt başlık eklenmemiş.</p>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingPlace} onOpenChange={(open) => !open && setEditingPlace(null)}>
                <DialogContent className="max-w-xl"><DialogHeader><DialogTitle>Yeri Düzenle</DialogTitle></DialogHeader>
                    <Form {...editPlaceForm}><form onSubmit={editPlaceForm.handleSubmit(onEditPlaceSubmit)} className="space-y-4">
                        <LocalizedFormFields form={editPlaceForm} fieldNames={['name', 'slug', 'description']} />
                        <DialogFooter><Button type="submit" disabled={isSubmitting}>Değişiklikleri Kaydet</Button></DialogFooter>
                    </form></Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deletingPlace} onOpenChange={(o) => !o && setDeletingPlace(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{deletingPlace?.name.tr}" silinecek.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteItem(deletingPlace, deletePlace, setDeletingPlace)}>Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    );
}
