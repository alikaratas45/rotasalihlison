
import type { Place } from '@/lib/definitions';

export const places: Place[] = [
    {
        id: '1',
        slug: { tr: 'sardes-antik-kenti', en: 'sardes-ancient-city' },
        name: { tr: 'Sardes Antik Kenti', en: 'Sardes Ancient City' },
        description: { 
            tr: 'Lidya Krallığı\'nın görkemli başkenti Sardes, tarihin seyrini değiştiren birçok ilke ev sahipliği yapmıştır. M.Ö. 7. yüzyılda paranın ilk kez basıldığı yer olarak bilinen bu antik kent, zenginliği ve gücüyle antik dünyanın en önemli metropollerinden biriydi. Kent, devasa Artemis Tapınağı, restore edilmiş etkileyici Sinagog, Gymnasium ve Roma döneminden kalma dükkanlarıyla ziyaretçilerine adeta bir zaman yolculuğu sunar. Pactolus (Sart) Çayı\'nın altın taşıdığına inanılan bu topraklarda gezerken, Lidya\'nın zengin mirasını ve Roma\'nın ihtişamını bir arada hissedeceksiniz.',
            en: 'Sardes, the magnificent capital of the Lydian Kingdom, hosted many firsts that changed the course of history. Known as the first place where money was minted in the 7th century BC, this ancient city was one of the most important metropolises of the ancient world with its wealth and power. The city offers a journey through time with its huge Temple of Artemis, the impressively restored Synagogue, Gymnasium, and shops from the Roman period. As you wander through these lands, where the Pactolus (Sart) River was believed to carry gold, you will feel the rich heritage of Lydia and the splendor of Rome together.'
        },
        category: 'history',
        coordinates: { lat: 38.4893, lng: 28.0396 }
    },
    {
        id: '2',
        slug: { tr: 'kursunlu-kaplicalari', en: 'kursunlu-thermal-springs' },
        name: { tr: 'Kurşunlu Kaplıcaları', en: 'Kurşunlu Thermal Springs' },
        description: { 
            tr: 'Salihli\'nin doğal cennetlerinden biri olan Kurşunlu Kaplıcaları, yüzyıllardır şifa dağıtan termal sularıyla ünlüdür. Çam ormanları arasında, sakin ve huzurlu bir atmosferde yer alan bu kaplıcalar, romatizmal hastalıklardan cilt rahatsızlıklarına kadar birçok derde deva olduğuna inanılan mineralli sularıyla bilinir. Modern tesisleri, konaklama imkanları ve doğal güzellikleriyle Kurşunlu, hem bedensel hem de zihinsel olarak yenilenmek isteyenler için eşsiz bir kaçış noktasıdır.',
            en: 'Kurşunlu Thermal Springs, one of the natural paradises of Salihli, is famous for its healing thermal waters that have been providing cures for centuries. Located in a calm and peaceful atmosphere among pine forests, these springs are known for their mineral-rich waters believed to remedy many ailments from rheumatic diseases to skin conditions. With its modern facilities, accommodation options, and natural beauty, Kurşunlu is a unique escape point for those who want to rejuvenate both physically and mentally.'
        },
        category: 'nature',
        coordinates: { lat: 38.5833, lng: 28.2500 }
    },
    {
        id: '3',
        slug: { tr: 'salihli-odun-kofte', en: 'salihli-odun-kofte' },
        name: { tr: 'Salihli Odun Köftesi', en: 'Salihli Wood Meatballs' },
        description: { 
            tr: 'Salihli denince akla gelen ilk lezzet olan meşhur odun köftesi, sadece bir yemek değil, aynı zamanda bir kültür mirasıdır. Meşe odunu ateşinde ağır ağır pişirilen bu köfte, özel baharat karışımı ve kaliteli etin mükemmel uyumuyla hazırlanır. Yanında servis edilen közlenmiş domates, biber ve sumaklı soğan ile lezzeti tamamlanan odun köftesi, Salihli ziyaretinizi unutulmaz kılacak bir gastronomik deneyim sunar.',
            en: 'The famous wood meatballs, the first flavor that comes to mind when Salihli is mentioned, is not just a dish, but also a cultural heritage. This meatball, cooked slowly over oak wood fire, is prepared with a perfect harmony of a special spice mix and high-quality meat. Complemented by roasted tomatoes, peppers, and sumac onions served alongside, the wood meatballs offer a gastronomic experience that will make your visit to Salihli unforgettable.'
        },
        category: 'food',
        coordinates: { lat: 38.4833, lng: 28.1333 }
    },
    {
        id: '4',
        slug: { tr: 'ataturk-aniti', en: 'ataturk-monument' },
        name: { tr: 'Atatürk Anıtı', en: 'Atatürk Monument' },
        description: { 
            tr: 'Salihli\'nin kalbinde, Kent Meydanı\'nda gururla yükselen Atatürk Anıtı, modern Türkiye\'nin kurucusu ve ulu önder Mustafa Kemal Atatürk\'e olan saygının bir ifadesidir. Şehrin en önemli buluşma noktalarından biri olan bu anıt, milli bayramlarda ve anma günlerinde törenlerin merkezi olur. Anıt, sadece bir heykel değil, aynı zamanda Salihli halkının bağımsızlık ve çağdaşlık değerlerine olan bağlılığının bir sembolüdür.',
            en: 'The Atatürk Monument, rising proudly in the heart of Salihli in the City Square, is an expression of respect for Mustafa Kemal Atatürk, the founder and great leader of modern Turkey. As one of the most important meeting points of the city, this monument becomes the center of ceremonies on national holidays and commemoration days. The monument is not just a statue, but also a symbol of the commitment of the people of Salihli to the values of independence and modernity.'
        },
        category: 'poi',
        coordinates: { lat: 38.4830, lng: 28.1400 }
    },
    {
        id: '5',
        slug: { tr: 'salihli-kent-muzesi', en: 'salihli-city-museum' },
        name: { tr: 'Salihli Kent Müzesi', en: 'Salihli City Museum' },
        description: { 
            tr: 'Tarihi bir konakta hizmet veren Salihli Kent Müzesi, şehrin zengin sosyal, kültürel ve ekonomik geçmişine ışık tutar. Müzede, geleneksel yaşam tarzını yansıtan etnografik eserler, tarım aletleri, eski fotoğraflar ve belgeler sergilenmektedir. Ziyaretçiler, Salihli\'nin Kurtuluş Savaşı\'ndaki rolünden, tarımsal gelişimine ve kültürel dokusuna kadar pek çok konuda bilgi edinebilirler. Bu müze, Salihli\'nin ruhunu ve kimliğini anlamak için mutlaka ziyaret edilmesi gereken bir yerdir.',
            en: 'Serving in a historical mansion, the Salihli City Museum sheds light on the rich social, cultural, and economic past of the city. The museum exhibits ethnographic artifacts reflecting the traditional way of life, agricultural tools, old photographs, and documents. Visitors can learn about many subjects, from Salihli\'s role in the War of Independence to its agricultural development and cultural fabric. This museum is a must-visit place to understand the spirit and identity of Salihli.'
        },
        category: 'history',
        coordinates: { lat: 38.4845, lng: 28.1415 }
    }
];
