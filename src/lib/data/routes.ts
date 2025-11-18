import type { Route } from '@/lib/definitions';

export const routes: Route[] = [
    {
        id: 'r1',
        slug: { tr: 'lidya-hazineleri-rotasi', en: 'lydian-treasures-route' },
        name: { tr: 'Lidya Hazineleri Rotası', en: 'Lydian Treasures Route' },
        description: { 
            tr: 'Antik dünyanın en zengin krallığının izlerini sürün. Bu rota sizi paranın doğduğu topraklara, görkemli tapınaklara ve antik Lidya\'nın sırlarına götürecek.',
            en: 'Trace the steps of the richest kingdom of the ancient world. This route will take you to the lands where money was born, magnificent temples, and the secrets of ancient Lydia.'
        },
        stops: ['1', '5']
    },
    {
        id: 'r2',
        slug: { tr: 'gediz-vadisi-doga-rotasi', en: 'gediz-valley-nature-route' },
        name: { tr: 'Gediz Vadisi Doğa Rotası', en: 'Gediz Valley Nature Route' },
        description: { 
            tr: 'Gediz Nehri\'nin bereketli topraklarında bir yolculuğa çıkın. Bu rota, sizi Kurşunlu\'nun şifalı sularından, yemyeşil vadilere uzanan bir huzur yolculuğuna çıkaracak.',
            en: 'Embark on a journey through the fertile lands of the Gediz River. This route will take you on a peaceful journey from the healing waters of Kurşunlu to lush green valleys.'
        },
        stops: ['2']
    },
    {
        id: 'r3',
        slug: { tr: 'salihli-lezzet-rotasi', en: 'salihli-flavors-route' },
        name: { tr: 'Salihli Lezzet Rotası', en: 'Salihli Flavors Route' },
        description: { 
            tr: 'Salihli\'nin meşhur Odun Köftesi\'nden Sultaniye üzümüne, bu rota damak çatlatan lezzetleri keşfetmek isteyenler için birebir.',
            en: 'From Salihli\'s famous Wood Meatballs to Sultaniye grapes, this route is perfect for those who want to discover mouth-watering flavors.'
        },
        stops: ['3']
    }
];
