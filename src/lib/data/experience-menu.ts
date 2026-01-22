import type { ExperienceItem } from '@/lib/definitions';

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
    icon: 'Dna',
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
      tr: 'Doğa Rotaları',
      en: 'Nature Routes',
      fr: 'Itinéraires Nature',
      de: 'Naturrouten',
      ja: '自然のルート'
    },
    icon: 'Leaf',
    link: '/rotalar',
    order: 3
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
    icon: 'Route',
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
  }
];
