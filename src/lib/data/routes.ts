
import type { Route } from '@/lib/definitions';

export const routes: Route[] = [
    // --- TEMATİK ROTALAR (ŞEHİR İÇİ / KÜLTÜR) ---
    {
        id: 'r1',
        slug: { 
            tr: 'lidya-hazineleri-rotasi', 
            en: 'lydian-treasures-route',
            fr: 'route-des-tresors-lydiens',
            de: 'route-der-lydischen-schatze',
            ja: 'lydian-treasures-route-ja'
        },
        name: { 
            tr: 'Lidya Hazineleri Rotası', 
            en: 'Lydian Treasures Route',
            fr: 'Route des Trésors Lydiens',
            de: 'Route der Lydischen Schätze',
            ja: 'リディアの宝物ルート'
        },
        description: { 
            tr: 'Antik dünyanın en zengin krallığının izlerini sürün. Bu rota sizi paranın doğduğu topraklara, görkemli tapınaklara ve antik Lidya\'nın sırlarına götürecek.',
            en: 'Trace the steps of the richest kingdom of the ancient world. This route will take you to the lands where money was born, magnificent temples, and the secrets of ancient Lydia.',
            fr: 'Suivez les traces du royaume le plus riche du monde antique. Cet itinéraire vous mènera aux terres où la monnaie est née, à de magnifiques temples et aux secrets de l\'ancienne Lydie.',
            de: 'Folgen Sie den Spuren des reichsten Königreichs der Antike. Diese Route führt Sie in die Länder, in denen das Geld geboren wurde, zu prächtigen Tempeln und den Geheimnissen des alten Lydien.',
            ja: '古代世界で最も豊かな王国の足跡をたどってください。このルートは、お金が生まれた土地、壮大な寺院、古代リディアの秘密へとあなたを導きます。'
        },
        category: 'thematic',
        stops: ['12', '13']
    },
    {
        id: 'r2',
        slug: { 
            tr: 'doga-rotasi', 
            en: 'nature-route',
            fr: 'route-nature',
            de: 'naturroute',
            ja: 'nature-route-ja'
        },
        name: { 
            tr: 'Doğa Rotası', 
            en: 'Nature Route',
            fr: 'Route Nature',
            de: 'Naturroute',
            ja: '自然ルート'
        },
        description: { 
            tr: 'Gediz Nehri\'nin bereketli topraklarında bir yolculuğa çıkın. Bu rota, sizi Kurşunlu\'nun şifalı sularından, volkanik kanyonlara ve Tabak Deresi\'nin büyüleyici dev kazanlarına uzanan bir huzur yolculuğuna çıkaracak.',
            en: 'Embark on a journey through the fertile lands of the Gediz River. This route will take you on a peaceful journey from the healing waters of Kurşunlu to volcanic canyons and the fascinating giant cauldrons of Tabak Creek.',
            fr: 'Embarquez pour un voyage à travers les terres fertiles de la rivière Gediz. Cet itinéraire vous emmènera dans un voyage paisible des eaux curatives de Kurşunlu aux canyons volcaniques et aux fascinants chaudrons géants du ruisseau Tabak.',
            de: 'Begeben Sie sich auf eine Reise durch die fruchtbaren Länder des Gediz-Flusses. Diese Route führt Sie auf eine friedliche Reise von den heilenden Wassern von Kurşunlu zu vulkanischen Schluchten und den faszinierenden Riesenkesseln des Tabak-Bachs.',
            ja: 'ゲディズ川の肥沃な土地を旅に出かけましょう。このルートは、クルシュンルの癒しの水から火山の峡谷やタバック・クリークの魅力的な巨大な大釜へと続く平和な旅にあなたを連れています。'
        },
        category: 'thematic',
        stops: ['2', '6', '7']
    },

    // --- BİSİKLET ROTALARI ---
    {
        id: 'b-1',
        category: 'bicycle',
        distance: '24,5 km',
        wikilocId: '40219098',
        slug: { tr: 'lidya-yolu-bisiklet-rotasi', en: 'lydian-way-bicycle', fr: 'voie-lydienne-velo', de: 'lydischer-weg-rad', ja: 'lydian-way-bicycle-ja' },
        name: { tr: 'Lidya Yolu Bisiklet Rotası', en: 'Lydian Way Bicycle Route', fr: 'Piste Cyclable de la Voie Lydienne', de: 'Lydischer Weg Radroute', ja: 'リディアの道 自転車ルート' },
        description: { 
            tr: 'Antik Lidya medeniyetinin izlerini takip eden, Sart Antik Kenti\'nden başlayıp Bozdağlar\'ın eteklerine uzanan tarih ve doğa dolu bir parkur.',
            en: 'A path full of history and nature following the traces of the ancient Lydian civilization, starting from Sardis and stretching to the foothills of the Bozdağ Mountains.'
        } as any,
        stops: ['1', '12', '13']
    },
    {
        id: 'b-2',
        category: 'bicycle',
        distance: '42,0 km',
        wikilocId: '40219150',
        slug: { tr: 'salihli-alasehir-bisiklet-rotasi', en: 'salihli-alasehir-bicycle', fr: 'salihli-alasehir-velo', de: 'salihli-alasehir-rad', ja: 'salihli-alasehir-bicycle-ja' },
        name: { tr: 'Salihli-Alaşehir Bisiklet Rotası', en: 'Salihli-Alaşehir Bicycle Route', fr: 'Piste Cyclable Salihli-Alaşehir', de: 'Salihli-Alaşehir Radroute', ja: 'サリフリ-アラシェヒル 自転車ルート' },
        description: { 
            tr: 'Salihli\'den başlayıp Alaşehir\'e kadar uzanan, bölgenin verimli tarım alanları ve dünyaca ünlü üzüm bağları arasından geçen keyifli bir parkur.',
            en: 'A pleasant trail starting from Salihli and extending to Alaşehir, passing through the region\'s fertile agricultural lands and world-famous vineyards.'
        } as any,
        stops: []
    },
    {
        id: 'b-3',
        category: 'bicycle',
        distance: '55,2 km',
        wikilocId: '40219200',
        slug: { tr: 'kursunlu-marmara-bisiklet-rotasi', en: 'kursunlu-marmara-bicycle', fr: 'kursunlu-marmara-velo', de: 'kursunlu-marmara-rad', ja: 'kursunlu-marmara-bicycle-ja' },
        name: { tr: 'Kurşunlu - Gölmarmara Bisiklet Rotası', en: 'Kurşunlu - Gölmarmara Bicycle Route', fr: 'Piste Cyclable Kurşunlu-Marmara', de: 'Kurşunlu-Marmara Radroute', ja: 'クルシュンル-マルマラ 自転車ルート' },
        description: { 
            tr: 'Kurşunlu Kaplıcaları\'ndan başlayıp Marmara Gölü kıyılarına uzanan, eşsiz doğa manzaraları sunan kapsamlı bir bisiklet parkuru.',
            en: 'A comprehensive bicycle trail starting from Kurşunlu Thermal Springs to the shores of Lake Marmara, offering unique natural views.'
        } as any,
        stops: ['2']
    },

    // --- YÜRÜYÜŞ ROTALARI ---
    {
        id: 'h-1',
        category: 'walking',
        distance: '8,4 km',
        wikilocId: '40219300',
        slug: { tr: 'adala-kanyonu-yuruyus-rotasi', en: 'adala-canyon-hike', fr: 'randonnee-canyon-adala', de: 'adala-kanyon-wanderung', ja: 'adala-canyon-hike-ja' },
        name: { tr: 'Adala Volkanik Kanyon Yürüyüşü', en: 'Adala Volcanic Canyon Hike', fr: 'Randonnée du Canyon Volcanique d\'Adala', de: 'Adala Vulkancanyon Wanderung', ja: 'アダラ火山渓谷ハイキング' },
        description: { 
            tr: 'Kula-Salihli UNESCO Küresel Jeoparkı\'nın kalbinde, Gediz Nehri\'nin şekillendirdiği muazzam lav oluşumları arasında unutulmaz bir doğa yürüyüşü.',
            en: 'An unforgettable nature walk among the immense lava formations shaped by the Gediz River in the heart of the UNESCO Global Geopark.'
        } as any,
        stops: ['7']
    },
    {
        id: 'h-2',
        category: 'walking',
        distance: '4,2 km',
        wikilocId: '40219400',
        slug: { tr: 'kursunlu-yuruyus-rotasi', en: 'kursunlu-walking-path', fr: 'sentier-kursunlu', de: 'kursunlu-wanderweg', ja: 'kursunlu-walking-ja' },
        name: { tr: 'Kurşunlu Yürüyüş Rotası', en: 'Kurşunlu Walking Route', fr: 'Itinéraire de Randonnée de Kurşunlu', de: 'Kurşunlu Wanderweg', ja: 'クルシュンル・ウォーキング・ルート' },
        description: { 
            tr: 'Kurşunlu Kaplıcaları\'nın eşsiz doğasında, vadi boyunca uzanan ve şifalı suların serinliğini hissedeceğiniz keyifli bir parkur.',
            en: 'A pleasant trail in the unique nature of Kurşunlu Thermal Springs, stretching along the valley.'
        } as any,
        stops: ['2']
    },
    {
        id: 'h-3',
        category: 'walking',
        distance: '12,0 km',
        wikilocId: '40219500',
        slug: { tr: 'kayabasi-yuruyus-rotasi', en: 'kayabasi-walking-route', fr: 'sentier-kayabasi', de: 'kayabasi-wanderweg', ja: 'kayabasi-walking-ja' },
        name: { tr: 'Salihli Kayabaşı Yürüyüş Rotası', en: 'Salihli Kayabaşı Walking Route', fr: 'Itinéraire de Salihli Kayabaşı', de: 'Salihli Kayabaşı Wanderweg', ja: 'サリフリ・カヤバシュ' },
        description: { 
            tr: 'Salihli\'nin Kayabaşı mevkiinde, doğa ile iç içe, muazzam manzaralar ve kaya oluşumları sunan huzurlu bir yürüyüş parkuru.',
            en: 'A peaceful walking trail in the Kayabaşı area of Salihli, offering magnificent views and rock formations.'
        } as any,
        stops: []
    }
];
