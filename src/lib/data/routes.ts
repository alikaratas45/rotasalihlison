
import type { Route } from '@/lib/definitions';

export const routes: Route[] = [
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
        stops: ['2', '6', '7']
    }
];
