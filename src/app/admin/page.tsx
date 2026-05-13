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
import { Loader2, MoreHorizontal, FilePenLine, Trash2, Layers, Plus, Upload, Headphones, PieChart, Download, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

// Definitions
import type { Place, Feedback, SubPoint } from '@/lib/definitions';

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
});

const settingsFormSchema = z.object({
    aboutTitle: localizedStringSchema,
    aboutContent: localizedStringSchema,
});

const languageNames: Record<string, string> = { tr: 'Türkçe', en: 'English', fr: 'Français', de: 'Deutsch', ja: '日本語' };
const languages = ['tr', 'en', 'fr', 'de', 'ja'] as const;

export default function AdminPage() {
    const firestore = useFirestore();
    const firebaseApp = useFirebaseApp();
    const { toast } = useToast();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);
    const [feedbackPlaceFilter, setFeedbackPlaceFilter] = useState('all');

    const [editingPlace, setEditingPlace] = useState<Place | null>(null);
    const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
    const [deletingFeedback, setDeletingFeedback] = useState<Feedback | null>(null);
    const [managingSubPointsPlace, setManagingSubPointsPlace] = useState<Place | null>(null);
    const [editingSubPoint, setEditingSubPoint] = useState<SubPoint | null>(null);
    
    const { data: places, loading: placesLoading } = useCollection<Place>(useMemo(() => query(collection(firestore, 'places')), [firestore]));
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

    const filteredFeedbacks = useMemo(() => {
        if (!feedbacks) return [];
        return feedbacks.filter(f => feedbackPlaceFilter === 'all' || f.placeId === feedbackPlaceFilter);
    }, [feedbacks, feedbackPlaceFilter]);

    const addPlaceForm = useForm({ resolver: zodResolver(placeFormSchema), defaultValues: { name: { tr: '', en: '' }, slug: { tr: '', en: '' }, description: { tr: '', en: '' }, category: 'poi', lat: 38.48, lng: 28.14, order: 99, audioUrlTr: '' } as any });
    const editPlaceForm = useForm({ resolver: zodResolver(placeFormSchema) });
    const subPointForm = useForm({ resolver: zodResolver(subPointFormSchema), defaultValues: { name: { tr: '', en: '' }, description: { tr: '', en: '' }, lat: 38.48, lng: 28.14, audioUrlTr: '' } as any });
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
        if (aboutSettings) {
            siteSettingsForm.reset({
                aboutTitle: aboutSettings.aboutTitle || { tr: '', en: '' },
                aboutContent: aboutSettings.aboutContent || { tr: '', en: '' }
            });
        }
    }, [aboutSettings, siteSettingsForm]);

    const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'place' | 'subpoint') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingAudio(true);
        try {
            const storage = getStorage(firebaseApp);
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
            toast({ variant: 'destructive', title: 'Yükleme Hatası', description: 'Storage bağlantı hatası veya yetki eksikliği.' });
        } finally { setIsUploadingAudio(false); }
    };

    const handleAddPlaceSubmit = (values: any) => {
        setIsSubmitting(true);
        const newPlace = { ...values, coordinates: { lat: values.lat, lng: values.lng }, subPoints: [] };
        addPlace(firestore, newPlace, { onSuccess: () => { toast({ title: 'Eklendi' }); addPlaceForm.reset(); setIsSubmitting(false); }, onError: () => setIsSubmitting(false) });
    };

    const handleEditPlaceSubmit = (values: any) => {
        if (!editingPlace?.id) return;
        setIsSubmitting(true);
        updatePlace(firestore, editingPlace.id, values, { onSuccess: () => { toast({ title: 'Güncellendi' }); setEditingPlace(null); setIsSubmitting(false); }, onError: () => setIsSubmitting(false) });
    };

    const handleSubPointSubmit = (values: any) => {
        if (!managingSubPointsPlace) return;
        setIsSubmitting(true);
        let updatedSubPoints = [...(managingSubPointsPlace.subPoints || [])];
        if (editingSubPoint) {
            updatedSubPoints = updatedSubPoints.map(s => s.id === editingSubPoint.id ? { ...s, ...values, coordinates: { lat: values.lat, lng: values.lng } } : s);
        } else {
            updatedSubPoints.push({ id: Math.random().toString(36).substring(7), ...values, coordinates: { lat: values.lat, lng: values.lng } });
        }
        updateSubPoints(firestore, managingSubPointsPlace.id, updatedSubPoints, { onSuccess: () => { toast({ title: 'Kaydedildi' }); setEditingSubPoint(null); subPointForm.reset(); setIsSubmitting(false); setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: updatedSubPoints }); }, onError: () => setIsSubmitting(false) });
    };

    const handleSettingsSubmit = (values: any) => {
        setIsSubmitting(true);
        setDoc(doc(firestore, 'settings', 'about'), values, { merge: true })
            .then(() => { toast({ title: 'Ayarlar Kaydedildi' }); setIsSubmitting(false); })
            .catch(() => setIsSubmitting(false));
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

    const renderLocalizedFields = (form: any, fieldNames: string[], prefix = "") => (
        <Accordion type="multiple" defaultValue={['tr', 'en']} className="w-full space-y-4">
            {languages.map((lang) => (
                <AccordionItem value={lang} key={`${prefix}${lang}`}>
                    <AccordionTrigger className="py-2 hover:no-underline">
                        <Badge variant="outline" className="mr-2">{lang.toUpperCase()}</Badge> {languageNames[lang]}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4 border-t mt-2">
                        {fieldNames.includes('name') && <FormField control={form.control} name={`${prefix}name.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>İsim</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                        )} />}
                        {fieldNames.includes('title') && <FormField control={form.control} name={`${prefix}aboutTitle.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Başlık</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                        )} />}
                        {fieldNames.includes('description') && <FormField control={form.control} name={`${prefix}description.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Açıklama</FormLabel><FormControl><Textarea rows={4} {...field} value={field.value || ''} /></FormControl></FormItem>
                        )} />}
                         {fieldNames.includes('content') && <FormField control={form.control} name={`${prefix}aboutContent.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>İçerik</FormLabel><FormControl><Textarea rows={10} {...field} value={field.value || ''} /></FormControl></FormItem>
                        )} />}
                        {fieldNames.includes('slug') && <FormField control={form.control} name={`${prefix}slug.${lang}`} render={({ field }) => (
                            <FormItem><FormLabel>Link Metni (Slug)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>
                        )} />}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <Tabs defaultValue="places" className="w-full">
                <TabsList className="flex justify-center sticky top-0 z-40 bg-background/95 backdrop-blur-md py-4 border-b">
                    <TabsTrigger value="places">Yerler</TabsTrigger>
                    <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
                    <TabsTrigger value="feedbacks">Anketler</TabsTrigger>
                    <TabsTrigger value="database">Veritabanı</TabsTrigger>
                </TabsList>
                
                <TabsContent value="places" className="p-4 space-y-8">
                    <Card><CardHeader><CardTitle>Yeni Yer Ekle</CardTitle></CardHeader><CardContent>
                        <Form {...addPlaceForm}><form onSubmit={addPlaceForm.handleSubmit(handleAddPlaceSubmit)} className="space-y-6">
                            {renderLocalizedFields(addPlaceForm, ['name', 'slug', 'description'])}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FormField control={addPlaceForm.control} name="category" render={({ field }) => (
                                    <FormItem><FormLabel>Kategori</FormLabel>
                                    <select {...field} className="w-full h-10 rounded-md border border-input px-3 text-sm">
                                        <option value="poi">Önemli Nokta</option>
                                        <option value="history">Tarih</option>
                                        <option value="nature">Doğa</option>
                                        <option value="food">Lezzet</option>
                                    </select></FormItem>
                                )}/>
                                <FormField control={addPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/>
                                <FormField control={addPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/>
                                <FormField control={addPlaceForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıralama</FormLabel><Input type="number" {...field} /></FormItem>)}/>
                            </div>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="animate-spin mr-2" />} Ekle</Button>
                        </form></Form>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle>Mevcut Yerler</CardTitle></CardHeader><CardContent className="p-0">
                        <Table><TableHeader><TableRow><TableHead className="w-20">Sıra</TableHead><TableHead>İsim</TableHead><TableHead className="text-right">Eylemler</TableHead></TableRow></TableHeader>
                        <TableBody>{placesLoading ? <TableRow><TableCell colSpan={3}><Skeleton className="h-20" /></TableCell></TableRow> : sortedPlaces.map(p => (
                            <TableRow key={p.id}><TableCell><Badge variant="secondary">{p.order || '-'}</Badge></TableCell><TableCell className="font-medium">{p.name.tr}</TableCell><TableCell className="text-right">
                                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingPlace(p)}><FilePenLine className="mr-2" /> Düzenle</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setManagingSubPointsPlace(p)}><Layers className="mr-2" /> Alt Başlıklar</DropdownMenuItem>
                                    <DropdownMenuSeparator /><DropdownMenuItem onClick={() => setDeletingPlace(p)} className="text-destructive"><Trash2 className="mr-2" /> Sil</DropdownMenuItem>
                                </DropdownMenuContent></DropdownMenu>
                            </TableCell></TableRow>
                        ))}</TableBody></Table>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="general" className="p-4 space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Hakkımızda / Tanıtım Metni</CardTitle><CardDescription>Ana sayfadaki 'Salihli Hakkında' butonuna basıldığında açılan pencere içeriği.</CardDescription></CardHeader>
                    <CardContent>
                        <Form {...siteSettingsForm}><form onSubmit={siteSettingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-6">
                            {renderLocalizedFields(siteSettingsForm, ['title', 'content'])}
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="animate-spin mr-2" />} Değişiklikleri Kaydet</Button>
                        </form></Form>
                    </CardContent>
                </TabsContent>

                <TabsContent value="feedbacks" className="p-4 space-y-6">
                    <div className="grid md:grid-cols-4 gap-4">
                        <Card className="p-4 bg-primary/5 border-primary/20 flex flex-col gap-4">
                            <h3 className="font-bold flex items-center gap-2"><PieChart className="h-4 w-4" /> Filtrele</h3>
                            <Select value={feedbackPlaceFilter} onValueChange={setFeedbackPlaceFilter}>
                                <SelectTrigger><SelectValue placeholder="Tüm Yerler" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">Tüm Yerler</SelectItem>{sortedPlaces.map(p => <SelectItem key={p.id} value={p.id}>{p.name.tr}</SelectItem>)}</SelectContent>
                            </Select>
                            <Button onClick={handleDownloadCSV} className="w-full"><Download className="mr-2" /> Rapor İndir</Button>
                        </Card>
                        <Card className="p-4 flex flex-col items-center justify-center text-center"><span className="text-xs text-muted-foreground font-bold uppercase">Toplam Anket</span><span className="text-3xl font-bold text-primary">{filteredFeedbacks.length}</span></Card>
                        <Card className="p-4 flex flex-col items-center justify-center text-center"><span className="text-xs text-muted-foreground font-bold uppercase">Ort. Memnuniyet</span><span className="text-3xl font-bold text-orange-500">{filteredFeedbacks.length ? (filteredFeedbacks.reduce((a,f) => a+f.satisfaction,0)/filteredFeedbacks.length).toFixed(1) : 0}/5</span></Card>
                        <Card className="p-4 flex flex-col items-center justify-center text-center"><span className="text-xs text-muted-foreground font-bold uppercase">Turla Gelen</span><span className="text-3xl font-bold text-blue-500">%{filteredFeedbacks.length ? ((filteredFeedbacks.filter(f=>f.withTour==='yes').length/filteredFeedbacks.length)*100).toFixed(0) : 0}</span></Card>
                    </div>
                    <Card><CardContent className="p-0">
                        <Table><TableHeader><TableRow><TableHead>Mekan</TableHead><TableHead>Tarih</TableHead><TableHead>Puan</TableHead><TableHead className="text-right">Eylem</TableHead></TableRow></TableHeader>
                        <TableBody>{filteredFeedbacks.map(f => (
                            <TableRow key={f.id}><TableCell className="font-medium">{f.placeName}</TableCell><TableCell className="text-xs text-muted-foreground">{f.createdAt?.toDate ? format(f.createdAt.toDate(), 'dd.MM.yy HH:mm') : '-'}</TableCell><TableCell><Badge variant="outline" className="bg-yellow-50">{f.satisfaction}/5 Yıldız</Badge></TableCell>
                            <TableCell className="text-right"><Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeletingFeedback(f)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
                        ))}</TableBody></Table>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="database" className="p-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card><CardHeader><CardTitle>Kod Güncelleme</CardTitle><CardDescription>Statik verilerdeki (kod içindeki) güncellemeleri veritabanına yansıtır.</CardDescription></CardHeader><CardContent><Button onClick={() => seedDatabase(firestore, 'UPDATE')} className="w-full" variant="secondary">Verileri Koddan Güncelle</Button></CardContent></Card>
                        <Card><CardHeader><CardTitle>Geri Yükle</CardTitle><CardDescription>Hatalı bir işlem sonrası veritabanını son yedek haline döndürür.</CardDescription></CardHeader><CardContent><Button onClick={() => undoLastOperation(firestore)} className="w-full" variant="outline">Son İşlemi Geri Al</Button></CardContent></Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* MODALS */}
            <Dialog open={!!editingPlace} onOpenChange={o => !o && setEditingPlace(null)}>
                <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b shrink-0"><DialogTitle>Yeri Düzenle</DialogTitle></DialogHeader>
                    <div className="flex-1 min-h-0"><ScrollArea className="h-full"><div className="p-6 space-y-6">
                        <Form {...editPlaceForm}><form onSubmit={editPlaceForm.handleSubmit(handleEditPlaceSubmit)} className="space-y-6">
                            <div className="bg-primary/5 p-4 rounded-lg border space-y-4">
                                <h4 className="font-bold flex items-center gap-2"><Headphones className="h-4 w-4" /> Türkçe Seslendirme (MP3)</h4>
                                <p className="text-xs text-muted-foreground">Kendi seslendirmenizi yükleyerek yapay zeka sesini devre dışı bırakabilirsiniz.</p>
                                <div className="flex items-center gap-3">
                                    <Input type="file" accept="audio/mpeg" onChange={e => handleAudioUpload(e, 'place')} className="hidden" id="audio-place" />
                                    <Button type="button" variant="outline" onClick={() => document.getElementById('audio-place')?.click()} disabled={isUploadingAudio}>
                                        {isUploadingAudio ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />} {editPlaceForm.getValues('audioUrlTr') ? 'Dosyayı Değiştir' : 'Özel MP3 Yükle'}
                                    </Button>
                                    {editPlaceForm.getValues('audioUrlTr') && <Badge className="bg-green-500 text-white border-none">MP3 Yüklü</Badge>}
                                </div>
                            </div>
                            {renderLocalizedFields(editPlaceForm, ['name', 'slug', 'description'])}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10">
                                <FormField control={editPlaceForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Kategori</FormLabel><select {...field} className="w-full h-10 border rounded px-2"><option value="poi">Önemli Nokta</option><option value="history">Tarih</option><option value="nature">Doğa</option><option value="food">Lezzet</option></select></FormItem>)}/>
                                <FormField control={editPlaceForm.control} name="order" render={({ field }) => (<FormItem><FormLabel>Sıra</FormLabel><Input type="number" {...field} /></FormItem>)}/>
                                <FormField control={editPlaceForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/>
                                <FormField control={editPlaceForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/>
                            </div>
                        </form></Form>
                    </div></ScrollArea></div>
                    <DialogFooter className="p-6 border-t bg-muted/20 shrink-0">
                        <Button variant="outline" onClick={() => setEditingPlace(null)}>İptal</Button>
                        <Button onClick={editPlaceForm.handleSubmit(handleEditPlaceSubmit)} disabled={isSubmitting}>{isSubmitting && <Loader2 className="animate-spin mr-2" />} Güncelle</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!managingSubPointsPlace} onOpenChange={o => !o && setManagingSubPointsPlace(null)}>
                <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b shrink-0"><DialogTitle>Alt Başlıklar: {managingSubPointsPlace?.name.tr}</DialogTitle></DialogHeader>
                    <div className="flex-1 min-h-0"><ScrollArea className="h-full"><div className="p-6 space-y-8">
                        <Form {...subPointForm}><form onSubmit={subPointForm.handleSubmit(handleSubPointSubmit)} className="space-y-4 border p-4 rounded bg-muted/5 shadow-sm">
                            <h4 className="font-bold flex items-center gap-2 text-primary">{editingSubPoint ? <FilePenLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingSubPoint ? 'Alt Başlığı Düzenle' : 'Yeni Alt Başlık Ekle'}</h4>
                            <div className="bg-primary/5 p-3 rounded border mb-4">
                                <Input type="file" accept="audio/mpeg" onChange={e => handleAudioUpload(e, 'subpoint')} className="hidden" id="audio-sub" />
                                <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById('audio-sub')?.click()} disabled={isUploadingAudio}>
                                    {isUploadingAudio ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <Upload className="h-3 w-3 mr-2" />} MP3 Yükle
                                </Button>
                                {subPointForm.getValues('audioUrlTr') && <Badge className="ml-2 bg-green-500 text-white">Yüklü</Badge>}
                            </div>
                            {renderLocalizedFields(subPointForm, ['name', 'description'])}
                            <div className="grid grid-cols-2 gap-4"><FormField control={subPointForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Lat</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/><FormField control={subPointForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Lng</FormLabel><Input type="number" step="any" {...field} /></FormItem>)}/></div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">{editingSubPoint ? 'Güncelle' : 'Ekle'}</Button>
                                {editingSubPoint && <Button type="button" variant="ghost" onClick={() => { setEditingSubPoint(null); subPointForm.reset(); }}>Vazgeç</Button>}
                            </div>
                        </form></Form>
                        <div className="space-y-2 pb-10">
                            <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest border-b pb-2">Ekli Alt Başlıklar</h4>
                            {managingSubPointsPlace?.subPoints?.map(s => (
                                <div key={s.id} className="flex justify-between items-center p-4 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{s.name.tr}</span>
                                        <span className="text-xs text-muted-foreground">{s.coordinates.lat.toFixed(4)}, {s.coordinates.lng.toFixed(4)}</span>
                                    </div>
                                    <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditingSubPoint(s); subPointForm.reset({ ...s, lat: s.coordinates.lat, lng: s.coordinates.lng }); }}><FilePenLine className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if(confirm('Bu alt başlık kalıcı olarak silinsin mi?')) { const u = managingSubPointsPlace.subPoints?.filter(x => x.id !== s.id) || []; updateSubPoints(firestore, managingSubPointsPlace.id, u, { onSuccess: () => setManagingSubPointsPlace({ ...managingSubPointsPlace, subPoints: u }) }); } }}><Trash2 className="h-4 w-4" /></Button></div>
                                </div>
                            )) || <p className="text-center py-10 text-muted-foreground italic">Henüz alt başlık eklenmemiş.</p>}
                        </div>
                    </div></ScrollArea></div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deletingFeedback} onOpenChange={o => !o && setDeletingFeedback(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anket Kaydını Sil</AlertDialogTitle><AlertDialogDescription>Bu anket kaydı kalıcı olarak silinecektir. Bu işlem geri alınamaz.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={async () => { if(deletingFeedback) { await deleteDoc(doc(firestore, 'feedbacks', deletingFeedback.id)); toast({ title: 'Silindi' }); setDeletingFeedback(null); } }} className="bg-destructive">Kalıcı Olarak Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!deletingPlace} onOpenChange={o => !o && setDeletingPlace(null)}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Mekanı Sil</AlertDialogTitle><AlertDialogDescription>'{deletingPlace?.name.tr}' mekanı ve tüm alt başlıkları kalıcı olarak silinecektir.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel><AlertDialogAction onClick={() => { if(deletingPlace) deletePlace(firestore, deletingPlace.id, { onSuccess: () => { toast({ title: 'Silindi' }); setDeletingPlace(null); } }); }} className="bg-destructive">Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
        </div>
    );
}