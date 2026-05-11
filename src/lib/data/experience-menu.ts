
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
      de: 'Natur und Frieden',
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
      tr: 'Rota Oluştur',
      en: 'Create Route',
      fr: 'Créer un Itinéraire',
      de: 'Route Erstellen',
      ja: 'ルートを作成'
    },
    icon: 'MapPinned',
    link: '/rota-olustur',
    order: 4
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
    order: 5
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
    order: 6
  },
  {
    name: {
      tr: 'Bisiklet Rotaları',
      en: 'Bicycle Routes',
      fr: 'Itinéraires Cyclables',
      de: 'Fahrradrouten',
      ja: '自転車ルート'
    },
    icon: 'Bike',
    link: '/bisiklet-rotalari',
    order: 7
  },
  {
    name: {
      tr: 'Yürüyüş Rotaları',
      en: 'Hiking Routes',
      fr: 'Itinéraires de Randonnée',
      de: 'Wanderwege',
      ja: 'ハイキングルート'
    },
    icon: 'Footprints',
    link: '/yuruyus-rotalari',
    order: 8
  },
  {
    name: {
      tr: 'Yakınımdakiler',
      en: 'What\'s Around Me?',
      fr: 'Qu\'y a-t-il autour de moi ?',
      de: 'Was ist um mich herum?',
      ja: '私の周りに何がある？'
    },
    icon: 'LocateFixed',
    link: '/cevremde-ne-var',
    order: 9
  }
];
