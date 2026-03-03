
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
            tr: `KURŞUNLU KAPLICALARI 

- Suyun Özellikleri: Toplam 2172 mg/lt mineralizasyonu olan, bikarbonatlı, flörürlü niteliktedir. Şifalı sular, sıcaklığı 43 ila 91 derece arasında değişen kaynaklardan sağlanıyor. Kaplıca suyunun romatizmaya, cilt ve kadın hastalıklarına, solunum yolu hastalıklarına, sinirsel rahatsızlıkları ve kireçlenmelerin tamamlayıcı tedavisine olumlu etkileri görüldüğü belirtiliyor. 

- Kaplıcadaki Yatak Kapasitesi: 86 Apart ve 270 yatak kapasiteli bir tesis olan Kurşunlu Kaplıcaları’nda, sadece Salihli halkına değil, çevre ilçeler ile tüm Türkiye’den gelen konuklara Ege’nin misafirperverliği, samimi ve güler yüzlü personel tarafından sunuluyor. Salihli merkeze 5 kilometre, İzmir-Ankara ana yoluna ise 3 kilometre uzaklıkta bulunan Kurşunlu Kaplıcaları’nda Bahçıvandan Servis elemanına, Resepsiyonistten Sağlık Memuruna, Fizyoterapistten Güvenlik Görevlisine kadar 47 personel ile konaklayan misafirlere üst düzeyde bir hizmet veriliyor. 

- Kurşunlu ismi nereden geliyor? Bir zamanlar güzelliği ile dillere destan olan kralın kızı Kursun önemli bir deri hastalığı geçirir. Bu deri hastalığı sebebi ile vücudunda yaralar çıkar ve çirkinleşir. Çirkinleşen Kursun dalga geçilmekten ve dışlanmaktan yorulur ve şehirden uzaklaşır. Kurşunlu vadisi etrafında yaşamaya başlar. Akşamları da sıcak tuttuğu için doğal kaynak olan kurşunlu çayının içerisinde uyur. Zamanla vücudundaki yaraların iyileştiğini gören Kursun, yaklaşık 15 gün sonra tamamen eski güzelliğine kavuşur ve şehre yeniden döner. İyileşmesinin kaynağını öğrenen halk belirli aralıklarla bu sıcak su kaynağına gelip 10 – 15 günlük dönemlerde bu sudan faydalanırlar. 

Bu Bölgedeki Kula – Salihli Jeoparkı Jeositleri:
- Kurşunlu Kaplıcaları
- Kurşunlu Şelalesi ve Aktüel Traverten Oluşumu
- Kurşunlu Vadisi`,
            en: `KURŞUNLU THERMAL SPRINGS

- Water Properties: Total mineralization of 2172 mg/lt, bicarbonate and fluoride-rich. Healing waters are sourced from springs between 43-91°C. Effective for rheumatism, skin and gynecological diseases, respiratory disorders, nervous conditions, and calcification.

- Capacity: Featuring 86 apartments and 270 beds, Kurşunlu offers Aegean hospitality to guests from across Turkey. Located 5 km from Salihli and 3 km from the Izmir-Ankara highway, 47 specialized staff (physiotherapists, health officers, etc.) provide high-level service.

- Origin of the Name: Legend says the king's beautiful daughter, Kursun, suffered from a severe skin disease that disfigured her. Exiled, she took refuge in the Kurşunlu valley. She slept in the naturally warm Kurşunlu stream to stay warm. Within 15 days, her wounds healed, and she regained her legendary beauty. Hearing this, the public began using these healing waters.

Geosites in the Area: Kurşunlu Thermal Springs, Kurşunlu Waterfall, and Kurşunlu Valley.`,
            fr: `SOURCES THERMALES DE KURŞUNLU

- Propriétés de l'eau : Minéralisation totale de 2172 mg/lt, riche en bicarbonate et fluorure. Eaux curatives entre 43 et 91°C. Efficace pour les rhumatismes, les maladies de peau, les troubles respiratoires et nerveux.

- Capacité : Avec 86 appartements et 270 lits, l'établissement offre l'hospitalité égéenne. Situé à 5 km de Salihli, 47 employés spécialisés assurent un service de haut niveau.

- Origine du nom : La légende raconte que Kursun, la fille du roi à la beauté légendaire, fut défigurée par une maladie de peau. Exilée, elle se réfugia dans la vallée de Kurşunlu et dormit dans les eaux chaudes du ruisseau. En 15 jours, elle fut guérie et retrouva sa beauté. Depuis, le public utilise ces eaux sacrées.

Géosites : Sources de Kurşunlu, Cascade de Kurşunlu et Vallée de Kurşunlu.`,
            de: `THERMALQUELLEN VON KURŞUNLU

- Wasserqualität: 2172 mg/l Mineralisierung, bikarbonat- und fluoridhaltig. Wassertemperaturen zwischen 43 und 91°C. Hilft bei Rheuma, Haut- und Frauenkrankheiten sowie Atemwegserkrankungen.

- Kapazität: 86 Apartments und 270 Betten. 5 km von Salihli entfernt sorgen 47 Mitarbeiter für erstklassigen Service.

- Namensherkunft: Die schöne Königstochter Kursun litt an einer entstellenden Hautkrankheit. Verstoßen suchte sie Zuflucht im Kurşunlu-Tal und badete im warmen Bach. Nach 15 Tagen war sie geheilt. Das Volk erfuhr davon und nutzt seitdem die heilenden Quellen.

Geosites: Kurşunlu Thermalquellen, Kurşunlu Wasserfall und Kurşunlu Tal.`,
            ja: `クルシュンル温泉

- 水質の特性：総鉱物含有量2172 mg/ltで、重炭酸塩とフッ化物を豊富に含みます。源泉温度は43度から91度です。リウマチ、皮膚病、婦人病、呼吸器疾患、神経痛に効果があります。

- 施設の規模：86のアパートメントと270のベッドを備えています。サリフリから5kmに位置し、47名の専門スタッフが質の高いサービスを提供しています。

- 名前の由来：絶世の美女だった王女クルスンが重い皮膚病にかかり、街を追われてクルシュンル渓谷に身を寄せました。温かい川で眠り続けたところ、15日間で完治し、元の美しさを取り戻しました。これを聞いた人々が、この癒しの水を利用するようになりました。

地域のジオサイト：クルシュンル温泉、クルシュンル滝、クルシュンル渓谷。`
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
            tr: `Efsaneye göre, Frigya Kralı Midas, tanrı Dionysos'un yoldaşı bir satiri konuk eder ve onu ağırlar. Bu iyiliğinden etkilenen Dionysos, krala bir dilek hakkı sunar. Gözü zenginlikte olan Midas, dokunduğu her şeyin altına dönüşmesini diler. Başlangıçta bu yeni gücüyle büyülenen Midas, yediği yemeğin, içtiği suyun, hatta sevgiyle sarıldığı kızının bile altına dönüştüğünü görünce dehşete kapılır. Tanrı Dionysos'a yalvararak bu laneti geri almasını ister. Tanrı, krala kurtuluş yolunu gösterir: Lidya topraklarındaki Paktolos (Sart) nehrinde yıkanması gerekmektedir. Kral Midas, Salihli'ye gelir ve kendini nehrin sularına bırakır. Yıkanırken, altın dokunuşu ondan ayrılır ve nehrin kumlarına karışır. Midas'ın bu lanetten kurtulduğu yerlerden biri olarak kabul edilen Tabak Deresi'ndeki "Dev Kazanları", bu efsanenin canlı bir anıtıdır.`,
            en: `According to legend, King Midas of Phrygia wished that everything he touched would turn to gold. He soon realized his mistake when his food and even his daughter turned to gold. He begged Dionysus to lift the curse. The god instructed him to wash in the Pactolus River (Sart Creek) in Lydia. Midas came to Salihli and bathed in the river, transferring the golden touch to the sands. The "Giant Cauldrons" in Tabak Creek are a living monument where Midas was freed from this curse.`,
            fr: `Selon la légende, le roi Midas souhaitait que tout ce qu'il touchait se transforme en or. Réalisant son erreur, il supplia Dionysos de rompre le sort. Le dieu lui dit de se laver dans le Pactole (Sart) en Lydie. Midas vint à Salihli, et son toucher d'or se mélangea au sable de la rivière. Les "Chaudrons Géants" sont le lieu sacré de sa délivrance.`,
            de: `König Midas wünschte sich die goldene Berührung, bereute dies jedoch schnell. Dionysos wies ihn an, im Fluss Paktolos (Sart) in Lydien zu baden. Midas kam nach Salihli, und die goldene Kraft ging auf den Flusssand über. Die „Riesenkessel“ am Tabak-Bach zeugen noch heute von dieser Legende.`,
            ja: `ミダス王は触れるものすべてを金に変える力を望みましたが、食べ物まで金に変わるのを見て後悔しました。ディオニュソス神の教えに従い、リディアのパクトロス川で身を清めたところ、その力は川の砂へと移りました。タバッククリークの「巨大な大釜」はこの伝説の舞台です。`
        },
        category: 'nature',
        coordinates: { lat: 38.458250364806744, lng: 28.044546435772286 },
        imageUrl: 'https://i.imgur.com/KHKrcb5.png',
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
            tr: "Jeoparkın üçüncü evre volkanlarından Kula, Sandal ve Kaplan Divitleri Kuzeybatı–Güneydoğu istikametinde uzanan bir kırık hattı boyunca yaklaşık 9 km aralıklarla dizilirler. Şist sırtları ile ardalanmış alüvyon düzlükleri üzerinde yükselen bu ufak yanardağların çevresindeki parazit koniler ve çatlaklardan 12 bin yıl öncelerde püsküren çok sıcak ve çok akışkan bazalt lavları (leçeler) vadiler ve akarsu yataklarını doldurup kilometrelerce yayılarak araziyi kaplamıştır. Adala (Hermos) Kanyonunun oluşum öyküsü işte bu dönemde Kaplan Divliti ve önündeki küçük koniden fışkırarak bir ateş seli gibi yayılan erimiş kayaç ve minerallerle başladı. Lavlar Gediz'e bağlanan bir vadi boyunca 12,5 km akıp Gediz Vadisini de 4 km kadar doldurarak ırmağın akıntısını kesintiye uğrattıktan sonra vadinin üst kesimindeki ovanın yüzeyine kadar yayıldılar. Bu lav setinin arkasında biriken Gediz ırmağı, sert bazalt kitlelerini yarıp geçemedi ama onların hemen yanındaki metamorfik ve tortul kayaçları oyup kendisine giderek derinleşen yeni bir yatak açarak Adala Kanyonu'nu oluşturdu.",
            en: "The Hermos (Adala) Canyon was formed 12,000 years ago during the eruption of volcanoes like Kaplan Divliti. Molten basalt lavas flowed for 12.5 km, filling the Gediz Valley and blocking the river. The Gediz River, unable to breach the hard basalt, carved a new path through the adjacent metamorphic and sedimentary rocks, creating the deep and majestic Adala Canyon we see today.",
            fr: "L'histoire du canyon d'Adala (Hermos) a commencé il y a 12 000 ans avec les laves basaltiques du volcan Kaplan Divliti. Ces laves ont parcouru 12,5 km, remplissant la vallée du Gediz. Le fleuve Gediz, bloqué par cette barrière de lave, a creusé les roches sédimentaires voisines, créant ainsi le canyon d'Adala.",
            de: "Der Adala (Hermos) Canyon entstand vor 12.000 Jahren durch Basaltlaven des Vulkans Kaplan Divliti. Die Laven füllten das Gediz-Tal auf einer Länge von 12,5 km aus. Der Fluss Gediz grub sich daraufhin ein neues Bett durch das umliegende Gestein und formte so die heutige Schlucht.",
            ja: "アダラ渓谷の歴史は、約1万2千年前のカプラン・ディヴィティ火山の噴火から始まりました。流出した溶岩がゲディズ川を塞ぎましたが、川は玄武岩の隣の堆積岩を削り取り、新しい川床を作ったことで、現在のアダラ渓谷が形成されました。"
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
            tr: `Kız Köprüsü'nün altından akan suyu her iki kıyısından batıya doğru 2 Km. kadar takip ettiğinizde bir doğa harikası olan Su Uçtu Şelalesi'ne ulaşırsınız. "Su Uçtu" aslında suları yüksekten dökülen tüm şelaleler için kullanılan bir deyim ama zengin bir çeşitliliğe sahip ağaç ve bitki örtüsü ile kaplı dar bir boğazdan 25 metre aşağıdaki Adala Kanyonu'na dökülen şelale bu deyimi özel bir ad olarak taşımayı fazlası ile hak ediyor. Şelale'nin diğer bir özelliği de jeoparkın diğer pek çok arazi şekli gibi volkanizmanın lavları ile önü kapanan Gediz'in araziyi aşındırıp oyarak akıntısına yatak açmasının bir sonucu olması. Bir zamanların coşkun akışlı ırmağı Demirköprü Barajı'nın bendi ile dizginlendikten sonra Şelale'nin debisi azalıp gücü zayıfladı ancak uğultulu bir çağıltı ile dökülen sularından sıçrayan zerreciklerin yarattığı nemli serinlikte Adala Kanyonu'na yüksekten baktığınızda, onun bir zamanlar ki gücünü kavrayabilirsiniz.`,
            en: `Following the water flowing under the Maiden's Bridge about 2 km westward leads to the Suuçtu Waterfall. This 25-meter drop through lush vegetation into the Adala Canyon was formed by the Gediz River carving its path after being blocked by volcanic lava. While the Demirköprü Dam has reduced its flow, the misty breeze over the canyon still reveals its former majestic power.`,
            fr: `En suivant l'eau qui coule sous le Pont des Demoiselles sur environ 2 km vers l'ouest, vous atteignez la cascade de Suuçtu. Tombant de 25 mètres dans le canyon d'Adala à travers une végétation luxuriante, cette cascade a été formée par l'érosion du Gediz après un blocage par la lave volcanique. Sa force passée reste perceptible dans sa fraîcheur humide.`,
            de: `Etwa 2 km westlich der Jungfrauenbrücke stürzt der Suuçtu-Wasserfall 25 Meter tief in den Adala-Canyon. Er entstand, als der durch Lava blockierte Fluss Gediz sich ein neues Bett grub. Trotz des verringerten Durchflusses durch die Demirköprü-Talsperre ist die einstige Kraft in der kühlen Gischt noch immer spürbar.`,
            ja: `乙女の橋の下を流れる水を西に約2kmたどると、自然の驚異であるスーチュ滝に到着します。溶岩によって遮られたゲディズ川が土地を浸食して形成された、高さ25メートルの滝です。ダム建設により流量は減りましたが、今でもかつての力強さを感じることができます。`
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
            tr: `Adala – Demirköprü Barajı Arasındaki yolun 3. Kilometresinde inşa edilen 97.5 metre uzunluktaki bu büyük ve zarif taş köprü, tasarımındaki mükemmellikler nedeniyle günümüze sapasağlam gelebilmiştir. Yuvarlak kemerli altı ayak üzerinde yükselen köprü, Osmanlı'nın ilk dönemlerine tarihlenmektedir. Rivayete göre Lidyalılar döneminde Krezüs'ün kızına ait olduğu için bu adı almıştır. Yüzyıllarca kervan yollarının kavşak noktası olmuştur. II. Abdülhamid döneminde Northeast'inde "Demir Köprü" inşa edilene kadar bölgenin tek geçiş noktasıydı. 1954'te baraj inşaatı için Demir Köprü yıkılmış, ancak Kız Köprüsü doğanın sessizliğinde bir ata yadigârı olarak ayakta kalmıştır.`,
            en: `This 97.5-meter elegant stone bridge near the Demirköprü Dam is an architectural marvel that has survived intact. Dating to the early Ottoman period, legends say it belonged to King Croesus' daughter. It served as a vital junction for caravan routes for centuries until the construction of the modern "Demir Köprü" during the reign of Sultan Abdülhamid II.`,
            fr: `Ce pont en pierre de 97,5 mètres est une merveille architecturale qui a survécu intacte. Datant du début de la période ottomane, la légende dit qu'il appartenait à la fille du roi Crésus. Il a servi de carrefour vital pour les caravanes pendant des siècles.`,
            de: `Diese 97,5 Meter lange Steinbrücke ist ein architektonisches Meisterwerk, das bis heute erhalten geblieben ist. Sie stammt aus der frühen osmanischen Zeit und war über Jahrhunderte ein wichtiger Knotenpunkt für Karawanenwege.`,
            ja: `全長97.5メートルの優雅な石橋で、オスマン帝国初期のものと考えられています。伝説ではクロイソス王の娘にちなんで「乙女の橋」と呼ばれています。何世紀にもわたってキャラバンルートの重要な交差点でした。`
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
            tr: `Salihli-Akhisar yolu üzerinde Bintepe adıyla tanınan kral mezarları yer almaktadır. Sayıları 119 olan bu tümülüs (dolgu toprak) mezarlar Lidyalı soylulara aittir. Herodot’un Mısır piramitlerine benzettiği tümülüsün en büyüğünün Kral Alyattes'e ait olduğu bilinmektedir. Bintepeler Unesco Geçici Dünya Mirasları listesinde yer almaktadır. 230 metrelik çapıyla Karnıyarık Tepe, Giza'nın Büyük Piramidi Keops ile hemen hemen aynı çaptadır. 1962'de başlayan Amerikan Hafriyat Heyeti çalışmaları yarım kilometreden fazla tünel açmasına rağmen mezar odasına ulaşamamıştır. Yeni teoriler, M.Ö. 600 yılına tarihlenen bu devasa yapıların kral mezarı değilse bile, ana tanrıça kültünün güçlü olduğu Anadolu'da bir kraliçe için yapılmış olabileceğini önermektedir.`,
            en: `Bintepeler features 119 royal tumulus tombs compared by Herodotus to the Egyptian pyramids. The largest belongs to King Alyattes. Karnıyarık Tepe, with its 230-meter diameter, is nearly the same size as the Great Pyramid of Cheops. Despite extensive tunneling by US missions since 1962, the central burial chamber remains hidden. Modern theories suggest some might belong to Lydian queens, reflecting Anatolia's strong mother-goddess culture.`,
            fr: `Bintepeler comprend 119 tombes royales comparées par Hérodote aux pyramides d'Égypte. Karnıyarık Tepe a presque le même diamètre que la Grande Pyramide de Khéops. Malgré les recherches américaines depuis 1962, la chambre funéraire reste un mystère.`,
            de: `Bintepeler umfasst 119 Hügelgräber, die Herodot mit den ägyptischen Pyramiden verglich. Der Karnıyarık Tepe hat fast den gleichen Durchmesser wie die Cheops-Pyramide. Trotz umfangreicher Tunnelgrabungen seit 1962 wurde die Grabkammer noch nicht gefunden.`,
            ja: `ビンテペレルには119のリディア貴族の墳丘墓があり、ヘロドトスはエジプトのピラミッドに例えました。最大のカルヌヤルク・テペはギザのクフ王のピラミッドとほぼ同じ規模です。1962年からの調査でも、未だに埋葬室は見つかっていません。`
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
            tr: `Gymnasium Lidya döneminden kalma olarak bilinir fakat Roma dönemine aittir. Burada Lidya dönemine ait herhangi bir kalıntı yoktur. Yaklaşık 2000 yıl önce geçirdiği depremin ardından model olarak yapılmıştır. Septimius Severus bu yapıyı oğulları Geta ve Caracalla’ya bir de eşi Julia Domna’ya adamıştır. 25 dönüm üzerine kurulu bu kompleks; eğitim, spor ve alışveriş merkezidir. Hamamlardan çıkan soylular yukarıdaki balkonlarda meyvelerini yerken sporcuları izlerlerdi. Toplamda 34 adet Bizans dükkânı mevcuttur.

Hamam: Türk hamam geleneğiyle bağlantılı olan bu alan, aynı zamanda bir tedavi merkeziydi. Ayaklarını incitenlerin en üst basamağa, tüm vücudunda ağrı olanların ise başları dışarıda kalacak şekilde derin suya girdiği bir düzeneğe sahipti.
Tuvaletler (Latrin): İki düzine ziyaretçiyi ağırlayabilen, sürekli su akışının olduğu sosyal bir alandı. Önemli görüşmeler sırasında sesin dışarı çıkmaması için dışarıdan bando takımı çağırılırdı.
Sinagog (Havra): Bin kişi kapasiteli dini merkezdir. Ön avlusundaki çeşmede, evlenmeden önce günahlarından arınmak isteyen genç kızların yıkandığı inanılırdı. Duvarlardaki Yunanca isimler, panoları hediye eden hayırseverleri simgeler.`,
            en: `The Gymnasium belongs to the Roman period, built after an earthquake 2000 years ago and dedicated by Septimius Severus to his family. It was a 25-acre complex for education and shopping. 
- Baths: A social and medical hub where water levels were adjusted for specific physical therapies.
- Latrines: A social space for 24 visitors with continuous running water. Brass bands were often called to play outside to ensure privacy during political discussions.
- Synagogue: One of the largest in the ancient world, it features a purification fountain used by young women before marriage.`,
            fr: `Le Gymnase date de l'époque romaine, dédié par Septime Sévère à sa famille. C'était un complexe de 25 acres dédié à l'éducation et au commerce.
- Thermes : Utilisés pour la thérapie, avec des bassins de profondeurs variées.
- Latrines : Espace social pour 24 personnes. Des fanfares jouaient parfois à l'extérieur pour garantir la confidentialité des discussions politiques.
- Synagogue : Centre religieux pour 1000 personnes avec une fontaine de purification.`,
            de: `Das Gymnasium stammt aus der römischen Zeit und wurde von Septimius Severus seiner Familie gewidmet. Ein 25 Hektar großer Komplex für Bildung und Handel.
- Thermen: Ein Heilzentrum mit verschiedenen Wasserstufen für Therapien.
- Latrinen: Ein sozialer Raum für 24 Personen. Kapellen spielten oft draußen, um politische Gespräche zu übertönen.
- Synagoge: Eine der größten der Antike, mit einem Reinigungsbrunnen.`,
            ja: `ギムナジウムは2000年前のローマ時代のもので、セプティミウス・セウェルス帝が家族に捧げた25エーカーの複合施設です。
- 浴場：怪我の部位に合わせて水位を調整できる治療センターでもありました。
- 公衆トイレ：24人収容の社交の場で、重要な政治の話をする際は、声が漏れないように外で軍楽隊が演奏していました。
- シナゴーグ：1000人収容可能で、結婚前の浄化に使われた大理石の噴水があります。`
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
            tr: `Artemis, Zeus ile Leto'nun kızı, Apollon'un ikiz kardeşi ve ay tanrıçasıdır. Artemis, Poseidon’un oğlu Orion’a aşık olur ancak kardeşi Apollon’un oyunuyla sevgilisini okuyla vurur. Kahrolan Artemis, Orion’u gümüşten yapılmış ay arabasıyla gökyüzünün en karanlık noktasına, en parlak yıldız olması için taşır. 

Tapınak dünyanın en büyüklerinden biridir. Helenistik dönemde Zeus ve Artemis’e, Roma döneminde ise Antoninus Pius ve Faustina’ya adanmıştır. M.S. 5. YY’da içine inşa edilen küçük kilise ile Sardes, İncil'in Vahiy bölümünde adı geçen "7 Kilise"den (5. kilise) biri olmuştur. Vahiyde Sart kilisesine "Uyan! Beyazlar içinde benimle yürüyecekler" mesajı verilir.

Sunak: Lydia Kralı Kroisos tarafından M.Ö. 500'de başlatılmıştır.
Senet Taşı: Tapınaktaki büyük mermer blok üzerindeki yazılar, bir rahibeden borç alan kişinin teminatlarını içerir ki bu, tarihteki ilk bankacılık faaliyetlerinden biridir.
Sütunlar: 17,5 metre yüksekliğindeki sütunların her parçası 4 tondur. "Baş Sütun" üzerindeki yılan figürü, açılış kurdelesini temsil eder.`,
            en: `Artemis, the goddess of the moon, accidentally killed her lover Orion due to a trick by her twin brother Apollo. In her grief, she placed Orion in the darkest part of the sky to be the brightest star. 
The Temple is one of the world's largest. It became the 5th of the "7 Churches of Revelation" in the Bible. Artifacts like the "Credit Stone" show that banking activities occurred here anciently. Its massive 17.5-meter columns are architectural wonders, with the "Leader Column" featuring a unique snake figure.`,
            fr: `Artémis, déesse de la lune, a tué accidentellement son amant Orion. Affligée, elle l'a placé dans le ciel pour devenir l'étoile la plus brillante. Le temple est l'une des "7 Églises de l'Apocalypse". Des inscriptions prouvent des activités bancaires précoces. Ses colonnes de 17,5 mètres sont des chefs-d'œuvre.`,
            de: `Artemis, die Mondgöttin, tötete versehentlich ihren Geliebten Orion. Sie setzte ihn als hellsten Stern an den Himmel. Der Tempel ist eine der „7 Gemeinden der Offenbarung“. Inschriften belegen frühe Bankgeschäfte. Die 17,5 Meter hohen Säulen sind architektonische Weltwunder.`,
            ja: `月の女神アルテミスは、双子の兄アポロンの罠で恋人オリオンを射抜いてしまいました。悲しみのあまり、彼を天で最も輝く星にしました。この寺院は「ヨハネの黙示録の7つの教会」の5番目です。初期の銀行業務の証拠となる碑文や、高さ17.5メートルの巨大な柱が見どころです。`
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
            tr: 'İnsanlığın yerleşik düzene geçtiği Neolitik Çağ\'ın devrimsel buluşlarından biri olan çömlekçilik, Gökeyüp\'te 6500 yıldır kadınlar tarafından sürdürülmektedir. Çömlekçi çarkı kullanılmadan basit bir tabla üzerinde elle şekillendirilip güneşte kurutularak açık ateşte pişirilmektedir. Bu ilkel teknoloji, Türk boylarının Anadolu\'ya girmeye başladığı 12-13. yy\'da Horasan\'dan bu yörelere taşınmıştır. Gökeyüp, bu kadim sanatın yaşayan en önemli merkezlerinden biridir.',
            en: 'Pottery has been practiced by women in Gökeyüp for 6,500 years using Neolithic techniques. Pots are shaped by hand without a wheel and fired in open pits. This primitive technology was brought to Anatolia from Khorasan by Turkish tribes in the 12th-13th centuries. Gökeyüp remains a unique living archaeological center for this ancient art.',
            fr: 'La poterie est pratiquée par les femmes de Gökeyüp depuis 6 500 ans selon des techniques néolithiques. Façonnés à la main sans tour, les pots sont cuits à l\'air libre. Cette technique primitive a été apportée du Khorasan par les tribus turques aux XIIe-XIIIe siècles.',
            de: 'In Gökeyüp wird seit 6.500 Jahren Töpferei nach neolithischen Methoden betrieben. Die Gefäße werden ohne Töpferscheibe von Hand geformt und im offenen Feuer gebrannt. Diese Technik brachten türkische Stämme im 12. Jahrhundert aus Chorasan mit.',
            ja: 'ギョケユップの女性たちは6,500年前の新石器時代の技法で陶器を作り続けています。ろくろを使わず手作業で成形し、野焼きで仕上げます。12〜13世紀にホラサンから伝わった古代の芸術です。'
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
