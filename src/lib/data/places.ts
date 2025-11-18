import type { Place } from '@/lib/definitions';

export const places: Place[] = [
    {
        id: '1',
        slug: { tr: 'sardes-antik-kenti', en: 'sardes-ancient-city' },
        name: { tr: 'Sardes Antik Kenti', en: 'Sardes Ancient City' },
        description: { 
            tr: 'Lidya Krallığı\'nın başkenti olan Sardes, tarihte paranın ilk basıldığı yer olarak bilinir. Artemis Tapınağı ve Sinagog gibi etkileyici kalıntılara ev sahipliği yapmaktadır.',
            en: 'The capital of the Lydian Kingdom, Sardes is known as the first place where money was minted. It hosts impressive ruins such as the Temple of Artemis and the Synagogue.'
        },
        category: 'history',
        coordinates: { lat: 38.4893, lng: 28.0396 }
    },
    {
        id: '2',
        slug: { tr: 'kursunlu-kaplicalari', en: 'kursunlu-thermal-springs' },
        name: { tr: 'Kurşunlu Kaplıcaları', en: 'Kurşunlu Thermal Springs' },
        description: { 
            tr: 'Doğal güzellikler içinde yer alan Kurşunlu Kaplıcaları, şifalı sularıyla ünlüdür. Ziyaretçilere hem sağlık hem de huzur sunar.',
            en: 'Located in natural beauties, Kurşunlu Thermal Springs are famous for their healing waters. It offers both health and peace to its visitors.'
        },
        category: 'nature',
        coordinates: { lat: 38.5833, lng: 28.2500 }
    },
    {
        id: '3',
        slug: { tr: 'salihli-odun-kofte', en: 'salihli-odun-kofte' },
        name: { tr: 'Salihli Odun Köftesi', en: 'Salihli Wood Meatballs' },
        description: { 
            tr: 'Salihli\'nin en meşhur lezzeti olan odun köftesi, özel baharatları ve odun ateşinde pişirilmesiyle damaklarda unutulmaz bir tat bırakır.',
            en: 'The most famous flavor of Salihli, wood meatballs, leaves an unforgettable taste with its special spices and cooking on a wood fire.'
        },
        category: 'food',
        coordinates: { lat: 38.4833, lng: 28.1333 }
    },
    {
        id: '4',
        slug: { tr: 'ataturk-aniti', en: 'ataturk-monument' },
        name: { tr: 'Atatürk Anıtı', en: 'Atatürk Monument' },
        description: { 
            tr: 'Salihli\'nin merkezinde yer alan bu anıt, modern Türkiye\'nin kurucusu Mustafa Kemal Atatürk\'e adanmıştır.',
            en: 'Located in the center of Salihli, this monument is dedicated to Mustafa Kemal Atatürk, the founder of modern Turkey.'
        },
        category: 'poi',
        coordinates: { lat: 38.4830, lng: 28.1400 }
    },
    {
        id: '5',
        slug: { tr: 'salihli-kent-muzesi', en: 'salihli-city-museum' },
        name: { tr: 'Salihli Kent Müzesi', en: 'Salihli City Museum' },
        description: { 
            tr: 'Salihli\'nin sosyal ve kültürel tarihini yansıtan objelerin ve belgelerin sergilendiği bir müzedir.',
            en: 'It is a museum where objects and documents reflecting the social and cultural history of Salihli are exhibited.'
        },
        category: 'history',
        coordinates: { lat: 38.4845, lng: 28.1415 }
    }
];
