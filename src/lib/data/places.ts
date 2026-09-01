
import type { Place } from '@/lib/definitions';

export const places: Place[] = [
    {
        id: '1',
        slug: { tr: 'sardes-antik-kenti', en: 'sardes-ancient-city', fr: 'cite-antique-de-sardes', de: 'antike-stadt-sardes', ja: 'sardes-ancient-city-ja' },
        name: { tr: 'Sardes Antik Kenti', en: 'Sardis Ancient City', fr: 'Cité Antique de Sardes', de: 'Antike Stadt Sardes', ja: 'サルディス古代都市' },
        description: { 
            tr: `Salihli’nin tarihini başlatan Antik Sardes (SART) kenti, Gediz havzasında, Sart Çayı kıyısında ve Bozdağ’ın batısındaki tepelerin kuzey yamaçları üzerinde kurulmuştur. M.Ö. 7. ve 6. yüzyıllarda Lidya Devleti'nin görkemli başkenti olan Sardes, tarihte paranın ilk basıldığı yer olarak bilinir. \n\nEndüstriyel buluşların, lirik şiirin ve heykelciliğin merkezi olan kent, Pers, Roma ve Bizans dönemlerinde de önemini korumuştur. Mezarların yerleşim merkezleri çevresinde bulunması, antik kentin bugünkü Salihli’nin güneyine kadar uzanan geniş bir medeniyet havzası olduğunu kanıtlamaktadır.`, 
            en: `Sardis, the magnificent capital of the Lydian Kingdom in the 7th and 6th centuries BC, is known as the place where money was first minted in history. Located in the Gediz basin, on the slopes of Mount Tmolus (Bozdağ), it was a center of industrial inventions, lyric poetry, and sculpture. \n\nIt maintained its importance throughout the Persian, Roman, and Byzantine periods as a major administrative and cultural hub. The vast spread of tumuli and ruins proves that the ancient city was a broad civilization basin reaching the south of modern-day Salihli.`,
            fr: `Sardes, la magnifique capitale du royaume lydien aux VIIe et VIe siècles avant J.-C., est connue comme le lieu où la monnaie a été frappée pour la première fois dans l'histoire. Située dans le bassin du Gediz, sur les pentes du mont Tmolos, elle fut un centre d'inventions industrielles, de poésie lyrique et de sculpture.`,
            de: `Sardes, die prachtvolle Hauptstadt des lydischen Königreichs im 7. und 6. Jahrhundert v. Chr., ist als der Ort bekannt, an dem zum ersten Mal in der Geschichte Geld geprägt wurde. In der Nähe des heutigen Salihli gelegen, war es ein Zentrum für industrielle Erfindungen, Lyrik und Bildhauerei.`,
            ja: `紀元前7世紀から6世紀にかけてのリディア王国の壮大な首都サルディスは、歴史上初めて硬貨が鋳造された場所として知られています。ゲディズ盆地に位置し、工業的発明、叙情詩、彫刻の中心地でした。`
        },
        category: 'history',
        coordinates: { lat: 38.489271, lng: 28.037149 },
        imageUrl: 'https://i.imgur.com/2deYxHC.png',
        imageHint: 'ancient ruins'
    },
    {
        id: '6',
        slug: { tr: 'tabak-deresi-dev-kazanlari', en: 'tabak-creek-giant-cauldrons', fr: 'cite-tabak-ruisseau-chaudrons', de: 'tabak-bach-riesenkessel', ja: 'tabak-creek-giant-cauldrons-ja' },
        name: { tr: 'Tabak Deresi Dev Kazanları', en: 'Tabak Creek Giant Cauldrons', fr: 'Chaudrons Géants du Ruisseau Tabak', de: 'Tabak-Bach Riesenkessel', ja: 'タバッククリークの巨大な大釜' },
        description: { 
            tr: `Salihli’nin doğal gizemlerinden biri olan Tabak Deresi Dev Kazanları, suyun binlerce yıl boyunca kayaları aşındırmasıyla oluşmuş muazzam doğal havuzlardır. Kral Midas efsanesine ev sahipliği yapan bu bölge, altın dokunuş lanetinden kurtulmak için Midas’ın yıkandığı yer olarak bilinir. \n\nDoğa yürüyüşü ve fotoğraf meraklıları için saklı bir cennet niteliğindedir. Kayaların içindeki bu dairesel oyuklar, doğanın gücünü ve estetiğini en çıplak haliyle sergiler.`, 
            en: `Tabak Creek Giant Cauldrons are magnificent natural pools formed by water eroding rocks over thousands of years. This region is home to the legend of King Midas, known as the place where he bathed to be freed from the golden touch curse. \n\nIt is a hidden paradise for hiking and photography enthusiasts. These circular hollows within the rocks display the power and aesthetics of nature in its purest form.`,
            fr: `Les chaudrons géants du ruisseau Tabak sont de magnifiques bassins naturels formés par l'érosion des roches par l'eau. Berceau de la légende du roi Midas.`,
            de: `Die Riesenkessel des Tabak-Bachs sind prächtige natürliche Becken, die durch die jahrtausendelange Erosion von Felsen durch Wasser entstanden sind. Heimat der Legende von König Midas.`,
            ja: `タバッククリークの巨大な大釜は、数千年にわたって水が岩を侵食して形成された壮大な自然のプールです。ミダス王の伝説の地。`
        },
        category: 'nature',
        coordinates: { lat: 38.4725, lng: 28.0288 },
        imageUrl: 'https://i.imgur.com/aOjHCNC.jpeg',
        imageHint: 'river rocks'
    },
    {
        id: '12',
        slug: { tr: 'gymnasium', en: 'gymnasium', fr: 'gymnase', de: 'gymnasium', ja: 'gymnasium-ja' },
        name: { tr: 'Gymnasium', en: 'Gymnasium', fr: 'Gymnase', de: 'Gymnasium', ja: 'ギムナジウム' },
        description: { 
            tr: `Sardes Antik Kenti'nin en görkemli yapılarından biri olan Roma Hamam-Gymnasium Kompleksi, antik çağın eğitim, spor ve sosyal yaşam merkezidir. MS 2. yüzyılda inşa edilen bu devasa yapı, mermer işçiliği ve abidevi sütunlarıyla Roma mimarisinin en güzel örneklerinden birini sunmaktadır. \n\nKompleksin en dikkat çekici kısmı olan "Mermer Avlu" (Kaisersaal), imparatorlara adanmış olup eşsiz bir restorasyon çalışmasıyla ayağa kaldırılmıştır. Burası sadece spor yapılan bir alan değil, aynı zamanda felsefe ve sanatın tartışıldığı kültürel bir odak noktasıydı.`, 
            en: `The Roman Bath-Gymnasium Complex, one of the most magnificent structures in Sardis, was the center of education, sports, and social life in antiquity. Built in the 2nd century AD, this massive structure showcases some of the finest examples of Roman architecture with its intricate marble work and monumental columns. \n\nThe "Marble Court" (Kaisersaal), dedicated to the Roman emperors, has been restored to its former glory. It was not just a place for physical exercise, but also a cultural hub where philosophy and art were discussed.`,
            fr: `Le complexe romain Thermes-Gymnase, l'une des structures les plus grandioses de Sardes, était le centre de l'éducation, du sport et de la vie sociale dans l'Antiquité. Construit au IIe siècle de notre ère, ce bâtiment massif présente des exemples exceptionnels d'architecture romaine.`,
            de: `Der römische Bad-Gymnasium-Komplex, eines der prächtigsten Bauwerke in Sardes, war in der Antike das Zentrum für Bildung, Sport und soziales Leben. Er wurde im 2. Jahrhundert n. Chr. erbaut und zeigt feinste römische Architektur.`,
            ja: `サルディスで最も壮大な建造物の一つであるローマ浴場・ギムナジウム・コンプレックスは、古代の教育、スポーツ、社会生活の中心地でした。西暦2世紀に建てられたこの巨大な建造物は、ローマ建築の優れた例を示しています。`
        },
        category: 'history',
        coordinates: { lat: 38.488480, lng: 28.040289 },
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
                    tr: `Abidevi havra, Geç Roma döneminde, Musevi toplumunun dini merkezi olarak kullanılmaktaydı. 1962 yılında ortaya çıkarılan bina ve süslemeler kısmen restore edilmiştir. Bin kişiyle barındırabilecek büyüklükte ve uzunluğu 50 metreyi aşkın ana toplantı salonu yer almaktadır. \n\nYerden 14 metre yükseklikteki çatı masif taş payelerle desteklenmiştir. Bina, birkaç kere yenilenmiştir. Önceleri, Roma Hamam-Gymnasium Kompleksinin bir parçası iken, daha sonraları, Musevi toplumunun ibadethanesi haline dönüşmüştür. Mozaik yer döşemeleri, mefruşatı ve mermer duvar bezemeleri, MS 4. ve 5. yüzyıldan kalan nadide eserlerdir.`,
                    en: `The monumental synagogue was used as the religious center of the Jewish community in the Late Roman period. Excavated in 1962, it features a main assembly hall large enough to accommodate a thousand people, exceeding 50 meters in length. \n\nThe roof, 14 meters above the ground, was supported by massive stone pillars. Initially part of the Roman Bath-Gymnasium Complex, it later became a dedicated place of worship. The mosaic floors and marble wall decorations are precious remains from the 4th and 5th centuries AD.`,
                    fr: `Cette synagogue monumentale servait de centre religieux à la communauté juive à la fin de l'époque romaine. Découvert en 1962, le bâtiment comprend une salle de réunion principale pouvant accueillir mille personnes.`,
                    de: `Die monumentale Synagoge diente in der spätrömischen Zeit als religiöses Zentrum der jüdischen Gemeinde. Das 1962 freigelegte Gebäude verfügt über eine Versammlungshalle für tausend Personen.`,
                    ja: `この記念碑的なシナゴーグは、後期ローマ時代にユダヤ人コミュニティの宗教的中心地として使用されていました。1000人を収容できる大きさのメインホールがあります。`
                }
            }
        ]
    },
    {
        id: '7',
        slug: { tr: 'adala-volkanik-kanyonu', en: 'adala-volcanic-canyon', fr: 'canyon-volcanique-adala', de: 'vulkanischer-canyon-adala', ja: 'adala-volcanic-canyon-ja' },
        name: { tr: 'Adala Volkanik Kanyonu', en: 'Adala Volcanic Canyon', fr: 'Canyon Volcanique d\'Adala', de: 'Vulkanischer Canyon von Adala', ja: 'アダラ火山渓谷' },
        description: { 
            tr: `Kula-Salihli UNESCO Küresel Jeoparkı’nın bir parçası olan Adala Volkanik Kanyonu, Gediz Nehri’nin binlerce yıl önce akan lavları aşındırmasıyla oluşmuştur. Jeolojik açıdan "Siyah Lavlar" arasında akan nehrin oluşturduğu manzara, doğa severler için büyüleyicidir. \n\nKanyon, doğa yürüyüşü, fotoğrafçılık ve huzur arayanlar için eşsiz bir rotadır. Volkanik kaya oluşumlarının nehirle buluştuğu bu alan, bölgenin volkanik geçmişine dair en canlı kanıtları barındırmaktadır.`, 
            en: `Part of the Kula-Salihli UNESCO Global Geopark, the Adala Volcanic Canyon was formed by the Gediz River eroding ancient lava flows over thousands of years. The sight of the river flowing through "Black Lavas" is mesmerizing for nature enthusiasts. \n\nThe canyon offers unique routes for hiking, photography, and those seeking tranquility. These volcanic rock formations provide vivid evidence of the region's intense volcanic history.`,
            fr: `Faisant partie du géoparc mondial UNESCO de Kula-Salihli, le canyon volcanique d'Adala ha été formé par le fleuve Gediz érodant d'anciennes coulées de lave. C'est un site fascinant pour les amoureux de la nature.`,
            de: `Der Adala-Vulkancanyon, Teil des UNESCO-Global-Geoparks Kula-Salihli, entstand durch die Erosion alter Lavaströme durch den Fluss Gediz. Ein faszinierender Ort für Naturfreunde.`,
            ja: `ユネスコ世界ジオパークであるクラーサリフリの一部であるアダラ火山渓谷は、ゲディズ川が数千年にわたって古代の溶岩流を侵食して形成されました。`
        },
        category: 'nature',
        coordinates: { lat: 38.581712, lng: 28.271791 },
        imageUrl: 'https://i.imgur.com/I6L6rHm.jpeg',
        imageHint: 'volcanic canyon'
    },
    {
        id: '11',
        slug: { tr: 'bintepeler-lidya-tumulusleri', en: 'bintepeler-lydian-tumuli', fr: 'tumulus-lydiens-de-bintepeler', de: 'lydische-tumuli-von-bintepeler', ja: 'bintepeler-lydian-tumuli-ja' },
        name: { tr: 'Bintepeler Lidya Tümülüsleri', en: 'Bintepeler Lydian Tumuli', fr: 'Tumulus Lydiens de Bintepeler', de: 'Lydische Tumuli von Bintepeler', ja: 'ビンテペレル・リディアの墳丘墓' },
        description: { 
            tr: `Dünyanın en büyük tümülüs alanlarından biri olan Bintepeler, antik Lidya krallarına ve soylularına ait yaklaşık 100 civarında yapay tepeden (tümülüs) oluşur. "Anadolu’nun Piramitleri" olarak da adlandırılan bu alan, antik dünyanın ölü gömme geleneklerini en görkemli haliyle yansıtır. \n\nMarmara Gölü’nün güneyinde yer alan bu devasa mezar anıtları, Lidya’nın zenginliğini ve gücünü simgeler. En büyüğü Lidya Kralı Alyattes’e ait olan tümülüs, Heredot tarafından dünyanın en büyük yapılarından biri olarak tanımlanmıştır.`, 
            en: `Bintepeler is one of the world's largest tumulus areas, consisting of nearly 100 artificial hills (tumuli) belonging to Lydian kings and nobles. Often called the "Pyramids of Anatolia," this site showcases ancient burial traditions at their grandest scale. \n\nLocated south of Lake Marmara, these massive funerary monuments symbolize the wealth and power of Lydia. The largest one, belonging to King Alyattes, was described by Herodotus as one of the greatest structures in the world.`,
            fr: `Bintepeler est l'une des plus grandes zones de tumulus au monde, comprenant près de 100 collines artificielles appartenant aux rois et nobles lydiens. Surnommées les "Pyramides d'Anatolie".`,
            de: `Bintepeler ist eines der weltweit größten Gebiete mit Tumuli und besteht aus fast 100 künstlichen Hügeln, die lydischen Königen und Adligen gehörten. Oft als die "Pyramiden von Anatolien" bezeichnet.`,
            ja: `ビンテペレルは世界最大の墳丘墓地帯の一つで、リディアの王や貴族に属する約100の人工的な丘（墳丘墓）で構成されています。「アナトリアのピラミッド」とも呼ばれます。`
        },
        category: 'history',
        coordinates: { lat: 38.579235, lng: 28.007434 },
        imageUrl: 'https://i.imgur.com/2zhSlFd.jpeg',
        imageHint: 'ancient hills'
    },
    {
        id: '5',
        slug: { tr: 'salihli-kent-muzesi', en: 'salihli-city-museum', fr: 'musee-de-la-ville-de-salihli', de: 'stadtmuseum-salihli', ja: 'salihli-city-museum-ja' },
        name: { tr: 'Salihli Kent Müzesi', en: 'Salihli City Museum', fr: 'Musée de la Ville de Salihli', de: 'Stadtmuseum Salihli', ja: 'サリフリ市立博物館' },
        description: { 
            tr: `Salihli’nin Cumhuriyet dönemine tanıklık eden Müstantik (Sorgu Hakimi) Ahmet Efendi Konağı, günümüzde kentin sosyal, kültürel ve ekonomik tarihini sergileyen bir müze olarak hizmet vermektedir. \n\nMüze içerisinde tarım aletlerinden geleneksel kıyafetlere, eski zanaat dallarından Kurtuluş Savaşı hatıralarına kadar Salihli’nin kimliğini oluşturan pek çok eser sergilenmektedir. Konağın mimari yapısı da dönemin estetik anlayışını yansıtan önemli bir kültürel mirastır.`, 
            en: `The Ahmet Efendi Mansion, which witnessed Salihli's Republican era, now serves as a city museum showcasing the social, cultural, and economic history of the district. \n\nThe museum exhibits various artifacts forming Salihli's identity, ranging from agricultural tools and traditional costumes to old crafts and memories of the War of Independence. The mansion's architecture is also a significant heritage reflecting the era's aesthetics.`,
            fr: `Le manoir Ahmet Efendi, témoin de l'ère républicaine de Salihli, sert aujourd'hui de musée municipal retraçant l'histoire sociale, culturelle et économique du district.`,
            de: `Das Ahmet-Efendi-Herrenhaus, ein Zeuge der republikanischen Ära Salihlis, dient heute als Stadtmuseum, das die soziale, kulturelle und wirtschaftliche Geschichte des Bezirks zeigt.`,
            ja: `サリフリの共和国時代を見守ってきたアフメット・エフェンディ邸は、現在は地区の社会的、文化的、経済的歴史を紹介する市立博物館として機能しています。`
        },
        category: 'history',
        coordinates: { lat: 38.482355, lng: 28.130988 },
        imageUrl: 'https://i.imgur.com/IauiziR.jpeg',
        imageHint: 'city museum'
    },
    {
        id: '13',
        slug: { tr: 'artemis-tapinagi', en: 'temple-of-artemis', fr: 'temple-artemis', de: 'artemis-tempel', ja: 'temple-of-artemis-ja' },
        name: { tr: 'Artemis Tapınağı', en: 'Temple of Artemis', fr: 'Temple d\'Artémis', de: 'Artemis-Tempel', ja: 'アルテミス神殿' },
        description: { 
            tr: `Antik dünyanın en büyük İyon düzenindeki tapınaklarından biri olan Artemis Tapınağı, Lidya Krallığı'nın dini kalbidir. MS 17 yılındaki büyük depremden sonra İmparator Tiberius döneminde yeniden inşa edilen tapınak, devasa sütunları ve büyüleyici atmosferiyle ziyaretçilerini selamlar. \n\nTapınağın hemen yanında yer alan erken dönem Hristiyan kilisesi, inançlar arasındaki geçişi simgeleyen önemli bir detaydır. Tapınak, hem mimari ihtişamı hem de binlerce yıllık dini geçmişiyle Sardes’in en mistik noktalarından biridir.`, 
            en: `One of the largest Ionic temples in the ancient world, the Temple of Artemis was the religious heart of the Lydian Kingdom. Rebuilt during Emperor Tiberius's reign after the great earthquake of 17 AD, it welcomes visitors with its massive columns and enchanting atmosphere. \n\nThe early Christian church located right next to the temple is a significant detail symbolizing the transition between faiths. The temple remains one of the most mystical spots in Sardis, with its architectural grandeur and religious history.`,
            fr: `L'un des plus grands temples ioniques du monde antique, le temple d'Artémis était le cœur religieux du royaume lydien. Reconstruit sous le règne de l'empereur Tibère.`,
            de: `Der Artemis-Tempel, einer der größten ionischen Tempel der antiken Welt, war das religiöse Herz des lydischen Königreichs. Er wurde unter Kaiser Tiberius wiederaufgebaut.`,
            ja: `古代世界で最大のイオニア式神殿の一つであるアルテミス神殿は、リディア王国の宗教的中心地でした。西暦17年の大地震の後、ティベリウス皇帝の治世中に再建されました。`
        },
        category: 'history',
        coordinates: { lat: 38.479498, lng: 28.031180 },
        imageUrl: 'https://i.imgur.com/d2RoArI.jpeg',
        imageHint: 'ancient temple'
    }
];
