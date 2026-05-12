
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, orderBy, query, doc, setDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';

// Services
import { addPlace, updatePlace, deletePlace, updateSubPoints } from '@/firebase/firestore/places-service';
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
import { Loader2, MoreHorizontal, FilePenLine, Trash2, History, RefreshCw, Plus, Layers, Info, LayoutGrid, MapPin, X, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  order: z.coerce.number().min(0).optional().or(z.literal(0)),
});

const experienceFormSchema = z.object({
  name: localizedStringSchema,
  icon: z.string().min(1, 'İkon adı gereklidir.'),
  link: z.string().min(1, 'Link gereklidir.'),
  order: z.coerce.number().min(1),
});

const subPointFormSchema = z.object({
    name: localizedStringSchema,
    description: localizedStringSchema,
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
});

const settingsFormSchema = z.object({
    aboutTitle: localizedStringSchema,
    aboutContent: localizedStringSchema,
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
    const [editingSubPoint, setEditingSubPoint] = useState<SubPoint | null>(null);
    const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
    const [deletingExperience, setDeletingExperience] = useState<ExperienceItem | null>(null);
    
    const { data: places, loading: placesLoading } = useCollection<Place>(useMemo(() => query(collection(firestore, 'places')), [firestore]));
    const { data: experienceItems, loading: experienceLoading } = useCollection<ExperienceItem>(useMemo(() => query(collection(firestore, 'experience-items'), orderBy('order')), [firestore]));
    const { data: feedbacks } = useCollection<Feedback>(useMemo(() => query(collection(firestore, 'feedbacks'), orderBy('createdAt', 'desc')), [firestore]));
    const { data: aboutSettings } = useDoc<any>(useMemo(() => doc(firestore, 'settings', 'about'), [firestore]));

    const sortedPlaces = useMemo(() => {
        if (!places) return [];
        return [...places].sort((a, b) => {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.tr.localeCompare(b.name.tr, 'tr');
        });
    }, [places]);

    const sortedExperienceItems = useMemo(() => {
        if (!experienceItems) return [];
        return [...experienceItems].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
    }, [experienceItems]);

    const addPlaceForm = useForm({ resolver: zodResolver(placeFormSchema), defaultValues: { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14, order: 99 } as any });
    const editPlaceForm = useForm({ resolver: zodResolver(placeFormSchema) });
    const addExperienceForm = useForm({ resolver: zodResolver(experienceFormSchema), defaultValues: { name: { tr: '', en: '' }, icon: 'HelpCircle', link: '/', order: 10 } as any });
    const editExperienceForm = useForm({ resolver: zodResolver(experienceFormSchema) });
    const subPointForm = useForm({ resolver: zodResolver(subPointFormSchema), defaultValues: { name: { tr: '', en: '' }, description: { tr: '', en: '' }, lat: 38.48, lng: 28.14 } as any });
    const siteSettingsForm = useForm({ 
        resolver: zodResolver(settingsFormSchema),
        defaultValues: { aboutTitle: { tr: '', en: '' }, aboutContent: { tr: '', en: '' } }
    });

    useEffect(() => { 
        if (editingPlace) {
            editPlaceForm.reset({ 
                name: editingPlace.name,
                slug: editingPlace.slug,
                description: editingPlace.description,
                category: editingPlace.category,
                lat: editingPlace.coordinates?.lat || 0, 
                lng: editingPlace.coordinates?.lng || 0,
                imageUrl: editingPlace.imageUrl || '',
                imageHint: editingPlace.imageHint || '',
                order: editingPlace.order ?? 99
            }); 
        }
    }, [editingPlace, editPlaceForm]);

    useEffect(() => {
        if (editingExperience) {
            editExperienceForm.reset({
                name: editingExperience.name,
                icon: editingExperience.icon,
                link: editingExperience.link,
                order: editingExperience.order
            });
        }
    }, [editingExperience, editExperienceForm]);

    useEffect(() => {
        if (editingSubPoint) {
            subPointForm.reset({
                name: editingSubPoint.name,
                description: editingSubPoint.description,
                lat: editingSubPoint.coordinates.lat,
                lng: editingSubPoint.coordinates.lng
            });
        } else {
            subPointForm.reset({ name: { tr: '', en: '' }, description: { tr: '', en: '' }, lat: 38.48, lng: 28.14 });
        }
    }, [editingSubPoint, subPointForm]);

    useEffect(() => {
        if (aboutSettings && !isSubmitting) {
            siteSettingsForm.reset({
                aboutTitle: aboutSettings.aboutTitle || { tr: '', en: '' },
                aboutContent: aboutSettings.aboutContent || { tr: '', en: '' },
            });
        }
    }, [aboutSettings, siteSettingsForm, isSubmitting]);

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

    const handleAddExperienceSubmit = (values: any) => {
        setIsSubmitting(true);
        addExperienceItem(firestore, values, {
            onSuccess: () => { toast({ title: 'Menü Öğesi Eklendi' }); addExperienceForm.reset(); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false)
        });
    };

    const handleEditExperienceSubmit = (values: any) => {
        if (!editingExperience?.id) return;
        setIsSubmitting(true);
        updateExperienceItem(firestore, editingExperience.id, values, {
            onSuccess: () => { toast({ title: 'Menü Öğesi Güncellendi' }); setEditingExperience(null); setIsSubmitting(false); },
            onError: () => setIsSubmitting(false)
        });
    };

    const handleSubPointSubmit = (values: any) => {
        if (!managingSubPointsPlace) return;
        setIsSubmitting(true);
        
        let updatedSubPoints = [...(managingSubPointsPlace.subPoints || [])];
        
        if (editingSubPoint) {
            updatedSubPoints = updatedSubPoints.map(s => 
                s.id === editingSubPoint.id 
                ? { ...s, name: values.name, description: values.description, coordinates: { lat: values.lat, lng: values.lng } }
                : s
            );
        } else {
            const newSubPoint: SubPoint = { 
                id: Math.random().toString(36).substring(7), 
                name: values.name, 
                description: values.description, 
                coordinates: { lat: values.lat, lng: values.lng } 
            };
            updatedSubPoints.push(newSubPoint);
        }

        updateSubPoints(firestore, managingSubPointsPlace.id, updatedSubPoints, { 
            onSuccess: () => { 
                toast({ title: editingSubPoint ? 'Alt Başlık Güncellendi' : 'Alt Başlık Eklendi' }); 
                setEditingSubPoint(null);
                subPointForm.reset(); 
                setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: updatedSubPoints }); 
                setIsSubmitting(false); 
            }, 
            onError: () => setIsSubmitting(false) 
        });
    };

    const handleSettingsSubmit = async (values: any) => {
        setIsSubmitting(true);
        try {
            await setDoc(doc(firestore, 'settings', 'about'), values, { merge: true });
            toast({ title: 'Ayarlar Kaydedildi' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Hata', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
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
                    <AccordionTrigger className="hover:no-underline py-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold bg-muted px-2 py-0.5 rounded">{lang.toUpperCase()}</span>
                            <span>{languageNames[lang]}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2 border-t mt-2">
                        {fieldNames.includes('name') && <FormField control={form.control} name={`${prefix}name.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>İsim ({lang})</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                         {fieldNames.includes('aboutTitle') && <FormField control={form.control} name={`${prefix}aboutTitle.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Başlık ({lang})</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                        {fieldNames.includes('slug') && <FormField control={form.control} name={`${prefix}slug.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Link Metni ({lang})</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                        {fieldNames.includes('description') && <FormField control={form.control} name={`${prefix}description.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Açıklama ({lang})</FormLabel><FormControl><Textarea rows={5} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                        {fieldNames.includes('aboutContent') && <FormField control={form.control} name={`${prefix}aboutContent.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Hakkında İçeriği ({lang})</FormLabel><FormControl><Textarea rows={8} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                        )} />}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <Tabs defaultValue="places" className="w-full">
                <div className="flex justify-center sticky top-0 z-40 bg-background/95 backdrop-blur-md py-4 border-b">
                    <TabsList className="flex-wrap h-auto">
                        <TabsTrigger value="places">Yerler</TabsTrigger>
                        <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
                        <TabsTrigger value="experiences">Deneyim Menüsü</TabsTrigger>
                        <TabsTrigger value="feedbacks">Anketler</TabsTrigger>
                        <TabsTrigger value="database">Veritabanı</TabsTrigger>
                    </TabsList>
                </div>
                
                <div className="p-4 space-y-8">
                    <TabsContent value="places" className="mt-0 space-y-8">
                        <Card>
                            <CardHeader><CardTitle>Yeni Yer Ekle</CardTitle></CardHeader>
                            <CardContent>
                                <Form {...addPlaceForm}>
                                    <form onSubmit={addPlaceForm.handleSubmit(handleAddPlaceSubmit)} className="space-y-8">
                                        {renderLocalizedFields(addPlaceForm, ['name', 'slug', 'description'])}
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                            <FormField control={addPlaceForm.control} name="category" render={({ field }) => (
                                                <FormItem><FormLabel>Kategori</FormLabel><select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option><option value="shopping">Alışveriş</option><option value="poi">Önemli Nokta</option></select></FormItem>
                                            )}/>
                                            <FormField control={addPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                            <FormField control={addPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                            <FormField control={addPlaceForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıralama</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)}/>
                                        </div>
                                        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="animate-spin mr-2" />} Ekle</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Mevcut Yerler</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader><TableRow><TableHead className="w-16">Sıra</TableHead><TableHead>İsim</TableHead><TableHead>Kategori</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {placesLoading ? (<TableRow><TableCell colSpan={4}><Skeleton className="h-20 w-full" /></TableCell></TableRow>) : sortedPlaces.map((place) => (
                                            <TableRow key={place.id}>
                                                <TableCell className="font-bold text-primary">{place.order ?? '-'}</TableCell>
                                                <TableCell className="font-medium">{place.name.tr}</TableCell>
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

                    <TabsContent value="general" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Info className="text-primary" /> Salihli Hakkında Bilgileri</CardTitle>
                                <CardDescription>Ana sayfadaki "Salihli Hakkında" butonuna basıldığında açılan penceredeki metinleri 5 dilde düzenleyin.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...siteSettingsForm}>
                                    <form onSubmit={siteSettingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-8">
                                        {renderLocalizedFields(siteSettingsForm, ['aboutTitle', 'aboutContent'])}
                                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                                            {isSubmitting && <Loader2 className="animate-spin mr-2" />} Değişiklikleri Kaydet
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="experiences" className="mt-0 space-y-8">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><LayoutGrid className="text-primary" /> Yeni Menü Öğesi Ekle</CardTitle><CardDescription>Ana sayfadaki 6'lı grid menüye yeni bir seçenek ekleyin.</CardDescription></CardHeader>
                            <CardContent>
                                <Form {...addExperienceForm}>
                                    <form onSubmit={addExperienceForm.handleSubmit(handleAddExperienceSubmit)} className="space-y-6">
                                        {renderLocalizedFields(addExperienceForm, ['name'])}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField control={addExperienceForm.control} name="icon" render={({ field }) => (
                                                <FormItem><FormLabel>İkon (Lucide)</FormLabel><FormControl><Input placeholder="Mountain, Landmark vb." {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={addExperienceForm.control} name="link" render={({ field }) => (
                                                <FormItem><FormLabel>Link</FormLabel><FormControl><Input placeholder="/yerler?category=nature" {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={addExperienceForm.control} name="order" render={({ field }) => (
                                                <FormItem><FormLabel>Sıralama</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                            )} />
                                        </div>
                                        <Button type="submit" disabled={isSubmitting}>Ekle</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Deneyim Menüsü Sıralaması</CardTitle><CardDescription>Menü öğeleri 'order' değerine göre ana sayfada listelenir.</CardDescription></CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Sıra</TableHead><TableHead>İsim</TableHead><TableHead>Link</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {experienceLoading ? (<TableRow><TableCell colSpan={4}><Skeleton className="h-20 w-full" /></TableCell></TableRow>) : sortedExperienceItems?.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-bold text-primary">{item.order}</TableCell>
                                                <TableCell>{item.name.tr}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">{item.link}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setEditingExperience(item)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setDeletingExperience(item)} className="text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem>
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

                    <TabsContent value="feedbacks" className="mt-0">
                        <div className="flex gap-4 mb-4"><div className="w-full sm:w-64"><Label>Mekan Filtresi</Label><Select value={feedbackPlaceFilter} onValueChange={setFeedbackPlaceFilter}><SelectTrigger><SelectValue placeholder="Tüm Yerler" /></SelectTrigger><SelectContent><SelectItem value="all">Tüm Yerler</SelectItem>{sortedPlaces.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name.tr}</SelectItem>))}</SelectContent></Select></div></div>
                        <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Mekan</TableHead><TableHead>Tarih</TableHead><TableHead>Puan</TableHead></TableRow></TableHeader><TableBody>{feedbacks?.filter(f => feedbackPlaceFilter === 'all' || f.placeId === feedbackPlaceFilter).map((f) => (<TableRow key={f.id}><TableCell className="font-medium">{f.placeName}</TableCell><TableCell className="text-xs">{f.createdAt?.toDate ? format(f.createdAt.toDate(), 'd MMM HH:mm', { locale: trLocale }) : '---'}</TableCell><TableCell><Badge>{f.satisfaction}/5</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
                    </TabsContent>

                    <TabsContent value="database" className="mt-0">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card><CardHeader><CardTitle className="text-primary flex items-center gap-2"><RefreshCw /> Güvenli Mod</CardTitle><CardDescription>Sadece veritabanında olmayan yeni yerleri ekler.</CardDescription></CardHeader><CardContent><Button onClick={() => handleSeedAction('SAFE')} disabled={isDatabaseActionLoading} className="w-full" variant="secondary">Eksikleri Tamamla</Button></CardContent></Card>
                            <Card className="border-orange-200 bg-orange-50/10"><CardHeader><CardTitle className="text-orange-600 flex items-center gap-2"><RefreshCw /> Akıllı Güncelleme</CardTitle><CardDescription>Sıralama ve yeni özellikler gibi kod güncellemelerini mevcut verilerle birleştirir.</CardDescription></CardHeader><CardContent><Button onClick={() => handleSeedAction('UPDATE')} disabled={isDatabaseActionLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">Verileri Kod ile Güncelle</Button></CardContent></Card>
                            <Card className="md:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><History /> Geri Yükle</CardTitle><CardDescription>Son işlemi geri alarak verileri önceki haline döndürün.</CardDescription></CardHeader><CardContent className="flex justify-center"><Button onClick={handleUndoAction} disabled={isDatabaseActionLoading} variant="outline" size="lg">Son İşlemi Geri Al (Undo)</Button></CardContent></Card>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            {/* --- MODALS --- */}
            
            <Dialog open={!!managingSubPointsPlace} onOpenChange={(o) => { if(!o) { setManagingSubPointsPlace(null); setEditingSubPoint(null); } }}>
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b shrink-0">
                        <DialogTitle>{managingSubPointsPlace?.name.tr} - Alt Başlık Yönetimi</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-8">
                            <div className="border p-4 rounded-lg bg-muted/20">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        {editingSubPoint ? <FilePenLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />} 
                                        {editingSubPoint ? 'Alt Başlığı Düzenle' : 'Yeni Alt Başlık'}
                                    </h3>
                                    {editingSubPoint && <Button variant="ghost" size="sm" onClick={() => setEditingSubPoint(null)}><X className="h-4 w-4 mr-1" /> İptal</Button>}
                                </div>
                                <Form {...subPointForm}>
                                    <form onSubmit={subPointForm.handleSubmit(handleSubPointSubmit)} className="space-y-4">
                                        {renderLocalizedFields(subPointForm, ['name', 'description'])}
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={subPointForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/>
                                            <FormField control={subPointForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/>
                                        </div>
                                        <Button type="submit" disabled={isSubmitting} className="w-full">
                                            {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                            {editingSubPoint ? 'Güncelle' : 'Kaydet'}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                            <div>
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Layers className="h-4 w-4" /> Mevcut Alt Başlıklar</h3>
                                <div className="space-y-2 pb-10">
                                    {managingSubPointsPlace?.subPoints?.map((s) => (
                                        <div key={s.id} className="flex justify-between items-center p-3 border rounded-lg bg-background">
                                            <div>
                                                <p className="font-bold">{s.name.tr}</p>
                                                <p className="text-xs text-muted-foreground">{s.coordinates.lat}, {s.coordinates.lng}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="text-primary" onClick={() => setEditingSubPoint(s)}>
                                                    <FilePenLine />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { 
                                                    if(confirm('Silmek istediğinize emin misiniz?')) {
                                                        const updated = managingSubPointsPlace.subPoints?.filter(x => x.id !== s.id) || []; 
                                                        updateSubPoints(firestore, managingSubPointsPlace.id, updated, { onSuccess: () => setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: updated }) }); 
                                                    }
                                                }}>
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!managingSubPointsPlace?.subPoints || managingSubPointsPlace.subPoints.length === 0) && (
                                        <p className="text-center py-4 text-muted-foreground text-sm italic">Henüz alt başlık eklenmemiş.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingPlace} onOpenChange={(open) => !open && setEditingPlace(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b shrink-0"><DialogTitle>Yeri Düzenle</DialogTitle></DialogHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <Form {...editPlaceForm}>
                                <form onSubmit={editPlaceForm.handleSubmit(handleEditPlaceSubmit)} className="space-y-6">
                                    {renderLocalizedFields(editPlaceForm, ['name', 'slug', 'description'])}
                                    
                                    <div className="space-y-6 pt-6 border-t pb-10">
                                        <h4 className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Genel Bilgiler</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField control={editPlaceForm.control} name="category" render={({ field }) => (
                                                <FormItem><FormLabel>Kategori</FormLabel><select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option><option value="shopping">Alışveriş</option><option value="poi">Önemli Nokta</option></select></FormItem>
                                            )}/>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={editPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat (Enlem)</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                                <FormField control={editPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng (Boylam)</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl></FormItem>)}/>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormField control={editPlaceForm.control} name="imageUrl" render={({ field }) => (<FormItem className="md:col-span-1"><FormLabel>Görsel URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl></FormItem>)}/>
                                            <FormField control={editPlaceForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Görsel İpucu</FormLabel><FormControl><Input placeholder="landmark" {...field} /></FormControl></FormItem>)}/>
                                            <FormField control={editPlaceForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıralama</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)}/>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-6 border-t bg-muted/20 shrink-0">
                        <Button type="button" variant="outline" onClick={() => setEditingPlace(null)}>İptal</Button>
                        <Button type="button" onClick={editPlaceForm.handleSubmit(handleEditPlaceSubmit)} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="animate-spin mr-2" />} Güncelle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingExperience} onOpenChange={(open) => !open && setEditingExperience(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b shrink-0"><DialogTitle>Menü Öğesini Düzenle</DialogTitle></DialogHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            <Form {...editExperienceForm}>
                                <form onSubmit={editExperienceForm.handleSubmit(handleEditExperienceSubmit)} className="space-y-6 pb-10">
                                    {renderLocalizedFields(editExperienceForm, ['name'])}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField control={editExperienceForm.control} name="icon" render={({ field }) => (
                                            <FormItem><FormLabel>İkon</FormLabel><Input {...field} /></FormItem>
                                        )} />
                                        <FormField control={editExperienceForm.control} name="link" render={({ field }) => (
                                            <FormItem><FormLabel>Link</FormLabel><Input {...field} /></FormItem>
                                        )} />
                                        <FormField control={editExperienceForm.control} name="order" render={({ field }) => (
                                            <FormItem><FormLabel>Sıralama</FormLabel><Input type="number" {...field} /></FormItem>
                                        )} />
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-6 border-t bg-muted/20 shrink-0">
                        <Button type="button" variant="outline" onClick={() => setEditingExperience(null)}>İptal</Button>
                        <Button type="button" onClick={editExperienceForm.handleSubmit(handleEditExperienceSubmit)} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="animate-spin mr-2" />} Güncelle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deletingPlace} onOpenChange={(o) => !o && setDeletingPlace(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{deletingPlace?.name.tr}" silinecek.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => { if (deletingPlace?.id) deletePlace(firestore, deletingPlace.id, { onSuccess: () => setDeletingPlace(null) }); }}>Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deletingExperience} onOpenChange={(o) => !o && setDeletingExperience(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Emin misiniz?</AlertDialogTitle><AlertDialogDescription>"{deletingExperience?.name.tr}" menü öğesi silinecek.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => { if (deletingExperience?.id) deleteExperienceItem(firestore, deletingExperience.id, { onSuccess: () => setDeletingExperience(null) }); }}>Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
