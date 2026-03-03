
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
            tr: `KURŞUNLU KAPLICALARI - Suyun Özellikleri; Toplam 2172 mg/lt mineralizasyonu olan, bikarbonatlı, flörürlü niteliktedir. Şifalı sular, sıcaklığı 43 ila 91 derece arasında değişen kaynaklardan sağlanıyor. Kaplıca suyunun romatizmaya, cilt ve kadın hastalıklarına, solunum yolu hastalıklarına, sinirsel rahatsızlıkları ve kireçlenmelerin tamamlayıcı tedavisine olumlu etkileri görüldüğü belirtiliyor. - Kaplıcadaki Yatak Kapasitesi; 86 Apart ve 270 yatak kapasiteli bir tesis olan Kurşunlu Kaplıcaları’nda, sadece Salihli halkına değil, çevre ilçeler ile tüm Türkiye’den gelen konuklara Ege’nin misafirperverliği, samimi ve güler yüzlü personel tarafından sunuluyor. Salihli merkeze 5 kilometre, İzmir-Ankara ana yoluna ise 3 kilometre uzaklıkta bulunan Kurşunlu Kaplıcaları’nda Bahçıvandan Servis elemanına, Resepsiyonistten Sağlık Memuruna, Fizyoterapistten Güvenlik Görevlisine kadar 47 personel ile konaklayan misafirlere üst düzeyde bir hizmet veriliyor. - Kurşunlu ismi nereden geliyor? Bir zamanlar güzelliği ile dillere destan olan kralın kızı Kursun önemli bir deri hastalığı geçirir. Bu deri hastalığı sebebi ile vücudunda yaralar çıkar ve çirkinleşir. Çirkinleşen Kursun dalga geçilmekten ve dışlanmaktan yorulur ve şehirden uzaklaşır. Kurşunlu vadisi etrafında yaşamaya başlar. Akşamları da sıcak tuttuğu için doğal kaynak olan kurşunlu çayının içerisinde uyur. Zamanla vücudundaki yaraların iyileştiğini gören Kursun, yaklaşık 15 gün sonra tamamen eski güzelliğine kavuşur ve şehre yeniden döner. İyileşmesinin kaynağını öğrenen halk belirli aralıklarla bu sıcak su kaynağına gelip 10 – 15 günlük dönemlerde bu sudan faydalanırlar. Bu Bölgedeki Kula – Salihli Jeoparkı Jeositleri:
- Kurşunlu Kaplıcaları
- Kurşunlu Şelalesi ve Aktüel Traverten Oluşumu
- Kurşunlu Vadisi`,
            en: `KURŞUNLU THERMAL SPRINGS - Water Properties: Total mineralization of 2172 mg/lt, bicarbonate and fluoride-rich. Healing waters are sourced from springs between 43-91°C. Effective for rheumatism, skin and gynecological diseases, respiratory disorders, nervous conditions, and calcification.
- Capacity: Featuring 86 apartments and 270 beds, Kurşunlu offers Aegean hospitality to guests from across Turkey. Located 5 km from Salihli and 3 km from the Izmir-Ankara highway, 47 specialized staff (physiotherapists, health officers, etc.) provide high-level service.
- Origin of the Name: Legend says the king's beautiful daughter, Kursun, suffered from a severe skin disease that disfigured her. Exiled, she took refuge in the Kurşunlu valley. She slept in the naturally warm Kurşunlu stream to stay warm. Within 15 days, her wounds healed, and she regained her legendary beauty. Hearing this, the public began using these healing waters.
Geosites in the Area: Kurşunlu Thermal Springs, Kurşunlu Waterfall, and Kurşunlu Valley.`,
            fr: `SOURCES THERMALES DE KURŞUNLU - Propriétés de l'eau : Minéralisation totale de 2172 mg/lt, riche en bicarbonate et fluorure. Eaux curatives entre 43 et 91°C. Efficace pour les rhumatismes, les maladies de peau, les troubles respiratoires et nerveux.
- Capacité : Avec 86 appartements et 270 lits, l'établissement offre l'hospitalité égéenne. Situé à 5 km de Salihli, 47 employés spécialisés assurent un service de haut niveau.
- Origine du nom : La légende raconte que Kursun, la fille du roi à la beauté légendaire, fut défigurée par une maladie de peau. Exilée, elle se réfugia dans la vallée de Kurşunlu et dormit dans les eaux chaudes du ruisseau. En 15 jours, elle fut guérie et retrouva sa beauté. Depuis, le public utilise ces eaux sacrées.
Géosites : Sources de Kurşunlu, Cascade de Kurşunlu et Vallée de Kurşunlu.`,
            de: `THERMALQUELLEN VON KURŞUNLU - Wasserqualität: 2172 mg/l Mineralisierung, bikarbonat- und fluoridhaltig. Wassertemperaturen zwischen 43 und 91°C. Hilft bei Rheuma, Haut- und Frauenkrankheiten sowie Atemwegserkrankungen.
- Kapazität: 86 Apartments und 270 Betten. 5 km von Salihli entfernt sorgen 47 Mitarbeiter für erstklassigen Service.
- Namensherkunft: Die schöne Königstochter Kursun litt an einer entstellenden Hautkrankheit. Verstoßen suchte sie Zuflucht im Kurşunlu-Tal und badete im warmen Bach. Nach 15 Tagen war sie geheilt. Das Volk erfuhr davon und nutzt seitdem die heilenden Quellen.
Geosites: Kurşunlu Thermalquellen, Kurşunlu Wasserfall und Kurşunlu Tal.`,
            ja: `クルシュンル温泉 - 水質の特性：総鉱物含有量2172 mg/ltで、重炭酸塩とフッ化物を豊富に含みます。源泉温度は43度から91度です。リウマチ、皮膚病、婦人病、呼吸器疾患、神経痛に効果があります。
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
            ja: "アダラ渓谷の歴史は、約1万2千年前のごく最近のカプラン・ディヴィティ火山の噴火から始まりました。流出した溶岩がゲディズ川を塞ぎましたが、川は玄武岩の隣の堆積岩を削り取り、新しい川床を作ったことで、現在のアダラ渓谷が形成されました。"
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
            tr: `KIZ KÖPRÜSÜ: Adala – Demirköprü Barajı Arasındaki yolun 3. Kilometresinde ve baraja yaklaşık 1 km mesafede, çam ağaçlarının arasından sola sapan tali yol Kız Köprüsü'ne ulaşır. Gediz Vadisi'nin daraldığı bir noktada, vadinin iki yanındaki taraça düzlükleri birleştirecek şekilde inşa edilen 97.5 metre uzunluktaki bu büyük ve zarif taş köprü, yerli kayadan oluşan sağlam zemine oturması ve yer seçiminin yanı sıra tasarımındaki mükemmellikler nedeniyle günümüze sapasağlam gelebilmiştir. Kuzeybatı – Güneydoğu istikametinde uzanan köprünün zeminden en yüksek noktası, 11,5 metre ve korkuluklar dahil tabliye genişliği 3,4 metredir. Yuvarlak kemerli altı ayak üzerinde yükselen Kız Köprüsü'nün merkezindeki kemer, büyük ve yüksekken iki yanındaki kemerler, arazi yapısına bağlı olarak farklı büyüklüklerdedir. Bu nedenle büyük kemerin kilit taşından itibaren iki tarafa doğru hafif birer eğimle alçalan köprü, ana kemerli veya dik kemerli köprülerin mimari özelliklerini gösterir. Ayak ve kemerlerinin iç kısımlarında kesme taş kullanılan köprü gövdesi gnays, şist gibi yerli taşlardan harçlı örgü ile inşa edilmiştir. Üst kısımlarında ve iki yandaki 40'ar cm kalınlıktaki korkuluk duvarlarında bazalt ve benzeri volkanik kayaçların kullanımı ile göze çarpan işçilik farklılıkları Kız Köprüsü'nün birçok kez onarım gördüğü, yakın zamanda ve esaslı bir şekilde yapılan tamiratların birinde köprünün tabliye kısmının yeniden inşa edildiğine dair belirgin işaretlerdir. Kız Köprüsü'nün kitabesi yoktur ve büyük kemerin kilit taşı üzerindeki kitabe boşluğu da muhtemelen yerine konulmayan ya da günümüze ulaşmayan tamirat kitabesine aittir. Hakkındaki arşiv kayıtları da tespit edilemeyen köprünün, kim tarafından ve ne zaman inşa edildiği konusunda farklı anlatımlar ve görüşler bulunmaktadır. Araştırmacı İbrahim Çiçek "Tarih İçinde Adala ve Köyleri" adlı kitabında "Adala'nın Lidyalılar'a ait bir kasaba olduğunu, yanından geçen Gediz Irmağı'na da Kız Çayı denildiğini, bu çay üzerine yapılan köprünün Krezüs'ün kızına ait olduğunu bu nedenle de Kız Köprüsü denildiğini" anlatan rivayeti nakleder. Aynı kitapta, "Atatürk Üniversitesi Tarih Bölümü'nden Prof. Dr. Enver Konukçu ile Gazi Üniversitesi Sanat Tarihi Bölümü öğretim üyesi Hakkı Acun'un köprüyü yerinde inceledikleri ve Osmanlı'nın ilk dönemlerine tarihledikleri" anlatılır. (Çiçek, Çetin – 2001) Sanat Tarihi Profesörü Fügen İlter "Köprülerin ana gözlerinde dairesel kemer kullanma modasının Anadolu Beylikleri Dönemi'nde başladığını belirtir. (İlter – 1978) Ancak Sultan III. Murat'ın harem-i Humayun ağalarından Nasuh Ağa'nın Adala'da 1580 yılında inşa ettirdiği, ne zaman yıkıldığı bilinmeyen köprü ile Kız Köprüsü'nün birbirine yakın konumları birlikte değerlendirildiğinde Kız Köprüsü'nün, Nasuh Ağa Köprüsü'nün yıkılmasından sonra yaptırılması ihtimali kuvvetli şekilde söz konusudur. Kız Köprüsü konumu nedeniyle inşa edildiği tarihten yakın zamana kadar, Gediz Havzası'nda Sart, Salihli, Adala ve Dibek Dağı çevresinin yanı sıra Demirci, Gördes, Kula ve Alaşehir'e kadar uzanan yollarda ulaşımın her mevsimde kesintisiz sağlandığı tek kavşak noktası olmuştur. Bu mevkiinin ulaşım bakımından bölgesel önemini sürdürmesi nedeniyle Sultan II. Abdülhamid döneminde Kız Köprüsü'nün Kuzeydoğusunda yeniden düzenlenen Salihli – Demirci kara yolunda, Gediz üzerinden geçit sağlayan yeni bir köprü kuruldu. Taş örgü ayaklar üzerine oturtulan ve tabliyesi demir-çelik olan 113,4 metre uzunluktaki bu büyük köprüye inşaat özellikleri nedeniyle "Demir Köprü" adı verildi. Ancak konumu ve üzerine inşa edildiği vadi zemininin sağlamlığı nedeniyle 1954'de inşasına başlanan barajın set duvarının bu noktada yer almasına karar verildiği için bu köprü yıktırıldı ama adı Demirköprü Barajı ismiyle yaşatıldı. Kız Köprüsü bugün anayolun dışında doğanın sessizliğinde kalmış bir ata yadigârı ve jeoparkın önemli tarihi anıtlarından biri. Ancak zarif bir kavisle Gediz'in iki yakası arasında uzanan bu bilinmezliklerle dolu köprünün, suyun aynasına yansıyan görüntüsü, gurbeti sılaya bağlayıp, kervanları menzillerine ulaştıran yolların yüzlerce yıllık öykülerini fısıldar gibi.`,
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
            tr: `Bintepeler: Salihli-Akhisar yolu üzerinde Bintepe adıyla tanınan kral mezarları yer almaktadır. Antik Sardes Kenti ile Marmara Gölü arasında yer alan bölgeye yayılmış, sayıları 119 olan bu tümülüs (dolgu toprak) mezarlar Lidyalı soylulara aittir. Ait oldukları kişinin sosyal durumuna göre büyüklüğü, küçüklüğü değişkenlik gösteren mezarların en büyük üç tanesinin Lydia’nın ünlü krallarından Giges, Alyettes ve Kral Ardys’e ait olduğu söylenmektedir. Antik çağda bile ünlü olan Heradot’un Mısır piramitlerine benzettiği tümülüsün en büyüğünün Kral Alyattes'e ait olduğu bilinmektedir. Bintepeler Unesco Geçici Dünya Mirasları listesinde yer almaktadır. Bintepeler, jeomorfolojik yapı ve görünümün insan eliyle değiştirilmesine örnek olması açısından oldukça önemli yere sahiptir. Sardeis’in kuzeyinde yer alan Bin Tepe’deki Tümülüs mezarları, Lidya’nın antik dönemdeki en göze çarpan nirengi noktası olup, çok uzaklardan görünür ve bulunduğu alanı olağan dışı bir sihir ile işaretler. Bin Tepe Türkiye’deki en geniş mezarlık alanıdır, belki de dünyadaki en büyük mezarlık alanı kaplar. 1940’lı yıllarda en az 149 tane tümülüs mevcut iken, bunların çoğu tarımsal faaliyetler sonucu harap edildiğinden günümüze kadar ancak 115 - 119 tümülüs korunagelmiştir. Fevkalade bir güzelliğe sahip, akıldan çıkmayan bir manzaradır. Giza'daki üç piramit gibi, Bintepeler’de yer alan üç anıtsal nitelikli tümülüsten biri Karnıyarık Tepe’dir. 230 metrelik çapıyla ve güney kısmındaki 53 metrelik yüksekliğiyle kapladığı alan Giza’nın Büyük Piramidi Keops’la hemen hemen aynı çaptadır. Alyattes tümülüsü antik dönemde açılmış olduğundan, Sart Amerikan Hafriyat Heyeti, 1962 yılında, arkeolojik çalışmaların bir parçası olarak, Karnıyarık Tepe’de çalışma yapmayı uygun görmüştür. 1962 ve 1963 yıllarında yapılan jeofizik araştırmalarından ve sondaj çalışmalarından sonra, 1964, 1965 ve 1966 yıllarında tümülüsün içerisi tüneller kazılarak araştırılmıştır. 1992 yılında daha kapsamlı jeofizik araştırmaları yapılmış, bunu 1995 yılında yapılan sondaj çalışmaları takip etmiştir. 2011 yılında başka bir jeofizik çalışması yapılmış ve 2012 yılında Manisa Müzesi ile ortaklaşa tünel çalışmalarına yeniden başlanmıştır. Tahminimize göre, toprakla geri doldurulan Roma tünelleri, mezar odasına ulaşamayan hatlardır. Bunun sebebi de geri doldurmanın diğer tünellerden çıkan toprakla yapılmış olmasıdır. Tümülüsteki büyük yarık (“Karnıyarık”) da orijinal taban seviyesine inecek kadar kazılmamıştır. Gerek Roma tünelleri, gerek bizim açtığımız tüneller, tümülüsün merkezine kadar uzanmaktadırlar ve bu alanda ve çevresinde mezar odasının yerini tespit etme amacıyla araştırmalar yapılmıştır. Bu tüneller, tümülüsün yapımı ile ilgili önemli bilgiler vermektedirler. Ancak yarım kilometreden daha fazla uzunlukta tüneller açılmasına rağmen, henüz mezar odasının yeri tespit edilememiştir.
Karnıyarık tepe de denilen ve şimdiye kadar bildiğimiz Gyges tümülüsü hakkında yeni bir görüş daha vardır. Yeni çalışmalar, tümülüsün milattan önce 600 yıllarından öncesine tarihlenemeyeceğini göstermektedir. Gyges M.O. 644 yıllarında öldüğüne göre, bu onun mezarı olamaz. Bu mezar için olası en erken tarih olan M.Ö 600 ile, Lidyalıların, Persler tarafından mağlup edildikleri ve bundan dolayı muhtemelen anıtsal mezar inşa edemeyecekleri M.O 547 yılları arasında sadece iki Lidya kralı vardır: Alyattes ve Kroisos. Alyattes’in mezarı kesin olarak Bin Tepe’nin en büyük tümülüs olan Koca Mutaf Tepe’dir ve Kroisos de Persler tarafından götürülüp, Kyros’un (Büyük Keyhüsrev) güvenilir danışmanı ilan edilmiştir, olasılıkla da kraliyet tümülüsüne defnedilmemiştir. Eğer kral için değilse, bu bir kraliçe için olabilir mi? Ana tanrıçanın doğduğu Anadolu’da bu mümkün olabilir.`,
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
            tr: `Gymnasium Lidya döneminden kalma olarak bilinir fakat Roma dönemine aittir. Burada Lidya dönemine ait herhangi bir kalıntı yoktur. Bundan yaklaşık 2000 yıl önce geçirdiği depremin ardından model olarak yapılmıştır. Septimius Severus bu yapıyı oğulları Geta ve Caracalla’ya bir de eşi Julia Domna’ya adamıştır. (Septimius’tan sonra oğlu Caracalla ve Geta beraber imparator olmuşlar fakat daha sonra Caracalla Geta’yı bir suikastle öldürtmüştür)
Gymnasium yaklaşık 25 dönüm üzerine kurulmuş bir alışveriş merkezi ve eğitim sahasıdır. Hamamlardan çıkan soyluların yukarıdaki balkonlarda oturup meyvelerini yerken sporcuları izliyorlardı. Bu alanın bir kısmı kapalı idi. Burada restoranlar, ibadet yerleri, dükkânlar ve tuvaletler vardır. Toplamda 34 adet dükkân mevcuttur.

Hamam:
Yıkanmak, Roma İmparatorluğu’nun tamamına yayılmış olan bir sosyal gelenektir. Bu gelenek, ılık, sıcak ve soğuk su ile keyifle yıkanarak, sohbet ederek, egzersiz yaparak ve kültürel uygulamalarda bulunarak serbest zamanların değerlendirildiği faaliyetleri içermektedir. Roma hamamları gibi yapılar bu geleneğin birer fiziki kanıtıdır ve kalıntıları bizlerin bu durumu anlamamıza yardımcı olmaktadır. Türk hamam geleneğine bakınca, Roma hamamına uzak olmasına rağmen, bir bağlantının olduğu fark edilmektedir.
Hem soyluların hem de spor yapanların spordan sonra kullandıkları bu hamam ayrıca spor sırasında kendini inciten sporcular tedavi amaçlı kullanmışlardır. Ayaklarını incitenlerin en üst kısımda oturup sadece ayaklarını soktukları, bacaklarını incitenlerin 2. Basamağa oturarak yarı beline kadar suya gömüldükleri, tüm vücudunda ağrı olanlar başları dışarıda kalacak şekilde suya girdikleri bir hamamdı.

Tuvaletler (Latrin): 
Umumi tuvaletlerin küçük olması ve kuzey ve doğu yönlerindeki kapılar, bu alanın hem Hamam ziyaretçileri hem de mermer yolu kullanan halk tarafından kullanılmış olacağı fikrini akıllara getirmektedir. İki adet birbirine benzer şekilde düzenlenmiş uzun dikdörtgen biçimli odalar, erkekler ve kadınlar için ayrı ayrı hizmet vermek için yapıldıklarını düşündürür ve bunlar belki de iki düzine ziyaretçiyi aynı zamanda ağırlayabilecek kapasiteydiler. Daha büyükçe olan latrin sıralarının önünde mermer zemine gömülü, yükseltilmiş kenarları olan bir kanal ile sürekli su akışı sağlanırdı. Oturma sıraların altında yer alan derin bir lağım sistemiyle, Hamam’dan getirilen düzenli olarak su akışı muhtemelen kuzeye doğru tahliye edilirdi. Burada bulunan iki küçük heykel; Dionysos ve drapeli bir kadın figürü orijinal mimariye ait olabilirler. Burada uzun uzun sohbet edilir ve memleket meseleleri konuşulurdu. Hatta önemli görüşmeler olduğu esnada dışarıdan bando takımı çağırılır ve onların gürültülerinden dolayı ses dışarıya gitmezdi. Tuvaletler sadece görünen yer değil 4 tarafı da çevrili idi.

Dükkanlar:
Son halleriyle dikdörtgen şekilli 34 adet küçük Bizans dükkânı, bir düzine işlevsel faaliyet gösteren birim oluşturmaktaydı. Çoğu çok odalı olan bu dükkânlara girişler birden çok kapıdan sağlanırdı ve yer döşemeleri mermerden veya karodan oluşmaktaydı. Taş basamaklar ya da ahşap merdivenler, depo ve yaşam alanı olarak kullanılan ve hareketli revak ile gürültülü caddeye yukarıdan bakan üst kata ulaşımı sağlardı. Odaların düzenleri ve kullanımları, mesken tutuldukları 200 yıllık süre içerisinde sıklıkla değişmiştir. Kazılarda ortaya çıkarılan eserler ve eşyalar, bireysel olarak dükkânların değişken kimlikleri ile ilgili bilgi vermektedirler: birkaç küçük ünite taverna ya da lokanta olarak hizmet verirken, bazıları boya hazırlama, kullanma ya da satma konusuna, diğerleri ise cam eşyaların ve hırdavatların satımına ya da geri dönüşümüne odaklanmışlardı. Bu alandaki bankların, umumi tuvalet sıralarının ve su haznelerinin mevcudiyeti, sivil halk ile yerel dükkân sahiplerinin, bu alanları müşterek kullanımını göstermekteydi. Eserlerin üzerlerine yahut duvarlara kazınmış olan şahsi isimler ve dini semboller bu alandaki kültür zenginliğini göstermektedirler. 

Sinagog (Havra):
Abidevi havra, Geç Roma döneminde, Musevi toplumunun dini merkezi olarak kullanılmaktaydı. 1962 yılında ortaya çıkarılan bina ve süslemeler kısmen restore edilmiştir. Bin kişiyi barındırabilecek büyüklükte ve uzunluğu 50 metreyi aşkın ana toplantı salonu yer almaktadır. Yerden 14 metre yükseklikteki çatı masif taş payelerle desteklenmiştir. Bina, birkaç kere yenilenmiştir. Önceleri, Roma Hamam-Gymnasium Kompleksinin bir parçası iken, daha sonraları, Musevi toplumunun ibadethanesi haline dönüşmüştür. Mozaik yer döşemeleri, mefruşatı ve mermer duvar bezemeleri, değişik zamanlarda yapılmıştır; ancak bugün mevcut olanlar ise MS 4. ve 5. yüzyıldan kalanlardır. Havra, yedinci yüzyılın başlarında, Batı Anadolu’da yaygın görülen, akımın etkisiyle, şehrin çoğu alanı gibi terk edilmiştir. Ön avlunun ortasındaki, orijinali mermer olan, büyük vazo görünümdeki çeşme, ayinlerden önce cemaatin ellerini yıkadığı bir yerdi. Çeşmenin suyu, yer altına döşenmiş olan pişmiş toprak borular tarafından temin edilmekteydi. Suyun akışı, ustaca düzenlenmiş bir vana tarafından kontrol edilmekteydi. Çeşmeyi çevreleyen havuz, muhtemelen mermerden, düz plakalarla kaplıydı. Çeyiz hazırlamak için hayat kadınlığı yapan genç kızlar evlenmeden önce bu havuzda yıkanarak günahlarından arınırlardı. Ana salonda bulunan duvar dekorasyonlarının yapımına dördüncü yüzyılda başlanmıştır. İşin tamamlanması birkaç nesil boyunca devam etmiştir. Panoları hediye eden şahısların isimleri, Yunanca olarak, mermer plakalara işlenmiştir.`,
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
            tr: `Artemis Tapınağı: Öncelikle Artemis Kimdir onu açıklayalım. Artemis, Roma'daki adı Diana, Zeus ile Leto'nun kızı. Phoebe olarak da bilinir. Apollon'un ikiz kız kardeşi, vahşi doğa, avcılık, okçuluk ve ay tanrıçası. Ares'in dostu ve en büyük Yunan tanrıçalarından biridir.
Artemis dev bir avcı olan Poseidon’un oğlu olan Orion’a aşık olur. Fakat bu aşk Artemis'in ikiz kardeşi olan Apollon’un hoşuna gitmez. Orion bir gün denizde yüzerek açılır ve uzaktan bir nokta gibi görünür. Apollon bunu fırsat bilir ve okçuluk tanrıçası olan Artemis’e o noktayı okuyla vurup vuramayacağını sorar. Okuyla siyah noktayı vuran Artemis daha sonra sevgilisi Orion’u vurduğunu anlar ve kahrolur. Onu gümüşten yapılmış ay arabasına koyar ve kendi elleriyle gökyüzüne taşır. En parlak yıldız olabilmesi için gökyüzünün en karanlık noktasını seçer. Ve geceler boyu parlayan Orion’u seyreder.
Hıristiyanlık’tan sonra tahrip edilmiş, yapı taşları başka yapılarda kullanılmıştır. Dünya’nın en büyük tapınaklarından biridir.
Helenistik dönemde Zeus ve Artemis’in isimleri kullanılmış, Roma döneminde ise tapınağın batı bölümü Artemis, doğu bölümı de Antoninus Pius’a (M.S.138-161) adanmıştır. Roma döneminde pseuda-dipteras plan düzeni uygulanan yapı, İon üslubundaydı.
Hristiyanların egemen olduğu dönemde ise tapınağın güney-doğu köşesine doğal bir platform üzerine küçük bir kilise yapılmıştır (M.S. 5. YY’da). 7. YY’a kadar Hristiyan ibadethanesi olarak kullanılmıştır. M.S. 17’de Sardeis’i tamamıyla yıkan deprem, tapınağa da çok zarar vermiştir. M.S. II. yüzyılın ortalarına doğru Antonius Pius ve karısı Faustina tapınağı onarmış, içerisine imparatorların dini törenlerinde kullanılmak üzere iki bölüm yapılmıştır. Buraya normal bir insan boyunun dört katı heykeller konulmuştur. Bunlardan doğu yönündeki heykel İmparator Antonius Pius’u, batı yönündeki de eşi Faustina’yı temsil ediyordu. Faustina heykelinin başı bugün British Museum’dadır.
Anadolu’da Yuhanna ile Meryem’in gezdiği 7 şehirden birisi Sardes’tir. Yuhanna incilinin vahiy bölümünde 5. kilise olarak adlandırılır. Vahiyde şu şekilde bahseder “Sart’taki kilisenin meleğine yaz. Tanrı’nın yedi ruhuna ve yedi yıldıza sahip olan şöyle diyor: ‘Yaptıklarını biliyorum. Yaşıyorsun diye ad yapmışsın, ama ölüsün. Uyan! Geriye kalan ve ölmek üzere olan ne varsa güçlendir. Çünkü yaptıklarının Tanrım’ın önünde tamamlanmamış olduğunu gördüm. Bu nedenle neler aldığını, neler işittiğini anımsa. Bunları yerine getir, tövbe et! Eğer uyanmazsan, hırsız gibi geleceğim. Hangi saatte geleceğimi hiç bilemeyeceksin. Ama Sart’ta, aranızda giysilerini lekelememiş birkaç kişi var ki, beyazlar içinde benimle birlikte yürüyecekler. Çünkü buna layıktırlar. Galip gelen böylece beyaz giysiler giyecek. Onun adını yaşam kitabından hiç silmeyeceğim. Babam’ın ve meleklerinin önünde o kişinin adını açıkça anacağım. Kulağı olan, Ruh’un kiliselere ne dediğini işitsin.’
Bu 7 kilisenin 3 tanesi Manisa’da 3 tanesi İzmir’de 1 tanesi de Denizli’dedir.
7 kilise: • Efes (Ephesos) (Selçuk) • İzmir (Smyrna) • Bergama (Pergamon) • Salihli (Sardes) • Alaşehir (Philadelphia) • Denizli (Laodikeia) • Akhisar (Thyateira)
Bu 7 kilisenin önemi: Batı’nın batıl inancına göre, Tanrı kıyametin kopacağını 7 kiliseye haber verir. Tanrı’nın melek göndereceği kiliselerdir. Hz. İsa, Havari Yuhanna'ya görünür ve 7 kiliseye iletilmek üzere "mesajlar" verir. İşte kitapta adı geçen ve mesajlar yollanan 7 kilise, Hıristiyanlığın ilk kiliseleri olarak kabul görür.

Sunak:
Artemis Tapınağı’nın yapımını ilk defa Lydia Kralı Kroisos kum taşından bir sunak olarak başlatmıştır. (M.Ö. 500). En eski korunmuş bölgesi de bu sunaktır. Tören ve ainlerin odak noktasıdır. Bunun ardından M.Ö.330 yılına doğru asıl tapınak yapılmasına girişilmiş, ancak tamamlanamamıştır. Erken yapı, kireçtaşı tüften yapılmış basamaklı kare temellerden oluşur. Günümüzde basamaklı piramit gibi gözüken, ancak kaba taşlar ve baştan savma işçilik, şu an görünen basamakların yalnızca temeller olduğunu ve bunların üzerlerinde yer alması gereken, titizlikle inşa edildiği tahmin edilen yapının tamamen tahrip edildiğini önermektedir. Bu yapı, belki de kutsal alanda yer alan, Sardeis’in Akhaimenid Persler tarafından yönetildiği yaklaşık MÖ 500 - 400’lere tarihlenen en eski yapıdır. Sardeis’te bu döneme ait herhangi bir tapınağın izlerine rastlanmaz; belki de Lidyalıların tapınma adetleri Greklerden ve Romalılardan daha farklıydı. Bu yapı daha sonraki bir dönemde kısmen sökülmüş ve bazı bloklar erken yapının temellerini örten yeni ve daha büyük bir yapının inşasında kullanılmıştır. Bu yeni yapı, olasilikla çevre duvarlarıyla, şu an görünen seviyeden daha yüksekte yer alan ve günümüze korunagelmemiş daha küçük bir sunağa çevrilmişti. Sunağın ön kısmından mermer merdivenler ile bu yüksek seviyeye ulaşılırdı, hayvan sunuları, libasyon (tanrılara sunulan sıvı adağı) ve diğer sunular buradaki platform üzerinde yapılırdı. Mermer basamak bloklarının çoğunluğu antik dönemde yerlerinden sökülmüşlerdi, ancak yapının yan kısımlarında birkaç tanesi korunagelmiştir. Duvarlar orijinalde yüksek kaliteli stükko (sıva) ile kaplıydı, bazı yerlerde bu stükko parçalar halinde korunagelmiştir, bazıları da modern sıvanın altında korunmuştur.

Tapınaktaki Senet Taşı:
Tapınak içerisinde bulunan büyük mermerde bazı yazılar mevcuttur. Bu yazıdan anlaşılan: Bir kişi tapınağın rahibesinden borç para istemiş. Çok zengin olan rahibe borç para vermeyi kabul etmiş fakat 1 yıl sonra borcunu ödemediği takdirde tüm mal varlığını el koyacağını belirtmiş. Bu da ilk bankacılığın da burada yapıldığını göstermektedir.

Tapınaktaki Sütunlar:
Bir sütunun alt kısmında Yunanca yazılar vardır. Bu yazıda “Benim torusum ve temel bloğum yekpare bir taştır ve ben, diğer tüm [sütunlar] arasında ilk olarak ayağa kalkanım; halk tarafından değil dostlar tarafından verilmiş taşlardan [yapılarak].” Bu sütuna baş sütun diyoruz. Hepsinde endemik bitki figürü varken bu sütunda yılan figürü bulunmaktadır. Bu da açılıştaki kurdeleyi tabir ediyor. Sütunların her bir parçası 4 ton ağırlığındadır. Bu parçalar makara sistemi kullanılarak üstlere konuluyor. Uzunlukları 17,5 metredir. Yanlarda 10 ar tane, arkada 12, önde 8 adet sütun var. Tapınak 47,5 metreye 97,5 metre büyüklüğündedir.`,
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
            tr: 'kisik-deresi-antik-tas-ocaklari',
            en: 'kisik-creek-ancient-quarries',
            fr: 'carrieres-antiques-du-ruisseau-kisik',
            de: 'antike-steinbruche-am-kisik-bach',
            ja: 'kisik-creek-ancient-quarries-ja'
        },
        name: {
            tr: 'Kısık Deresi Antik Taş Ocakları',
            en: 'Kısık Creek Ancient Quarries',
            fr: 'Carrières Antiques du Ruisseau Kısık',
            de: 'Antike Steinbrüche am Kısık-Bach',
            ja: 'クシュク・クリーク古代採石場'
        },
        description: {
            tr: `KISIK (MAĞARA) DERESİ ANTİK TAŞ OCAKLARI:
Kısık Deresi’nin aşağı çığırlarında antik dönemde kullanıldığı anlaşılan mermer ocakları bulunmaktadır. Söz konusu alan Sardes şehrinin 3 km güneyinde yer almaktadır. Taş ocağı yakınında gözlemlenmiş yarı işlenmiş sütun parçalarının varlığı alanın aynı zamanda bir atölye olarak kullanıldığını göstermektedir. Ocak çevresinde antik dönem seramik parçalarının varlığı bunun kanıtı mahiyetindedir. Mermer ocaklarında Antik dönem taş kesim yöntemlerinin izlerinin bulunması, taş ocaklarının Sardes’in taş ihtiyacının giderilmesinde kullanıldığını göstermektedir. Dere boyunca bazı yerlerde işlenmiş sütunları görmek mümkündür. Bu bölge aynı zamanda yürüyüşçüler için harika bir rotadır.
Tmolos Mermeri denilen mermerler kaba kristalli ve açık beyaz renklidir. Bazen gri bandlara sahip olan, düşük dolamit (kalsiyum ve magnezyumlu karbonat bileşiminde bir kayaç) oranlı bu yerel taş Ephesos Artemis Tapınağında kullanılmıştır.
Mermerin yanında değirmen taşı, damarlı akik taşı da Sardes’te çıkar. Koyu kırmızı renkte sardoniks adı verilen taş ilk olarak Sardes Kentinde çıkmıştır. Ayrıca altın ve gümüşün ayarlarını anlamak için sürtülen taş olan mihenk (denek) taşı da bu bölgeden çıkartılmıştır. Altının ayarını anlamak için bu taşa sürtülür. Üzerine asit döküldüğünde iz varsa altın gerçek altındır. İz kaybolursa ya altının değeri düşüktür ya da sahtedir.`,
            en: `KISIK (CAVE) CREEK ANCIENT QUARRIES: In the lower reaches of Kısık Creek, there are marble quarries understood to have been used in the ancient period. The area is located 3 km south of Sardis. The presence of semi-processed column fragments shows that the area was also used as a workshop. Traces of ancient stone-cutting methods indicate these quarries met Sardis's stone needs. Processed columns can be seen along the creek. This region is also a great route for hikers.
The local stone called Tmolos Marble is coarse-crystalline and light white, sometimes with gray bands. This stone with low dolomite content was used in the Ephesus Temple of Artemis.
In addition to marble, millstones and veined agate are also mined in Sardis. The dark red stone called sardonyx first appeared in Sardis. Also, the touchstone (mihenk taşı), used to understand the purity of gold and silver, was extracted from this region. By rubbing gold on this stone and applying acid, its authenticity is verified.`,
            fr: `CARRIÈRES ANTIQUES DU RUISSEAU KISIK (GROTTE) : Dans le cours inférieur du ruisseau Kısık, se trouvent des carrières de marbre utilisées à l'époque antique, situées à 3 km au sud de Sardes. La présence de fragments de colonnes semi-finis montre que le site servait aussi d'atelier. Les méthodes de coupe antiques prouvent que ces carrières répondaient aux besoins de Sardes. On peut voir des colonnes façonnées le long du ruisseau. C'est aussi un excellent itinéraire de randonnée.
Le marbre de Tmolos, blanc clair à gros cristaux, a été utilisé dans le temple d'Artémis à Éphèse.
Outre le marbre, on y trouve des meules, de l'agate veinée et la sardoine rouge foncé. La pierre de touche (mihenk), servant à tester la pureté de l'or, provient également de cette région.`,
            de: `ANTIKE STEINBRÜCHE AM KISIK (HÖHLEN)-BACH: Im Unterlauf des Kısık-Bachs befinden sich Marmorbrüche aus der Antike, etwa 3 km südlich von Sardes. Halbbearbeitete Säulenfragmente deuten darauf hin, dass das Gebiet auch als Werkstatt diente. Spuren antiker Steintechniken belegen, dass Sardes hier seinen Steinbedarf deckte. Bearbeitete Säulen sind entlang des Bachlaufs zu sehen. Die Region ist ein idealer Wanderweg.
Der Tmolos-Marmor, grobkristallin und hellweiß, wurde auch im Artemistempel von Ephesos verwendet.
Neben Marmor werden in Sardes Mühlsteine, Achat und der dunkelrote Sardonyx gewonnen. Auch der Probierstein (mihenk taşı) zur Prüfung von Gold und Silber stammt aus dieser Region.`,
            ja: `クシュク（洞窟）クリーク古代採石場：クシュク・クリークの下流には、古代に使用された大理石の採石場があり、サルディスの南3kmに位置しています。半加工の柱の破片は、ここが作業場としても使われていたことを示しています。古代の石切技法の跡は、ここがサルディスの建設需要を満たしていた証拠です。クリーク沿いには加工された柱が見られ、ハイキングコースとしても人気です。
トモロス大理石と呼ばれる地元の石は、エフェソスのアルテミス神殿にも使用されました。
大理石のほか、砥石、瑪瑙、サルドニクスも産出されます。また、金や銀の純度を測るための「試金石（ミヘンク・タシュ）」もこの地域で採掘されました。`
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
            tr: `GÖKEYÜP ÇÖMLEKÇİLİĞİ: İnsanlığın kültürel bir sıçrama ile tarım ve hayvancılığa dayalı üretim ekonomisi ile yerleşik düzene geçtiği Neolitik Çağ'ın devrimsel buluşlarından biri de pişirilip sertleştirilmiş kilden yemek pişirme ve saklama kaplarının yapımıdır. Anadolu'da 6500'de başlayan seramik sonrası Neolitik dönemde kaplar çömlekçi çarkı kullanılmadan basit bir tabla üzerinde elle şekillendirilip güneşte kurutularak açık ateşte pişiriliyordu. Dokumacılık, sepet ve hasır örülmesinin yanı sıra seramik kap yapımı da muhtemelen kadınların el işleriydi. Profesör Güngör Güner "Anadolu'da Yaşamakta Olan İlkel Çömlekçilik" adlı kitabında kökü uygarlığın başlangıcına kadar uzanan ilkel çömlekçiliğin Anadolu'da kadınlar tarafından sürdürüldüğünü anlatıp bu yöntemi dört kategoriye ayırır. Bu tasnife göre birinci ve en ilkel yöntem yere konulmuş düz tabla üzerinde tabanı oluşturulan kabın sargı-ovalama tekniği ile şekillendirilmesidir. Gökeyüp'te halen sürdürülen ikinci yöntem de altı yuvarlak olduğu için kolayca dönebilen geniş bir çanak sertleştirilmiş toprak zemine konur ve üzerine seramikten yuvarlak bir altlık (kalıp) yerleştirilip kap yine sargı-ovalama yöntemi ile biçimlendirilir. Eskişehir'in Mihallıcık beldesine bağlı Sorgun ve Gökçeayva köyleri de Gökeyüp'le aynı üretim yöntemini sürdüren ilkel çömlekçilik merkezleridir. Ayrıca bu köylerin kuruluş öyküleri de Gökeyüp'le benzerlikler gösterir. Sorgunlular köylerinin 700-800 yıl öncelerde Horasan'dan gelerek buraya yerleşen Karayusuf ve üç oğlu ile bunların aileleri tarafından kurulduğunu; 400 yıl öncelerde bazı Sorgunlu ailelerin köyün kışlak alanına taşınıp Gökçeayva köyünü kurduklarını anlatır.
Seramik hamurları ve kap formlarındaki farklılıklara rağmen kapların benzer düzeneklerle kadınlar tarafından benzer aşamalarla yapılıp odun yığını üzerine istiflenerek açık ateşte pişirilmesi, bu çalışma için özel bir atölye kurulmayıp işin evin bir odası veya avlusunda sürdürülmesi aynı gelenek ve kökten geldiklerini gösterir. Her üç merkezde de atalarının Horasan'dan geldiğinin anlatılması göçebe yaşama da uygun olan bu ilkel teknolojinin Türk boylarının Anadolu'ya girmeye başladığı 12-13. yy'da bu yörelere Asya içlerinden taşındığını ve uygun kil yataklarının bulunduğu yerlerde geçim kaynağı olarak sürdürüldüğünü düşündürür. Anadolu'da Neolitik ve Kalkolitik çağların yerleşim merkezlerinin aynı yöntemle yapılmış kaplarında benzer kil karışımları ve benzer formların bulunmaması, çömlekçi çarkı ile seri üretime ve kapların fırında pişirilmesine geçildiği M.Ö. 3 bin sonrasında benzer kil bileşimleri ve kap türlerine rastlanmaması bu görüşü destekleyen arkeolojik kanıtlardır.`,
            en: `Pottery has been practiced by women in Gökeyüp for 6,500 years using Neolithic techniques. Pots are shaped by hand without a wheel and fired in open pits. This primitive technology was brought to Anatolia from Khorasan by Turkish tribes in the 12th-13th centuries. Gökeyüp remains a unique living archaeological center for this ancient art.`,
            fr: `La poterie est pratiquée par les femmes de Gökeyüp depuis 6 500 ans selon des techniques néolithiques. Façonnés à la main sans tour, les pots sont cuits à l\'air libre. Cette technique primitive a été apportée du Khorasan par les tribus turques aux XIIe-XIIIe siècles.`,
            de: `In Gökeyüp wird seit 6.500 Jahren Töpferei nach neolithischen Methoden betrieben. Die Gefäße werden ohne Töpferscheibe von Hand geformt und im offenen Feuer gebrannt. Diese Technik brachten türkische Stämme im 12. Jahrhundert aus Chorasan mit.`,
            ja: `ギョケユップの女性たちは6,500年前の新石器時代の技法で陶器を作り続けています。ろくろを使わず手作業で成形し、野焼きで仕上げます。12〜13世紀にホラサンから伝わった古代の芸術です。`
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
            tr: `KEMER KÖYÜ: Kemer Köyü gerek tarihi geçmişi, gerekse oldukça iyi korunmuş yerleşim dokusu ve konut mimarisi ile Salihli'nin potansiyel turizm merkezlerinden biri olabilecek durumdadır. Kemer köyü ticari yönü ile ön plana çıkmış önemli kırsal yerleşmelerden biridir. Palamut ve hayvan ticaretinde önemli bir merkez olan Kemer Köyü, mimari dokusuyla bugün de hala küçük bir kasaba görüntüsüne sahiptir. Geçmişte oldukça hareketli bir ticari faaliyete sahip köyde yürütülen iş kollarından bazıları arasında semercilik, ayakkabıcılık, demircilik, nalbant, baytar, berber, terzi, bakkal ve manifaturacı sayılabilir. Köyde en önemli iki üretim kolu ise susam yağı ve helva imalatıdır. Köyün ticari geçmişinin en önemli tanığı; çevre köylerden pazara getirilen palamutların koyulduğu depolar, bugün birçoğu aktif olmayan dükkânlardır. Bugün Kemer Köyü ile ova arasında izleri net bir şekilde izlenebilen eski ticaret yolu bulunmaktadır. Köyün kuzeyinde Nardi/Nardis isimli antik yerleşmesinin kalıntılarının olduğu düşünülen kale kalıntıları ve yoğun seramik parçalarının bulunduğu bir alan mevcuttur. Kemer köyündeki yapılarda üzerinde yunanca yazılar bulunan mermer parçalarının varlığı bu düşünceyi güçlendirmektedir.`,
            en: `KEMER VILLAGE: Kemer Village, with its historical past and well-preserved settlement texture and residential architecture, is in a position to be one of Salihli's potential tourism centers. It is an important rural settlement that came to the fore with its commercial aspect. Being an important center in the valonia oak (palamut) and livestock trade, Kemer Village still has the appearance of a small town today with its architectural fabric. trades carried out in the village in the past include saddle-making, shoemaking, blacksmithing, farriery, veterinary medicine, barbering, tailoring, grocery, and drapery. The two most important production branches in the village are sesame oil and halva production. The most important witnesses of the village's commercial past are the warehouses where the valonia oaks brought from the surrounding villages were put, and the shops, many of which are not active today. Today, there is an old trade route whose traces can be clearly followed between Kemer Village and the plain. To the north of the village, there are castle ruins thought to be the remains of the ancient settlement named Nardi/Nardis and an area where intense ceramic fragments are found. The presence of marble pieces with Greek inscriptions on them in the structures in Kemer village strengthens this thought.`,
            fr: `VILLAGE DE KEMER : Le village de Kemer, avec son passé historique et son architecture résidentielle bien préservée, est l'un des centres touristiques potentiels de Salihli. C'est un établissement rural important qui s'est distingué par son aspect commercial. Ancien centre du commerce du gland de chêne (palamut) et du bétail, Kemer a conservé son allure de petite ville. Autrefois, on y trouvait de nombreux métiers : bourrelier, cordonnier, forgeron, maréchal-ferrant, vétérinaire, coiffeur, tailleur, épicier et drapier. Les deux branches de production les plus importantes sont l'huile de sésame et le halva. Les témoins de ce passé sont les entrepôts à glands et les boutiques aujourd'hui inactives. Il existe une ancienne route commerciale dont les traces sont visibles entre le village et la plaine. Au nord, des ruines de château suggèrent l'antique cité de Nardi/Nardis, théorie renforcée par des inscriptions grecques sur des fragments de marbre.`,
            de: `DORF KEMER: Das Dorf Kemer ist aufgrund seiner historischen Vergangenheit und seiner gut erhaltenen Siedlungsstruktur ein potenzielles Tourismuszentrum von Salihli. Als wichtiges Zentrum für den Handel mit Vallonen-Eicheln (Palamut) und Vieh hat Kemer bis heute sein kleinstädtisches Erscheinungsbild bewahrt. Früher gab es hier vielfältige Berufe wie Sattler, Schuhmacher, Schmiede, Hufschmiede, Tierärzte, Barbiere, Schneider und Krämer. Die wichtigsten Produktionszweige sind Sesamöl und Halva. Zeugen dieser Vergangenheit sind die alten Lagerhäuser und Geschäfte. Zwischen dem Dorf und der Ebene verläuft ein alter Handelsweg. Nördlich des Dorfes befinden sich Burgruinen, die vermutlich zur antiken Siedlung Nardi/Nardis gehörten, worauf auch griechische Inschriften auf Marmorfragmenten hindeuten.`,
            ja: `ケメル村：ケメル村は、その歴史的背景と非常によく保存された建築様式により、サリフリの潜在的な観光センターの1つになる可能性を秘めています。商業面で際立った重要な農村集落です。オークの実（パラミット）と家畜の取引の重要な中心地であったケメル村は、今日でも建築的な構造から小さな町の外観を保っています。かつては、鞍作り、靴作り、鍛冶、蹄鉄打ち、獣医、理髪師、仕立て屋、雑貨店、布地店など、活発な商業活動が行われていました。村の最も重要な2つの生産部門は、胡麻油とハルヴァの製造です。商業的な過去の証人は、周囲の村からパラミットが運ばれた倉庫や、現在は活動していない店々です。現在、ケメル村と平野の間には、痕跡がはっきりと辿れる古い貿易路があります。村の北にはナルディ/ナルディスという古代集落の跡と考えられている城跡があり、そこでは多くの陶器の破片が見つかっています。村の建造物にギリシャ語の碑文が刻まれた大理石の破片があることは、この説を裏付けています。`
        },
        category: 'history',
        coordinates: { lat: 38.68798840823775, lng: 28.14369833471573 },
        imageUrl: 'https://i.imgur.com/NmkLLQV.jpeg',
        imageHint: 'stone bridge'
    }
];
