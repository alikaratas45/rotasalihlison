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
            en: 'Sardes, the magnificent capital of the Lydian Kingdom, hosted many firsts that changed the course of history. Known as the first place where money was minted in the 7th century BC, this ancient city was one of the most important metropolises of the ancient world with its wealth and power. The city offers a journey through time with its huge Temple of Artemis, the impressively restored Synagogue, Gymnasium, and shops from the Roman period.',
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
            en: 'This canyon, formed by the Gediz River eroding basalt rocks over thousands of years, offers impressive views. Ideal for hiking and photography.',
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
            tr: 'Yemyeşil bir doğanın ortasında, yaklaşık 30 metreden dökülen sularıyla Suuçtu Şelalesi, özellikle bahar aylarında büyüleyici bir güzelliğe bürünür. Serinlemek ve piknik yapmak için popüler bir noktadır.',
            en: 'In the midst of lush nature, Suuçtu Waterfall, with its waters pouring from about 30 meters, takes on a fascinating beauty, especially in the spring.',
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
            en: 'Located on the Gediz River in Adala, this historical bridge dates back to the Roman period. Named after a girl who donated her dowry for its construction.',
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
            tr: `Salihli-Akhisar yolu üzerinde Bintepe adıyla tanınan kral mezarları yer almaktadır. Antik Sardes Kenti ile Marmara Gölü arasında yer alan bölgeye yayılmış, sayıları 119 olan bu tümülüs (dolgu toprak) mezarlar Lidyalı soylulara aittir. Ait oldukları kişinin sosyal durumuna göre büyüklüğü, küçüklüğü değişkenlik gösteren mezarların en büyük üç tanesinin Lydia’nın ünlü krallarından Giges, Alyettes ve Kral Ardys’e ait olduğu söylenmektedir. Antik çağda bile ünlü olan Heradot’un Mısır piramitlerine benzettiği tümülüsün en büyüğünün Kral Alyattes'e ait olduğu bilinmektedir. Bintepeler Unesco Geçici Dünya Mirasları listesinde yer almaktadır. Bintepeler, jeomorfolojik yapı ve görünümün insan eliyle değiştirilmesine örnek olması açısından oldukça önemli yere sahiptir. Sardeis’in kuzeyinde yer alan Bin Tepe’deki Tümülüs mezarları, Lidya’nın antik dönemdeki en göze çarpan nirengi noktası olup, çok uzaklardan görünür ve bulunduğu alanı olağan dışı bir sihir ile işaretler. Bin Tepe Türkiye’deki en geniş mezarlık alanıdır, belki de dünyadaki en büyük mezarlık alanı kaplar. 1940’lı yıllarda en az 149 tane tümülüs mevcut iken, bunların çoğu tarımsal faaliyetler sonucu harap edildiğinden günümüze kadar ancak 115 - 119 tümülüs korunagelmiştir. Fevkalade bir güzelliğe sahip, akıldan çıkmayan bir manzaradır. Giza'daki üç piramit gibi, Bintepeler’de yer alan üç anıtsal nitelikli tümülüsten biri Karnıyarık Tepe’dir. 230 metrelik çapıyla ve güney kısmındaki 53 metrelik yüksekliğiyle kapladığı alan Giza’nın Büyük Piramidi Keops’la hemen hemen aynı çaptadır. Alyattes tümülüsü antik dönemde açılmış olduğundan, Sart Amerikan Hafriyat Heyeti, 1962 yılında, arkeolojik çalışmaların bir parçası olarak, Karnıyarık Tepe’de çalışma yapmayı uygun görmüştür. 1962 ve 1963 yıllarında yapılan jeofizik araştırmalarından ve sondaj çalışmalarından sonra, 1964, 1965 ve 1966 yıllarında tümülüsün içerisi tüneller kazılarak araştırılmıştır. 1992 yılında daha kapsamlı jeofizik araştırmaları yapılmış, bunu 1995 yılında yapılan sondaj çalışmaları takip etmiştir. 2011 yılında başka bir jeofizik çalışması yapılmış ve 2012 yılında Manisa Müzesi ile ortaklaşa tünel çalışmalarına yeniden başlanmıştır. Tahminimize göre, toprakla geri doldurulan Roma tünelleri, mezar odasına ulaşamayan hatlardır. Bunun sebebi de geri doldurmanın diğer tünellerden çıkan toprakla yapılmış olmasıdır. Tümülüsteki büyük yarık (“Karnıyarık”) da orijinal taban seviyesine inecek kadar kazılmamıştır. Gerek Roma tünelleri, gerek bizim açtığımız tüneller, tümülüsün merkezine kadar uzanmaktadırlar ve bu alanda ve çevresinde mezar odasının yerini tespit etme amacıyla araştırmalar yapılmıştır. Bu tüneller, tümülüsün yapımı ile ilgili önemli bilgiler vermektedirler. Ancak yarım kilometreden daha fazla uzunlukta tüneller açılmasına rağmen, henüz mezar odasının yeri tespit edilememiştir.
            Karnıyarık tepe de denilen ve şimdiye kadar bildiğimiz Gyges tümülüsü hakkında yeni bir görüş daha vardır. Yeni çalışmalar, tümülüsün milattan önce 600 yıllarından öncesine tarihlenemeyeceğini göstermektedir. Gyges M.O. 644 yıllarında öldüğüne göre, bu onun mezarı olamaz. Bu mezar için olası en erken tarih olan M.Ö 600 ile, Lidyalıların, Persler tarafından mağlup edildikleri ve bundan dolayı muhtemelen anıtsal mezar inşa edemeyecekleri M.O 547 yılları arasında sadece iki Lidya kralı vardır: Alyattes ve Kroisos. Alyattes’in mezarı kesin olarak Bin Tepe’nin en büyük tümülüs olan Koca Mutaf Tepe’dir ve Kroisos de Persler tarafından götürülüp, Kyros’un (Büyük Keyhüsrev) güvenilir danışmanı ilan edilmiştir, olasılıkla da kraliyet tümülüsüne defnedilmemiştir. Eğer kral için değilse, bu bir kraliçe için olabilir mi? Ana tanrıçanın doğduğu Anadolu’da bu mümkün olabilir.`,
            en: `Bintepeler: Royal tombs known as Bintepe are located on the Salihli-Akhisar road. These 119 tumulus (fill-earth) tombs, spread across the region between the Ancient City of Sardis and Lake Marmara, belong to Lydian nobles. The size of the tombs varies according to the social status of the deceased, and it is said that the three largest belong to Lydia's famous kings: Gyges, Alyattes, and King Ardys. It is known that the largest tumulus, which Herodotus compared to the Egyptian pyramids even in ancient times, belongs to King Alyattes. Bintepeler is on the UNESCO Tentative World Heritage list. It is an important example of the human modification of geomorphological structures. These burial mounds are the most striking landmark of ancient Lydia, visible from afar and marking the area with an extraordinary magic. Bin Tepe is the largest burial site in Turkey, perhaps the largest in the world. While there were at least 149 tumuli in the 1940s, only 115-119 remain today as most were destroyed by agricultural activities. Like the three pyramids at Giza, one of the three monumental tumuli in Bintepeler is Karnıyarık Tepe. With its 230-meter diameter and 53-meter height, it covers almost the same area as the Great Pyramid of Giza (Cheops). Since the Alyattes tumulus had been opened in antiquity, the Sardis American Excavation Team focused on Karnıyarık Tepe in 1962. After geophysical research and drilling in 1962-1963, the interior was explored through tunnels in 1964-1966. Despite over half a kilometer of tunnels, the burial chamber has not yet been located. A new view suggests that Karnıyarık Tepe (previously thought to be Gyges' tomb) cannot date before 600 BC. Since Gyges died around 644 BC, it likely wasn't his. Between 600 BC and the Lydian defeat by Persians in 547 BC, there were only two kings: Alyattes and Croesus. Alyattes' tomb is Koca Mutaf Tepe, and Croesus was taken by the Persians, so he likely wasn't buried here. Could it be for a queen? In Anatolia, the birthplace of the mother goddess, this is possible.`,
            fr: `Bintepeler : Les tombes royales connues sous le nom de Bintepe se trouvent sur la route Salihli-Akhisar. Ces 119 tombes de type tumulus (terre de remblai), réparties entre l'ancienne cité de Sardes et le lac Marmara, appartiennent à la noblesse lydienne. La taille des tombes varie selon le statut social du défunt, et on dit que les trois plus grandes appartiennent aux célèbres rois de Lydie : Gyès, Alyattès et le roi Ardys. On sait que le plus grand tumulus, comparé aux pyramides d'Égypte par Hérodote dès l'Antiquité, appartient au roi Alyattès. Bintepeler est inscrit sur la liste indicative du patrimoine mondial de l'UNESCO. C'est un exemple important de la modification humaine des structures géomorphologiques. Ces tumuli sont le point de repère le plus frappant de la Lydie antique, visibles de très loin. Bin Tepe est le plus grand site funéraire de Turquie, peut-être même du monde. Alors qu'il y en avait au moins 149 dans les années 1940, il n'en reste aujourd'hui que 115 à 119 car la plupart ont été détruits par les activités agricoles. Tout comme les trois pyramides de Gizeh, l'un des trois tumuli monumentaux de Bintepeler est Karnıyarık Tepe. Avec ses 230 mètres de diamètre et ses 53 mètres de hauteur, il couvre presque la même surface que la Grande Pyramide de Khéops. Malgré plus d'un demi-kilomètre de tunnels, la chambre funéraire n'a pas encore été localisée. Une nouvelle hypothèse suggère que Karnıyarık Tepe pourrait être la tombe d'une reine plutôt que celle d'un roi, compte tenu des dates historiques.`,
            de: `Bintepeler: An der Straße Salihli-Akhisar befinden sich die als Bintepe bekannten Königsgräber. Diese 119 Tumulus-Gräber (Hügelgräber), die über das Gebiet zwischen der antiken Stadt Sardes und dem Marmara-See verteilt sind, gehören dem lydischen Adel. Die Größe der Gräber variiert je nach sozialem Status, und es heißt, dass die drei größten den berühmten lydischen Königen Gyges, Alyattes und König Ardys gehören. Der größte Hügel, den Herodot schon in der Antike mit den ägyptischen Pyramiden verglich, gehört König Alyattes. Bintepeler steht auf der Tentativliste des UNESCO-Welterbes. Es ist ein bedeutendes Beispiel für die menschliche Veränderung geomorphologischer Strukturen. Diese Grabhügel sind das markanteste Wahrzeichen des antiken Lydiens, schon von weitem sichtbar. Bin Tepe ist die größte Grabstätte der Türkei, vielleicht sogar der Welt. In den 1940er Jahren gab es noch 149 Tumuli, heute sind es wegen der Landwirtschaft nur noch 115-119. Wie die drei Pyramiden von Gizeh ist der Karnıyarık Tepe einer der drei monumentalen Tumuli in Bintepeler. Mit einem Durchmesser von 230 Metern deckt er fast die gleiche Fläche ab wie die Cheops-Pyramide. Trotz über 500 Metern an Tunnelgrabungen wurde die Grabkammer bisher nicht gefunden. Neue Forschungen deuten darauf hin, dass es sich vielleicht nicht um das Grab von Gyges, sondern möglicherweise um das einer Königin handelt.`,
            ja: `ビンテペレル：サリフリとアキサールの間の道路沿いには、ビンテペとして知られる王家の墓があります。サルディス古代都市とマルマラ湖の間に広がるこれら119のテュムルス（墳丘墓）は、リディアの貴族のものです。墓の大きさは故人の社会的地位によって異なり、最も大きい3つはリディアの有名な王であるギュゲス、アリュアッテス、アルデュスのものと言われています。ヘロドトスが古代にエジプトのピラミッドと比較した最大の墳丘は、アリュアッテス王のものです。ビンテペレルはユネスコの世界遺産暫定リストに含まれています。これは、地形構造の人為的な改変の重要な例です。これらの墳丘は古代リディアの最も印象的なランドマークであり、遠くからでも見ることができ、不思議な魔力を漂わせています。ビンテペはトルコで最大、おそらく世界でも最大の墓地遺跡です。1940年代には少なくとも149ありましたが、現在は農業活動により115〜119に減少しています。ギザの3つのピラミッドのように、ビンテペレルの3つの記念碑的な墳丘の1つがカルヌヤルク・テペです。直径230メートル、高さ53メートルで、ギザのクフ王のピラミッドとほぼ同じ規模です。半キロメートル以上のトンネルが掘られましたが、埋葬室はまだ発見されていません。最新の説では、これがギュゲス王のものではなく、リディアの女王の墓である可能性も示唆されています。`
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
            en: `The Gymnasium is often thought to be from the Lydian period, but it actually belongs to the Roman period. Built as a model after an earthquake 2000 years ago, dedicated to Septimius Severus's family. It was a shopping and education center. Nobles watched athletes from balconies.

Bath:
A social tradition in the Roman Empire. Used by both nobles and athletes for hygiene and treatment.

Toilets (Latrine):
Public toilets used by both bath visitors and the public. A place for long conversations and state matters.

Shops:
34 small Byzantine shops focused on taverns, restaurants, dye preparation, and glassware.

Synagogue:
A religious center for the Jewish community in the Late Roman period. One of the largest in the ancient world.`,
            fr: `Le Gymnase est souvent considéré comme datant de l'époque lydienne, mais il appartient à l'époque romaine. Construit après un séisme il y a 2000 ans, c'était un centre commercial et éducatif.

Thermes :
Une tradition sociale romaine pour l'hygiène et les soins sportifs.

Toilettes (Latrines) :
Lieu de rencontre social et politique.

Boutiques :
34 unités byzantines comprenant des tavernes et des ateliers.

Synagogue :
Centre religieux monumental de la communauté juive à l'époque romaine tardive.`,
            de: `Das Gymnasium wird oft der lydischen Zeit zugeschrieben, gehört aber tatsächlich zur römischen Epoche. Ein Einkaufs- und Bildungszentrum auf 25 Dekar.

Bad (Thermen):
Römische soziale Tradition für Hygiene und Therapie.

Toiletten (Latrinen):
Ort für soziale und politische Gespräche.

Geschäfte:
34 kleine byzantinische Läden für Handwerk und Gastronomie.

Synagoge:
Ein religiöses Zentrum der jüdischen Gemeinde in der Spätromantik.`,
            ja: `ギムナジウムはリディア時代のものと思われがちですが、実際にはローマ時代のものです。2000年前の地震の後に再建された、ショッピングと教育の中心地でした。

浴場：
ローマ帝国の社会的習慣で、貴族やアスリートが治療や衛生のために利用しました。

トイレ（ラトリン）：
公衆トイレは社交の場でもあり、政治的な議論も行われました。

売店：
居酒屋や染料店など、34のビザンチン様式の店舗がありました。

シナゴーグ（会堂）：
後期ローマ時代のユダヤ人コミュニティの宗教的中心地でした。`
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
            tr: `Artemis Kimdir? Öncelikle Artemis Kimdir onu açıklayalım. Artemis, Roma'daki adı Diana, Zeus ile Leto'nun kızı. Phoebe olarak da bilinir. Apollon'un ikiz kız kardeşi, vahşi doğa, avcılık, okçuluk ve ay tanrıçası. Ares'in dostu ve en büyük Yunan tanrıçalarından biridir.
Artemis dev bir avcı olan Poseidon’un oğlu olan Orion’a aşık olur. Fakat bu aşk Artemisin ikiz kardeşi olan Apollon’un hoşuna gitmez. Orion birgün denizde yüzerek açılır ve uzaktan bir nokta gibi görünür. Apollon bunu fırsat bilir ve okçuluk tanrıçası olan Artemis’e o noktayı okuyla vurup vuramayacağını sorar. Okuyla siyah noktayı vuran Artemis daha sonra sevgilisi Orion’u vurduğunu anlar ve kahrolur. Onu gümüşten yapılmış ay arabasına koyar ve kendi elleriyle gökyüzüne taşır. En parlak yıldız olabilmesi için gökyüzünün en karanlık noktasını seçer. Ve geceler boyu parlayan Orion’u seyreder.
Hıristiyanlık’tan sonra tahrip edilmiş, yapı taşları başka yapılarda kullanılmıştır Dünya’nın en büyük tapınaklarından biridir.
Helenistik dönemde Zeus ve Artemis’in isimleri kullanılmış, Roma döneminde ise tapınağın batı bölümü Artemis, doğu bölümü de Antoninus Pius’a (M.S.138-161) adanmıştır.
Hristiyanların egemen olduğu dönemde ise tapınağın güney-doğu köşesine küçük bir kilise yapılmıştır (M.S. 5. YY’da). Sardes, Anadolu’daki "7 Kilise"den beşincisidir. İncil'in Vahiy bölümünde bu kiliseye yönelik mesajlar yer alır.

Sunak:
Artemis Tapınağı’nın yapımını ilk defa Lydia Kralı Kroisos kum taşından bir sunak olarak başlatmıştır (M.Ö. 500). En eski korunmuş bölgesi de bu sunaktır.

Tapınaktaki Senet Taşı:
Tapınak içerisinde bulunan mermer yazıt, bir kişinin rahibeden borç aldığını ve ödemezse mal varlığına el konulacağını belirtir. Bu, tarihteki ilk bankacılık faaliyetlerinden biri kabul edilir.

Tapınaktaki Sütunlar:
Her bir parçası 4 ton olan sütunlar 17,5 metre yüksekliğindedir. "Baş sütun" olarak adlandırılan sütunda, endemik bitki figürleri yerine yılan figürü bulunur.`,
            en: `Who is Artemis? Artemis (Diana) is the goddess of the wild, hunting, and the moon. Legend says she accidentally shot her lover Orion and placed him in the sky as a constellation. The temple is one of the world's largest. It contains a small 5th-century church, making Sardis one of the "7 Churches of Revelation". Features a sandstone altar from 500 BC and early banking inscriptions.`,
            fr: `Qui est Artémis ? Artémis (Diane) est la déesse de la chasse et de la lune. Le temple est l'un des plus grands au monde. Il abrite une petite église du Ve siècle, Sardes étant l'une des "7 Églises de l'Apocalypse". On y trouve un autel de 500 av. J.-C. et des inscriptions témoignant des débuts du système bancaire.`,
            de: `Wer ist Artemis? Artemis (Diana) ist die Göttin der Jagd und des Mondes. Der Tempel ist einer der größten der Welt. Er beherbergt eine kleine Kirche aus dem 5. Jahrhundert, da Sardes eine der "7 Gemeinden der Offenbarung" ist. Er enthält einen Altar von 500 v. Chr. und frühe Bankinschriften.`,
            ja: `アルテミスとは？ アルテミス（ダイアナ）は狩猟と月の女神です。この神殿は世界最大級の規模を誇ります。サルディスはヨハネの黙示録の「7つの教会」の1つであり、5世紀の小さな教会も併設されています。紀元前500年の祭壇や、初期の銀行業務を示す碑文も残されています。`
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
