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
        stops: ['1', '5']
    },
    {
        id: 'r2',
        slug: { 
            tr: 'gediz-vadisi-doga-rotasi', 
            en: 'gediz-valley-nature-route',
            fr: 'route-nature-de-la-vallee-de-gediz',
            de: 'naturroute-gediz-tal',
            ja: 'gediz-valley-nature-route-ja'
        },
        name: { 
            tr: 'Gediz Vadisi Doğa Rotası', 
            en: 'Gediz Valley Nature Route',
            fr: 'Route Nature de la Vallée de Gediz',
            de: 'Naturroute Gediz-Tal',
            ja: 'ゲディズ渓谷自然ルート'
        },
        description: { 
            tr: 'Gediz Nehri\'nin bereketli topraklarında bir yolculuğa çıkın. Bu rota, sizi Kurşunlu\'nun şifalı sularından, yemyeşil vadilere uzanan bir huzur yolculuğuna çıkaracak.',
            en: 'Embark on a journey through the fertile lands of the Gediz River. This route will take you on a peaceful journey from the healing waters of Kurşunlu to lush green valleys.',
            fr: 'Embarquez pour un voyage à travers les terres fertiles de la rivière Gediz. Cet itinéraire vous emmènera dans un voyage paisible des eaux curatives de Kurşunlu aux vallées verdoyantes.',
            de: 'Begeben Sie sich auf eine Reise durch die fruchtbaren Länder des Gediz-Flusses. Diese Route führt Sie auf eine friedliche Reise von den heilenden Wassern von Kurşunlu zu üppig grünen Tälern.',
            ja: 'ゲディズ川の肥沃な土地を旅に出かけましょう。このルートは、クルシュンルの癒しの水から緑豊かな谷へと続く平和な旅にあなたを連れて行きます。'
        },
        stops: ['2']
    },
    {
        id: 'r3',
        slug: { 
            tr: 'salihli-lezzet-rotasi', 
            en: 'salihli-flavors-route',
            fr: 'route-des-saveurs-de-salihli',
            de: 'geschmacksroute-salihli',
            ja: 'salihli-flavors-route-ja'
        },
        name: { 
            tr: 'Salihli Lezzet Rotası', 
            en: 'Salihli Flavors Route',
            fr: 'Route des Saveurs de Salihli',
            de: 'Geschmacksroute Salihli',
            ja: 'サリフリフレーバールート'
        },
        description: { 
            tr: 'Salihli\'nin meşhur Odun Köftesi\'nden Sultaniye üzümüne, bu rota damak çatlatan lezzetleri keşfetmek isteyenler için birebir.',
            en: 'From Salihli\'s famous Wood Meatballs to Sultaniye grapes, this route is perfect for those who want to discover mouth-watering flavors.',
            fr: 'Des célèbres boulettes de viande au feu de bois de Salihli aux raisins Sultaniye, cet itinéraire est parfait pour ceux qui veulent découvrir des saveurs alléchantes.',
            de: 'Von den berühmten Holz-Fleischbällchen von Salihli bis zu den Sultaniye-Trauben ist diese Route perfekt für diejenigen, die köstliche Aromen entdecken möchten.',
            ja: 'サリフリの有名なウッドミートボールからスルタニエブドウまで、このルートは食欲をそそる味を発見したい人に最適です。'
        },
        stops: ['3']
    }
];
