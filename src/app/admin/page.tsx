'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';

// Services
import { addPlace, updatePlace, deletePlace } from '@/firebase/firestore/places-service';
import { addRoute, updateRoute, deleteRoute } from '@/firebase/firestore/routes-service';
import { addExperienceItem, updateExperienceItem, deleteExperienceItem } from '@/firebase/firestore/experience-menu-service';
import { seedDatabase } from '@/firebase/firestore/seed-service';

// UI Components
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, MoreHorizontal, FilePenLine, Trash2, PlusCircle, Star, Users, MapPin, CheckCircle2, XCircle, Download, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Definitions
import type { Place, Route, ExperienceItem, Feedback } from '@/lib/definitions';


// --- ZOD Schemas ---
const localizedStringSchema = z.object({
  tr: z.string().min(1, 'Bu alan gereklidir.'),
  en: z.string().min(1, 'Bu alan gereklidir.'),
  fr: z.string().optional(),
  de: z.string().optional(),
  ja: z.string().optional(),
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

// --- Helper Components ---
const LocalizedFormFields = ({ form, fieldNames }: { form: any, fieldNames: Array<'name' | 'slug' | 'description'> }) => (
    <Accordion type="multiple" defaultValue={['tr', 'en']} className="w-full space-y-4">
        {languages.map((lang) => (
            <AccordionItem value={lang} key={lang}>
                <AccordionTrigger>{languageNames[lang]}</AccordionTrigger>
                <AccordionContent className="space-y-4">
                    {fieldNames.includes('name') && <FormField control={form.control} name={`name.${lang}`} render={({ field }) => (
                        <FormItem><FormLabel>İsim ({lang})</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />}
                    {fieldNames.includes('slug') && <FormField control={form.control} name={`slug.${lang}`} render={({ field }) => (
                        <FormItem><FormLabel>Link Metni ({lang})</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />}
                    {fieldNames.includes('description') && <FormField control={form.control} name={`description.${lang}`} render={({ field }) => (
                        <FormItem><FormLabel>Açıklama ({lang})</FormLabel><FormControl><Textarea rows={5} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />}
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
);

const RatingBadge = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-1">
            <span className="font-bold">{rating.toFixed(1)}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        </div>
    );
};


export default function AdminPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    // --- State Management ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [feedbackPlaceFilter, setFeedbackPlaceFilter] = useState<string>('all');

    const [editingPlace, setEditingPlace] = useState<Place | null>(null);
    const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
    
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

    const sortedPlaces = useMemo(() => places?.slice().sort((a, b) => a.name.tr.localeCompare(b.name.tr, 'tr')) || [], [places]);

    // --- Feedback Filtering & Export ---
    const filteredFeedbacks = useMemo(() => {
        if (!feedbacks) return [];
        if (feedbackPlaceFilter === 'all') return feedbacks;
        return feedbacks.filter(f => f.placeId === feedbackPlaceFilter);
    }, [feedbacks, feedbackPlaceFilter]);

    const stats = useMemo(() => {
        if (!filteredFeedbacks || filteredFeedbacks.length === 0) return null;
        const total = filteredFeedbacks.length;
        const avgCleanliness = filteredFeedbacks.reduce((acc, f) => acc + f.cleanliness, 0) / total;
        const avgAccessibility = filteredFeedbacks.reduce((acc, f) => acc + f.accessibility, 0) / total;
        const avgSatisfaction = filteredFeedbacks.reduce((acc, f) => acc + f.satisfaction, 0) / total;
        const tourCount = filteredFeedbacks.filter(f => f.withTour === 'yes').length;
        const guidedCount = filteredFeedbacks.filter(f => f.guided === 'yes').length;
        const infoBoardsCount = filteredFeedbacks.filter(f => f.infoBoards === 'yes').length;

        return { total, avgCleanliness, avgAccessibility, avgSatisfaction, tourCount, guidedCount, infoBoardsCount };
    }, [filteredFeedbacks]);

    const handleDownloadReport = useCallback(() => {
        if (!filteredFeedbacks || filteredFeedbacks.length === 0) return;

        const headers = ["Mekan", "Temizlik", "Erişim", "Memnuniyet", "Turla Gelis", "Rehberlik", "Bilgi Panolari", "Tarih"];
        const rows = filteredFeedbacks.map(f => [
            f.placeName,
            f.cleanliness,
            f.accessibility,
            f.satisfaction,
            f.withTour === 'yes' ? 'Evet' : 'Hayir',
            f.guided === 'yes' ? 'Evet' : 'Hayir',
            f.infoBoards === 'yes' ? 'Evet' : 'Hayir',
            f.createdAt?.toDate ? format(f.createdAt.toDate(), 'yyyy-MM-dd HH:mm') : ''
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rota-salihli-anket-raporu-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [filteredFeedbacks]);

    // --- Form Definitions ---
    const defaultPlaceValues: PlaceFormData = { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14, imageUrl: '', imageHint: '' };
    const addPlaceForm = useForm<PlaceFormData>({ resolver: zodResolver(placeFormSchema), defaultValues: defaultPlaceValues });
    const editPlaceForm = useForm<PlaceFormData>({ resolver: zodResolver(placeFormSchema) });

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
        const newPlace = { ...values, coordinates: { lat: values.lat, lng: values.lng }, imageUrl: values.imageUrl || `https://picsum.photos/seed/${randomSeed}/600/400`, imageHint: values.imageHint || 'landmark' };
        addPlace(firestore, newPlace, createApiCallbacks("Yer", () => addPlaceForm.reset(defaultPlaceValues)));
    }
    function onEditPlaceSubmit(values: PlaceFormData) {
        if (!editingPlace) return;
        setIsSubmitting(true);
        updatePlace(firestore, editingPlace.id, values, createApiCallbacks("Yer", () => setEditingPlace(null)));
    }
    function onAddRouteSubmit(values: RouteFormData) {
        setIsSubmitting(true);
        addRoute(firestore, values, createApiCallbacks("Rota", () => addRouteForm.reset(defaultRouteValues)));
    }
    function onEditRouteSubmit(values: RouteFormData) {
        if (!editingRoute) return;
        setIsSubmitting(true);
        updateRoute(firestore, editingRoute.id, values, createApiCallbacks("Rota", () => setEditingRoute(null)));
    }
    function onAddExperienceItemSubmit(values: ExperienceItemFormData) {
        setIsSubmitting(true);
        addExperienceItem(firestore, values, createApiCallbacks("Deneyim Öğesi", () => addExperienceItemForm.reset(defaultExperienceItemValues)));
    }
    function onEditExperienceItemSubmit(values: ExperienceItemFormData) {
        if (!editingExperienceItem) return;
        setIsSubmitting(true);
        updateExperienceItem(firestore, editingExperienceItem.id, values, createApiCallbacks("Deneyim Öğesi", () => setEditingExperienceItem(null)));
    }

    // --- Deletion Handlers ---
    const handleDelete = <T extends { id: string; name: { tr: string } }>(
        entity: T | null,
        deleteFn: (db: any, id: string, callbacks: any) => void,
        setDeletingEntity: (entity: T | null) => void,
        entityName: string
    ) => {
        if (!entity) return;
        deleteFn(firestore, entity.id, {
            onSuccess: () => {
                toast({ title: 'Başarılı!', description: `"${entity.name.tr}" silindi.` });
                setDeletingEntity(null);
            },
            onError: (error: any) => {
                toast({ variant: 'destructive', title: 'Hata!', description: `${entityName} silinirken bir hata oluştu: ${error.message}` });
                setDeletingEntity(null);
            }
        });
    };

    // --- Seeding Handler ---
    async function handleSeedDatabase() {
        setIsSeeding(true);
        try {
            const results = await seedDatabase(firestore);
            toast({
                title: 'Veritabanı Beslendi!',
                description: `${results.places.added} yer, ${results.routes.added} rota, ${results.experienceItems.added} deneyim öğesi eklendi.`,
            });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata!', description: 'Veritabanı beslenirken bir sorun oluştu. Lütfen konsolu kontrol edin.' });
            console.error(error);
        } finally {
            setIsSeeding(false);
        }
    }

    const categoryLabels: Record<Place['category'], string> = { history: 'Tarih', nature: 'Doğa', food: 'Lezzet', shopping: 'Alışveriş', poi: 'Önemli Nokta' };

    return (
        <div className="space-y-8">
            <Tabs defaultValue="places">
                <div className="flex justify-center">
                    <TabsList>
                        <TabsTrigger value="places">Yerler</TabsTrigger>
                        <TabsTrigger value="routes">Rotalar</TabsTrigger>
                        <TabsTrigger value="experiences">Deneyim Menüsü</TabsTrigger>
                        <TabsTrigger value="feedbacks">Anketler</TabsTrigger>
                        <TabsTrigger value="database">Veritabanı</TabsTrigger>
                    </TabsList>
                </div>
                
                {/* PLACES TAB */}
                <TabsContent value="places">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yeni Yer Ekle</CardTitle>
                            <CardDescription>Formu doldurarak uygulamaya yeni bir mekan ekleyin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...addPlaceForm}>
                            <form onSubmit={addPlaceForm.handleSubmit(onAddPlaceSubmit)} className="space-y-8">
                              <LocalizedFormFields form={addPlaceForm} fieldNames={['name', 'slug', 'description']} />
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                 <FormField control={addPlaceForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Kategori</FormLabel><select {...field} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option><option value="shopping">Alışveriş</option><option value="poi">Önemli Nokta</option></select><FormMessage /></FormItem>)}/>
                                 <FormField control={addPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                 <FormField control={addPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                              </div>
                               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField control={addPlaceForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Resim URL'si</FormLabel><FormControl><Input placeholder="https://picsum.photos/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={addPlaceForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Resim İpucu (AI için)</FormLabel><FormControl><Input placeholder="landmark" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)}/>
                              </div>
                              <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Yeni Yeri Ekle</Button>
                            </form>
                          </Form>
                        </CardContent>
                    </Card>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Mevcut Yerler</CardTitle>
                            <CardDescription>Kayıtlı tüm yerleri buradan yönetebilirsiniz.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader><TableRow><TableHead>İsim</TableHead><TableHead className="hidden md:table-cell">Kategori</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                              <TableBody>
                                {placesLoading ? Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-5 w-3/4" /></TableCell><TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell></TableRow>))
                                : sortedPlaces?.map((place) => (
                                  <TableRow key={place.id}>
                                    <TableCell className="font-medium">{place.name.tr}</TableCell>
                                    <TableCell className="hidden md:table-cell"><Badge variant="secondary">{categoryLabels[place.category] || 'Diğer'}</Badge></TableCell>
                                    <TableCell className="text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Menü</span></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onSelect={() => setEditingPlace(place)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem>
                                          <DropdownMenuItem onSelect={() => setDeletingPlace(place)} className="text-destructive focus:bg-destructive/10 focus:text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {!placesLoading && places?.length === 0 && (<div className="text-center p-8 text-muted-foreground">Henüz hiç yer eklenmemiş.</div>)}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ROUTES TAB */}
                <TabsContent value="routes">
                    <Card>
                        <CardHeader><CardTitle>Yeni Rota Ekle</CardTitle><CardDescription>Yeni bir tematik rota oluşturun.</CardDescription></CardHeader>
                        <CardContent>
                            <Form {...addRouteForm}>
                                <form onSubmit={addRouteForm.handleSubmit(onAddRouteSubmit)} className="space-y-8">
                                    <LocalizedFormFields form={addRouteForm} fieldNames={['name', 'slug', 'description']} />
                                    <FormField control={addRouteForm.control} name="stops" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duraklar</FormLabel>
                                            <ScrollArea className="h-72 w-full rounded-md border p-4">
                                            {sortedPlaces.map((place) => (
                                                <FormField key={place.id} control={addRouteForm.control} name="stops" render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                                                        <FormControl>
                                                            <Checkbox checked={field.value?.includes(place.id)} onCheckedChange={(checked) => {
                                                                return checked ? field.onChange([...field.value, place.id]) : field.onChange(field.value?.filter((value) => value !== place.id));
                                                            }}/>
                                                        </FormControl>
                                                        <FormLabel className="font-normal">{place.name.tr}</FormLabel>
                                                    </FormItem>
                                                )}/>
                                            ))}
                                            </ScrollArea>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Yeni Rotayı Ekle</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                     <Card className="mt-8">
                        <CardHeader><CardTitle>Mevcut Rotalar</CardTitle></CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader><TableRow><TableHead>İsim</TableHead><TableHead>Durak Sayısı</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {routesLoading ? Array.from({ length: 3 }).map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-5 w-3/4" /></TableCell><TableCell><Skeleton className="h-5 w-12" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell></TableRow>))
                                        : routes?.map((route) => (
                                            <TableRow key={route.id}>
                                                <TableCell className="font-medium">{route.name.tr}</TableCell>
                                                <TableCell>{route.stops.length}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onSelect={() => setEditingRoute(route)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem>
                                                            <DropdownMenuItem onSelect={() => setDeletingRoute(route)} className="text-destructive focus:bg-destructive/10 focus:text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* EXPERIENCES TAB */}
                <TabsContent value="experiences">
                    <Card>
                        <CardHeader><CardTitle>Yeni Deneyim Öğesi Ekle</CardTitle><CardDescription>Ana sayfadaki "Salihli'de Bir Gün" bölümüne yeni bir kart ekleyin.</CardDescription></CardHeader>
                        <CardContent>
                            <Form {...addExperienceItemForm}>
                                <form onSubmit={addExperienceItemForm.handleSubmit(onAddExperienceItemSubmit)} className="space-y-8">
                                    <LocalizedFormFields form={addExperienceItemForm} fieldNames={['name']} />
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                      <FormField control={addExperienceItemForm.control} name="icon" render={({ field }) => (<FormItem><FormLabel>İkon Adı</FormLabel><FormControl><Input placeholder="Mountain" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                      <FormField control={addExperienceItemForm.control} name="link" render={({ field }) => (<FormItem><FormLabel>Link</FormLabel><FormControl><Input placeholder="/yerler?category=nature" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                      <FormField control={addExperienceItemForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıralama</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    </div>
                                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Yeni Öğeyi Ekle</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                     <Card className="mt-8">
                        <CardHeader><CardTitle>Mevcut Deneyim Öğeleri</CardTitle></CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Sıra</TableHead><TableHead>İsim</TableHead><TableHead>İkon</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {experienceItemsLoading ? Array.from({ length: 4 }).map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-5 w-4" /></TableCell><TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell><Skeleton className="h-5 w-24" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell></TableRow>))
                                        : experienceItems?.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.order}</TableCell>
                                                <TableCell className="font-medium">{item.name.tr}</TableCell>
                                                <TableCell><code>{item.icon}</code></TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onSelect={() => setEditingExperienceItem(item)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem>
                                                            <DropdownMenuItem onSelect={() => setDeletingExperienceItem(item)} className="text-destructive focus:bg-destructive/10 focus:text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FEEDBACKS TAB */}
                <TabsContent value="feedbacks">
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                        <div className="w-full md:w-64">
                            <Label className="mb-2 block">Mekan Filtresi</Label>
                            <Select value={feedbackPlaceFilter} onValueChange={setFeedbackPlaceFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tüm Mekanlar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tüm Mekanlar</SelectItem>
                                    {sortedPlaces.map(place => (
                                        <SelectItem key={place.id} value={place.id}>{place.name.tr}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
                            <Download className="h-4 w-4" />
                            Raporu İndir (CSV)
                        </Button>
                    </div>

                    {feedbacksLoading ? (
                        <div className="flex flex-col gap-8">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-[400px] w-full" />
                        </div>
                    ) : filteredFeedbacks && filteredFeedbacks.length > 0 ? (
                        <div className="space-y-8">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                                <Card className="bg-primary/5 border-primary/10">
                                    <CardHeader className="p-4 pb-2">
                                        <CardDescription className="text-xs uppercase tracking-wider">Toplam Katılım</CardDescription>
                                        <CardTitle className="text-2xl flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{stats?.total}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4 pb-2">
                                        <CardDescription className="text-xs uppercase tracking-wider">Temizlik Ort.</CardDescription>
                                        <CardTitle className="text-2xl flex items-center gap-2"><RatingBadge rating={stats?.avgCleanliness || 0} /></CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4 pb-2">
                                        <CardDescription className="text-xs uppercase tracking-wider">Erişim Ort.</CardDescription>
                                        <CardTitle className="text-2xl flex items-center gap-2"><RatingBadge rating={stats?.avgAccessibility || 0} /></CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4 pb-2">
                                        <CardDescription className="text-xs uppercase tracking-wider">Memnuniyet Ort.</CardDescription>
                                        <CardTitle className="text-2xl flex items-center gap-2"><RatingBadge rating={stats?.avgSatisfaction || 0} /></CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4 pb-2">
                                        <CardDescription className="text-xs uppercase tracking-wider">Turla Gelen</CardDescription>
                                        <CardTitle className="text-2xl">{stats?.tourCount}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4 pb-2">
                                        <CardDescription className="text-xs uppercase tracking-wider">Rehberli</CardDescription>
                                        <CardTitle className="text-2xl">{stats?.guidedCount}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4 pb-2">
                                        <CardDescription className="text-xs uppercase tracking-wider">Yeterli Bilgi Panosu</CardDescription>
                                        <CardTitle className="text-2xl">{stats?.infoBoardsCount}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>

                            {/* Feedbacks Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Anket Yanıtları ({filteredFeedbacks.length})</CardTitle>
                                    <CardDescription>Ziyaretçilerden gelen tüm geri bildirimler.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mekan</TableHead>
                                                    <TableHead>Temizlik</TableHead>
                                                    <TableHead>Erişim</TableHead>
                                                    <TableHead>Memnuniyet</TableHead>
                                                    <TableHead className="text-center">Tur</TableHead>
                                                    <TableHead className="text-center">Rehber</TableHead>
                                                    <TableHead className="text-center">Pano</TableHead>
                                                    <TableHead className="text-right">Tarih</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredFeedbacks.map((f, index) => (
                                                    <TableRow key={f.id || `feedback-${index}`}>
                                                        <TableCell className="font-medium flex items-center gap-2">
                                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                                            {f.placeName}
                                                        </TableCell>
                                                        <TableCell><RatingBadge rating={f.cleanliness} /></TableCell>
                                                        <TableCell><RatingBadge rating={f.accessibility} /></TableCell>
                                                        <TableCell><RatingBadge rating={f.satisfaction} /></TableCell>
                                                        <TableCell className="text-center">
                                                            {f.withTour === 'yes' ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground/30 mx-auto" />}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {f.guided === 'yes' ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground/30 mx-auto" />}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {f.infoBoards === 'yes' ? <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground/30 mx-auto" />}
                                                        </TableCell>
                                                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                                                            {f.createdAt?.toDate ? format(f.createdAt.toDate(), 'd MMM HH:mm', { locale: trLocale }) : '---'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center flex flex-col items-center">
                                <Star className="h-12 w-12 text-muted-foreground/20 mb-4" />
                                <CardTitle className="text-muted-foreground">Gösterilecek veri yok.</CardTitle>
                                <CardDescription>Seçili filtreye uygun anket verisi bulunamadı.</CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                
                {/* DATABASE TAB */}
                <TabsContent value="database">
                     <Card>
                        <CardHeader>
                          <CardTitle>Veritabanı Yönetimi</CardTitle>
                          <CardDescription>Uygulamanın başlangıç verilerini (Yerler, Rotalar, Deneyim Öğeleri) veritabanına yükleyin. Bu işlem sadece eksik olan başlangıç verilerini ekler, mevcut verilerinize dokunmaz.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={handleSeedDatabase} disabled={isSeeding}>{isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Başlangıç Verilerini Yükle</Button>
                        </CardContent>
                      </Card>
                </TabsContent>
            </Tabs>
      
            {/* DIALOGS for Editing & Deleting */}
            <Dialog open={!!editingPlace} onOpenChange={(open) => !open && setEditingPlace(null)}>
                <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Yeri Düzenle</DialogTitle></DialogHeader>
                    <Form {...editPlaceForm}><form onSubmit={editPlaceForm.handleSubmit(onEditPlaceSubmit)}>
                        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <LocalizedFormFields form={editPlaceForm} fieldNames={['name', 'slug', 'description']} />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <FormField control={editPlaceForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Kategori</FormLabel><select {...field} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option><option value="shopping">Alışveriş</option><option value="poi">Önemli Nokta</option></select><FormMessage /></FormItem>)}/>
                                <FormField control={editPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={editPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField control={editPlaceForm.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Resim URL'si</FormLabel><FormControl><Input placeholder="https://picsum.photos/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={editPlaceForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Resim İpucu (AI için)</FormLabel><FormControl><Input placeholder="landmark" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                        </div>
                        <DialogFooter className="pt-4"><DialogClose asChild><Button type="button" variant="outline">İptal</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Değişiklikleri Kaydet</Button></DialogFooter>
                    </form></Form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!deletingPlace} onOpenChange={(open) => !open && setDeletingPlace(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{deletingPlace?.name.tr}" adlı yeri kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(deletingPlace, deletePlace, setDeletingPlace, 'Yer')} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
            <Dialog open={!!editingRoute} onOpenChange={(open) => !open && setEditingRoute(null)}>
                <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Rotayı Düzenle</DialogTitle></DialogHeader>
                    <Form {...editRouteForm}><form onSubmit={editRouteForm.handleSubmit(onEditRouteSubmit)}>
                        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <LocalizedFormFields form={editRouteForm} fieldNames={['name', 'slug', 'description']} />
                            <FormField control={editRouteForm.control} name="stops" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duraklar</FormLabel>
                                    <ScrollArea className="h-72 w-full rounded-md border p-4">
                                    {sortedPlaces.map((place) => (
                                        <FormField key={place.id} control={editRouteForm.control} name="stops" render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                                                <FormControl><Checkbox checked={field.value?.includes(place.id)} onCheckedChange={(checked) => {return checked ? field.onChange([...field.value, place.id]) : field.onChange(field.value?.filter((value) => value !== place.id));}}/></FormControl>
                                                <FormLabel className="font-normal">{place.name.tr}</FormLabel>
                                            </FormItem>
                                        )}/>
                                    ))}
                                    </ScrollArea><FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter className="pt-4"><DialogClose asChild><Button type="button" variant="outline">İptal</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Değişiklikleri Kaydet</Button></DialogFooter>
                    </form></Form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!deletingRoute} onOpenChange={(open) => !open && setDeletingRoute(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{deletingRoute?.name.tr}" adlı rotayı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(deletingRoute, deleteRoute, setDeletingRoute, 'Rota')} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
            <Dialog open={!!editingExperienceItem} onOpenChange={(open) => !open && setEditingExperienceItem(null)}>
                <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Deneyim Öğesini Düzenle</DialogTitle></DialogHeader>
                    <Form {...editExperienceItemForm}><form onSubmit={editExperienceItemForm.handleSubmit(onEditExperienceItemSubmit)}>
                        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                             <LocalizedFormFields form={editExperienceItemForm} fieldNames={['name']} />
                             <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <FormField control={editExperienceItemForm.control} name="icon" render={({ field }) => (<FormItem><FormLabel>İkon Adı</FormLabel><FormControl><Input placeholder="Mountain" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={editExperienceItemForm.control} name="link" render={({ field }) => (<FormItem><FormLabel>Link</FormLabel><FormControl><Input placeholder="/yerler?category=nature" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={editExperienceItemForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıralama</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             </div>
                        </div>
                        <DialogFooter className="pt-4"><DialogClose asChild><Button type="button" variant="outline">İptal</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Değişiklikleri Kaydet</Button></DialogFooter>
                    </form></Form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!deletingExperienceItem} onOpenChange={(open) => !open && setDeletingExperienceItem(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{deletingExperienceItem?.name.tr}" adlı öğeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(deletingExperienceItem, deleteExperienceItem, setDeletingExperienceItem, 'Deneyim Öğesi')} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
