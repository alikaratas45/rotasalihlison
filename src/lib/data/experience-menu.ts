import { ExperienceItem } from '@/lib/definitions';

// Omit 'id' because it will be auto-generated during seeding
export const experienceItems: Omit<ExperienceItem, 'id'>[] = [
  {
    name: {
      tr: 'Tarihe Yolculuk',
      en: 'Journey to History',
      fr: 'Voyage dans l\'Histoire',
      de: 'Reise in die Geschichte',
      ja: '歴史への旅'
    },
    icon: 'Landmark',
    link: '/yerler?category=history',
    order: 1
  },
  {
    name: {
      tr: 'Doğa ve Huzur',
      en: 'Nature and Peace',
      fr: 'Nature et Paix',
      de: 'Natur oder Frieden',
      ja: '自然と平和'
    },
    icon: 'Mountain',
    link: '/yerler?category=nature',
    order: 2
  },
  {
    name: {
      tr: 'Lezzet Durakları',
      en: 'Flavor Stops',
      fr: 'Arrêts Gourmands',
      de: 'Geschmacksstopps',
      ja: '味の停留所'
    },
    icon: 'Utensils',
    link: '/lezzetler',
    order: 3
  },
  {
    name: {
      tr: 'Tematik Rotalar',
      en: 'Thematic Routes',
      fr: 'Itinéraires Thématiques',
      de: 'Thematische Routen',
      ja: 'テーマ別ルート'
    },
    icon: 'Map',
    link: '/rotalar',
    order: 4
  },
  {
    name: {
      tr: 'Rota Oluştur',
      en: 'Create Route',
      fr: 'Créer un Itinéraire',
      de: 'Route Erstellen',
      ja: 'ルートを作成'
    },
    icon: 'MapPinned',
    link: '/rota-olustur',
    order: 5
  },
  {
    name: {
      tr: 'Hikayeler',
      en: 'Stories',
      fr: 'Histoires',
      de: 'Geschichten',
      ja: '物語'
    },
    icon: 'BookOpen',
    link: '/hikayeler',
    order: 6
  },
  {
    name: {
      tr: 'Ziyaretçi Defteri',
      en: 'Guestbook',
      fr: 'Livre d\'or',
      de: 'Gästebuch',
      ja: 'ゲストブック'
    },
    icon: 'MessageSquare',
    link: '/ziyaretci-defteri',
    order: 7
  },
  {
    name: {
      tr: 'Dijital Yayınlar',
      en: 'Digital Publications',
      fr: 'Publications Numériques',
      de: 'Digitale Publikationen',
      ja: '電子出版物'
    },
    icon: 'Library',
    link: '/dijital-yayinlar',
    order: 8
  },
  {
    name: {
      tr: 'Rotalar',
      en: 'Tracks',
      fr: 'Sentiers',
      de: 'Pfade',
      ja: 'トレイル'
    },
    icon: 'Footprints',
    link: '/yuruyus-rotalari',
    order: 9
  },
  {
    name: {
      tr: 'Konaklama',
      en: 'Accommodation',
      fr: 'Hébergement',
      de: 'Unterkunft',
      ja: '宿泊施設'
    },
    icon: 'Bed',
    link: '/konaklama',
    order: 10
  }
];
