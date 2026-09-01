
import type { Route } from '@/lib/definitions';

export const routes: Route[] = [
    // --- TEMATİK ROTALAR ---
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
            tr: 'Gediz Nehri\'nin bereketli topraklarında bir yolculuğa çıkın. Bu rota, sizi volkanik kanyonlara ve Tabak Deresi\'nin büyüleyici dev kazanlarına uzanan bir huzur yolculuğuna çıkaracak.',
            en: 'Embark on a journey through the fertile lands of the Gediz River. This route will take you on a peaceful journey to volcanic canyons and the fascinating giant cauldrons of Tabak Creek.',
            fr: 'Embarquez pour un voyage à travers les terres fertiles de la rivière Gediz. Cet itinéraire vous emmènera dans un voyage paisible vers les canyons volcaniques et les fascinants chaudrons géants du ruisseau Tabak.',
            de: 'Begeben Sie sich auf eine Reise durch die fruchtbaren Länder des Gediz-Flusses. Diese Route führt Sie auf eine friedliche Reise zu vulkanischen Schluchten und den faszinierenden Riesenkesseln des Tabak-Bachs.',
            ja: 'ゲディズ川の肥沃な土地を旅に出かけましょう。このルートは、火山の峡谷やタバック・クリークの魅力的な巨大な大釜へと続く平和な旅にあなたを連れています。'
        },
        category: 'thematic',
        stops: ['6', '7']
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
            en: 'A path full of history and nature following the traces of the ancient Lydian civilization, starting from Sardis and stretching to the foothills of the Bozdağ Mountains.',
            fr: 'Un parcours plein d\'histoire et de nature suivant les traces de l\'ancienne civilisation lydienne.',
            de: 'Ein Weg voller Geschichte und Natur, der den Spuren der alten lydischen Zivilisation folgt.',
            ja: '古代リディア文明の足跡をたどる、歴史と自然に満ちたコースです。'
        },
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
            en: 'A pleasant trail starting from Salihli and extending to Alaşehir, passing through the region\'s fertile agricultural lands and world-famous vineyards.',
            fr: 'Un sentier agréable partant de Salihli et s\'étendant jusqu\'à Alaşehir.',
            de: 'Ein angenehmer Weg, der in Salihli beginnt und bis nach Alaşehir führt.',
            ja: 'サリフリから始まりアラシェヒルまで続く、この地域の肥沃な農地を通る快適なコースです。'
        },
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
            tr: 'Salihli çevresinden başlayıp Marmara Gölü kıyılarına uzanan, eşsiz doğa manzaraları sunan kapsamlı bir bisiklet parkuru.',
            en: 'A comprehensive bicycle trail starting from around Salihli to the shores of Lake Marmara, offering unique natural views.',
            fr: 'Un sentier cyclable complet partant des environs de Salihli jusqu\'aux rives du lac Marmara.',
            de: 'Ein umfassender Fahrradweg, der von der Umgebung von Salihli bis zum Ufer des Marmara-Sees führt.',
            ja: 'サリフリ周辺から始まりマルマラ湖の岸辺まで続く、独特の自然の景色を楽しめる総合的な自転車コースです。'
        },
        stops: []
    },
    {
        id: 'b-4',
        category: 'bicycle',
        distance: '31,8 km',
        wikilocId: '40219250',
        slug: { tr: 'kula-salihli-jeopark-bisiklet-rotasi', en: 'kula-salihli-geopark-bicycle', fr: 'geoparc-kula-salihli-velo', de: 'geopark-kula-salihli-rad', ja: 'geopark-kula-salihli-ja' },
        name: { tr: 'Kula-Salihli Jeopark Bisiklet Rotası', en: 'Kula-Salihli Geopark Bicycle Route', fr: 'Piste Cyclable du Géoparc Kula-Salihli', de: 'Kula-Salihli Geopark Radroute', ja: 'クラーサリフリ ジオパーク 自転車ルート' },
        description: { 
            tr: 'Kula-Salihli UNESCO Küresel Jeoparkı\'nın eşsiz jeolojik oluşumları arasında geçen, volkanik koniler ve lav akıntıları eşliğinde büyüleyici bir parkur.',
            en: 'A fascinating trail passing through the unique geological formations of the Kula-Salihli UNESCO Global Geopark, accompanied by volcanic cones and lava flows.',
            fr: 'Un sentier fascinant traversant les formations géologiques uniques du géoparc mondial UNESCO de Kula-Salihli.',
            de: 'Ein faszinierender Weg durch die einzigartigen geologischen Formationen des UNESCO Global Geoparks Kula-Salihli.',
            ja: 'クラーサリフリ・ユネスコ世界ジオパークの独特な地質学的形成物の中を進む魅力的なコースです。'
        },
        stops: ['7']
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
            en: 'An unforgettable nature walk among the immense lava formations shaped by the Gediz River in the heart of the Kula-Salihli UNESCO Global Geopark.',
            fr: 'Une marche inoubliable au cœur du Géoparc mondial UNESCO Kula-Salihli.',
            de: 'Eine unvergessliche Naturwanderung inmitten der riesigen Lavaformationen.',
            ja: 'クラーサリフリ・ユネスコ世界ジオパークの中心部を進む忘れられない自然散策。'
        },
        stops: ['7']
    },
    {
        id: 'h-2',
        category: 'walking',
        distance: '4,2 km',
        wikilocId: '40219400',
        slug: { tr: 'kursunlu-yuruyus-rotasi', en: 'kursunlu-walking-path', fr: 'sentier-kursunlu', de: 'kursunlu-wanderweg', ja: 'kursunlu-walking-ja' },
        name: { tr: 'Vadi Yürüyüş Rotası', en: 'Valley Walking Route', fr: 'Itinéraire de Randonnée de la Vallée', de: 'Tal-Wanderweg', ja: 'バレー・ウォーキング・ルート' },
        description: { 
            tr: 'Salihli\'nin eşsiz doğasında, vadi boyunca uzanan ve doğanın serinliğini hissedeceğiniz keyifli bir parkur.',
            en: 'A pleasant trail in the unique nature of Salihli, stretching along the valley where you will feel the coolness of nature.',
            fr: 'Un sentier agréable dans la nature unique de Salihli.',
            de: 'Ein angenehmer Weg in der einzigartigen Natur von Salihli.',
            ja: 'サリフリの独特な自然の中、自然の冷たさを感じながら谷沿いに続くコースです。'
        },
        stops: []
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
            en: 'A peaceful walking trail in the Kayabaşı area of Salihli, intertwined with nature, offering magnificent views and rock formations.',
            fr: 'Un sentier de randonnée paisible dans la zone de Kayabaşı à Salihli.',
            de: 'Ein friedlicher Wanderweg im Gebiet Kayabaşı in Salihli, inmitten der Natur.',
            ja: 'サリフリのカヤバシュ地区にある、自然と一体となり壮大な景色を楽しめる穏やかなコースです。'
        },
        stops: []
    },
    {
        id: 'h-4',
        category: 'walking',
        distance: '7,2 km',
        wikilocId: '40219600',
        kmlUrl: '/allahdiyen.kml',
        slug: { tr: 'allahdiyen-komurcutepesi-yuruyus-rotasi', en: 'allahdiyen-komurcutepesi-hike', fr: 'sentier-allahdiyen-komurcutepesi', de: 'allahdiyen-komurcutepesi-weg', ja: 'allahdiyen-komurcutepesi-ja' },
        name: { tr: 'Allahdiyen - Kömürcütepesi Yürüyüş Rotası', en: 'Allahdiyen - Kömürcütepesi Hiking Route', fr: 'Itinéraire Allahdiyen - Kömürcütepesi', de: 'Allahdiyen - Kömürcütepesi Wanderweg', ja: 'アッラーディイェン - キョミュルジュテペシ' },
        description: { 
            tr: 'Allahdiyen köyünden başlayıp Kömürcütepesi mevkiine kadar uzanan, çam ağaçları ve dere şırıltıları eşliğinde muazzam bir doğa yürüyüşü parkuru.',
            en: 'A magnificent nature walk trail starting from Allahdiyen village and extending to Kömürcütepesi, accompanied by pine trees and the sound of the stream.',
            fr: 'Un sentier de randonnée en pleine nature partant du village d\'Allahdiyen jusqu\'à Kömürcütepesi.',
            de: 'Ein herrlicher Naturwanderweg, der vom Dorf Allahdiyen zum Kömürcütepesi führt.',
            ja: 'アッラーディイェン村からキョミュルジュテペシまで続く、松の木と小川のせせらぎに包まれた素晴らしい自然散策コースです。'
        },
        stops: []
    }
];
