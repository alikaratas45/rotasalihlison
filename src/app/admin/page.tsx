'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useDoc, useFirebaseApp } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, orderBy, query, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';

// Services
import { addPlace, updatePlace, deletePlace, updateSubPoints } from '@/firebase/firestore/places-service';
import { seedDatabase, undoLastOperation, createBackup } from '@/firebase/firestore/seed-service';
import { addExperienceItem, updateExperienceItem, deleteExperienceItem } from '@/firebase/firestore/experience-menu-service';
import { deleteFeedbackComment } from '@/firebase/firestore/feedback-service';
import { addStory, updateStory, deleteStory } from '@/firebase/firestore/stories-service';
import { addRoute, updateRoute, deleteRoute } from '@/firebase/firestore/routes-service';

// UI Components
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, FilePenLine, Trash2, Plus, Upload, Headphones, Download, Settings, BookOpen, Route as RouteIcon, Utensils, Bed, MapPin, AlertCircle, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

// Definitions
import type { Place, Feedback, SubPoint, ExperienceItem, CommentFeedback, Story, Route } from '@/lib/definitions';

// Constants
const languageNames: Record<string, string> = { tr: 'Türkçe', en: 'English', fr: 'Français', de: 'Deutsch', ja: '日本語' };
const languages = ['tr', 'en', 'fr', 'de', 'ja'] as const;

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
  category: z.enum(['history', 'nature', 'food', 'shopping', 'poi', 'accommodation']),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  imageUrl: z.string().url({ message: 'Lütfen geçerli bir URL girin.' }).optional().or(z.literal('')),
  imageHint: z.string().optional(),
  order: z.coerce.number().min(0).optional().or(z.literal(0)),
  audioUrlTr: z.string().optional().or(z.literal('')),
});

const storyFormSchema = z.object({
    title: localizedStringSchema,
    slug: localizedStringSchema,
    author: localizedStringSchema,
    content: localizedStringSchema,
    placeId: z.string().optional(),
});

const routeFormSchema = z.object({
    name: localizedStringSchema,
    slug: localizedStringSchema,
    description: localizedStringSchema,
    stops: z.array(z.string()).default([]),
    kmlUrl: z.string().optional(),
});

// Helper Component for Localized Fields
const LocalizedFields = ({ form, fieldNames, prefix = "" }: { form: any, fieldNames: string[], prefix?: string }) => {
    return (
        <Accordion type="multiple" defaultValue={['tr', 'en']} className="w-full space-y-4">
            {languages.map((lang) => (
                <AccordionItem value={lang} key={`${prefix}${lang}`}>
                    <AccordionTrigger className="py-2 hover:no-underline">
                        <Badge variant="outline" className="mr-2">{lang.toUpperCase()}</Badge> {languageNames[lang]}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4 border-t mt-2">
                        {fieldNames.includes('name') && (
                            <FormField control={form.control} name={`${prefix}name.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>İsim</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                        {fieldNames.includes('title') && (
                            <FormField control={form.control} name={`${prefix}title.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>Başlık</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                        {fieldNames.includes('author') && (
                            <FormField control={form.control} name={`${prefix}author.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>Yazar / Kaynak</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                        {fieldNames.includes('description') && (
                            <FormField control={form.control} name={`${prefix}description.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>Açıklama / Kısa Özet</FormLabel><FormControl><Textarea rows={4} {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                        {fieldNames.includes('content') && (
                            <FormField control={form.control} name={`${prefix}content.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>İçerik / Metin</FormLabel><FormControl><Textarea rows={10} {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                        {fieldNames.includes('slug') && (
                            <FormField control={form.control} name={`${prefix}slug.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>Link Metni (Slug)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default function AdminPage() {
    const firestore = useFirestore();
    const firebaseApp = useFirebaseApp();
    const { toast } = useToast();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('places');

    // Data queries
    const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
    const storiesQuery = useMemo(() => query(collection(firestore, 'stories')), [firestore]);
    const routesQuery = useMemo(() => query(collection(firestore, 'routes')), [firestore]);

    const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);
    const { data: stories, loading: storiesLoading } = useCollection<Story>(storiesQuery);
    const { data: routes, loading: routesLoading } = useCollection<Route>(routesQuery);

    // ID tracking states
    const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
    const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
    const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
    
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingType, setDeletingType] = useState<'place' | 'story' | 'route' | null>(null);

    const sortedPlaces = useMemo(() => {
        if (!places) return [];
        return [...places].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    }, [places]);

    // Forms
    const placeForm = useForm({ 
        resolver: zodResolver(placeFormSchema), 
        defaultValues: { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14, order: 99, audioUrlTr: '', imageUrl: '' } as any 
    });

    const storyForm = useForm({
        resolver: zodResolver(storyFormSchema),
        defaultValues: { title: { tr: '', en: '' }, slug: { tr: '', en: '' }, author: { tr: '', en: '' }, content: { tr: '', en: '' }, placeId: '' } as any
    });

    const routeForm = useForm({
        resolver: zodResolver(routeFormSchema),
        defaultValues: { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, stops: [], kmlUrl: '' } as any
    });

    // Reset forms when editing
    useEffect(() => {
        if (editingPlaceId && places) {
            const p = places.find(x => x.id === editingPlaceId);
            if (p) placeForm.reset({ ...p, lat: p.coordinates.lat, lng: p.coordinates.lng });
        } else if (!editingPlaceId) {
            placeForm.reset({ name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14, order: 99, audioUrlTr: '', imageUrl: '' });
        }
    }, [editingPlaceId, places, placeForm]);

    useEffect(() => {
        if (editingStoryId && stories) {
            const s = stories.find(x => x.id === editingStoryId);
            if (s) storyForm.reset(s);
        } else if (!editingStoryId) {
            storyForm.reset({ title: { tr: '', en: '' }, slug: { tr: '', en: '' }, author: { tr: '', en: '' }, content: { tr: '', en: '' }, placeId: '' });
        }
    }, [editingStoryId, stories, storyForm]);

    useEffect(() => {
        if (editingRouteId && routes) {
            const r = routes.find(x => x.id === editingRouteId);
            if (r) routeForm.reset(r);
        } else if (!editingRouteId) {
            routeForm.reset({ name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, stops: [], kmlUrl: '' });
        }
    }, [editingRouteId, routes, routeForm]);

    // Action Handlers
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, pathPrefix: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const storage = getStorage(firebaseApp);
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `${pathPrefix}/${fileName}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            
            if (pathPrefix === 'audio') placeForm.setValue('audioUrlTr', url);
            if (pathPrefix === 'kml') routeForm.setValue('kmlUrl', url);
            
            toast({ title: 'Yüklendi', description: 'Değişikliği kaydetmeyi unutmayın.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Yükleme başarısız.' });
        } finally { setIsUploading(false); }
    };

    const onPlaceSubmit = (values: any) => {
        setIsSubmitting(true);
        const data = { ...values, coordinates: { lat: values.lat, lng: values.lng } };
        const callback = { 
            onSuccess: () => { toast({ title: 'Başarılı' }); setEditingPlaceId(null); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false)
        };
        editingPlaceId ? updatePlace(firestore, editingPlaceId, data, callback) : addPlace(firestore, data, callback);
    };

    const onStorySubmit = (values: any) => {
        setIsSubmitting(true);
        const callback = {
            onSuccess: () => { toast({ title: 'Başarılı' }); setEditingStoryId(null); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false)
        };
        editingStoryId ? updateStory(firestore, editingStoryId, values, callback) : addStory(firestore, values, callback);
    };

    const onRouteSubmit = (values: any) => {
        setIsSubmitting(true);
        const callback = {
            onSuccess: () => { toast({ title: 'Başarılı' }); setEditingRouteId(null); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false)
        };
        editingRouteId ? updateRoute(firestore, editingRouteId, values, callback) : addRoute(firestore, values, callback);
    };

    const handleDelete = async () => {
        if (!deletingId || !deletingType) return;
        setIsSubmitting(true);
        const callback = { onSuccess: () => { toast({ title: 'Silindi' }); setDeletingId(null); setIsSubmitting(false); } };
        if (deletingType === 'place') deletePlace(firestore, deletingId, callback);
        if (deletingType === 'story') deleteStory(firestore, deletingId, callback);
        if (deletingType === 'route') deleteRoute(firestore, deletingId, callback);
    };

    const handleManualBackup = async () => {
        setIsBackingUp(true);
        try {
            await createBackup(firestore);
            toast({ title: 'Yedekleme Başarılı', description: 'Şu anki site durumu başarıyla kaydedildi.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Yedekleme sırasında bir sorun oluştu.' });
        } finally {
            setIsBackingUp(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex justify-center sticky top-0 z-40 glass py-4 border-b overflow-x-auto gap-2">
                    <TabsTrigger value="places" className="rounded-xl px-6">Yerler & Mekanlar</TabsTrigger>
                    <TabsTrigger value="stories" className="rounded-xl px-6">Hikayeler</TabsTrigger>
                    <TabsTrigger value="routes" className="rounded-xl px-6">Rotalar & KML</TabsTrigger>
                    <TabsTrigger value="database" className="rounded-xl px-6">Veritabanı</TabsTrigger>
                </TabsList>

                {/* --- YERLER & MEKANLAR --- */}
                <TabsContent value="places" className="p-4 space-y-8 animate-in fade-in duration-500">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <Button variant="outline" className="rounded-2xl h-12 gap-2 border-primary/20 hover:bg-primary/5" onClick={() => { setEditingPlaceId(null); placeForm.reset(); placeForm.setValue('category', 'food'); }}>
                            <Utensils className="h-4 w-4 text-orange-600" /> Yeni Lezzet Durağı
                        </Button>
                        <Button variant="outline" className="rounded-2xl h-12 gap-2 border-primary/20 hover:bg-primary/5" onClick={() => { setEditingPlaceId(null); placeForm.reset(); placeForm.setValue('category', 'accommodation'); }}>
                            <Bed className="h-4 w-4 text-blue-600" /> Yeni Konaklama İşletmesi
                        </Button>
                    </div>

                    <Card className="rounded-[2rem] shadow-xl border-none">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black font-headline text-primary">
                                {editingPlaceId ? 'Mekanı Düzenle' : 'Yeni Yer/Mekan Ekle'}
                            </CardTitle>
                            <CardDescription>Sardes, Kurşunlu, restoranlar veya oteller gibi tüm noktaları buradan yönetin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...placeForm}>
                                <form onSubmit={placeForm.handleSubmit(onPlaceSubmit)} className="space-y-8">
                                    <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/10 space-y-4">
                                        <h4 className="font-bold flex items-center gap-2 text-primary"><Headphones className="h-5 w-5" /> Türkçe Seslendirme (MP3)</h4>
                                        <div className="flex items-center gap-4">
                                            <input type="file" accept="audio/mpeg" onChange={e => handleFileUpload(e, 'audio')} className="hidden" id="audio-upload" />
                                            <Button type="button" variant="outline" className="rounded-xl font-bold" onClick={() => document.getElementById('audio-upload')?.click()} disabled={isUploading}>
                                                {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />} MP3 Yükle
                                            </Button>
                                            {placeForm.watch('audioUrlTr') && <Badge className="bg-green-600">MP3 Yüklü</Badge>}
                                        </div>
                                    </div>
                                    
                                    <LocalizedFields form={placeForm} fieldNames={['name', 'slug', 'description']} />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={placeForm.control} name="category" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kategori (Nerede Listelenecek?)</FormLabel>
                                                <select {...field} className="w-full h-12 rounded-xl border border-input px-4 focus:ring-2 focus:ring-primary font-bold">
                                                    <option value="poi">Önemli Nokta (Yerler Sayfası)</option>
                                                    <option value="history">Tarih (Yerler Sayfası)</option>
                                                    <option value="nature">Doğa (Yerler Sayfası)</option>
                                                    <option value="food">Lezzet Durağı (Lezzetler Sayfası)</option>
                                                    <option value="accommodation">Konaklama İşletmesi (Konaklama Sayfası)</option>
                                                </select>
                                            </FormItem>
                                        )}/>
                                        <FormField control={placeForm.control} name="imageUrl" render={({ field }) => (
                                            <FormItem><FormLabel>Görsel URL (Direct Link)</FormLabel><FormControl><Input placeholder="https://i.imgur.com/..." {...field} className="rounded-xl h-12" /></FormControl></FormItem>
                                        )}/>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <FormField control={placeForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Enlem (Lat)</FormLabel><Input type="number" step="any" {...field} className="rounded-xl" /></FormItem>)}/>
                                        <FormField control={placeForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Boylam (Lng)</FormLabel><Input type="number" step="any" {...field} className="rounded-xl" /></FormItem>)}/>
                                        <FormField control={placeForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıralama No</FormLabel><Input type="number" {...field} className="rounded-xl" /></FormItem>)}/>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="submit" disabled={isSubmitting} className="rounded-2xl px-12 h-14 font-black shadow-lg">
                                            {isSubmitting && <Loader2 className="animate-spin mr-2" />} {editingPlaceId ? 'Güncelle' : 'Kaydet'}
                                        </Button>
                                        {editingPlaceId && <Button variant="ghost" onClick={() => setEditingPlaceId(null)} className="h-14 rounded-2xl">İptal</Button>}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                        <CardHeader><CardTitle>Mevcut Yerler</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader><TableRow className="bg-muted/50"><TableHead className="w-20 pl-6">Sıra</TableHead><TableHead>İsim</TableHead><TableHead>Kategori</TableHead><TableHead className="text-right pr-6">İşlemler</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {placesLoading ? <TableRow><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow> : 
                                    sortedPlaces.map(p => (
                                        <TableRow key={p.id} className="hover:bg-muted/30">
                                            <TableCell className="pl-6"><Badge variant="secondary">{p.order || '-'}</Badge></TableCell>
                                            <TableCell className="font-bold">{p.name.tr}</TableCell>
                                            <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" onClick={() => setEditingPlaceId(p.id)}><FilePenLine className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingId(p.id); setDeletingType('place'); }}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- HİKAYELER --- */}
                <TabsContent value="stories" className="p-4 space-y-8 animate-in fade-in duration-500">
                    <Card className="rounded-[2rem] shadow-xl border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-black text-primary"><BookOpen /> {editingStoryId ? 'Hikayeyi Düzenle' : 'Yeni Hikaye Ekle'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...storyForm}>
                                <form onSubmit={storyForm.handleSubmit(onStorySubmit)} className="space-y-6">
                                    <LocalizedFields form={storyForm} fieldNames={['title', 'slug', 'author', 'content']} />
                                    <FormField control={storyForm.control} name="placeId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>İlgili Mekan (Mekana Git butonu için)</FormLabel>
                                            <select {...field} className="w-full h-12 rounded-xl border px-4 font-bold">
                                                <option value="">Bağlantılı Mekan Yok</option>
                                                {places?.map(p => <option key={p.id} value={p.id}>{p.name.tr}</option>)}
                                            </select>
                                        </FormItem>
                                    )}/>
                                    <div className="flex gap-4">
                                        <Button type="submit" disabled={isSubmitting} className="rounded-2xl px-12 h-14 font-black">
                                            {isSubmitting && <Loader2 className="animate-spin mr-2" />} Kaydet
                                        </Button>
                                        {editingStoryId && <Button variant="ghost" onClick={() => setEditingStoryId(null)} className="h-14 rounded-2xl">İptal</Button>}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader><TableRow className="bg-muted/50"><TableHead className="pl-6">Başlık</TableHead><TableHead>Yazar</TableHead><TableHead className="text-right pr-6">İşlemler</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {storiesLoading ? <TableRow><TableCell colSpan={3}><Skeleton className="h-12 w-full" /></TableCell></TableRow> : 
                                    stories?.map(s => (
                                        <TableRow key={s.id} className="hover:bg-muted/30">
                                            <TableCell className="pl-6 font-bold">{s.title.tr}</TableCell>
                                            <TableCell className="text-muted-foreground">{s.author.tr}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" onClick={() => setEditingStoryId(s.id)}><FilePenLine className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingId(s.id); setDeletingType('story'); }}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- ROTALAR & KML --- */}
                <TabsContent value="routes" className="p-4 space-y-8 animate-in fade-in duration-500">
                    <Card className="rounded-[2rem] shadow-xl border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-black text-primary"><RouteIcon /> {editingRouteId ? 'Rotayı Düzenle' : 'Yeni Rota Oluştur'}</CardTitle>
                            <CardDescription>Tematik rotalar (durak seçimiyle) veya bisiklet/yürüyüş yolları (KML yükleyerek) oluşturun.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...routeForm}>
                                <form onSubmit={routeForm.handleSubmit(onRouteSubmit)} className="space-y-6">
                                    <LocalizedFields form={routeForm} fieldNames={['name', 'slug', 'description']} />
                                    
                                    <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/10 space-y-4">
                                        <h4 className="font-bold flex items-center gap-2 text-primary"><MapPin className="h-5 w-5" /> Rota Çizimi (KML Dosyası)</h4>
                                        <FormDescription>Bisiklet veya yürüyüş rotası için Google Earth/Maps'ten aldığınız .kml dosyasını buraya yükleyin.</FormDescription>
                                        <div className="flex items-center gap-4">
                                            <input type="file" accept=".kml" onChange={e => handleFileUpload(e, 'kml')} className="hidden" id="kml-upload" />
                                            <Button type="button" variant="outline" className="rounded-xl font-bold" onClick={() => document.getElementById('kml-upload')?.click()} disabled={isUploading}>
                                                {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />} KML Yükle
                                            </Button>
                                            {routeForm.watch('kmlUrl') && <Badge className="bg-blue-600">KML Aktif</Badge>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-bold text-primary">Rota Duraklarını Seçin (Tematik Rotalar İçin)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-4 bg-muted/20 rounded-2xl border">
                                            {places?.map(p => (
                                                <div key={p.id} className="flex items-center space-x-2 bg-background p-2 rounded-lg shadow-sm">
                                                    <Checkbox 
                                                        id={`stop-${p.id}`} 
                                                        checked={routeForm.watch('stops')?.includes(p.id)}
                                                        onCheckedChange={(checked) => {
                                                            const current = routeForm.getValues('stops') || [];
                                                            routeForm.setValue('stops', checked ? [...current, p.id] : current.filter(id => id !== p.id));
                                                        }}
                                                    />
                                                    <label htmlFor={`stop-${p.id}`} className="text-xs font-medium cursor-pointer truncate">{p.name.tr}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="submit" disabled={isSubmitting} className="rounded-2xl px-12 h-14 font-black">
                                            {isSubmitting && <Loader2 className="animate-spin mr-2" />} Rota Kaydet
                                        </Button>
                                        {editingRouteId && <Button variant="ghost" onClick={() => setEditingRouteId(null)} className="h-14 rounded-2xl">İptal</Button>}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader><TableRow className="bg-muted/50"><TableHead className="pl-6">Rota İsmi</TableHead><TableHead>Durak Sayısı</TableHead><TableHead>KML Durumu</TableHead><TableHead className="text-right pr-6">İşlemler</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {routesLoading ? <TableRow><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow> : 
                                    routes?.map(r => (
                                        <TableRow key={r.id} className="hover:bg-muted/30">
                                            <TableCell className="pl-6 font-bold">{r.name.tr}</TableCell>
                                            <TableCell><Badge variant="secondary">{r.stops?.length || 0} Durak</Badge></TableCell>
                                            <TableCell>{r.kmlUrl ? <Badge className="bg-blue-100 text-blue-800">Çizim Var</Badge> : <span className="text-xs text-muted-foreground">Yok</span>}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" onClick={() => setEditingRouteId(r.id)}><FilePenLine className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingId(r.id); setDeletingType('route'); }}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- VERİTABANI & AYARLAR --- */}
                <TabsContent value="database" className="p-4 space-y-8 animate-in fade-in duration-500">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                            <CardHeader><CardTitle>Sitenin Şu Anki Halini Yedekle</CardTitle><CardDescription>Tüm yerleri, rotaları ve hikayeleri güvenli bir şekilde yedekler.</CardDescription></CardHeader>
                            <CardContent>
                                <Button onClick={handleManualBackup} disabled={isBackingUp} className="w-full h-14 rounded-2xl font-bold" variant="default">
                                    {isBackingUp ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Şu Anki Durumu Yedekle
                                </Button>
                            </CardContent>
                        </Card>
                        
                        <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                            <CardHeader><CardTitle>Statik Verileri Yükle</CardTitle><CardDescription>Kod içindeki varsayılan verileri veritabanına aktarır.</CardDescription></CardHeader>
                            <CardContent>
                                <Button onClick={async () => { setIsSeeding(true); await seedDatabase(firestore, 'UPDATE'); setIsSeeding(false); toast({ title: 'Güncellendi' }); }} disabled={isSeeding} className="w-full h-14 rounded-2xl font-bold" variant="secondary">
                                    {isSeeding ? <Loader2 className="animate-spin mr-2" /> : null} Verileri Koddan Güncelle
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                            <CardHeader><CardTitle>Yedekten Geri Yükle</CardTitle><CardDescription>En son yapılan işlemleri veya son manuel yedeği geri yükler.</CardDescription></CardHeader>
                            <CardContent>
                                <Button onClick={() => undoLastOperation(firestore)} className="w-full h-14 rounded-2xl font-bold" variant="outline">Son İşlemi/Yedeği Geri Al</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* DELETE DIALOG */}
            <AlertDialog open={!!deletingId} onOpenChange={o => !o && setDeletingId(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10 max-w-md">
                    <AlertDialogHeader className="flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black font-headline">Silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription className="text-lg font-medium text-slate-600 mt-2">Bu işlem geri alınamaz ve veri kalıcı olarak silinecektir.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-10">
                        <AlertDialogCancel className="rounded-xl h-12 flex-1 border-slate-200">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 font-black flex-1">
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Evet, Sil'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
