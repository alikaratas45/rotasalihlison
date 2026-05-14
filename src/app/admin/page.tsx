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
import { seedDatabase, undoLastOperation } from '@/firebase/firestore/seed-service';
import { addExperienceItem, updateExperienceItem, deleteExperienceItem } from '@/firebase/firestore/experience-menu-service';
import { deleteFeedbackComment } from '@/firebase/firestore/feedback-service';

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
import { Loader2, MoreHorizontal, FilePenLine, Trash2, Layers, Plus, Upload, Headphones, PieChart, Download, Settings, LayoutGrid, MessageSquare, ImageIcon, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

// Definitions
import type { Place, Feedback, SubPoint, ExperienceItem, CommentFeedback } from '@/lib/definitions';

// Constants
const languageNames: Record<string, string> = { tr: 'Türkçe', en: 'English', fr: 'Français', de: 'Deutsch', ja: '日本語' };
const languages = ['tr', 'en', 'fr', 'de', 'ja'] as const;

// Helper to fix common URL mistakes
const sanitizeImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.includes('imgur.com/') && !url.includes('i.imgur.com')) {
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    return `https://i.imgur.com/${id}.png`;
  }
  return url;
};

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
  audioUrlTr: z.string().optional().or(z.literal('')),
});

const subPointFormSchema = z.object({
    name: localizedStringSchema,
    description: localizedStringSchema,
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    audioUrlTr: z.string().optional().or(z.literal('')),
    imageUrl: z.string().url({ message: 'Lütfen geçerli bir URL girin.' }).optional().or(z.literal('')),
});

const experienceItemSchema = z.object({
    name: localizedStringSchema,
    icon: z.string().min(1, 'İkon adı gereklidir.'),
    link: z.string().min(1, 'Link gereklidir.'),
    order: z.coerce.number().min(0),
});

const settingsFormSchema = z.object({
    aboutTitle: localizedStringSchema,
    aboutContent: localizedStringSchema,
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
                            <FormField control={form.control} name={`${prefix}aboutTitle.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>Başlık</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                        {fieldNames.includes('description') && (
                            <FormField control={form.control} name={`${prefix}description.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>Açıklama</FormLabel><FormControl><Textarea rows={4} {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        )}
                        {fieldNames.includes('content') && (
                            <FormField control={form.control} name={`${prefix}aboutContent.${lang}`} render={({ field }) => (
                                <FormItem><FormLabel>İçerik</FormLabel><FormControl><Textarea rows={10} {...field} value={field.value || ''} /></FormControl></FormItem>
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
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);
    const [feedbackPlaceFilter, setFeedbackPlaceFilter] = useState('all');

    // ID tracking states
    const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
    const [deletingPlaceId, setDeletingPlaceId] = useState<string | null>(null);
    const [managingSubPointsPlaceId, setManagingSubPointsPlaceId] = useState<string | null>(null);
    
    const [deletingFeedback, setDeletingFeedback] = useState<Feedback | null>(null);
    const [deletingGuestbookComment, setDeletingGuestbookComment] = useState<CommentFeedback | null>(null);
    const [editingSubPoint, setEditingSubPoint] = useState<SubPoint | null>(null);
    const [subPointIndexToDelete, setSubPointIndexToDelete] = useState<number | null>(null);

    const [editingExpItemId, setEditingExpItemId] = useState<string | null>(null);
    const [deletingExpItemId, setDeletingExpItemId] = useState<string | null>(null);

    // Data queries
    const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
    const feedbacksQuery = useMemo(() => query(collection(firestore, 'feedbacks'), orderBy('createdAt', 'desc')), [firestore]);
    const guestbookQuery = useMemo(() => query(collection(firestore, 'feedback'), orderBy('createdAt', 'desc')), [firestore]);
    const experienceQuery = useMemo(() => query(collection(firestore, 'experience-items'), orderBy('order')), [firestore]);
    const aboutDocRef = useMemo(() => doc(firestore, 'settings', 'about'), [firestore]);

    const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);
    const { data: feedbacks } = useCollection<Feedback>(feedbacksQuery);
    const { data: guestbookComments, loading: guestbookLoading } = useCollection<CommentFeedback>(guestbookQuery);
    const { data: expItems, loading: expLoading } = useCollection<ExperienceItem>(experienceQuery);
    const { data: aboutSettings } = useDoc<any>(aboutDocRef);

    // Derived active objects
    const editingPlace = useMemo(() => places?.find(p => p.id === editingPlaceId) || null, [places, editingPlaceId]);
    const deletingPlace = useMemo(() => places?.find(p => p.id === deletingPlaceId) || null, [places, deletingPlaceId]);
    const managingSubPointsPlace = useMemo(() => places?.find(p => p.id === managingSubPointsPlaceId) || null, [places, managingSubPointsPlaceId]);
    const editingExpItem = useMemo(() => expItems?.find(i => i.id === editingExpItemId) || null, [expItems, editingExpItemId]);
    const deletingExpItem = useMemo(() => expItems?.find(i => i.id === deletingExpItemId) || null, [expItems, deletingExpItemId]);

    const sortedPlaces = useMemo(() => {
        if (!places) return [];
        return [...places].sort((a, b) => {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.tr.localeCompare(b.name.tr, 'tr');
        });
    }, [places]);

    const filteredFeedbacks = useMemo(() => {
        if (!feedbacks) return [];
        return feedbacks.filter(f => feedbackPlaceFilter === 'all' || f.placeId === feedbackPlaceFilter);
    }, [feedbacks, feedbackPlaceFilter]);

    // Forms
    const addPlaceForm = useForm({ 
        resolver: zodResolver(placeFormSchema), 
        defaultValues: { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14, order: 99, audioUrlTr: '', imageUrl: '' } as any 
    });
    const editPlaceForm = useForm({ resolver: zodResolver(placeFormSchema) });
    const subPointForm = useForm({ 
        resolver: zodResolver(subPointFormSchema), 
        defaultValues: { name: { tr: '', en: '' }, description: { tr: '', en: '' }, lat: 38.48, lng: 28.14, audioUrlTr: '', imageUrl: '' } as any 
    });
    const expItemForm = useForm({ 
        resolver: zodResolver(experienceItemSchema), 
        defaultValues: { name: { tr: '', en: '' }, icon: 'HelpCircle', link: '/', order: 0 } as any 
    });
    const siteSettingsForm = useForm({ resolver: zodResolver(settingsFormSchema) });

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
                order: editingPlace.order ?? 99,
                audioUrlTr: editingPlace.audioUrlTr || ''
            }); 
        }
    }, [editingPlace, editPlaceForm]);

    useEffect(() => {
        if (editingExpItem) {
            expItemForm.reset({
                name: editingExpItem.name,
                icon: editingExpItem.icon,
                link: editingExpItem.link,
                order: editingExpItem.order
            });
        } else {
            expItemForm.reset({ name: { tr: '', en: '' }, icon: 'HelpCircle', link: '/', order: (expItems?.length || 0) + 1 });
        }
    }, [editingExpItem, expItemForm, expItems]);

    useEffect(() => {
        if (aboutSettings) {
            siteSettingsForm.reset({
                aboutTitle: aboutSettings.aboutTitle || { tr: '', en: '' },
                aboutContent: aboutSettings.aboutContent || { tr: '', en: '' }
            });
        }
    }, [aboutSettings, siteSettingsForm]);

    // Action Handlers
    const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'place' | 'subpoint') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingAudio(true);
        try {
            const storage = getStorage(firebaseApp, "studio-4936508951-29568.firebasestorage.app");
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
            const path = type === 'place' ? `audio/places/${fileName}` : `audio/subpoints/${fileName}`;
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            if (type === 'place') editPlaceForm.setValue('audioUrlTr', url);
            else subPointForm.setValue('audioUrlTr', url);
            toast({ title: 'Ses Yüklendi', description: 'Değişiklikleri kaydetmeyi unutmayın.' });
        } catch (error: any) {
            console.error("Audio upload error:", error);
            toast({ variant: 'destructive', title: 'Yükleme Hatası', description: 'Depolama ayarlarınızı kontrol edin.' });
        } finally { setIsUploadingAudio(false); }
    };

    const handleAddPlaceSubmit = (values: any) => {
        setIsSubmitting(true);
        const newPlace = { ...values, coordinates: { lat: values.lat, lng: values.lng }, subPoints: [] };
        addPlace(firestore, newPlace, { 
            onSuccess: () => { 
                toast({ title: 'Eklendi' }); 
                addPlaceForm.reset(); 
                setIsSubmitting(false); 
            }, 
            onError: () => setIsSubmitting(false) 
        });
    };

    const handleEditPlaceSubmit = (values: any) => {
        if (!editingPlace?.id) return;
        setIsSubmitting(true);
        updatePlace(firestore, editingPlace.id, values, { 
            onSuccess: () => { 
                toast({ title: 'Güncellendi' }); 
                setEditingPlaceId(null); 
                setIsSubmitting(false); 
            }, 
            onError: () => setIsSubmitting(false) 
        });
    };

    const handleSubPointSubmit = (values: any) => {
        if (!managingSubPointsPlace) return;
        setIsSubmitting(true);
        let updatedSubPoints = [...(managingSubPointsPlace.subPoints || [])];
        if (editingSubPoint) {
            updatedSubPoints = updatedSubPoints.map(s => s.id === editingSubPoint.id ? { ...s, ...values, coordinates: { lat: values.lat, lng: values.lng } } : s);
        } else {
            const newId = `sp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            updatedSubPoints.push({ id: newId, ...values, coordinates: { lat: values.lat, lng: values.lng } });
        }
        updateSubPoints(firestore, managingSubPointsPlace.id, updatedSubPoints, { 
            onSuccess: () => { 
                toast({ title: 'Kaydedildi' }); 
                setEditingSubPoint(null); 
                subPointForm.reset(); 
                setIsSubmitting(false); 
            }, 
            onError: () => setIsSubmitting(false) 
        });
    };

    const handleConfirmDeleteSubPoint = () => {
        if (subPointIndexToDelete === null || !managingSubPointsPlaceId || !places) return;
        
        const place = places.find(p => p.id === managingSubPointsPlaceId);
        if (!place || !place.subPoints) return;
        
        setIsSubmitting(true);
        const updatedSubPoints = [...place.subPoints];
        updatedSubPoints.splice(subPointIndexToDelete, 1);
        
        updateSubPoints(firestore, place.id, updatedSubPoints, {
            onSuccess: () => {
                toast({ title: 'Alt başlık silindi' });
                setSubPointIndexToDelete(null);
                setIsSubmitting(false);
            },
            onError: (err) => {
                console.error("Silme hatası:", err);
                toast({ variant: 'destructive', title: 'Hata', description: 'Silme işlemi başarısız oldu.' });
                setSubPointIndexToDelete(null);
                setIsSubmitting(false);
            }
        });
    };

    const handleExpItemSubmit = (values: any) => {
        setIsSubmitting(true);
        if (editingExpItem) {
            updateExperienceItem(firestore, editingExpItem.id, values, {
                onSuccess: () => { 
                    toast({ title: 'Güncellendi' }); 
                    setEditingExpItemId(null); 
                    setIsSubmitting(false); 
                },
                onError: () => setIsSubmitting(false)
            });
        } else {
            addExperienceItem(firestore, values, {
                onSuccess: () => { 
                    toast({ title: 'Eklendi' }); 
                    expItemForm.reset(); 
                    setIsSubmitting(false); 
                },
                onError: () => setIsSubmitting(false)
            });
        }
    };

    const handleSettingsSubmit = (values: any) => {
        setIsSubmitting(true);
        setDoc(doc(firestore, 'settings', 'about'), values, { merge: true })
            .then(() => { 
                toast({ title: 'Ayarlar Kaydedildi' }); 
                setIsSubmitting(false); 
            })
            .catch(() => setIsSubmitting(false));
    };

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedDatabase(firestore, 'UPDATE');
            toast({ title: 'Başarılı', description: 'Veriler koddan başarıyla güncellendi.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Güncelleme sırasında bir sorun oluştu.' });
        } finally {
            setIsSeeding(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!filteredFeedbacks.length) return;
        const total = filteredFeedbacks.length;
        const avg = (key: string) => (filteredFeedbacks.reduce((acc, f: any) => acc + (f[key] || 0), 0) / total).toFixed(2);
        const ratio = (key: string) => `%${((filteredFeedbacks.filter((f: any) => f[key] === 'yes').length / total) * 100).toFixed(1)}`;
        const d = ';';
        const rows = [
            [`sep=${d}`],
            ['SALIHLI ROTA ANALIZ RAPORU'],
            ['Tarih', format(new Date(), 'dd.MM.yyyy HH:mm')],
            ['Toplam Katilimci', total],
            [''],
            ['ISTATISTIKSEL OZET'],
            ['Temizlik Ortalaması', avg('cleanliness')],
            ['Erişilebilirlik Ortalaması', avg('accessibility')],
            ['Memnuniyet Ortalaması', avg('satisfaction')],
            ['Turla Gelen Oranı', ratio('withTour')],
            ['Rehber Alan Oranı', ratio('guided')],
            ['Bilgi Panosu Yeterliliği', ratio('infoBoards')],
            [''],
            ['DETAYLI ANKET LISTESI'],
            ['Mekan;Tarih;Temizlik;Erisim;Memnuniyet;Tur;Rehber;Pano']
        ];
        filteredFeedbacks.forEach(f => {
            const dateStr = f.createdAt?.toDate ? format(f.createdAt.toDate(), 'dd.MM.yyyy') : '';
            rows.push([`${f.placeName}${d}${dateStr}${d}${f.cleanliness}${d}${f.accessibility}${d}${f.satisfaction}${d}${f.withTour}${d}${f.guided}${d}${f.infoBoards}`]);
        });
        const blob = new Blob(['\ufeff' + rows.map(r => r.join('')).join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Salihli_Rapor_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <Tabs defaultValue="places" className="w-full">
                <TabsList className="flex justify-center sticky top-0 z-40 glass py-4 border-b overflow-x-auto">
                    <TabsTrigger value="places">Yerler</TabsTrigger>
                    <TabsTrigger value="experience">Salihli'de Bir Gün</TabsTrigger>
                    <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
                    <TabsTrigger value="feedbacks">Anketler</TabsTrigger>
                    <TabsTrigger value="guestbook">Ziyaretçi Defteri</TabsTrigger>
                    <TabsTrigger value="database">Veritabanı</TabsTrigger>
                </TabsList>
                
                <TabsContent value="places" className="p-4 space-y-8">
                    <Card className="rounded-[2rem] shadow-xl border-none">
                        <CardHeader><CardTitle>Yeni Yer Ekle</CardTitle></CardHeader>
                        <CardContent>
                            <Form {...addPlaceForm}>
                                <form onSubmit={addPlaceForm.handleSubmit(handleAddPlaceSubmit)} className="space-y-6">
                                    <LocalizedFields form={addPlaceForm} fieldNames={['name', 'slug', 'description']} />
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField control={addPlaceForm.control} name="category" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kategori</FormLabel>
                                                <select {...field} className="w-full h-10 rounded-xl border border-input px-3 text-sm focus:ring-2 focus:ring-primary">
                                                    <option value="poi">Önemli Nokta</option>
                                                    <option value="history">Tarih</option>
                                                    <option value="nature">Doğa</option>
                                                    <option value="food">Lezzet</option>
                                                </select>
                                            </FormItem>
                                        )}/>
                                        <FormField control={addPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} className="rounded-xl" /></FormItem>)}/>
                                        <FormField control={addPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} className="rounded-xl" /></FormItem>)}/>
                                        <FormField control={addPlaceForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıralama</FormLabel><Input type="number" {...field} className="rounded-xl" /></FormItem>)}/>
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="rounded-xl px-12 h-12 font-bold shadow-lg">
                                        {isSubmitting && <Loader2 className="animate-spin mr-2" />} Ekle
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                        <CardHeader><CardTitle>Mevcut Yerler</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-20 pl-6">Sıra</TableHead>
                                        <TableHead>İsim</TableHead>
                                        <TableHead className="text-right pr-6">Eylemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {placesLoading ? (
                                        <TableRow><TableCell colSpan={3} className="p-6"><Skeleton className="h-20 w-full rounded-2xl" /></TableCell></TableRow>
                                    ) : sortedPlaces.map(p => (
                                        <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="pl-6"><Badge variant="secondary" className="rounded-lg">{p.order || '-'}</Badge></TableCell>
                                            <TableCell className="font-bold text-slate-700">{p.name.tr}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                                                        <DropdownMenuItem onClick={() => setEditingPlaceId(p.id)} className="rounded-xl p-3"><FilePenLine className="mr-2 h-4 w-4" /> Düzenle</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setManagingSubPointsPlaceId(p.id)} className="rounded-xl p-3"><Layers className="mr-2 h-4 w-4" /> Alt Başlıklar</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDeletingPlaceId(p.id)} className="text-destructive rounded-xl p-3"><Trash2 className="mr-2 h-4 w-4" /> Sil</DropdownMenuItem>
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

                <TabsContent value="experience" className="p-4 space-y-8">
                    <Card className="rounded-[2rem] shadow-xl border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LayoutGrid className="h-5 w-5 text-primary" />
                                {editingExpItem ? 'Menü Öğesini Düzenle' : 'Yeni Menü Öğesi Ekle'}
                            </CardTitle>
                            <CardDescription>Ana sayfadaki "Salihli'de Bir Gün" bölümünü yönetin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...expItemForm}>
                                <form onSubmit={expItemForm.handleSubmit(handleExpItemSubmit)} className="space-y-6">
                                    <LocalizedFields form={expItemForm} fieldNames={['name']} />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField control={expItemForm.control} name="icon" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>İkon (Lucide Adı)</FormLabel>
                                                <FormControl><Input placeholder="Mountain, Utensils..." {...field} className="rounded-xl" /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={expItemForm.control} name="link" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Link (Sayfa Yolu)</FormLabel>
                                                <FormControl><Input placeholder="/yerler, /lezzetler..." {...field} className="rounded-xl" /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={expItemForm.control} name="order" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sıralama</FormLabel>
                                                <FormControl><Input type="number" {...field} className="rounded-xl" /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="flex gap-4">
                                        <Button type="submit" disabled={isSubmitting} className="rounded-xl px-12 h-12 font-bold shadow-lg">
                                            {isSubmitting && <Loader2 className="animate-spin mr-2" />} {editingExpItem ? 'Güncelle' : 'Ekle'}
                                        </Button>
                                        {editingExpItem && (
                                            <Button variant="ghost" onClick={() => setEditingExpItemId(null)} className="h-12 rounded-xl">İptal</Button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                        <CardHeader><CardTitle>Mevcut Menü Öğeleri</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-20 pl-6">Sıra</TableHead>
                                        <TableHead>İsim (TR)</TableHead>
                                        <TableHead>Link</TableHead>
                                        <TableHead className="text-right pr-6">Eylemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expLoading ? (
                                        <TableRow><TableCell colSpan={4} className="p-6"><Skeleton className="h-12 w-full rounded-xl" /></TableCell></TableRow>
                                    ) : expItems?.map(item => (
                                        <TableRow key={item.id} className="hover:bg-muted/30">
                                            <TableCell className="pl-6"><Badge variant="outline">{item.order}</Badge></TableCell>
                                            <TableCell className="font-bold">{item.name.tr}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{item.link}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingExpItemId(item.id)} className="rounded-xl"><FilePenLine className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeletingExpItemId(item.id)} className="text-destructive rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="general" className="p-4 space-y-6">
                    <Card className="rounded-[2rem] shadow-xl border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> Hakkımızda / Tanıtım Metni</CardTitle>
                            <CardDescription>Ana sayfadaki 'Salihli Hakkında' butonuna basıldığında açılan pencere içeriği.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...siteSettingsForm}>
                                <form onSubmit={siteSettingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-6">
                                    <LocalizedFields form={siteSettingsForm} fieldNames={['title', 'content']} />
                                    <Button type="submit" disabled={isSubmitting} className="rounded-xl px-12 h-12 font-bold shadow-lg">
                                        {isSubmitting && <Loader2 className="animate-spin mr-2" />} Değişiklikleri Kaydet
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="feedbacks" className="p-4 space-y-6">
                    <div className="grid md:grid-cols-4 gap-6">
                        <Card className="p-6 rounded-[2rem] bg-primary shadow-xl border-none text-white flex flex-col gap-4">
                            <h3 className="font-bold flex items-center gap-2"><PieChart className="h-5 w-5" /> Filtrele</h3>
                            <Select value={feedbackPlaceFilter} onValueChange={setFeedbackPlaceFilter}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl"><SelectValue placeholder="Tüm Yerler" /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="all">Tüm Yerler</SelectItem>
                                    {sortedPlaces.map(p => <SelectItem key={p.id} value={p.id}>{p.name.tr}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleDownloadCSV} variant="secondary" className="w-full rounded-xl h-12 font-bold"><Download className="mr-2 h-4 w-4" /> Rapor İndir</Button>
                        </Card>
                        <Card className="p-6 rounded-[2rem] shadow-xl border-none flex flex-col items-center justify-center text-center"><span className="text-xs text-muted-foreground font-black uppercase tracking-widest">Toplam Anket</span><span className="text-4xl font-black text-primary mt-2">{filteredFeedbacks.length}</span></Card>
                        <Card className="p-6 rounded-[2rem] shadow-xl border-none flex flex-col items-center justify-center text-center"><span className="text-xs text-muted-foreground font-black uppercase tracking-widest">Ort. Memnuniyet</span><span className="text-4xl font-black text-accent mt-2">{filteredFeedbacks.length ? (filteredFeedbacks.reduce((a,f) => a+f.satisfaction,0)/filteredFeedbacks.length).toFixed(1) : 0}/5</span></Card>
                        <Card className="p-6 rounded-[2rem] shadow-xl border-none flex flex-col items-center justify-center text-center"><span className="text-xs text-muted-foreground font-black uppercase tracking-widest">Turla Gelen</span><span className="text-4xl font-black text-blue-500 mt-2">%{filteredFeedbacks.length ? ((filteredFeedbacks.filter(f=>f.withTour==='yes').length/filteredFeedbacks.length)*100).toFixed(0) : 0}</span></Card>
                    </div>
                    <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="pl-6">Mekan</TableHead>
                                        <TableHead>Tarih</TableHead>
                                        <TableHead>Puan</TableHead>
                                        <TableHead className="text-right pr-6">Eylem</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredFeedbacks.map(f => (
                                        <TableRow key={f.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="pl-6 font-bold">{f.placeName}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{f.createdAt?.toDate ? format(f.createdAt.toDate(), 'dd.MM.yy HH:mm') : '-'}</TableCell>
                                            <TableCell><Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-bold px-3 py-1">{f.satisfaction}/5 Yıldız</Badge></TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" className="text-destructive rounded-xl" onClick={() => setDeletingFeedback(f)}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="guestbook" className="p-4 space-y-6">
                    <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Ziyaretçi Defteri Yorumları
                            </CardTitle>
                            <CardDescription>Ziyaretçiler tarafından paylaşılan tüm mesajları yönetin.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="pl-6">İsim</TableHead>
                                        <TableHead>Mesaj</TableHead>
                                        <TableHead>Tarih</TableHead>
                                        <TableHead className="text-right pr-6">Eylemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guestbookLoading ? (
                                        <TableRow><TableCell colSpan={4} className="p-6"><Skeleton className="h-12 w-full rounded-xl" /></TableCell></TableRow>
                                    ) : guestbookComments?.map(comment => (
                                        <TableRow key={comment.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="pl-6 font-bold">{comment.name || 'Ziyaretçi'}</TableCell>
                                            <TableCell className="max-w-md truncate">{comment.message}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {comment.createdAt?.toDate ? format(comment.createdAt.toDate(), 'dd.MM.yy HH:mm') : '-'}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" className="text-destructive rounded-xl" onClick={() => setDeletingGuestbookComment(comment)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="database" className="p-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                            <CardHeader><CardTitle>Kod Güncelleme</CardTitle><CardDescription>Statik verilerdeki (kod içindeki) güncellemeleri veritabanına yansıtır.</CardDescription></CardHeader>
                            <CardContent>
                                <Button onClick={handleSeedDatabase} disabled={isSeeding} className="w-full h-14 rounded-2xl font-bold" variant="secondary">
                                    {isSeeding ? <Loader2 className="animate-spin mr-2" /> : null} Verileri Koddan Güncelle
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden">
                            <CardHeader><CardTitle>Geri Yükle</CardTitle><CardDescription>Hatalı bir işlem sonrası veritabanını son yedek haline döndürür.</CardDescription></CardHeader>
                            <CardContent>
                                <Button onClick={() => undoLastOperation(firestore)} className="w-full h-14 rounded-2xl font-bold" variant="outline">Son İşlemi Geri Al</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* MODALS */}
            <Dialog open={!!editingPlace} onOpenChange={o => !o && setEditingPlaceId(null)}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
                    <DialogHeader className="p-8 border-b shrink-0 bg-primary/5"><DialogTitle className="text-2xl font-black font-headline text-primary">Yeri Düzenle: {editingPlace?.name.tr}</DialogTitle></DialogHeader>
                    <div className="flex-1 min-h-0">
                        <ScrollArea className="h-full">
                            <div className="p-8 space-y-8 pb-20">
                                <Form {...editPlaceForm}>
                                    <form onSubmit={editPlaceForm.handleSubmit(handleEditPlaceSubmit)} className="space-y-8">
                                        <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/10 space-y-4">
                                            <h4 className="font-bold flex items-center gap-2 text-primary"><Headphones className="h-5 w-5" /> Türkçe Seslendirme (MP3)</h4>
                                            <p className="text-sm text-muted-foreground font-medium">Kendi seslendirmenizi yükleyerek yapay zeka sesini devre dışı bırakabilirsiniz.</p>
                                            <div className="flex items-center gap-4">
                                                <input type="file" accept="audio/mpeg" onChange={e => handleAudioUpload(e, 'place')} className="hidden" id="audio-place" />
                                                <Button type="button" variant="outline" className="rounded-xl px-6 font-bold" onClick={() => document.getElementById('audio-place')?.click()} disabled={isUploadingAudio}>
                                                    {isUploadingAudio ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />} {editPlaceForm.getValues('audioUrlTr') ? 'Dosyayı Değiştir' : 'Özel MP3 Yükle'}
                                                </Button>
                                                {editPlaceForm.getValues('audioUrlTr') && <Badge className="bg-green-600 text-white border-none rounded-lg font-bold px-4 py-1.5">MP3 Yüklü</Badge>}
                                            </div>
                                        </div>
                                        <LocalizedFields form={editPlaceForm} fieldNames={['name', 'slug', 'description']} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField control={editPlaceForm.control} name="imageUrl" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Görsel URL</FormLabel>
                                                    <FormControl><Input placeholder="https://..." {...field} className="rounded-xl" /></FormControl>
                                                </FormItem>
                                            )} />
                                            <FormField control={editPlaceForm.control} name="imageHint" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Görsel İpucu (Hint)</FormLabel>
                                                    <FormControl><Input placeholder="antik kent, manzara..." {...field} className="rounded-xl" /></FormControl>
                                                </FormItem>
                                            )} />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <FormField control={editPlaceForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Kategori</FormLabel><select {...field} className="w-full h-11 border rounded-xl px-4 focus:ring-2 focus:ring-primary"><option value="poi">Önemli Nokta</option><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option></select></FormItem>)}/>
                                            <FormField control={editPlaceForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıra</FormLabel><Input type="number" {...field} className="rounded-xl h-11" /></FormItem>)}/>
                                            <FormField control={editPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} className="rounded-xl h-11" /></FormItem>)}/>
                                            <FormField control={editPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} className="rounded-xl h-11" /></FormItem>)}/>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </ScrollArea>
                    </div>
                    <DialogFooter className="p-8 border-t bg-muted/20 shrink-0">
                        <Button variant="ghost" onClick={() => setEditingPlaceId(null)} className="rounded-xl px-8 h-12">İptal</Button>
                        <Button onClick={editPlaceForm.handleSubmit(handleEditPlaceSubmit)} disabled={isSubmitting} className="rounded-xl px-12 h-12 font-black shadow-lg">{isSubmitting && <Loader2 className="animate-spin mr-2" />} Güncelle</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!managingSubPointsPlaceId} onOpenChange={o => !o && setManagingSubPointsPlaceId(null)}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
                    <DialogHeader className="p-8 border-b shrink-0 bg-primary/5"><DialogTitle className="text-2xl font-black font-headline text-primary">Alt Başlık Yönetimi: {managingSubPointsPlace?.name.tr}</DialogTitle></DialogHeader>
                    <div className="flex-1 min-h-0">
                        <ScrollArea className="h-full">
                            <div className="p-8 space-y-12 pb-20">
                                <Form {...subPointForm}>
                                    <form onSubmit={subPointForm.handleSubmit(handleSubPointSubmit)} className="space-y-6 border-2 border-primary/10 p-8 rounded-[2rem] bg-muted/5 shadow-sm">
                                        <h4 className="font-black text-lg flex items-center gap-2 text-primary uppercase tracking-tight">{editingSubPoint ? <FilePenLine className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {editingSubPoint ? 'Alt Başlığı Düzenle' : 'Yeni Alt Başlık Ekle'}</h4>
                                        <div className="bg-primary/5 p-5 rounded-2xl border-2 border-primary/10 mb-4 flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <input type="file" accept="audio/mpeg" onChange={e => handleAudioUpload(e, 'subpoint')} className="hidden" id="audio-sub" />
                                                <Button type="button" size="sm" variant="outline" className="rounded-xl px-4 font-bold" onClick={() => document.getElementById('audio-sub')?.click()} disabled={isUploadingAudio}>
                                                    {isUploadingAudio ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />} MP3 Yükle
                                                </Button>
                                                {subPointForm.getValues('audioUrlTr') && <Badge className="bg-green-600 text-white px-3 py-1 rounded-lg">MP3 Yüklü</Badge>}
                                            </div>
                                            
                                            <div className="flex-1 min-w-[200px]">
                                                <FormField control={subPointForm.control} name="imageUrl" render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <div className="relative">
                                                                <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input placeholder="Görsel Linki (https://...)" {...field} className="rounded-xl pl-9 h-9 text-xs" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px]" />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        </div>
                                        <LocalizedFields form={subPointForm} fieldNames={['name', 'description']} />
                                        <div className="grid grid-cols-2 gap-6"><FormField control={subPointForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} className="rounded-xl h-11" /></FormItem>)}/><FormField control={subPointForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} className="rounded-xl h-11" /></FormItem>)}/></div>
                                        <div className="flex gap-4 pt-4">
                                            <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-xl font-bold shadow-md">
                                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {editingSubPoint ? 'Güncelle' : 'Ekle'}
                                            </Button>
                                            {editingSubPoint && <Button type="button" variant="ghost" onClick={() => { setEditingSubPoint(null); subPointForm.reset(); }} className="h-12 rounded-xl">Vazgeç</Button>}
                                        </div>
                                    </form>
                                </Form>
                                <div className="space-y-4">
                                    <h4 className="font-black text-sm text-muted-foreground uppercase tracking-widest border-b-2 border-primary/10 pb-4">Ekli Alt Başlıklar</h4>
                                    {managingSubPointsPlace?.subPoints?.map((s, index) => (
                                        <div key={`${s.id}-${index}`} className="flex justify-between items-center p-6 border-none rounded-[1.5rem] bg-white shadow-md hover:shadow-xl transition-all group">
                                            <div className="flex items-center gap-4">
                                                {s.imageUrl && (
                                                    <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-muted">
                                                        <Image src={sanitizeImageUrl(s.imageUrl)} alt={s.name.tr} fill className="object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg text-slate-800">{s.name.tr}</span>
                                                    <span className="text-xs text-muted-foreground font-mono mt-1 opacity-70 group-hover:opacity-100">{s.coordinates.lat.toFixed(4)}, {s.coordinates.lng.toFixed(4)}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary" onClick={() => { setEditingSubPoint(s); subPointForm.reset({ ...s, lat: s.coordinates.lat, lng: s.coordinates.lng }); }}><FilePenLine className="h-5 w-5" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive rounded-xl hover:bg-destructive/5" onClick={() => setSubPointIndexToDelete(index)} disabled={isSubmitting}>
                                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                                </Button>
                                            </div>
                                        </div>
                                    )) || <p className="text-center py-20 text-muted-foreground italic bg-muted/20 rounded-[2rem]">Henüz alt başlık eklenmemiş.</p>}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>

            {/* CONFIRM DELETE SUBPOINT ALERT DIALOG */}
            <AlertDialog open={subPointIndexToDelete !== null} onOpenChange={o => !o && setSubPointIndexToDelete(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10 max-w-md">
                    <AlertDialogHeader className="flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black font-headline">Alt Başlığı Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-lg font-medium text-slate-600 mt-2">
                            Bu alt başlık kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-10">
                        <AlertDialogCancel className="rounded-xl h-12 px-8 flex-1 border-slate-200">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDeleteSubPoint} 
                            disabled={isSubmitting}
                            className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-10 font-black flex-1 shadow-lg shadow-destructive/20"
                        >
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Evet, Kalıcı Olarak Sil'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deletingFeedback} onOpenChange={o => !o && setDeletingFeedback(null)}>
                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
                    <AlertDialogHeader><AlertDialogTitle className="text-2xl font-black">Anket Kaydını Sil</AlertDialogTitle><AlertDialogDescription className="text-lg">Bu anket kaydı kalıcı olarak silinecektir. Bu işlem geri alınamaz.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter className="pt-6"><AlertDialogCancel className="rounded-xl h-12 px-8">İptal</AlertDialogCancel><AlertDialogAction onClick={async () => { if(deletingFeedback) { await deleteDoc(doc(firestore, 'feedbacks', deletingFeedback.id)); toast({ title: 'Silindi' }); setDeletingFeedback(null); } }} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-10 font-bold">Kalıcı Olarak Sil</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deletingGuestbookComment} onOpenChange={o => !o && setDeletingGuestbookComment(null)}>
                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black">Yorumu Sil</AlertDialogTitle>
                        <AlertDialogDescription className="text-lg">Bu ziyaretçi yorumu kalıcı olarak silinecektir. Bu işlem geri alınamaz.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-6">
                        <AlertDialogCancel className="rounded-xl h-12 px-8">İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { if(deletingGuestbookComment) deleteFeedbackComment(firestore, deletingGuestbookComment.id, { onSuccess: () => { toast({ title: 'Silindi' }); setDeletingGuestbookComment(null); } }); }} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-10 font-bold">Yorumu Sil</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deletingPlaceId} onOpenChange={o => !o && setDeletingPlaceId(null)}>
                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
                    <AlertDialogHeader><AlertDialogTitle className="text-2xl font-black">Mekanı Sil</AlertDialogTitle><AlertDialogDescription className="text-lg">'{deletingPlace?.name.tr}' mekanı ve tüm alt başlıkları kalıcı olarak silinecektir.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter className="pt-6"><AlertDialogCancel className="rounded-xl h-12 px-8">İptal</AlertDialogCancel><AlertDialogAction onClick={() => { if(deletingPlace) deletePlace(firestore, deletingPlace.id, { onSuccess: () => { toast({ title: 'Silindi' }); setDeletingPlaceId(null); } }); }} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-10 font-bold">Sil</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deletingExpItemId} onOpenChange={o => !o && setDeletingExpItemId(null)}>
                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
                    <AlertDialogHeader><AlertDialogTitle className="text-2xl font-black">Menü Öğesini Sil</AlertDialogTitle><AlertDialogDescription className="text-lg">'{deletingExpItem?.name.tr}' menü öğesi kalıcı olarak silinecektir.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter className="pt-6"><AlertDialogCancel className="rounded-xl h-12 px-8">İptal</AlertDialogCancel><AlertDialogAction onClick={() => { if(deletingExpItem) deleteExperienceItem(firestore, deletingExpItem.id, { onSuccess: () => { toast({ title: 'Silindi' }); setDeletingExpItemId(null); } }); }} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-10 font-bold">Sil</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}