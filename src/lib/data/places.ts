
import type { Place } from '@/lib/definitions';

export const places: Place[] = [
    {
        id: '1',
        slug: { 
            tr: 'sardes-antik-kenti', 
            en: 'sardes-ancient-city',
            fr: 'cite-antique-de-sardes',
            de: 'antike-stadt-sardes' 
        },
        name: { 
            tr: 'Sardes Antik Kenti', 
            en: 'Sardes Ancient City',
            fr: 'Cité Antique de Sardes',
            de: 'Antike Stadt Sardes' 
        },
        description: { 
            tr: 'Lidya Krallığı\'nın görkemli başkenti Sardes, tarihin seyrini değiştiren birçok ilke ev sahipliği yapmıştır. M.Ö. 7. yüzyılda paranın ilk kez basıldığı yer olarak bilinen bu antik kent, zenginliği ve gücüyle antik dünyanın en önemli metropollerinden biriydi. Kent, devasa Artemis Tapınağı, restore edilmiş etkileyici Sinagog, Gymnasium ve Roma döneminden kalma dükkanlarıyla ziyaretçilerine adeta bir zaman yolculuğu sunar. Pactolus (Sart) Çayı\'nın altın taşıdığına inanılan bu topraklarda gezerken, Lidya\'nın zengin mirasını ve Roma\'nın ihtişamını bir arada hissedeceksiniz.',
            en: 'Sardes, the magnificent capital of the Lydian Kingdom, hosted many firsts that changed the course of history. Known as the first place where money was minted in the 7th century BC, this ancient city was one of the most important metropolises of the ancient world with its wealth and power. The city offers a journey through time with its huge Temple of Artemis, the impressively restored Synagogue, Gymnasium, and shops from the Roman period. As you wander through these lands, where the Pactolus (Sart) River was believed to carry gold, you will feel the rich heritage of Lydia and the splendor of Rome together.',
            fr: 'Sardes, la magnifique capitale du royaume de Lydie, a été le théâtre de nombreuses premières qui ont changé le cours de l\'histoire. Connue pour être le premier lieu où la monnaie a été frappée au VIIe siècle avant J.-C., cette ville antique était l\'une des métropoles les plus importantes du monde antique par sa richesse et sa puissance. La ville offre un voyage dans le temps avec son immense temple d\'Artémis, sa synagogue impressionnante restaurée, son gymnase et ses boutiques de l\'époque romaine. En vous promenant sur ces terres, où l\'on croyait que la rivière Pactole (Sart) charriait de l\'or, vous ressentirez à la fois le riche héritage de la Lydie et la splendeur de Rome.',
            de: 'Sardes, die prächtige Hauptstadt des Lydischen Königreichs, war Schauplatz vieler Neuerungen, die den Lauf der Geschichte veränderten. Bekannt als der erste Ort, an dem im 7. Jahrhundert v. Chr. Geld geprägt wurde, war diese antike Stadt mit ihrem Reichtum und ihrer Macht eine der wichtigsten Metropolen der antiken Welt. Die Stadt bietet eine Zeitreise mit ihrem riesigen Artemis-Tempel, der beeindruckend restaurierten Synagoge, dem Gymnasium und den Geschäften aus der Römerzeit. Bei einem Spaziergang durch dieses Land, in dem der Fluss Pactolus (Sart) Gold geführt haben soll, werden Sie das reiche Erbe Lydiens und die Pracht Roms zugleich spüren.'
        },
        category: 'history',
        coordinates: { lat: 38.4893, lng: 28.0396 }
    },
    {
        id: '2',
        slug: { 
            tr: 'kursunlu-kaplicalari', 
            en: 'kursunlu-thermal-springs',
            fr: 'sources-thermales-de-kursunlu',
            de: 'thermalquellen-von-kursunlu' 
        },
        name: { 
            tr: 'Kurşunlu Kaplıcaları', 
            en: 'Kurşunlu Thermal Springs',
            fr: 'Sources Thermales de Kurşunlu',
            de: 'Thermalquellen von Kurşunlu' 
        },
        description: { 
            tr: 'Salihli\'nin doğal cennetlerinden biri olan Kurşunlu Kaplıcaları, yüzyıllardır şifa dağıtan termal sularıyla ünlüdür. Çam ormanları arasında, sakin ve huzurlu bir atmosferde yer alan bu kaplıcalar, romatizmal hastalıklardan cilt rahatsızlıklarına kadar birçok derde deva olduğuna inanılan mineralli sularıyla bilinir. Modern tesisleri, konaklama imkanları ve doğal güzellikleriyle Kurşunlu, hem bedensel hem de zihinsel olarak yenilenmek isteyenler için eşsiz bir kaçış noktasıdır.',
            en: 'Kurşunlu Thermal Springs, one of the natural paradises of Salihli, is famous for its healing thermal waters that have been providing cures for centuries. Located in a calm and peaceful atmosphere among pine forests, these springs are known for their mineral-rich waters believed to remedy many ailments from rheumatic diseases to skin conditions. With its modern facilities, accommodation options, and natural beauty, Kurşunlu is a unique escape point for those who want to rejuvenate both physically and mentally.',
            fr: 'Les sources thermales de Kurşunlu, l\'un des paradis naturels de Salihli, sont célèbres pour leurs eaux thermales curatives qui prodiguent des soins depuis des siècles. Situées dans une atmosphère calme et paisible au milieu des forêts de pins, ces sources sont connues pour leurs eaux riches en minéraux censées remédier à de nombreuses affections, des maladies rhumatismales aux problèmes de peau. Avec ses installations modernes, ses possibilités d\'hébergement et sa beauté naturelle, Kurşunlu est un point d\'évasion unique pour ceux qui souhaitent se ressourcer physiquement et mentalement.',
            de: 'Die Thermalquellen von Kurşunlu, eines der Naturparadiese von Salihli, sind berühmt für ihr heilendes Thermalwasser, das seit Jahrhunderten Heilung bringt. In einer ruhigen und friedlichen Atmosphäre inmitten von Pinienwäldern gelegen, sind diese Quellen für ihr mineralreiches Wasser bekannt, von dem angenommen wird, dass es viele Beschwerden von rheumatischen Erkrankungen bis hin zu Hautkrankheiten heilt. Mit seinen modernen Einrichtungen, Unterkunftsmöglichkeiten und seiner natürlichen Schönheit ist Kurşunlu ein einzigartiger Zufluchtsort für diejenigen, die sich sowohl körperlich als auch geistig erholen möchten.'
        },
        category: 'nature',
        coordinates: { lat: 38.5833, lng: 28.2500 }
    },
    {
        id: '3',
        slug: { 
            tr: 'salihli-odun-kofte', 
            en: 'salihli-wood-meatballs',
            fr: 'boulettes-de-viande-au-feu-de-bois-de-salihli',
            de: 'salihli-holzfleischballchen'
        },
        name: { 
            tr: 'Salihli Odun Köftesi', 
            en: 'Salihli Wood Meatballs',
            fr: 'Boulettes de Viande au Feu de Bois de Salihli',
            de: 'Salihli Holz-Fleischbällchen'
        },
        description: { 
            tr: 'Salihli denince akla gelen ilk lezzet olan meşhur odun köftesi, sadece bir yemek değil, aynı zamanda bir kültür mirasıdır. Meşe odunu ateşinde ağır ağır pişirilen bu köfte, özel baharat karışımı ve kaliteli etin mükemmel uyumuyla hazırlanır. Yanında servis edilen közlenmiş domates, biber ve sumaklı soğan ile lezzeti tamamlanan odun köftesi, Salihli ziyaretinizi unutulmaz kılacak bir gastronomik deneyim sunar.',
            en: 'The famous wood meatballs, the first flavor that comes to mind when Salihli is mentioned, is not just a dish, but also a cultural heritage. This meatball, cooked slowly over oak wood fire, is prepared with a perfect harmony of a special spice mix and high-quality meat. Complemented by roasted tomatoes, peppers, and sumac onions served alongside, the wood meatballs offer a gastronomic experience that will make your visit to Salihli unforgettable.',
            fr: 'Les célèbres boulettes de viande au feu de bois, la première saveur qui vient à l\'esprit quand on mentionne Salihli, ne sont pas seulement un plat, mais aussi un héritage culturel. Ces boulettes, cuites lentement sur un feu de bois de chêne, sont préparées avec une harmonie parfaite d\'un mélange d\'épices spécial et de viande de haute qualité. Complétées par des tomates rôties, des poivrons et des oignons au sumac servis à côté, les boulettes de viande au feu de bois offrent une expérience gastronomique qui rendra votre visite à Salihli inoubliable.',
            de: 'Die berühmten Holz-Fleischbällchen, der erste Geschmack, der einem bei der Erwähnung von Salihli in den Sinn kommt, sind nicht nur ein Gericht, sondern auch ein Kulturerbe. Diese langsam über Eichenholzfeuer gegarten Fleischbällchen werden mit einer perfekten Harmonie aus einer speziellen Gewürzmischung und hochwertigem Fleisch zubereitet. Ergänzt durch geröstete Tomaten, Paprika und Sumach-Zwiebeln, die daneben serviert werden, bieten die Holz-Fleischbällchen ein gastronomisches Erlebnis, das Ihren Besuch in Salihli unvergesslich machen wird.'
        },
        category: 'food',
        coordinates: { lat: 38.4833, lng: 28.1333 }
    },
    {
        id: '4',
        slug: { 
            tr: 'ataturk-aniti', 
            en: 'ataturk-monument',
            fr: 'monument-ataturk',
            de: 'ataturk-denkmal' 
        },
        name: { 
            tr: 'Atatürk Anıtı', 
            en: 'Atatürk Monument',
            fr: 'Monument Atatürk',
            de: 'Atatürk-Denkmal' 
        },
        description: { 
            tr: 'Salihli\'nin kalbinde, Kent Meydanı\'nda gururla yükselen Atatürk Anıtı, modern Türkiye\'nin kurucusu ve ulu önder Mustafa Kemal Atatürk\'e olan saygının bir ifadesidir. Şehrin en önemli buluşma noktalarından biri olan bu anıt, milli bayramlarda ve anma günlerinde törenlerin merkezi olur. Anıt, sadece bir heykel değil, aynı zamanda Salihli halkının bağımsızlık ve çağdaşlık değerlerine olan bağlılığının bir sembolüdür.',
            en: 'The Atatürk Monument, rising proudly in the heart of Salihli in the City Square, is an expression of respect for Mustafa Kemal Atatürk, the founder and great leader of modern Turkey. As one of the most important meeting points of the city, this monument becomes the center of ceremonies on national holidays and commemoration days. The monument is not just a statue, but also a symbol of the commitment of the people of Salihli to the values of independence and modernity.',
            fr: 'Le monument Atatürk, qui se dresse fièrement au cœur de Salihli sur la place de la ville, est une expression de respect pour Mustafa Kemal Atatürk, le fondateur et grand leader de la Turquie moderne. En tant que l\'un des points de rencontre les plus importants de la ville, ce monument devient le centre des cérémonies lors des fêtes nationales et des jours de commémoration. Le monument n\'est pas seulement une statue, mais aussi un symbole de l\'engagement du peuple de Salihli envers les valeurs d\'indépendance et de modernité.',
            de: 'Das Atatürk-Denkmal, das stolz im Herzen von Salihli auf dem Stadtplatz emporragt, ist ein Ausdruck des Respekts für Mustafa Kemal Atatürk, den Gründer und großen Führer der modernen Türkei. Als einer der wichtigsten Treffpunkte der Stadt wird dieses Denkmal zum Zentrum der Zeremonien an Nationalfeiertagen und Gedenktagen. Das Denkmal ist nicht nur eine Statue, sondern auch ein Symbol für das Bekenntnis der Menschen von Salihli zu den Werten der Unabhängigkeit und Modernität.'
        },
        category: 'poi',
        coordinates: { lat: 38.4830, lng: 28.1400 }
    },
    {
        id: '5',
        slug: { 
            tr: 'salihli-kent-muzesi', 
            en: 'salihli-city-museum',
            fr: 'musee-de-la-ville-de-salihli',
            de: 'stadtmuseum-salihli'
        },
        name: { 
            tr: 'Salihli Kent Müzesi', 
            en: 'Salihli City Museum',
            fr: 'Musée de la Ville de Salihli',
            de: 'Stadtmuseum Salihli'
        },
        description: { 
            tr: 'Tarihi bir konakta hizmet veren Salihli Kent Müzesi, şehrin zengin sosyal, kültürel ve ekonomik geçmişine ışık tutar. Müzede, geleneksel yaşam tarzını yansıtan etnografik eserler, tarım aletleri, eski fotoğraflar ve belgeler sergilenmektedir. Ziyaretçiler, Salihli\'nin Kurtuluş Savaşı\'ndaki rolünden, tarımsal gelişimine ve kültürel dokusuna kadar pek çok konuda bilgi edinebilirler. Bu müze, Salihli\'nin ruhunu ve kimliğini anlamak için mutlaka ziyaret edilmesi gereken bir yerdir.',
            en: 'Serving in a historical mansion, the Salihli City Museum sheds light on the rich social, cultural, and economic past of the city. The museum exhibits ethnographic artifacts reflecting the traditional way of life, agricultural tools, old photographs, and documents. Visitors can learn about many subjects, from Salihli\'s role in the War of Independence to its agricultural development and cultural fabric. This museum is a must-visit place to understand the spirit and identity of Salihli.',
            fr: 'Installé dans un manoir historique, le musée de la ville de Salihli met en lumière le riche passé social, culturel et économique de la ville. Le musée expose des artefacts ethnographiques reflétant le mode de vie traditionnel, des outils agricoles, des photographies anciennes et des documents. Les visiteurs peuvent s\'informer sur de nombreux sujets, du rôle de Salihli dans la guerre d\'indépendance à son développement agricole et à son tissu culturel. Ce musée est un lieu incontournable pour comprendre l\'esprit et l\'identité de Salihli.',
            de: 'Das Stadtmuseum Salihli, das in einem historischen Herrenhaus untergebracht ist, beleuchtet die reiche soziale, kulturelle und wirtschaftliche Vergangenheit der Stadt. Das Museum stellt ethnografische Artefakte aus, die den traditionellen Lebensstil widerspiegeln, landwirtschaftliche Werkzeuge, alte Fotografien und Dokumente. Besucher können sich über viele Themen informieren, von der Rolle Salihlis im Unabhängigkeitskrieg bis zu seiner landwirtschaftlichen Entwicklung und seinem kulturellen Gefüge. Dieses Museum ist ein Muss, um den Geist und die Identität von Salihli zu verstehen.'
        },
        category: 'history',
        coordinates: { lat: 38.4845, lng: 28.1415 }
    }
];
