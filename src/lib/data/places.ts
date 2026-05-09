import type { Place } from '@/lib/definitions';

export const places: Place[] = [
    {
        id: '1',
        slug: { tr: 'sardes-antik-kenti', en: 'sardes-ancient-city', fr: 'cite-antique-de-sardes', de: 'antike-stadt-sardes', ja: 'sardes-ancient-city-ja' },
        name: { tr: 'Sardes Antik Kenti', en: 'Sardis Ancient City', fr: 'Cité Antique de Sardes', de: 'Antike Stadt Sardes', ja: 'サルディス古代都市' },
        description: { tr: `Lidya Krallığı'nın başkenti olan Sardes, paranın ilk basıldığı yer olarak tarihe geçmiştir.`, en: `Sardis, the capital of the Lydian Kingdom, was the place where money was first minted.`, fr: `Sardes, capitale de la Lydie, est le lieu où la monnaie fut inventée.`, de: `Sardes, die Hauptstadt Lydiens, war der Ort, an dem das Geld erfunden wurde.`, ja: `リディア王国の首都サルディスは、初めて硬貨が鋳造された場所です。` },
        category: 'history',
        coordinates: { lat: 38.48848035921838, lng: 28.040289089766958 },
        imageUrl: 'https://i.imgur.com/2deYxHC.png',
        imageHint: 'ancient ruins'
    },
    {
        id: '2',
        slug: { tr: 'kursunlu-kaplicalari', en: 'kursunlu-thermal-springs', fr: 'sources-thermales-de-kursunlu', de: 'thermalquellen-von-kursunlu', ja: 'kursunlu-thermal-springs-ja' },
        name: { tr: 'Kurşunlu Kaplıcaları', en: 'Kurşunlu Thermal Springs', fr: 'Sources Thermales de Kurşunlu', de: 'Thermalquellen von Kurşunlu', ja: 'クルシュンル温泉' },
        description: { tr: `Şifalı suları ve doğal güzelliği ile bilinen Kurşunlu, Salihli'nin en önemli turizm merkezlerinden biridir.`, en: `Known for its healing waters and natural beauty, Kurşunlu is one of Salihli's major tourism spots.`, fr: `Connu pour ses eaux curatives, Kurşunlu est un site touristique majeur de Salihli.`, de: `Kurşunlu ist bekannt für seine Thermalquellen und seine natürliche Schönheit.`, ja: `癒しの水で知られるクルシュンルは、サリフリの主要な観光スポットです。` },
        category: 'nature',
        coordinates: { lat: 38.448729326237775, lng: 28.11443981723854 },
        imageUrl: 'https://i.imgur.com/n7fioom.jpeg',
        imageHint: 'hot springs'
    },
    {
        id: '3',
        slug: { tr: 'salihli-odun-kofte', en: 'salihli-wood-meatballs', fr: 'boulettes-de-viande-au-feu-de-bois-de-salihli', de: 'salihli-holzfleischballchen', ja: 'salihli-wood-meatballs-ja' },
        name: { tr: 'Salihli Odun Köftesi', en: 'Salihli Wood Meatballs', fr: 'Boulettes de Viande au Feu de Bois de Salihli', de: 'Salihli Holz-Meatballs', ja: 'サリフリ・ウッドミートボール' },
        description: { tr: `Meşe odunu ateşinde pişen meşhur köfte.`, en: `Famous meatballs cooked over oak wood fire.`, fr: `Boulettes de viande cuites au feu de bois.`, de: `Berühmte Fleischbällchen über Eichenholzfeuer.`, ja: `オークの薪で焼かれた有名なミートボール。` },
        category: 'food',
        coordinates: { lat: 38.4833, lng: 28.1333 },
        imageUrl: 'https://i.imgur.com/IT6VuDV.jpeg',
        imageHint: 'grilled meatballs'
    },
    {
        id: '5',
        slug: { tr: 'salihli-kent-muzesi', en: 'salihli-city-museum', fr: 'musee-de-la-ville-de-salihli', de: 'stadtmuseum-salihli', ja: 'salihli-city-museum-ja' },
        name: { tr: 'Salihli Kent Müzesi', en: 'Salihli City Museum', fr: 'Musée de la Ville de Salihli', de: 'Stadtmuseum Salihli', ja: 'サリフリ市立博物館' },
        description: { tr: `Salihli'nin tarihi ve kültürel geçmişini yansıtan konak.`, en: `A mansion reflecting Salihli's historical and cultural past.`, fr: `Manoir reflétant le passé de Salihli.`, de: `Ein Herrenhaus, das die Geschichte von Salihli zeigt.`, ja: `サリフリの歴史を反映した博物館。` },
        category: 'history',
        coordinates: { lat: 38.48235578263535, lng: 28.1309880487272 },
        imageUrl: 'https://i.imgur.com/IauiziR.jpeg',
        imageHint: 'city museum'
    },
    {
        id: '6',
        slug: { tr: 'tabak-deresi-dev-kazanlari', en: 'tabak-creek-giant-cauldrons', fr: 'chaudrons-geants-du-ruisseau-tabak', de: 'riesenkessel-am-tabak-bach', ja: 'tabak-creek-giant-cauldrons-ja' },
        name: { tr: 'Tabak Deresi Dev Kazanları', en: 'Tabak Creek Giant Cauldrons', fr: 'Chaudrons Géants du Ruisseau Tabak', de: 'Riesenkessel am Tabak-Bach', ja: 'タバッククリークの巨大な大釜' },
        description: { tr: `Kral Midas'ın altın dokunuşundan kurtulduğu yerlerden biri olarak inanılır.`, en: `Believed to be one of the places where King Midas was freed from the golden touch.`, fr: `L'un des endroits où le roi Midas fut libéré du toucher d'or.`, de: `Einer der Orte, an denen Midas vom goldenen Fluch befreit wurde.`, ja: `ミダス王が黄金の呪いから解放された場所と信じられています。` },
        category: 'nature',
        coordinates: { lat: 38.458250364806744, lng: 28.044546435772286 },
        imageUrl: 'https://i.imgur.com/aOjHCNC.jpeg',
        imageHint: 'river rocks'
    },
    {
        id: '7',
        slug: { tr: 'adala-volkanik-kanyonu', en: 'adala-volcanic-canyon', fr: 'canyon-volcanique-adala', de: 'vulkanischer-canyon-adala', ja: 'adala-volcanic-canyon-ja' },
        name: { tr: 'Adala Volkanik Kanyonu', en: 'Adala Volcanic Canyon', fr: 'Canyon Volcanique d\'Adala', de: 'Vulkanischer Canyon von Adala', ja: 'アダラ火山渓谷' },
        description: { tr: `Gediz Nehri'nin lavlar arasında oluşturduğu muazzam kanyon.`, en: `Magnificent canyon formed by the Gediz River through lava flows.`, fr: `Canyon formé par la rivière Gediz entre les laves.`, de: `Prachtvoller Canyon, den der Gediz durch Lavaströme grub.`, ja: `ゲディズ川が溶岩流の間に形成した壮大な渓谷。` },
        category: 'nature',
        coordinates: { lat: 38.581712325205984, lng: 28.271791613037774 },
        imageUrl: 'https://i.imgur.com/I6L6rHm.jpeg',
        imageHint: 'volcanic canyon'
    },
    {
        id: '8',
        slug: { tr: 'adala-ataturk-evi', en: 'adala-ataturk-house', fr: 'maison-ataturk-adala', de: 'adala-ataturk-haus', ja: 'adala-ataturk-house-ja' },
        name: { tr: 'Adala Atatürk Evi', en: 'Adala Atatürk House', fr: 'Maison Atatürk d\'Adala', de: 'Adala Atatürk-Haus', ja: 'アダラアタテュルクハウス' },
        description: { tr: `Atatürk'ün konakladığı tarihi yapı.`, en: `Historical house where Atatürk stayed.`, fr: `Maison historique où Atatürk a séjourné.`, de: `Historisches Haus, in dem Atatürk wohnte.`, ja: `アタテュルクが滞在した歴史的な家。` },
        category: 'history',
        coordinates: { lat: 38.57849271604208, lng: 28.270398205456143 },
        imageUrl: 'https://i.imgur.com/vfBy0dj.jpeg',
        imageHint: 'historic house'
    },
    {
        id: '9',
        slug: { tr: 'suuctu-selalesi', en: 'suuctu-waterfall', fr: 'cascade-suuctu', de: 'suuctu-wasserfall', ja: 'suuctu-waterfall-ja' },
        name: { tr: 'Suuçtu Şelalesi', en: 'Suuçtu Waterfall', fr: 'Cascade de Suuçtu', de: 'Suuçtu Wasserfall', ja: 'スーチュ滝' },
        description: { tr: `Adala Kanyonu'na dökülen doğa harikası şelale.`, en: `Natural wonder waterfall pouring into Adala Canyon.`, fr: `Cascade se jetant dans le canyon d'Adala.`, de: `Wasserfall, der in den Adala-Canyon stürzt.`, ja: `アダラ渓谷に流れ落ちる natural wonder の滝。` },
        category: 'nature',
        coordinates: { lat: 38.603174968474164, lng: 28.287310874314443 },
        imageUrl: 'https://i.imgur.com/B2DiIdP.jpeg',
        imageHint: 'waterfall nature'
    },
    {
        id: '10',
        slug: { tr: 'kiz-koprusu', en: 'kiz-koprusu-maidens-bridge', fr: 'pont-des-demoiselles-kiz-koprusu', de: 'jungfrauenbrucke-kiz-koprusu', ja: 'kiz-koprusu-maidens-bridge-ja' },
        name: { tr: 'Kız Köprüsü', en: 'Kız Köprüsü (Maiden\'s Bridge)', fr: 'Pont des Demoiselles (Kız Köprüsü)', de: 'Jungfrauenbrücke (Kız Köprüsü)', ja: 'クズ・キョプリュス（乙女の橋）' },
        description: { tr: `Gediz Nehri üzerinde tarihi taş köprü.`, en: `Historical stone bridge over the Gediz River.`, fr: `Pont de pierre historique sur le Gediz.`, de: `Historische Steinbrücke über den Gediz.`, ja: `ゲディズ川に架かる歴史的な石橋。` },
        category: 'history',
        coordinates: { lat: 38.610014244679405, lng: 28.298125541176937 },
        imageUrl: 'https://i.imgur.com/PKqOBtx.jpeg',
        imageHint: 'stone bridge'
    },
    {
        id: '11',
        slug: { tr: 'bintepeler-lidya-tumulusleri', en: 'bintepeler-lydian-tumuli', fr: 'tumulus-lydiens-de-bintepeler', de: 'lydische-tumuli-von-bintepeler', ja: 'bintepeler-lydian-tumuli-ja' },
        name: { tr: 'Bintepeler Lidya Tümülüsleri', en: 'Bintepeler Lydian Tumuli', fr: 'Tumulus Lydiens de Bintepeler', de: 'Lydische Tumuli von Bintepeler', ja: 'ビンテペレル・リディアの墳丘墓' },
        description: { tr: `Lidya soylularına ait antik tümülüsler.`, en: `Ancient tumuli belonging to Lydian nobles.`, fr: `Tumulus antiques appartenant aux nobles lydiens.`, de: `Antike Tumuli des lydischen Adels.`, ja: `リディア貴族の古代墳丘墓。` },
        category: 'history',
        coordinates: { lat: 38.579235811237744, lng: 28.007434965748573 },
        imageUrl: 'https://i.imgur.com/2zhSlFd.jpeg',
        imageHint: 'ancient hills'
    },
    {
        id: '12',
        slug: { tr: 'gymnasium', en: 'gymnasium', fr: 'gymnase', de: 'gymnasium', ja: 'gymnasium-ja' },
        name: { tr: 'Gymnasium', en: 'Gymnasium', fr: 'Gymnase', de: 'Gymnasium', ja: 'ギムナジウム' },
        description: { tr: `Antik çağın eğitim ve spor merkezi.`, en: `Ancient center for education and sports.`, fr: `Centre antique d'éducation et de sport.`, de: `Antikes Zentrum für Bildung und Sport.`, ja: `古代の教育とスポーツの中心地。` },
        category: 'history',
        coordinates: { lat: 38.48848035921838, lng: 28.040289089766958 },
        imageUrl: 'https://i.imgur.com/l2YJCmK.jpeg',
        imageHint: 'ancient gymnasium',
        subPoints: [
            {
                id: 'synagogue-1',
                name: {
                    tr: 'Sinagog (Havra)',
                    en: 'Synagogue',
                    fr: 'Synagogue',
                    de: 'Synagoge',
                    ja: 'シナゴーグ（会堂）'
                },
                coordinates: { lat: 38.488307, lng: 28.040346 },
                description: {
                    tr: `Abidevi havra, Geç Roma döneminde, Musevi toplumunun dini merkezi olarak kullanılmaktaydı. 1962 yılında ortaya çıkarılan bina ve süslemeler kısmen restore edilmiştir. Bin kişiyi barındırabilecek büyüklükte ve uzunluğu 50 metreyi aşkın ana toplantı salonu yer almaktadır. Yerden 14 metre yükseklikteki çatı masif taş payelerle desteklenmiştir. Bina, birkaç kere yenilenmiştir. Önceleri, Roma Hamam-Gymnasium Kompleksinin bir parçası iken, daha sonraları, Musevi toplumunun ibadethanesi haline dönüşmüştür. Mozaik yer döşemeleri, mefruşatı ve mermer duvar bezemeleri, değişik zamanlarda yapılmıştır; ancak bugün mevcut olanlar ise MS 4. ve 5. yüzyıldan kalanlardır. Havra, yedinci yüzyılın başlarında, Batı Anadolu’da yaygın görülen akımın etkisiyle terk edilmiştir.`,
                    en: `The monumental synagogue was used as the religious center of the Jewish community in the Late Roman period. Excavated in 1962, the building and its decorations have been partially restored. It features a main assembly hall large enough to accommodate a thousand people, exceeding 50 meters in length. The roof, 14 meters above the ground, was supported by massive stone pillars. The building was renovated several times. Initially part of the Roman Bath-Gymnasium Complex, it later became a place of worship for the Jewish community. Mosaic floors, furnishings, and marble wall decorations were made at different times; however, those existing today date from the 4th and 5th centuries AD. The synagogue was abandoned in the early seventh century due to the influence of widespread movements in Western Anatolia.`,
                    fr: `Cette synagogue monumentale servait de centre religieux à la communauté juive à la fin de l'époque romaine. Découvert en 1962, le bâtiment et ses décorations ont été partiellement restaurés. Il comprend une salle de réunion principale pouvant accueillir mille personnes et mesurant plus de 50 mètres de long. Le toit, situé à 14 mètres du sol, était soutenu par d'énormes piliers en pierre. Le bâtiment a été rénové à plusieurs reprises. Initialement partie intégrante du complexe thermal-gymnase romain, il est devenu plus tard un lieu de culte pour la communauté juive. Les sols en mosaïque, le mobilier et les décorations murales en marbre ont été réalisés à différentes époques ; cependant, les vestiges actuels datent des IVe et Ve siècles de notre ère. La synagogue fut abandonnée au début du VIIe siècle, sous l'influence des courants alors répandus en Anatolie occidentale.`,
                    de: `Die monumentale Synagoge diente in der spätrömischen Zeit als religiöses Zentrum der jüdischen Gemeinde. Das 1962 freigelegte Gebäude und sein Schmuck wurden teilweise restauriert. Es verfügt über eine Hauptversammlungshalle, die groß genug für tausend Personen ist und eine Länge von über 50 Metern aufweist. Das Dach in 14 Metern Höhe wurde von massiven Steinpfeilern getragen. Das Gebäude wurde mehrmals renoviert. Ursprünglich Teil des römischen Bad-Gymnasium-Komplexes, wurde es später zum Gotteshaus der jüdischen Gemeinde. Mosaikböden, Einrichtungsgegenstände und marmorne Wanddekorationen entstanden zu verschiedenen Zeiten; die heute sichtbaren stammen jedoch aus dem 4. und 5. Jahrhundert n. Chr. Die Synagoge wurde zu Beginn des siebten Jahrhunderts aufgegeben, beeinflusst durch Strömungen, die in Westanatolien verbreitet waren.`,
                    ja: `この記念碑的なシナゴーグは、後期ローマ時代にユダヤ人コミュニティの宗教的中心地として使用されていました。1962年に発掘された建物と装飾は、部分的に復元されています。1000人を収容できる大きさで、長さ50メートルを超えるメインの集会ホールがあります。地上14メートルの高さの屋根は、巨大な石の柱で支えられています。建物は数回改修されました。当初はローマの浴場・ギムナジウム・コンプレックスの一部でしたが、後にユダヤ人コミュニティの礼拝所となりました。モザイクの床、家具、大理石の壁の装飾はさまざまな時期に作られましたが、現在残っているものは西暦4世紀から5世紀のものです。この会堂は、7世紀初頭に西アナトリアで広まった潮流の影響により、放棄されました。`
                }
            }
        ]
    },
    {
        id: '13',
        slug: { tr: 'artemis-tapinagi', en: 'temple-of-artemis', fr: 'temple-artemis', de: 'artemis-tempel', ja: 'temple-of-artemis-ja' },
        name: { tr: 'Artemis Tapınağı', en: 'Temple of Artemis', fr: 'Temple d\'Artémis', de: 'Artemis-Tempel', ja: 'アルテミス神殿' },
        description: { tr: `Antik dünyada inşa edilmiş en büyük tapınaklardan biridir.`, en: `One of the largest temples built in the ancient world.`, fr: `L'un des plus grands temples du monde antique.`, de: `Einer der größten Tempel der antiken Welt.`, ja: `古代世界で建てられた最大の神殿の一つ。` },
        category: 'history',
        coordinates: { lat: 38.479498365864494, lng: 28.03118038595177 },
        imageUrl: 'https://i.imgur.com/d2RoArI.jpeg',
        imageHint: 'ancient temple'
    },
    {
        id: '15',
        slug: { tr: 'kisik-deresi-antik-tas-ocaklari', en: 'kisik-creek-ancient-quarries', fr: 'carrieres-antiques-du-ruisseau-kisik', de: 'antike-steinbruche-am-kisik-bach', ja: 'kisik-creek-ancient-quarries-ja' },
        name: { tr: 'Kısık Deresi Antik Taş Ocakları', en: 'Kısık Creek Ancient Quarries', fr: 'Carrières Antiques du Ruisseau Kısık', de: 'Antike Steinbrüche am Kısık-Bach', ja: 'クシュク・クリーク古代採石場' },
        description: { tr: `Sardes'in taş ihtiyacını karşılayan antik mermer ocakları.`, en: `Ancient marble quarries that provided stone for Sardis.`, fr: `Carrières de marbre antiques pour Sardes.`, de: `Antike Marmorbrüche für Sardes.`, ja: `サルディスに石材を供給した古代の採石場。` },
        category: 'history',
        coordinates: { lat: 38.45680901086971, lng: 28.016172179836534 },
        imageUrl: 'https://i.imgur.com/NNREyvf.jpeg',
        imageHint: 'marble quarry'
    },
    {
        id: '16',
        slug: { tr: 'gokeyup-comlekciligi', en: 'gokeyup-pottery', fr: 'poterie-de-gokeyup', de: 'goekeyup-toepferei', ja: 'gokeyup-pottery-ja' },
        name: { tr: 'Gökeyüp Çömlekçiliği', en: 'Gökeyüp Pottery', fr: 'Poterie de Gökeyüp', de: 'Töpferei in Gökeyüp', ja: 'ギョケユップ陶器' },
        description: { tr: `Binlerce yıllık yöntemlerle sürdürülen geleneksel çömlekçilik.`, en: `Traditional pottery maintained with thousand-year-old methods.`, fr: `Poterie traditionnelle millénaire.`, de: `Traditionelle Töpferei mit alten Methoden.`, ja: `千年前からの技法を守る伝統陶器。` },
        category: 'shopping',
        coordinates: { lat: 38.6918318507784, lng: 28.281361601505868 },
        imageUrl: 'https://i.imgur.com/OwqFeZh.jpeg',
        imageHint: 'pottery workshop'
    },
    {
        id: '17',
        slug: { tr: 'kemer-koyu', en: 'kemer-village', fr: 'village-de-kemer', de: 'kemer-dorf', ja: 'kemer-village-ja' },
        name: { tr: 'Kemer Köyü', en: 'Kemer Village', fr: 'Village de Kemer', de: 'Kemer Dorf', ja: 'ケメル村' },
        description: { tr: `Tarihi dokusunu koruyan önemli bir ticaret merkezi.`, en: `An important trade center preserving its historical texture.`, fr: `Centre de commerce historique préservé.`, de: `Historisches Handelszentrum.`, ja: `歴史的な風情を残す貿易の拠点。` },
        category: 'history',
        coordinates: { lat: 38.68798840823775, lng: 28.14369833471573 },
        imageUrl: 'https://i.imgur.com/NmkLLQV.jpeg',
        imageHint: 'stone bridge'
    }
];
