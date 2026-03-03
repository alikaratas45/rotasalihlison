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
            en: 'Sardes Ancient City',
            fr: 'Cité Antique de Sardes',
            de: 'Antike Stadt Sardes',
            ja: 'サルディス古代都市'
        },
        description: { 
            tr: 'Lidya Krallığı\'nın görkemli başkenti Sardes, tarihin seyrini değiştiren birçok ilke ev sahipliği yapmıştır. M.Ö. 7. yüzyılda paranın ilk kez basıldığı yer olarak bilinen bu antik kent, zenginliği ve gücüyle antik dünyanın en önemli metropollerinden biriydi. Kent, devasa Artemis Tapınağı, restore edilmiş etkileyici Sinagog, Gymnasium ve Roma döneminden kalma dükkanlarıyla ziyaretçilerine adeta bir zaman yolculuğu sunar. Pactolus (Sart) Çayı\'nın altın taşıdığına inanılan bu topraklarda gezerken, Lidya\'nın zengin mirasını ve Roma\'nın ihtişamını bir arada hissedeceksiniz.',
            en: 'Sardes, the magnificent capital of the Lydian Kingdom, hosted many firsts that changed the course of history. Known as the first place where money was minted in the 7th century BC, this ancient city was one of the most important metropolises of the ancient world with its wealth and power. The city offers a journey through time with its huge Temple of Artemis, the impressively restored Synagogue, Gymnasium, and shops from the Roman period. As you wander through these lands, where the Pactolus (Sart) River was believed to carry gold, you will feel the rich heritage of Lydia and the splendor of Rome together.',
            fr: 'Sardes, la magnifique capitale du royaume de Lydie, a été le théâtre de nombreuses premières qui ont changé le cours de l\'histoire. Connue pour être le premier lieu où la monnaie a été frappée au VIIe siècle avant J.-C., cette ville antique était l\'une des métropoles les plus importantes du monde antique par sa richesse et sa puissance. La ville offre un voyage dans le temps avec son immense temple d\'Artémis, sa synagogue impressionnante restaurée, son gymnase et ses boutiques de l\'époque romaine.',
            de: 'Sardes, die prächtige Hauptstadt des Lydischen Königreichs, war Schauplatz vieler Neuerungen, die den Lauf der Geschichte veränderten. Bekannt als der erste Ort, an dem im 7. Jahrhundert v. Chr. Geld geprägt wurde, war diese antike Stadt mit ihrem Reichtum und ihrer Macht eine der wichtigsten Metropolen der antiken Welt. Die Stadt bietet eine Zeitreise mit ihrem riesigen Artemis-Tempel, der beeindruckend restaurierten Synagoge, dem Gymnasium und den Geschäften aus der Römerzeit.',
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
            en: 'Kurşunlu Thermal Springs, one of the natural paradises of Salihli, is famous for its healing thermal waters that have been providing cures for centuries. Located in a calm and peaceful atmosphere among pine forests, these springs are known for their mineral-rich waters believed to remedy many ailments from rheumatic diseases to skin conditions.',
            fr: 'Les sources thermales de Kurşunlu, l\'un des paradis naturels de Salihli, sont célèbres pour leurs eaux thermales curatives qui prodiguent des soins depuis des siècles. Situées dans une atmosphère calme et paisible au milieu des forêts de pins.',
            de: 'Die Thermalquellen von Kurşunlu, eines der Naturparadiese von Salihli, sind berühmt für ihr heilendes Thermalwasser, das seit Jahrhunderten Heilung bringt. In einer ruhigen und friedlichen Atmosphäre inmitten von Pinienwäldern gelegen.',
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
            en: 'The famous wood meatballs, the first flavor that comes to mind when Salihli is mentioned, is not just a dish, but also a cultural heritage. This meatball, cooked slowly over oak wood fire, is prepared with a perfect harmony of a special spice mix and high-quality meat.',
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
            en: 'Serving in a historical mansion, the Salihli City Museum sheds light on the rich social, cultural, and economic past of the city. The museum exhibits ethnographic artifacts reflecting the traditional way of life, agricultural tools, old photographs, and documents.',
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
            en: 'According to legend, Tabak Creek, a branch of the Pactolus (Sart) River where King Midas was freed from the curse of turning everything he touched into gold, is home to interesting geological formations. These pits, known as the "Giant Cauldrons," are natural pools formed by the water eroding the rocks.',
            fr: 'Selon la légende, le ruisseau Tabak, une branche de la rivière Pactole (Sart) où le roi Midas fut libéré de la malédiction de transformer tout ce qu\'il touchait en or.',
            de: 'Der Legende nach ist der Tabak-Bach, ein Nebenarm des Flusses Paktolos (Sart), an dem König Midas vom Fluch befreit wurde, alles, was er berührte, in Gold zu verwandeln, die Heimat interessanter geologischer Formationen.',
            ja: '伝説によると、ミダス王が触れるものすべてを金に変える呪いから解放されたパクトロス川の支流であるタバッククリークは、興味深い地質学的形成物の本拠地です。'
        },
        category: 'nature',
        coordinates: { lat: 38.458250364806744, lng: 28.044546435772286 },
        imageUrl: '/tabak.jpg',
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
            tr: 'Gediz Nehri\'nin binlerce yılda bazalt kayaları aşındırarak oluşturduğu bu kanyon, etkileyici manzaralar sunar. Doğa yürüyüşü ve fotoğrafçılık için ideal olan bölge, Kula-Salihli Jeoparkı\'nın önemli bir parçasıdır.',
            en: 'This canyon, formed by the Gediz River eroding basalt rocks over thousands of years, offers impressive views. Ideal for hiking and photography, the area is an important part of the Kula-Salihli Geopark.',
            fr: 'Ce canyon, formé par l\'érosion des roches basaltiques par la rivière Gediz au fil des milliers d\'années, offre des vues impressionnantes.',
            de: 'Diese Schlucht, die durch die Erosion von Basaltfelsen durch den Fluss Gediz über Tausende von Jahren entstanden ist, bietet beeindruckende Ausblicke.',
            ja: '何千年にもわたってゲディズ川が玄武岩を侵食して形成されたこの渓谷は、印象的な景色を眺めることができます。'
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
            en: 'This house, where Mustafa Kemal Atatürk stayed for a while during the War of Independence, has been restored and turned into a museum. Take a historical journey with items and documents from that period.',
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
            tr: 'Yemyeşil bir doğanın ortasında, yaklaşık 30 metreden dökülen sularıyla Suuçtu Şelalesi, özellikle bahar aylarında büyüleyici bir güzelliğe bürünür. Serinlemek ve piknik yapmak için popüler bir noktadır.',
            en: 'In the midst of lush nature, Suuçtu Waterfall, with its waters pouring from about 30 meters, takes on a fascinating beauty, especially in the spring. It is a popular spot for cooling off and picnicking.',
            fr: 'Au milieu d\'une nature luxuriante, la cascade de Suuçtu, avec ses eaux tombant d\'environ 30 mètres.',
            de: 'Inmitten üppiger Natur entfaltet der Suuçtu-Wasserfall, dessen Wasser aus etwa 30 Metern Höhe herabstürzt, besonders im Frühling eine faszinierende Schönheit.',
            ja: '緑豊かな自然の真っ東京にあるスーチュ滝は、約30メートルから流れ落ちる水で、特に春には魅力的な美しさを帯びます。'
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
            tr: 'Adala\'da Gediz Nehri üzerinde yer alan bu tarihi köprü, Roma döneminden kalmadır. Efsaneye göre, köprünün yapımı için halktan toplanan paraya çeyizini bağışlayan bir kızın adını almıştır.',
            en: 'Located on the Gediz River in Adala, this historical bridge dates back to the Roman period. According to legend, it was named after a girl who donated her dowry to the money collected from the public for the construction of the bridge.',
            fr: 'Situé sur la rivière Gediz à Adala, ce pont historique remonte à la période romaine. Selon la légende, il a été nommé ainsi d\'après une jeune fille qui a fait don de sa dot.',
            de: 'Diese historische Brücke über den Fluss Gediz in Adala stammt aus der Römerzeit. Der Legende nach wurde sie nach einem Mädchen benannt, das ihre Mitgift spendete.',
            ja: 'アダラのゲディズ川に架かるこの歴史的な橋は、ローマ時代にまでさかのぼります。'
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
            tr: 'Lidya kralları ve soyluları için yapılmış anıt mezarlardır. Anadolu\'nun en büyük tümülüslerinin bulunduğu bu alan, "Anadolu\'nun Piramitleri" olarak anılır. Karun ve Alyattes gibi ünlü kralların mezarları burada yer alır.',
            en: 'These are monumental tombs built for Lydian kings and nobles. This area, which contains the largest tumuli in Anatolia, is known as the "Pyramids of Anatolia." The tombs of famous kings like Croesus and Alyattes are located here.',
            fr: 'Ce sont des tombes monumentales construites pour les rois et les nobles lydiens. Cette zone est connue sous le nom de "Pyramides d\'Anatolie".',
            de: 'Dies sind monumentale Gräber, die für lydische Könige und Adlige erbaut wurden. Dieses Gebiet ist als die "Pyramiden Anatoliens" bekannt.',
            ja: 'これらはリディアの王や貴族のために建てられた記念碑的な墓です。アナトリアで最大の墳丘墓があるこの地域は、「アナトリアのピラミッド」として知られています。'
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
            tr: `Gymnasium Lidya döneminden kalma olarak bilinir fakat Roma dönemine aittir. Burada Lidya dönemine ait herhangi bir kalıntı yoktur. Bundan yaklaşık 2000 yıl önce geçirdiği depremin ardından model olarak yapılmıştır. Septimius Severus bu yapıyı oğulları Geta ve Caracalla’ya bir de eşi Julia Domna’ya adamıştır. (Septimius’tan sonra oğlu Caracalla ve Geta beraber imparator olmuşlar fakat daha sonra Caracella Geta’yı bir suikastle öldürtmüştür). Gymnasium yaklaşık 25 dönüm üzerine kurulmuş bir alış veriş merkezi ve eğitim sahasıdır. Hamamlardan çıkan soyluların yukarıdaki balkonlarda oturup meyvelerini yerken sporcuları izliyorlardı. Bu alanın bir kısmı kapalı idi. Burada restoranlar, ibadet yerleri, dükkânlar ve tuvaletler vardır. Toplamda 34 adet dükkân mevcuttur.

Hamam:
Yıkanmak, Roma İmparatorluğu’nun tamamına yayılmış̧ olan bir sosyal gelenektir. Bu gelenek, ılık, sıcak ve soğuk su ile keyifle yıkanarak, sohbet ederek, egzersiz yaparak ve kültürel uygulamalarda bulunarak serbest zamanların değerlendirildiği faaliyetleri içermektedir. Hem soyluların hem de spor yapanların spordan sonra kullandıkları bu hamam ayrıca spor sırasında kendini inciten sporcular tedavi amaçlı kullanmışlardır. Ayaklarını incitenlerin en üst kısımda oturup sadece ayaklarını soktukları, bacaklarını incitenlerin 2. Basamağa oturarak yarı beline kadar suya gömüldükleri, tüm vücudunda ağrı olanlar başları dışarıda kalacak şekilde suya girdikleri bir hamamdı.

Tuvaletler (Latrin):
Umumi tuvaletlerin küçük olması ve kuzey ve doğu yönlerindeki kapılar, bu alanın hem Hamam ziyaretçileri hem de mermer yolu kullanan halk tarafından kullanılmış olacağı fikrini akıllara getirmektedir. İki adet birbirine benzer şekilde düzenlenmiş uzun dikdörtgen biçimli odalar, erkekler ve kadınlar için ayrı ayrı hizmet vermek için yapıldıklarını düşündürür. Burada uzun uzun sohbet edilir ve memleket meseleleri konuşulurdu. Hatta önemli görüşmeler olduğu esnada dışarıdan bando takımı çağırılır ve onların gürültülerinden dolayı ses dışarıya gitmezdi.

Dükkanlar:
Son halleriyle dikdörtgen şekilli 34 adet küçük Bizans dükkânı mevcuttu. Kazılarda ortaya çıkarılan eserler dükkânların değişken kimlikleri ile ilgili bilgi vermektedir: birkaç küçük ünite taverna ya da lokanta olarak hizmet verirken, bazıları boya hazırlama, diğerleri ise cam eşyaların ve hırdavatların satımına odaklanmışlardı.

Sinagog (Havra):
Abidevi havra, Geç Roma döneminde, Musevi toplumunun dini merkezi olarak kullanılmaktaydı. Bin kişiyi barındırabilecek büyüklükte ve uzunluğu 50 metreyi aşkın ana toplantı salonu yer almaktadır. Ön avlunun ortasındaki çeşme, ayinlerden önce cemaatin ellerini yıkadığı bir yerdi. Çeyiz hazırlamak için hayat kadınlığı yapan genç kızlar evlenmeden önce bu havuzda yıkanarak günahlarından arınırlardı.`,
            en: `The Gymnasium is often thought to be from the Lydian period, but it actually belongs to the Roman period. There are no Lydian remains here. It was built as a model after an earthquake about 2000 years ago. Septimius Severus dedicated this structure to his sons Geta and Caracalla, and his wife Julia Domna. (After Septimius, his sons Caracalla and Geta became co-emperors, but Caracalla later had Geta assassinated). The Gymnasium is a shopping center and education area built on approximately 25 acres. Nobles emerging from the baths would sit on the balconies above, eating fruit while watching the athletes. There are restaurants, places of worship, shops, and toilets here. In total, there are 34 shops.

Bath:
Bathing was a social tradition spread throughout the Roman Empire. This tradition included washing with warm, hot, and cold water, chatting, and exercising. Used by both nobles and athletes, this bath was also used for treatment. Those with foot injuries sat at the top; those with leg injuries sat on the second step to be immersed up to the waist; and those with full-body pain submerged themselves leaving only their heads out.

Toilets (Latrine):
The public toilets suggest they were used by both bath visitors and the public. Two similar long rectangular rooms likely served men and women separately. People held long conversations here about state matters. During important meetings, a band was called outside so the noise would prevent voices from being heard outside.

Shops:
In their final form, there were 34 small Byzantine shops. Excavations show their varied identities: some served as taverns or restaurants, some specialized in dyes, and others in glassware or hardware sales.

Synagogue:
This monumental synagogue was the religious center of the Jewish community in the Late Roman period. The main hall is over 50 meters long and could hold a thousand people. The fountain in the front courtyard was for ritual hand washing. It is said that young girls who worked as prostitutes to prepare a dowry would wash in this pool before marriage to be purified from their sins.`,
            fr: `Le Gymnase est souvent considéré comme datant de l'époque lydienne, mais il appartient en réalité à l'époque romaine. Il n'y a aucun vestige lydien ici. Il a été construit comme modèle après un tremblement de terre il y a environ 2000 ans. Septime Sévère a dédié cette structure à ses fils Geta et Caracalla, ainsi qu'à son épouse Julia Domna. Le Gymnase est un centre commercial et un espace éducatif s'étendant sur environ 25 décares. Les nobles sortant des thermes s'asseyaient sur les balcons pour manger des fruits tout en regardant les athlètes. On y trouvait des restaurants, des lieux de culte, des boutiques et des toilettes. Au total, il y a 34 boutiques.

Thermes :
Se baigner était une tradition sociale dans tout l'Empire romain. Utilisés par les nobles et les sportifs, ces thermes servaient aussi de lieu de traitement. Ceux qui étaient blessés aux pieds ne trempaient que les pieds ; ceux blessés aux jambes étaient immergés jusqu'à la taille ; et ceux souffrant de douleurs sur tout le corps s'immergeaient totalement en ne laissant que la tête dépasser.

Toilettes (Latrines) :
Les toilettes publiques étaient utilisées par les visiteurs des thermes et le public. On y discutait longuement des affaires du pays. Lors de réunions importantes, une fanfare était appelée à l'extérieur pour que le bruit empêche les voix d'être entendues au-dehors.

Boutiques :
Il y avait 34 petites boutiques byzantines. Les fouilles révèlent leurs diverses activités : tavernes, restaurants, ateliers de teinture ou vente de verrerie et de quincaillerie.

Synagogue :
Cette synagogue monumentale était le centre religieux de la communauté juive à l'époque romaine tardive. La salle principale mesure plus de 50 mètres et peut accueillir mille personnes. La fontaine de la cour servait au lavage rituel des mains. On raconte que les jeunes filles qui se prostituaient pour préparer leur dot se lavaient dans ce bassin avant le mariage pour être purifiées de leurs péchés.`,
            de: `Das Gymnasium wird oft der lydischen Zeit zugeschrieben, gehört aber tatsächlich zur römischen Epoche. Es gibt hier keine lydischen Überreste. Es wurde vor etwa 2000 Jahren nach einem Erdbeben als Modell errichtet. Septimius Severus widmete dieses Bauwerk seinen Söhnen Geta und Caracalla sowie seiner Frau Julia Domna. Das Gymnasium ist ein Einkaufszentrum und Bildungsbereich auf etwa 25 Dekar. Adlige, die aus den Bädern kamen, saßen auf den Balkonen, aßen Früchte und beobachteten die Athleten. Es gab Restaurants, Gebetsstätten, Geschäfte und Toiletten. Insgesamt gibt es 34 Geschäfte.

Bad (Thermen):
Das Baden war eine soziale Tradition im gesamten Römischen Reich. Sowohl Adlige als auch Sportler nutzten die Bäder, auch zu Heilzwecken. Wer Fußverletzungen hatte, tauchte nur die Füße ein; wer Beinverletzungen hatte, tauchte bis zur Taille ein; und wer Schmerzen am ganzen Körper hatte, tauchte bis zum Kopf unter.

Toiletten (Latrinen):
Die öffentlichen Toiletten wurden von Badbesuchern und der Öffentlichkeit genutzt. Hier wurden lange Gespräche über Staatsangelegenheiten geführt. Bei wichtigen Treffen wurde draußen eine Musikkapelle gerufen, damit der Lärm verhinderte, dass Stimmen nach außen drangen.

Geschäfte:
Es gab 34 kleine byzantinische Geschäfte. Ausgrabungen zeigen ihre vielfältige Nutzung: Tavernen, Restaurants, Färbereien oder der Verkauf von Glas- und Eisenwaren.

Synagoge:
Diese monumentale Synagoge war das religiöse Zentrum der jüdischen Gemeinde in der Spätromantik. Die Haupthalle ist über 50 Meter lang und bietet Platz für tausend Personen. Der Brunnen im Vorhof diente der rituellen Handwaschung. Es heißt, dass junge Mädchen, die als Prostituierte arbeiteten, um ihre Mitgift vorzubereiten, sich vor der Hochzeit in diesem Becken wuschen, um von ihren Sünden gereinigt zu werden.`,
            ja: `ギムナジウムはリディア時代のものと思われがちですが、実際にはローマ時代のものです。ここにはリディア時代の遺構はありません。約2000年前の地震の後、モデルとして建設されました。セプティミウス・セウェルスは、この建物を息子のゲタとカラカラ、そして妻のユリア・ドムナに捧げました。ギムナジウムは約25デカールの敷地に建てられたショッピングセンター兼教育の場です。浴場から出てきた貴族たちは、バルコニーに座って果物を食べながらアスリートたちを眺めていました。ここにはレストラン、礼拝所、売店、トイレがあり、合計34の店舗が存在しました。

浴場：
入浴はローマ帝国全土に広まった社会的習慣でした。貴族もアスリートも利用し、怪我の治療にも使われました。足を痛めた人は足だけを浸し、脚を痛めた人は腰まで浸かり、全身が痛む人は頭だけを出して全身を沈めて入浴しました。

トイレ（ラトリン）：
公衆トイレは浴場の利用者と一般市民の両方に使われていました。ここでは国政などの長い会話が行われました。重要な話し合いの最中には、外に楽団を呼び、その騒音で声が外に漏れないようにしました。

売店：
最終的には34の小さなビザンチン様式の店がありました。調査により、居酒屋、レストラン、染料店、ガラス細工や金物店など、多様な活動が行われていたことが分かっています。

シナゴーグ（会堂）：
この記念碑的な会堂は、後期ローマ時代のユダヤ人コミュニティの宗教的中心地でした。長さ50メートルを超え、1000人を収容できました。中庭の噴水は儀式の前に手を洗う場所でした。持参金を用意するために売春をしていた少女たちが、結婚前にこのプールで身を清め、罪を洗ったと言い伝えられています。`
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
            tr: `Artemis Kimdir? Artemis (Roma'daki adı Diana), Zeus ile Leto'nun kızı, Apollon'un ikiz kız kardeşidir. Vahşi doğa, avcılık ve ay tanrıçasıdır. Efsaneye göre Artemis, Orion'a aşık olur. Apollon bu aşka karşı çıkar ve Artemis'i kandırarak Orion'u okuyla vurmasına sebep olur. Artemis kahrolur ve Orion'u gümüş ay arabasıyla gökyüzüne taşır; en parlak yıldız olması için onu gökyüzünün en karanlık noktasına yerleştirir.

Tapınak Tarihi:
Dünyanın en büyük tapınaklarından biri olan bu yapı, Helenistik dönemde Zeus ve Artemis'e, Roma döneminde ise Artemis ve İmparator Antoninus Pius'a adanmıştır. M.S. 17 depreminde yıkılmış, Antoninus Pius ve Faustina tarafından onarılmıştır. İçerisine imparator ve eşinin devasa heykelleri konulmuştur (Faustina'nın başı bugün British Museum'dadır). Hristiyanlık döneminde (M.S. 5. YY) güneydoğu köşesine küçük bir kilise eklenmiş ve 7. YY'a kadar kullanılmıştır.

Sardes ve 7 Kilise:
Sardes, Anadolu'daki "7 Kilise"den beşincisidir. İncil'in Vahiy bölümünde bu kiliseye "Uyan! Yaptıklarının Tanrı katında tamamlanmamış olduğunu gördüm" mesajı verilir. Bu 7 kilise (Efes, İzmir, Bergama, Salihli, Alaşehir, Denizli, Akhisar), Hristiyanlığın en erken ve kutsal merkezleri kabul edilir.

Sunak:
M.Ö. 500'de Kral Kroisos tarafından başlatılan kum taşı sunak, yapının en eski kısmıdır. Törenlerin odak noktasıdır. M.Ö. 330'da devasa tapınak inşaatı başlamış ancak tamamlanamamıştır.

Tapınaktaki Senet Taşı:
Tapınaktaki bir mermer yazıtta, bir şahsın tapınak rahibesinden borç aldığı ve ödeyemezse mal varlığına el konulacağı yazılıdır. Bu, tarihteki ilk bankacılık faaliyetlerinden biri kabul edilir.

Sütunlar:
Her bir parçası 4 ton olan sütunlar 17,5 metre yüksekliğindedir. "Baş sütun" olarak adlandırılan sütunda, dostlar tarafından hediye edildiğini belirten Yunanca bir yazıt ve endemik bitki figürleri yerine yılan figürü bulunur.`,
            en: `Who is Artemis? Artemis (Diana in Rome) is the daughter of Zeus and Leto, and twin sister of Apollo. She is the goddess of the wild, hunting, and the moon. Legend says Artemis fell in love with Orion. Apollo tricked her into shooting Orion with her arrow. Devastated, she placed Orion in the sky's darkest point so he could be the brightest star (the constellation Orion).

Temple History:
One of the world's largest temples, it was dedicated to Zeus and Artemis in the Hellenistic period, and later to Artemis and Emperor Antoninus Pius in the Roman period. Damaged in the 17 AD earthquake, it was restored by Antoninus Pius and Faustina. Colossal statues were erected; the head of Empress Faustina's statue is now in the British Museum. A small church was added in the 5th century AD and used until the 7th century.

Sardis and the 7 Churches:
Sardis is the 5th of the "7 Churches" of Revelation in the Bible. The message to Sardis was: "Wake up! I have found your deeds unfinished." These 7 churches (Ephesus, Smyrna, Pergamon, Sardis, Philadelphia, Laodicea, Thyatira) are sacred early Christian centers.

The Altar:
Started around 500 BC by King Croesus, this sandstone altar is the oldest part and the focus of ceremonies. Construction of the massive temple began around 330 BC but was never completed.

The Promissory Note Stone:
An inscription on a marble block records a loan from a temple priestess, showing early banking activities.

Columns:
The 17.5m high columns were built with segments weighing 4 tons each. The "Head Column" features a Greek inscription stating it was gifted by friends and features a snake figure instead of endemic plants.`,
            fr: `Qui est Artémis ? Artémis (Diane) est la fille de Zeus et de Léto, déesse de la nature sauvage et de la lune. La légende raconte qu'elle plaça son amant Orion dans le ciel pour en faire la constellation la plus brillante.

Histoire du Temple :
L'un des plus grands au monde, dédié à Zeus, Artémis et plus tard à l'empereur Antoninus Pius. Une petite église y fut ajoutée au Ve siècle. Sardes est la 5ème des 7 Églises de l'Apocalypse.

L'Autel : Commencé par le roi Crésus vers 500 av. J.-C., c'est la partie la plus ancienne.

La Pierre de Crédit : Témoigne des prémices de l'activité bancaire antique.

Colonnes : Hautes de 17,5 m, elles témoignent d'une ingénierie exceptionnelle.`,
            de: `Wer war Artemis? Artemis (Diana) ist die Tochter von Zeus und Leto, Göttin der Jagd und des Mondes. Sie setzte Orion als Sternbild an den Himmel.

Tempelgeschichte:
Einer der größten Tempel der Welt. In der Römerzeit Antoninus Pius gewidmet. Sardes ist die 5. der 7 Gemeinden der Offenbarung. Im 5. Jh. wurde eine kleine Kirche angebaut.

Altar: Von König Krösus um 500 v. Chr. errichtet.

Schuldschein-Stein: Ein früher Vorläufer des Bankwesens.

Säulen: 17,5 m hoch, jedes Segment wiegt 4 Tonnen.`,
            ja: `アルテミスとは？ ゼウスとレトの娘で、狩猟と月の女神です。悲しい恋の末、恋人オリオンを星座にしました。

神殿の歴史：
世界最大級の神殿。ヘレニズム時代はゼウスとアルテミスに、ローマ時代はアントニヌス・ピウス帝に捧げられました。サルディスはヨハネの黙示録の「7つの教会」の5番目です。

祭壇：紀元前500年頃、クロイソス王により建設。

借用書の石：初期の銀行業務が行われていた証拠です。

柱：高さ17.5メートル。パーツ一つが4トンに及びます。`
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
            en: 'This quarry, where the marbles used in the magnificent structures of the Ancient City of Sardis were extracted, offers important clues about ancient stonemasonry and engineering.',
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
            tr: 'Salihli\'ye bağlı Gökeyüp mahallesinde yüzyıllardır devam eden geleneksel çömlekçilik sanatı.',
            en: 'The traditional art of pottery that has been going on for centuries in the Gökeyüp neighborhood of Salihli.',
            fr: 'L\'art traditionnel de la poterie qui se perpétue depuis des siècles dans le quartier de Gökeyüp à Salihli.',
            de: 'Die traditionelle Töpferkunst, die seit Jahrhunderten im Stadtteil Gökeyüp von Salihli fortbesteht.',
            ja: 'サリフリのギョケユップ地区で何世紀にもわたって続いている伝統的な陶芸。'
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
