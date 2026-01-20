import type { Brochure } from '@/lib/definitions';

export const brochures: Brochure[] = [
    {
        id: 'b1',
        title: {
            tr: 'Salihli Tanıtım Broşürü',
            en: 'Salihli Promotional Brochure',
            fr: 'Brochure Promotionnelle de Salihli',
            de: 'Salihli Werbebroschüre',
            ja: 'サリフリプロモーションパンフレット'
        },
        pages: [
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-cover/800/1200',
                imageHint: 'brochure cover Salihli landscape',
                title: {
                    tr: 'Salihli\'yi Keşfet',
                    en: 'Discover Salihli',
                    fr: 'Découvrez Salihli',
                    de: 'Entdecken Sie Salihli',
                    ja: 'サリフリを発見'
                },
                text: {
                    tr: 'Sardes\'in mirası, paranın merkezi. Tarih, doğa ve lezzetin buluştuğu eşsiz bir rota.',
                    en: 'The heritage of Sardis, the center of money. A unique route where history, nature, and flavor meet.',
                    fr: 'L\'héritage de Sardes, le centre de l\'argent. Un itinéraire unique où l\'histoire, la nature et la saveur se rencontrent.',
                    de: 'Das Erbe von Sardes, das Zentrum des Geldes. Eine einzigartige Route, auf der sich Geschichte, Natur und Geschmack treffen.',
                    ja: 'サルディスの遺産、お金の中心。歴史、自然、そして味が融合するユニークなルート。'
                }
            },
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-p2/800/1200',
                imageHint: 'Sardis ruins columns',
                title: {
                    tr: 'Sardes Antik Kenti',
                    en: 'Sardis Ancient City',
                    fr: 'Cité Antique de Sardes',
                    de: 'Antike Stadt Sardes',
                    ja: 'サルディス古代都市'
                },
                text: {
                    tr: 'Lidya Krallığı\'nın görkemli başkenti. Paranın icat edildiği topraklarda tarihe tanıklık edin. Artemis Tapınağı ve Gymnasium sizi bekliyor.',
                    en: 'The magnificent capital of the Lydian Kingdom. Witness history in the land where money was invented. The Temple of Artemis and the Gymnasium await you.',
                    fr: 'La magnifique capitale du royaume de Lydie. Soyez témoin de l\'histoire sur la terre où l\'argent a été inventé. Le temple d\'Artémis et le gymnase vous attendent.',
                    de: 'Die prächtige Hauptstadt des Lydischen Königreichs. Erleben Sie Geschichte in dem Land, in dem das Geld erfunden wurde. Der Tempel der Artemis und das Gymnasium erwarten Sie.',
                    ja: 'リディア王国の壮大な首都。お金が発明された土地で歴史を目撃してください。アルテミス神殿とギムナジウムがあなたを待っています。'
                }
            },
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-p3/800/1200',
                imageHint: 'Kurşunlu hot springs pool',
                 title: {
                    tr: 'Kurşunlu Kaplıcaları',
                    en: 'Kurşunlu Thermal Springs',
                    fr: 'Sources Thermales de Kurşunlu',
                    de: 'Thermalquellen von Kurşunlu',
                    ja: 'クルシュンル温泉'
                },
                text: {
                    tr: 'Doğanın ortasında şifa bulun. Yüzyıllardır deva dağıtan termal sularıyla bedeninizi ve ruhunuzu yenileyin.',
                    en: 'Find healing in the middle of nature. Renew your body and soul with its thermal waters that have been providing cures for centuries.',
                    fr: 'Trouvez la guérison au milieu de la nature. Renouvelez votre corps et votre âme avec ses eaux thermales qui offrent des cures depuis des siècles.',
                    de: 'Finden Sie Heilung inmitten der Natur. Erneuern Sie Körper und Seele mit seinem Thermalwasser, das seit Jahrhunderten Heilung bietet.',
                    ja: '自然の中で癒しを見つけてください。何世紀にもわたって治療を提供してきた温泉水で体と魂をリフレッシュしてください。'
                }
            },
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-p4/800/1200',
                imageHint: 'local cuisine meatballs',
                 title: {
                    tr: 'Salihli Odun Köftesi',
                    en: 'Salihli Wood Meatballs',
                    fr: 'Boulettes de Viande au Feu de Bois de Salihli',
                    de: 'Salihli Holz-Fleischbällchen',
                    ja: 'サリフリウッドミートボール'
                },
                text: {
                    tr: 'Salihli denince akla gelen ilk lezzet. Meşe odunu ateşinde pişen bu eşsiz köftenin tadına bakmadan dönmeyin.',
                    en: 'The first flavor that comes to mind when you think of Salihli. Don\'t leave without tasting these unique meatballs cooked over an oak wood fire.',
                    fr: 'La première saveur qui vient à l\'esprit quand on pense à Salihli. Ne partez pas sans avoir goûté ces boulettes de viande uniques cuites au feu de bois de chêne.',
                    de: 'Der erste Geschmack, der einem in den Sinn kommt, wenn man an Salihli denkt. Gehen Sie nicht, ohne diese einzigartigen Fleischbällchen probiert zu haben, die über einem Eichenholzfeuer gekocht werden.',
                    ja: 'サリフリを考えると最初に思い浮かぶ味。オーク材の火で調理されたこれらのユニークなミートボールを味わうことなしに去らないでください。'
                }
            },
        ]
    }
];
