
import type { Place } from '@/lib/definitions';

export const places: Place[] = [
    {
        id: '1',
        slug: { 
            tr: 'sardes-antik-kenti', 
            en: 'sardes-ancient-city',
            fr: 'cite-antique-de-sardes',
            de: 'antike-stadt-sardes',
            ja: 'sardes-ancient-city-ja'
        },
        name: { 
            tr: 'Sardes Antik Kenti', 
            en: 'Sardis Ancient City',
            fr: 'Cité Antique de Sardes',
            de: 'Antike Stadt Sardes',
            ja: 'サルディス古代都市'
        },
        description: { 
            tr: 'Lidya Krallığı\'nın görkemli başkenti Sardes, tarihin seyrini değiştiren birçok ilke ev sahipliği yapmıştır. M.Ö. 7. yüzyılda paranın ilk kez basıldığı yer olarak bilinen bu antik kent, zenginliği ve gücüyle antik dünyanın en önemli metropollerinden biriydi. Kent, devasa Artemis Tapınağı, restore edilmiş etkileyici Sinagog, Gymnasium ve Roma döneminden kalma dükkanlarıyla ziyaretçilerine adeta bir zaman yolculuğu sunar. Pactolus (Sart) Çayı\'nın altın taşıdığına inanılan bu topraklarda gezerken, Lidya\'nın zengin mirasını ve Roma\'nın ihtişamını bir arada hissedeceksiniz.',
            en: 'Sardis, the magnificent capital of the Lydian Kingdom, hosted many firsts that changed the course of history. Known as the first place where money was minted in the 7th century BC, this ancient city was one of the most important metropolises of the ancient world with its wealth and power. The city offers a journey through time with its huge Temple of Artemis, the impressively restored Synagogue, Gymnasium, and shops from the Roman period.',
            fr: 'Sardes, la magnifique capitale du royaume de Lydie, a été le théâtre de nombreuses premières qui ont changé le cours de l\'histoire. Connue pour être le premier lieu où la monnaie a été frappée au VIIe siècle avant J.-C., cette ville antique était l\'une des métropoles les plus importantes du monde antique.',
            de: 'Sardes, die prächtige Hauptstadt des Lydischen Königreichs, war Schauplatz vieler Neuerungen, die den Lauf der Geschichte veränderten. Bekannt als der erste Ort, an dem im 7. Jahrhundert v. Chr. Geld geprägt wurde.',
            ja: 'リディア王国の壮大な首都サルディスは、歴史の流れを変えた多くの史上初の出来事を主催しました。紀元前7世紀に初めて貨幣が鋳造された場所として知られるこの古代都市は、その富と力で古代世界で最も重要な大都市の1つでした。'
        },
        category: 'history',
        coordinates: { lat: 38.48848035921838, lng: 28.040289089766958 },
        imageUrl: 'https://i.imgur.com/KHKrcb5.png',
        imageHint: 'ancient ruins'
    },
    {
        id: '2',
        slug: { 
            tr: 'kursunlu-kaplicalari', 
            en: 'kursunlu-thermal-springs',
            fr: 'sources-thermales-de-kursunlu',
            de: 'thermalquellen-von-kursunlu',
            ja: 'kursunlu-thermal-springs-ja'
        },
        name: { 
            tr: 'Kurşunlu Kaplıcaları', 
            en: 'Kurşunlu Thermal Springs',
            fr: 'Sources Thermales de Kurşunlu',
            de: 'Thermalquellen von Kurşunlu',
            ja: 'クルシュンル温泉'
        },
        description: { 
            tr: 'Salihli\'nin doğal cennetlerinden biri olan Kurşunlu Kaplıcaları, yüzyıllardır şifa dağıtan termal sularıyla ünlüdür. Çam ormanları arasında, sakin ve huzurlu bir atmosferde yer alan bu kaplıcalar, romatizmal hastalıklardan cilt rahatsızlıklarına kadar birçok derde deva olduğuna inanılan mineralli sularıyla bilinir.',
            en: 'Kurşunlu Thermal Springs, one of the natural paradises of Salihli, is famous for its healing thermal waters that have been providing cures for centuries. Located in a calm and peaceful atmosphere among pine forests.',
            fr: 'Les sources thermales de Kurşunlu, l\'un des paradis naturels de Salihli, sont célèbres pour leurs eaux thermales curatives qui prodiguent des soins depuis des siècles.',
            de: 'Die Thermalquellen von Kurşunlu, eines der Naturparadiese von Salihli, sind berühmt für ihr heilendes Thermalwasser, das seit Jahrhunderten Heilung bringt.',
            ja: 'サリフリの自然の楽園の1つであるクルシュンル温泉は、何世紀にもわたって治癒を提供してきた癒しの温泉水で有名です。'
        },
        category: 'nature',
        coordinates: { lat: 38.448729326237775, lng: 28.11443981723854 },
        imageUrl: 'https://i.imgur.com/n7fioom.jpeg',
        imageHint: 'hot springs'
    },
    {
        id: '3',
        slug: { 
            tr: 'salihli-odun-kofte', 
            en: 'salihli-wood-meatballs',
            fr: 'boulettes-de-viande-au-feu-de-bois-de-salihli',
            de: 'salihli-holzfleischballchen',
            ja: 'salihli-wood-meatballs-ja'
        },
        name: { 
            tr: 'Salihli Odun Köftesi', 
            en: 'Salihli Wood Meatballs',
            fr: 'Boulettes de Viande au Feu de Bois de Salihli',
            de: 'Salihli Holz-Fleischbällchen',
            ja: 'サリフリウッドミートボール'
        },
        description: { 
            tr: 'Salihli denince akla gelen ilk lezzet olan meşhur odun köftesi, sadece bir yemek değil, aynı zamanda bir kültür mirasıdır. Meşe odunu ateşinde ağır ağır pişirilen bu köfte, özel baharat karışımı ve kaliteli etin mükemmel uyumuyla hazırlanır.',
            en: 'The famous wood meatballs, the first flavor that comes to mind when Salihli is mentioned, is not just a dish, but also a cultural heritage. Cooked slowly over oak wood fire.',
            fr: 'Les célèbres boulettes de viande au feu de bois, la première saveur qui vient à l\'esprit quand on mentionne Salihli, ne sont pas seulement un plat, mais aussi un héritage culturel.',
            de: 'Die berühmten Holz-Fleischbällchen, der erste Geschmack, der einem bei der Erwähnung von Salihli in den Sinn kommt, sind nicht nur ein Gericht, sondern auch ein Kulturerbe.',
            ja: 'サリフリといえば最初に思い浮かぶ有名なウッドミートボールは、単なる料理ではなく、文化遺産でもあります。'
        },
        category: 'food',
        coordinates: { lat: 38.4833, lng: 28.1333 },
        imageUrl: 'https://i.imgur.com/IT6VuDV.jpeg',
        imageHint: 'grilled meatballs'
    },
    {
        id: '5',
        slug: { 
            tr: 'salihli-kent-muzesi', 
            en: 'salihli-city-museum',
            fr: 'musee-de-la-ville-de-salihli',
            de: 'stadtmuseum-salihli',
            ja: 'salihli-city-museum-ja'
        },
        name: { 
            tr: 'Salihli Kent Müzesi', 
            en: 'Salihli City Museum',
            fr: 'Musée de la Ville de Salihli',
            de: 'Stadtmuseum Salihli',
            ja: 'サリフリ市立博物館'
        },
        description: { 
            tr: 'Tarihi bir konakta hizmet veren Salihli Kent Müzesi, şehrin zengin sosyal, kültürel ve ekonomik geçmişine ışık tutar. Müzede, geleneksel yaşam tarzını yansıtan etnografik eserler, tarım aletleri, eski fotoğraflar ve belgeler sergilenmektedir.',
            en: 'Serving in a historical mansion, the Salihli City Museum sheds light on the rich social, cultural, and economic past of the city.',
            fr: 'Installé dans un manoir historique, le musée de la ville de Salihli met en lumière le riche passé social, culturel et économique de la ville.',
            de: 'Das Stadtmuseum Salihli, das in einem historischen Herrenhaus untergebracht ist, beleuchtet die reiche soziale, kulturelle und wirtschaftliche Vergangenheit der Stadt.',
            ja: '歴史的な邸宅で提供されるサリフリ市立博物館は、市の豊かな社会的、文化的、経済的な過去に光を当てます。'
        },
        category: 'history',
        coordinates: { lat: 38.48235578263535, lng: 28.1309880487272 },
        imageUrl: 'https://i.imgur.com/IauiziR.jpeg',
        imageHint: 'city museum'
    },
    {
        id: '6',
        slug: { 
            tr: 'tabak-deresi-dev-kazanlari', 
            en: 'tabak-creek-giant-cauldrons',
            fr: 'chaudrons-geants-du-ruisseau-tabak',
            de: 'riesenkessel-am-tabak-bach',
            ja: 'tabak-creek-giant-cauldrons-ja'
        },
        name: { 
            tr: 'Tabak Deresi Dev Kazanları', 
            en: 'Tabak Creek Giant Cauldrons',
            fr: 'Chaudrons Géants du Ruisseau Tabak',
            de: 'Riesenkessel am Tabak-Bach',
            ja: 'タバッククリークの巨大な大釜'
        },
        description: { 
            tr: 'Efsaneye göre, Kral Midas\'ın her dokunduğunu altına çevirme lanetinden kurtulduğu yer olan Paktalos (Sart) Çayı\'nın bir kolu olan Tabak Deresi, ilginç jeolojik oluşumlara ev sahipliği yapar. "Dev Kazanları" olarak bilinen bu çukurlar, suyun kayaları binlerce yılda aşındırmasıyla oluşmuş doğal havuzlardır.',
            en: 'According to legend, Tabak Creek, a branch of the Pactolus (Sart) River where King Midas was freed from the curse of turning everything he touched into gold, is home to interesting geological formations.',
            fr: 'Selon la légende, le ruisseau Tabak, une branche de la rivière Pactole (Sart) où le roi Midas fut libéré de la malédiction de transformer tout ce qu\'il touchait en or.',
            de: 'Der Legende nach ist der Tabak-Bach, ein Nebenarm des Flusses Paktolos (Sart), an dem König Midas vom Fluch befreit wurde, alles, was er berührte, in Gold zu verwandeln, die Heimat interessanter geologischer Formationen.',
            ja: '伝説によると、ミダス王が触れるものすべてを金に変える呪いから解放されたパクトロス川の支流であるタバッククリークは、興味深い地質学的形成物の本拠地です。'
        },
        category: 'nature',
        coordinates: { lat: 38.458250364806744, lng: 28.044546435772286 },
        imageUrl: 'https://i.imgur.com/KHKrcb5.png', // Note: User said id 6 used this link in history
        imageHint: 'river rocks'
    },
    {
        id: '7',
        slug: {
            tr: 'adala-volkanik-kanyonu',
            en: 'adala-volcanic-canyon',
            fr: 'canyon-volcanique-adala',
            de: 'vulkanischer-canyon-adala',
            ja: 'adala-volcanic-canyon-ja'
        },
        name: {
            tr: 'Adala Volkanik Kanyonu',
            en: 'Adala Volcanic Canyon',
            fr: 'Canyon Volcanique d\'Adala',
            de: 'Vulkanischer Canyon von Adala',
            ja: 'アダラ火山渓谷'
        },
        description: {
            tr: "Jeoparkın üçüncü evre volkanlarından Kula, Sandal ve Kaplan Divitleri Kuzeybatı–Güneydoğu istikametinde uzanan bir kırık hattı boyunca yaklaşık 9 km aralıklarla dizilirler. Şist sırtları ile ardalanmış alüvyon düzlükleri üzerinde yükselen bu ufak yanardağların çevresindeki parazit koniler ve çatlaklardan 12 bin yıl öncelerde püsküren çok sıcak ve çok akışkan bazalt lavları (leçeler) vadiler ve akarsu yataklarını doldurup kilometrelerce yayılarak araziyi kaplamıştır. Adala (Hermos) Kanyonunun oluşum öyküsü işte bu dönemde Kaplan Divliti ve önündeki küçük koniden fışkırarak bir ateş seli gibi yayılan erimiş kayaç ve minerallerle başladı. Lavlar Gediz'e bağlanan bir vadi boyunca 12,5 km akıp Gediz Vadisini de 4 km kadar doldurarak ırmağın akıntısını kesintiye uğrattıktan sonra vadinin üst kesimindeki ovanın yüzeyine kadar yayıledılar. Bu lav setinin arkasında biriken Gediz ırmağı, sert bazalt kitlelerini yarıp geçemedi ama onların hemen yanındaki metamorfik ve tortul kayaçları oyup kendisine giderek derinleşen yeni bir yatak açarak Adala Kanyonu'nu oluşturdu.",
            en: "Kula, Sandal, and Kaplan Divitler, third-stage volcanoes of the Geopark, are lined up at intervals of approximately 9 km along a fault line extending in a Northwest-Southeast direction. Very hot and fluid basalt lavas erupted from parasite cones and fissures around these small volcanoes rising on alluvial plains alternated with schist ridges about 12,000 years ago, filling valleys and stream beds and spreading for kilometers. The formation story of the Adala (Hermos) Canyon began in this period with molten rocks and minerals spreading like a flood of fire, gushing from the Kaplan Divliti. The lavas flowed 12.5 km along a valley connected to the Gediz and filled the Gediz Valley by about 4 km, interrupting the river's flow and spreading to the surface of the plain in the upper part of the valley. The Gediz River, accumulating behind this lava barrier, could not breach the hard basalt masses but carved out the metamorphic and sedimentary rocks right next to them, opening a new bed that gradually deepened, thus forming the Adala Canyon.",
            fr: "Les volcans de la troisième phase du Géoparc, Kula, Sandal et Kaplan Divitler, sont alignés à environ 9 km d'intervalle le long d'une ligne de faille s'étendant du nord-ouest au sud-est. Des laves basaltiques très chaudes et fluides ont jailli des cônes parasites il y a environ 12 000 ans, remplissant les vallées et les lits des rivières. L'histoire de la formation du canyon d'Adala (Hermos) a commencé à cette époque avec des roches et des minéraux en fusion jaillissant du Kaplan Divliti. Les laves ont coulé sur 12,5 km, remplissant la vallée du Gediz sur 4 km et interrompant le cours de la rivière. Le fleuve Gediz, s'accumulant derrière ce barrage de lave, a creusé les roches métamorphiques et sédimentaires adjacentes, ouvrant un nouveau lit qui s'est progressivement approfondi, formant ainsi le canyon d'Adala.",
            de: "Kula, Sandal und Kaplan Divitler, Vulkane der dritten Phase des Geoparks, sind in Abständen von etwa 9 km entlang einer Verwerfungslinie aufgereiht. Sehr heiße und flüssige Basaltlaven brachen vor etwa 12.000 Jahren aus Parasitärkegeln und Spalten aus und füllten Täler und Flussbetten. Die Entstehungsgeschichte des Adala (Hermos) Canyons begann in dieser Zeit mit geschmolzenem Gestein, das aus dem Kaplan Divliti hervorbrach. Die Laven flossen 12,5 km weit und füllten das Gediz-Tal auf einer Länge von 4 km aus, wodurch der Flusslauf unterbrochen wurde. Der Gediz-Fluss staute sich hinter dieser Lavabarriere an und grub sich in das angrenzende metamorphe und sedimentäre Gestein ein, wodurch ein neues, tieferes Bett entstand, das heute den Adala-Canyon bildet.",
            ja: "ジオパークの第3段階の火山であるクラ、サンダル、カプラン・ディヴィトレルは、北西から南東に延びる断層線に沿って約9kmの間隔で並んでいます。約1万2千年前、玄武岩溶岩が、谷や河床を埋め尽くし、数キロメートルにわたって広がりました。アダラ（ヘルメス）渓谷の形成物語は、この時期にカプラン・ディヴィティから噴き出した溶岩の流れから始まりました。溶岩はゲディズ川につながる谷に沿って12.5km流れ、ゲディズ渓谷を4kmほど埋めて川の流れを遮断しました。この溶岩堤の背後に蓄積したゲディズ川は、硬い玄武岩の塊を突き抜けることはできませんでしたが、そのすぐ隣の変成岩や堆積岩を削り取り、徐々に深くなる新しい川床を開き、アダラ渓谷を形成しました。"
        },
        category: 'nature',
        coordinates: { lat: 38.581712325205984, lng: 28.271791613037774 },
        imageUrl: 'https://i.imgur.com/I6L6rHm.jpeg',
        imageHint: 'volcanic canyon'
    },
    {
        id: '8',
        slug: {
            tr: 'adala-ataturk-evi',
            en: 'adala-ataturk-house',
            fr: 'maison-ataturk-adala',
            de: 'adala-ataturk-haus',
            ja: 'adala-ataturk-house-ja'
        },
        name: {
            tr: 'Adala Atatürk Evi',
            en: 'Adala Atatürk House',
            fr: 'Maison Atatürk d\'Adala',
            de: 'Adala Atatürk-Haus',
            ja: 'アダラアタテュルクハウス'
        },
        description: {
            tr: 'Kurtuluş Savaşı sırasında Mustafa Kemal Atatürk\'ün bir süre konakladığı bu ev, restore edilerek müzeye dönüştürülmüştür. O döneme ait eşyalar ve belgelerle tarihi bir yolculuğa çıkın.',
            en: 'This house, where Mustafa Kemal Atatürk stayed for a while during the War of Independence, has been restored and turned into a museum.',
            fr: 'Cette maison, où Mustafa Kemal Atatürk a séjourné pendant un certain temps pendant la guerre d\'indépendance, a été restaurée et transformée en musée.',
            de: 'Dieses Haus, in dem Mustafa Kemal Atatürk während des Unabhängigkeitskrieges eine Zeit lang wohnte, wurde restauriert und in ein Museum umgewandelt.',
            ja: '独立戦争中にムスタファ・ケマル・アタテュルクがしばらく滞在したこの家は、修復されて博物館になりました。'
        },
        category: 'history',
        coordinates: { lat: 38.57849271604208, lng: 28.270398205456143 },
        imageUrl: 'https://i.imgur.com/vfBy0dj.jpeg',
        imageHint: 'historic house'
    },
    {
        id: '9',
        slug: {
            tr: 'suuctu-selalesi',
            en: 'suuctu-waterfall',
            fr: 'cascade-suuctu',
            de: 'suuctu-wasserfall',
            ja: 'suuctu-waterfall-ja'
        },
        name: {
            tr: 'Suuçtu Şelalesi',
            en: 'Suuçtu Waterfall',
            fr: 'Cascade de Suuçtu',
            de: 'Suuçtu Wasserfall',
            ja: 'スーチュ滝'
        },
        description: {
            tr: 'Kız Köprüsü\'nün altından akan suyu her iki kıyısından batıya doğru 2 Km. kadar takip ettiğinizde bir doğa harikası olan Su Uçtu Şelalesi\'ne ulaşırsınız. "Su Uçtu" aslında suları yüksekten dökülen tüm şelaleler için kullanılan bir deyim ama zengin bir çeşitliliğe sahip ağaç ve bitki örtüsü ile kaplı dar bir boğazdan 25 metre aşağıdaki Adala Kanyonu\'na dökülen şelale bu deyimi özel bir ad olarak taşımayı fazlası ile hak ediyor. Şelale\'nin diğer bir özelliği de jeoparkın diğer pek çok arazi şekli gibi volkanizmanın lavları ile önü kapanan Gediz\'in araziyi aşındırıp oyarak akıntısına yatak açmasının bir sonucu olması. Bir zamanların coşkun akışlı ırmağı Demirköprü Barajı\'nın bendi ile dizginlendikten sonra Şelale\'nin debisi azalıp gücü zayıfladı ancak uğultulu bir çağıltı ile dökülen sularından sıçrayan zerreciklerin yarattığı nemli serinlikte Adala Kanyonu\'na yüksekten baktığınızda, onun bir zamanlar ki gücünü kavrayabilirsiniz.',
            en: 'Following the water flowing under the Maiden\'s Bridge about 2 km westward, you reach Suuçtu Waterfall. "Su Uçtu" (Water Flew) is a term used for waterfalls pouring from high, but this 25-meter drop into Adala Canyon through lush vegetation truly deserves the name. Formed by the Gediz River carving its path after being blocked by lava, its flow decreased after the Demirköprü Dam, but its historical power is still palpable in its misty breeze.',
            fr: 'En suivant l\'eau qui coule sous le Pont des Demoiselles sur environ 2 km vers l\'ouest, vous atteignez la cascade de Suuçtu. "Su Uçtu" est un terme pour les chutes d\'eau, mais celle-ci, tombant de 25 mètres dans le canyon d\'Adala à travers une végétation luxuriante, mérite amplement son nom. Formée par l\'érosion du Gediz après un blocage par la lave, son débit a diminué avec le barrage de Demirköprü, mais sa force passée reste perceptible dans sa fraîcheur humide.',
            de: 'Wenn man dem Wasser, das unter der Jungfrauenbrücke fließt, etwa 2 km nach Westen folgt, erreicht man den Suuçtu-Wasserfall. "Su Uçtu" ist ein Begriff für hohe Wasserfälle, aber dieser, der aus 25 Metern Höhe durch dichte Vegetation in den Adala-Canyon stürzt, verdient den Namen als Eigennamen. Er entstand, als der durch Lava blockierte Gediz sich ein neues Bett grub. Nach dem Bau der Demirköprü-Talsperre nahm die Wassermenge ab, doch die einstige Kraft ist in der feuchten Kühle noch immer spürbar.',
            ja: '乙女の橋（クズ・キョプリュス）の下を流れる水を西に約2kmたどると、自然の驚異であるスーチュ滝に到着します。「スーチュ」とは高い場所から流れ落ちる滝を指す言葉ですが、緑豊かな植物に覆われた狭い峡谷から25メートル下のアダラ渓谷に流れ落ちるこの滝は、その名を冠するにふsわしい場所です。溶岩によって遮られたゲディズ川が土地を浸食して形成されました。流量は減りましたが、かつての力強さを感じることができます。'
        },
        category: 'nature',
        coordinates: { lat: 38.603174968474164, lng: 28.287310874314443 },
        imageUrl: 'https://i.imgur.com/B2DiIdP.jpeg',
        imageHint: 'waterfall nature'
    },
    {
        id: '10',
        slug: {
            tr: 'kiz-koprusu',
            en: 'kiz-koprusu-maidens-bridge',
            fr: 'pont-des-demoiselles-kiz-koprusu',
            de: 'jungfrauenbrucke-kiz-koprusu',
            ja: 'kiz-koprusu-maidens-bridge-ja'
        },
        name: {
            tr: 'Kız Köprüsü',
            en: 'Kız Köprüsü (Maiden\'s Bridge)',
            fr: 'Pont des Demoiselles (Kız Köprüsü)',
            de: 'Jungfrauenbrücke (Kız Köprüsü)',
            ja: 'クズ・キョプリュス（乙女の橋）'
        },
        description: {
            tr: 'Adala – Demirköprü Barajı Arasındaki yolun 3. Kilometresinde inşa edilen 97.5 metre uzunluktaki bu büyük ve zarif taş köprü, tasarımındaki mükemmellikler nedeniyle günümüze sapasağlam gelebilmiştir. Yuvarlak kemerli altı ayak üzerinde yükselen köprü, Osmanlı\'nın ilk dönemlerine tarihlenmektedir. Rivayete göre Lidyalılar döneminde Krezüs\'ün kızına ait olduğu için bu adı almıştır. Yüzyıllarca kervan yollarının kavşak noktası olmuştur.',
            en: 'Located near the Demirköprü Dam, this elegant 97.5-meter stone bridge spans the narrowest point of the Gediz Valley. Built on solid rock, its architectural perfection has kept it intact. It features six rounded arches. While legends link it to the daughter of King Croesus, experts date it to the early Ottoman period. It was a vital crossroads for centuries.',
            fr: 'Situé près du barrage de Demirköprü, cet élégant pont en pierre de 97,5 mètres enjambe le point le plus étroit de la vallée du Gediz. Construit sur du rocher solide, sa perfection architecturale l\'a préservé. Il possède six arches circulaires. Si la légende le lie à la fille du roi Crésus, les experts le datent du début de la période ottomane.',
            de: 'Diese elegante, 97,5 Meter lange Steinbrücke liegt in der Nähe der Demirköprü-Talsperre am engsten Punkt des Gediz-Tals. Dank ihrer soliden Bauweise auf Felsgrund ist sie bis heute gut erhalten. Sie hat sechs Rundbögen. Während Legenden sie mit der Tochter von König Krösus verbinden, datieren Experten sie in die frühe osmanische Zeit.',
            ja: 'デミルキョプリュダムの近くに位置する、全長97.5メートルの優雅な石橋です。強固な岩盤の上に建てられたこの橋は、その建築的な完璧さゆえに今日まで無傷で残っています。6つの円形アーチがあり、伝説ではリディアのクロイソス王の娘にちなんで「乙女の橋」と呼ばれていますが、専門家はオスマン帝国初期のものと考えています。'
        },
        category: 'history',
        coordinates: { lat: 38.610014244679405, lng: 28.298125541176937 },
        imageUrl: 'https://i.imgur.com/PKqOBtx.jpeg',
        imageHint: 'stone bridge'
    },
    {
        id: '11',
        slug: {
            tr: 'bintepeler-lidya-tumulusleri',
            en: 'bintepeler-lydian-tumuli',
            fr: 'tumulus-lydiens-de-bintepeler',
            de: 'lydische-tumuli-von-bintepeler',
            ja: 'bintepeler-lydian-tumuli-ja'
        },
        name: {
            tr: 'Bintepeler Lidya Tümülüsleri',
            en: 'Bintepeler Lydian Tumuli',
            fr: 'Tumulus Lydiens de Bintepeler',
            de: 'Lydische Tumuli von Bintepeler',
            ja: 'ビンテペレル・リディアの墳丘墓'
        },
        description: {
            tr: `Salihli-Akhisar yolu üzerinde Bintepe adıyla tanınan kral mezarları yer almaktadır. Antik Sardes Kenti ile Marmara Gölü arasında yer alan bölgeye yayılmış, sayıları 119 olan bu tümülüs (dolgu toprak) mezarlar Lidyalı soylulara aittir. Ait oldukları kişinin sosyal durumuna göre büyüklüğü, küçüklüğü değişkenlik gösteren mezarların en büyük üç tanesinin Lydia’nın ünlü krallarından Giges, Alyettes ve Kral Ardys’e ait olduğu söylenmektedir. Antik çağda bile ünlü olan Heradot’un Mısır piramitlerine benzettiği tümülüsün en büyüğünün Kral Alyattes'e ait olduğu bilinmektedir. Bintepeler Unesco Geçici Dünya Mirasları listesinde yer almaktadır. Bintepeler, jeomorfolojik yapı ve görünümün insan eliyle değiştirilmesine örnek olması açısından oldukça önemli yere sahiptir. Sardeis’in kuzeyinde yer alan Bin Tepe’deki Tümülüs mezarları, Lidya’nın antik dönemdeki en göze çarpan nirengi noktası olup, çok uzaklardan görünür ve bulunduğu alanı olağan dışı bir sihir ile işaretler. Bin Tepe Türkiye’deki en geniş mezarlık alanıdır, belki de dünyadaki en büyük mezarlık alanı kaplar. 1940’lı yıllarda en az 149 tane tümülüs mevcut iken, bunların çoğu tarımsal faaliyetler sonucu harap edildiğinden günümüze kadar ancak 115 - 119 tümülüs korunagelmiştir. Fevkalade bir güzelliğe sahip, akıldan çıkmayan bir manzaradır. Giza'daki üç piramit gibi, Bintepeler’de yer alan üç anıtsal nitelikli tümülüsten biri Karnıyarık Tepe’dir. 230 metrelik çapıyla ve güney kısmındaki 53 metrelik yüksekliğiyle kapladığı alan Giza’nın Büyük Piramidi Keops’la hemen hemen aynı çaptadır. Alyattes tümülüsü antik dönemde açılmış olduğundan, Sart Amerikan Hafriyat Heyeti, 1962 yılında, arkeolojik çalışmaların bir parçası olarak, Karnıyarık Tepe’de çalışma yapmayı uygun görmüştür. 1962 ve 1963 yıllarında yapılan jeofizik araştırmalarından ve sondaj çalışmalarından sonra, 1964, 1965 ve 1966 yıllarında tümülüsün içerisi tüneller kazılarak araştırılmıştır. 1992 yılında daha kapsamlı jeofizik araştırmaları yapılmış, bunu 1995 yılında yapılan sondaj çalışmaları takip etmiştir. 2011 yılında başka bir jeofizik çalışması yapılmış ve 2012 yılında Manisa Müzesi ile ortaklaşa tünel çalışmalarına yeniden başlanmıştır. Tahminimize göre, toprakla geri doldurulan Roma tünelleri, mezar odasına ulaşamayan hatlardır. Bunun sebebi de geri doldurmanın diğer tünellerden çıkan toprakla yapılmış olmasıdır. Tümülüsteki büyük yarık (“Karnıyarık”) da orijinal taban seviyesine inecek kadar kazılmamıştır. Gerek Roma tünelleri, gerek bizim açtığımız tüneller, tümülüsün merkezine kadar uzanmaktadırlar ve bu alanda ve çevresinde mezar odasının yerini tespit etme amacıyla araştırmalar yapılmıştır. Bu tüneller, tümülüsün yapımı ile ilgili önemli bilgiler vermektedirler. Ancak yarım kilometreden daha fazla uzunlukta tüneller açılmasına rağmen, henüz mezar odasının yeri tespit edilememiştir.
            Karnıyarık tepe de denilen ve şimdiye kadar bildiğimiz Gyges tümülüsü hakkında yeni bir görüş daha vardır. Yeni çalışmalar, tümülüsün milattan önce 600 yıllarından öncesine tarihlenemeyeceğini göstermektedir. Gyges M.O. 644 yıllarında öldüğüne göre, bu onun mezarı olamaz. Bu mezar için olası en erken tarih olan M.Ö 600 ile, Lidyalıların, Persler tarafından mağlup edildikleri ve bundan dolayı muhtemelen anıtsal mezar inşa edemeyecekleri M.O 547 yılları arasında sadece iki Lidya kralı vardır: Alyattes ve Kroisos. Alyattes’in mezarı kesin olarak Bin Tepe’nin en büyük tümülüs olan Koca Mutaf Tepe’dir ve Kroisos de Persler tarafından götürülüp, Kyros’un (Büyük Keyhüsrev) güvenilir danışmanı ilan edilmiştir, olasılıkla da kraliyet tümülüsüne defnedilmemiştir. Eğer kral için değilse, bu bir kraliçe için olabilir mi? Ana tanrıçanın doğduğu Anadolu’da bu mümkün olabilir.`,
            en: `Bintepeler: Royal tombs known as Bintepe are located on the Salihli-Akhisar road. These 119 tumulus tombs belong to Lydian nobles. The three largest are said to belong to famous kings: Gyges, Alyattes, and King Ardys. Herodotus compared the largest, belonging to Alyattes, to the Egyptian pyramids. Bintepeler is on the UNESCO Tentative World Heritage list. These burial mounds are the most striking landmark of ancient Lydia, marking the area with extraordinary magic. Like the pyramids at Giza, Karnıyarık Tepe is nearly the same size as Cheops. Despite extensive excavations since 1962, the burial chamber remains elusive. New studies suggest Karnıyarık Tepe cannot date before 600 BC, making its original attribution to Gyges unlikely. It might even belong to a Lydian queen.`,
            fr: `Bintepeler : Les tombes royales connues sous le nom de Bintepe se trouvent sur la route Salihli-Akhisar. Ces 119 tombes de type tumulus appartiennent à la noblesse lydienne. Les trois plus grandes appartiendraient aux célèbres rois : Gyès, Alyattès et Ardys. Hérodote comparait le plus grand tumulus aux pyramides d'Égypte. Bintepeler est inscrit sur la liste indicative de l'UNESCO. Ces tumuli sont le point de repère le plus frappant de la Lydie antique. Karnıyarık Tepe couvre presque la même surface que la pyramide de Khéops. Malgré des fouilles approfondies depuis 1962, la chambre funéraire n'a pas été trouvée. De nouvelles théories suggèrent qu'il pourrait s'agir de la tombe d'une reine lydienne.`,
            de: `Bintepeler: An der Straße Salihli-Akhisar befinden sich die als Bintepe bekannten Königsgräber. Diese 119 Hügelgräber gehören dem lydischen Adel. Die drei größten sollen den Königen Gyges, Alyattes und Ardys gehören. Herodot verglich den größten Hügel mit den ägyptischen Pyramiden. Bintepeler steht auf der UNESCO-Tentativliste. Diese Grabhügel sind das markanteste Wahrzeichen des antiken Lydiens. Der Karnıyarık Tepe hat fast die gleiche Grundfläche wie die Cheops-Pyramide. Trotz intensiver Forschung seit 1962 wurde die Grabkammer noch nicht entdeckt. Neuere Ansichten vermuten hier das Grab einer lydischen Königin.`,
            ja: `ビンテペレル：サリフリとアキサールの間の道路沿いには、ビンテペとして知られる王家の墓があります。これら119のテュムルス（墳丘墓）はリディアの貴族のものです。最大のものはアリュアッテス王のもので、ヘロドトスはエジプトのピラミッドに例えました。ユネスコの世界遺産暫定リストに含まれています。ギザのクフ王のピラミッドとほぼ同じ規模のカルヌヤルク・テペなどがあります。1962年以来の発掘調査にもかかわらず、埋葬室はまだ発見されていません。最新の説では、これが王ではなくリディアの女王の墓である可能性も示唆されています。`
        },
        category: 'history',
        coordinates: { lat: 38.579235811237744, lng: 28.007434965748573 },
        imageUrl: 'https://i.imgur.com/2zhSlFd.jpeg',
        imageHint: 'ancient hills'
    },
    {
        id: '12',
        slug: {
            tr: 'gymnasium',
            en: 'gymnasium',
            fr: 'gymnase',
            de: 'gymnasium',
            ja: 'gymnasium-ja'
        },
        name: {
            tr: 'Gymnasium',
            en: 'Gymnasium',
            fr: 'Gymnase',
            de: 'Gymnasium',
            ja: 'ギムナジウム'
        },
        description: {
            tr: `Gymnasium Lidya döneminden kalma olarak bilinir fakat Roma dönemine aittir. Burada Lidya dönemine ait herhangi bir kalıntı yoktur. Bundan yaklaşık 2000 yıl önce geçirdiği depremin ardından model olarak yapılmıştır. Septimius Severus bu yapıyı oğulları Geta ve Caracalla’ya bir de eşi Julia Domna’ya adamıştır. Gymnasium yaklaşık 25 dönüm üzerine kurulmuş bir alış veriş merkezi ve eğitim sahasıdır.

Hamam:
Roma İmparatorluğu’nun tamamına yayılmış̧ olan bir sosyal gelenek olan yıkanma, spor sonrası temizlik ve tedavi amaçlı kullanılırdı. Ayaklarını incitenlerin en üst kısımda, bacaklarını incitenlerin 2. Basamakta, tüm vücudunda ağrı olanların ise tamamen suya girdiği özel basamaklı bir yapısı vardı.

Tuvaletler (Latrin):
Aynı anda 24 kişiyi ağırlayabilen umumi tuvaletler, mermer zeminleri ve sürekli su akışıyla döneminin mühendislik harikasıydı. Burada memleket meseleleri konuşulur, gürültü dışarı çıkmasın diye bando takımları çalardı.

Dükkanlar:
34 adet Bizans dükkânı; restoran, boyahane ve cam eşya dükkanı olarak hizmet verirdi. Sivil halk ile dükkan sahiplerinin ortak kullanım alanıydı.

Sinagog (Havra):
Musevi toplumunun dini merkezi olan yapı, bin kişi kapasitesiyle antik dünyanın en büyük havralarından biridir. Ön avlusundaki mermer çeşme, ayinler öncesi temizlik için kullanılırdı.`,
            en: `The Gymnasium at Sardis belongs to the Roman period, built after an earthquake 2000 years ago. It was a massive complex for education, sports, and shopping. The Bath was used for social gathering and physical therapy. The Latrines were sophisticated public toilets where social and political issues were discussed. The site also includes 34 Byzantine shops and one of the largest ancient Synagogues ever discovered, serving as a major religious center for the Jewish community.`,
            fr: `Le Gymnase de Sardes date de l'époque romaine, construit après un séisme il y a 2000 ans. C'était un vaste complexe dédié à l'éducation, aux sports et au commerce. Il comprend des thermes pour l'hygiène et la thérapie, des latrines publiques sophistiquées pour les rencontres sociales, 34 boutiques byzantines et l'une des plus grandes synagogues antiques connues.`,
            de: `Das Gymnasium von Sardes stammt aus der römischen Epoche und wurde nach einem Erdbeben vor 2000 Jahren errichtet. Es war ein riesiger Komplex für Bildung, Sport und Handel. Es umfasst Thermen für Hygiene und Therapie, hochentwickelte öffentliche Latrinen für soziale Kontakte, 34 byzantinische Läden und eine der größten antiken Synagogen, die je entdeckt wurden.`,
            ja: `サルディスのギムナジウムはローマ時代のもので、2000年前の地震の後に建設されました。教育、スポーツ、ショッピングのための巨大な複合施設でした。浴場、社交の場でもあった洗練された公衆トイレ、34のビザンチン様式の店舗、そして古代世界最大級のシナゴーグ（会堂）が含まれています。`
        },
        category: 'history',
        coordinates: { lat: 38.48848035921838, lng: 28.040289089766958 },
        imageUrl: 'https://i.imgur.com/l2YJCmK.jpeg',
        imageHint: 'ancient gymnasium'
    },
    {
        id: '13',
        slug: {
            tr: 'artemis-tapinagi',
            en: 'temple-of-artemis',
            fr: 'temple-artemis',
            de: 'artemis-tempel',
            ja: 'temple-of-artemis-ja'
        },
        name: {
            tr: 'Artemis Tapınağı',
            en: 'Temple of Artemis',
            fr: 'Temple d\'Artémis',
            de: 'Artemis-Tempel',
            ja: 'アルテミス神殿'
        },
        description: {
            tr: `Artemis (Diana), vahşi doğa, avcılık ve ay tanrıçasıdır. Tapınak, dünyanın en büyük tapınaklarından biridir. Helenistik dönemde başlayan yapım süreci Roma döneminde de devam etmiştir. Tapınağın güney-doğu köşesinde MS 5. yüzyıldan kalma küçük bir kilise bulunur; Sardes, İncil'de adı geçen 7 kiliseden beşincisidir.

Sunak:
Lidya Kralı Kroisos tarafından MÖ 500'de başlatılan en eski bölümdür.

Senet Taşı:
Tapınaktaki bir yazıtta, rahibeden alınan borç ve teminatlar anlatılır; bu, tarihteki ilk bankacılık faaliyetlerinden biri olarak kabul edilir.

Sütunlar:
17,5 metre yüksekliğindeki devasa sütunların her bir parçası 4 tondur. Baş sütunda endemik bitkiler yerine yılan figürü bulunur.`,
            en: `The Temple of Artemis at Sardis is one of the largest in the world. Dedicated to the goddess of the wild and the moon, it spans Hellenistic and Roman periods. It features a 5th-century church, marking Sardis as one of the "Seven Churches of Revelation." Historical artifacts like the "Credit Stone" show early banking activities, and its massive 17.5-meter columns are architectural wonders.`,
            fr: `Le temple d'Artémis à Sardes est l'un des plus grands au monde. Dédié à la déesse de la chasse et de la lune, il traverse les périodes hellénistique et romaine. Il abrite une église du Ve siècle, faisant de Sardes l'une des "Sept Églises de l'Apocalypse". Des inscriptions témoignent d'activités bancaires précoces.`,
            de: `Der Artemis-Tempel in Sardes ist einer der größten der Welt. Er ist der Göttin der Jagd und des Mondes geweiht und stammt aus hellenistischer und römischer Zeit. Er enthält eine Kirche aus dem 5. Jh., da Sardes eine der "Sieben Gemeinden der Offenbarung" ist. Funde wie der "Schuldstein" belegen frühe Bankgeschäfte.`,
            ja: `サルディスのアルテミス神殿は世界最大級の規模を誇ります。狩猟と月の女神に捧げられたこの神殿は、ヘレニズム期からローマ期にかけて建設されました。5世紀の教会も併設されており、サルディスは「ヨハネの黙示録の7つの教会」の1つです。初期の銀行業務を示す碑文や、高さ17.5メートルの巨大な柱が特徴です。`
        },
        category: 'history',
        coordinates: { lat: 38.479498365864494, lng: 28.03118038595177 },
        imageUrl: 'https://i.imgur.com/d2RoArI.jpeg',
        imageHint: 'ancient temple'
    },
    {
        id: '15',
        slug: {
            tr: 'antik-mermer-ocagi',
            en: 'ancient-marble-quarry',
            fr: 'carriere-de-marbre-antique',
            de: 'antiker-marmorsteinbruch',
            ja: 'ancient-marble-quarry-ja'
        },
        name: {
            tr: 'Antik Mermer Ocağı',
            en: 'Ancient Marble Quarry',
            fr: 'Carrière de Marbre Antique',
            de: 'Antiker Marmorsteinbruch',
            ja: '古代大理石採石場'
        },
        description: {
            tr: 'Sardes Antik Kenti\'nin ihtişamlı yapılarında kullanılan mermerlerin çıkarıldığı bu ocak, antik dönemdeki taş işçiliği ve mühendisliği hakkında önemli ipuçları sunar.',
            en: 'This quarry, where the marbles used in the magnificent structures of the Ancient City of Sardis were extracted.',
            fr: 'Cette carrière, d\'où étaient extraits les marbres utilisés dans les magnifiques structures de la cité antique de Sardes.',
            de: 'Dieser Steinbruch, in dem die für die prächtigen Bauten der antiken Stadt Sardes verwendeten Marmore abgebaut wurden.',
            ja: 'サルディス古代都市の壮大な建造物に使用された大理石が採掘されたこの採石場です。'
        },
        category: 'history',
        coordinates: { lat: 38.45680901086971, lng: 28.016172179836534 },
        imageUrl: 'https://i.imgur.com/NNREyvf.jpeg',
        imageHint: 'marble quarry'
    },
    {
        id: '16',
        slug: {
            tr: 'gokeyup-comlekciligi',
            en: 'gokeyup-pottery',
            fr: 'poterie-de-gokeyup',
            de: 'goekeyup-toepferei',
            ja: 'gokeyup-pottery-ja'
        },
        name: {
            tr: 'Gökeyüp Çömlekçiliği',
            en: 'Gökeyüp Pottery',
            fr: 'Poterie de Gökeyüp',
            de: 'Töpferei in Gökeyüp',
            ja: 'ギョケユップ陶器'
        },
        description: {
            tr: 'İnsanlığın yerleşik düzene geçtiği Neolitik Çağ\'ın devrimsel buluşlarından biri olan çömlekçilik, Gökeyüp\'te 6500 yıldır kadınlar tarafından sürdürülmektedir. Çömlekçi çarkı kullanılmadan elle şekillendirilen kaplar, açık ateşte pişirilmektedir. Bu ilkel yöntem, 12-13. yy\'da Türk boyları tarafından Horasan\'dan Anadolu\'ya taşınmıştır. Gökeyüp, bu kadim sanatın yaşayan en önemli merkezlerinden biridir.',
            en: 'Pottery, one of the revolutionary inventions of the Neolithic Age, has been practiced by women in Gökeyüp for 6,500 years. Pots are shaped by hand without a wheel and fired in open pits. This primitive technique was brought to Anatolia from Khorasan by Turkish tribes in the 12th-13th centuries. Gökeyüp is a unique living archaeological center for this ancient art.',
            fr: 'La poterie, l\'une des inventions révolutionnaires de l\'âge néolithique, est pratiquée par les femmes de Gökeyüp depuis 6 500 ans. Les pots sont façonnés à la main sans tour et cuits à l\'air libre. Cette technique primitive a été apportée du Khorasan par les tribus turques aux XIIe-XIIIe siècles. Gökeyüp est un centre archéologique vivant unique de cet art ancien.',
            de: 'Die Töpferei, eine der revolutionären Erfindungen der Jungsteinzeit, wird in Gökeyüp seit 6.500 Jahren von Frauen betrieben. Die Gefäße werden ohne Töpferscheibe von Hand geformt und im offenen Feuer gebrannt. Diese primitive Technik wurde im 12.-13. Jahrhundert von türkischen Stämmen aus Chorasan nach Anatolien gebracht. Gökeyüp ist ein einzigartiges lebendiges Denkmal dieser antiken Kunst.',
            ja: '新石器時代の革命的な発明の1つである陶器製作は、ギョケユップの女性たちによって6,500年間守られてきました。ろくろを使わずに手作業で形を作り、野焼きで仕上げます。この原始的な技法は、12〜13世紀にトルコ系部族によってホラサンからアナトリアに持ち込まれました。古代の芸術を示す貴重な生きた考古学的拠点です。'
        },
        category: 'shopping',
        coordinates: { lat: 38.6918318507784, lng: 28.281361601505868 },
        imageUrl: 'https://i.imgur.com/OwqFeZh.jpeg',
        imageHint: 'pottery workshop'
    },
    {
        id: '17',
        slug: {
            tr: 'kemer-koyu',
            en: 'kemer-village',
            fr: 'village-de-kemer',
            de: 'kemer-dorf',
            ja: 'kemer-village-ja'
        },
        name: {
            tr: 'Kemer Köyü',
            en: 'Kemer Village',
            fr: 'Village de Kemer',
            de: 'Kemer Dorf',
            ja: 'ケメル村'
        },
        description: {
            tr: 'Salihli\'nin Kemer mahallesi, tarihi taş köprüleri ve Gediz Nehri\'nin eşsiz manzaralarına ev sahipliği yapar.',
            en: 'The Kemer neighborhood of Salihli is home to historic stone bridges and unique views of the Gediz River.',
            fr: 'Le quartier de Kemer à Salihli abrite des ponts de pierre historiques et des vues uniques sur la rivière Gediz.',
            de: 'Das Viertel Kemer von Salihli beheimatet historische Steinbrücken und einzigartige Ausblicke auf den Fluss Gediz.',
            ja: 'サリフリのケメル地区には、歴史的な石橋 ve ゲディズ川のユニークな景色があります。'
        },
        category: 'history',
        coordinates: { lat: 38.68798840823775, lng: 28.14369833471573 },
        imageUrl: 'https://i.imgur.com/NmkLLQV.jpeg',
        imageHint: 'stone bridge'
    }
];
