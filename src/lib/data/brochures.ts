import type { Brochure } from '@/lib/definitions';

export const brochures: Brochure[] = [
    {
        id: 'b1',
        title: {
            tr: 'Salihli Tanıtım Broşürü',
            en: 'Salihli Promotional Brochure',
            fr: 'Brochure Promotionnelle de Salihli',
            de: 'Salihli Werbebroschüre'
        },
        pages: [
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-cover/800/1200',
                imageHint: 'brochure cover'
            },
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-p2/800/1200',
                imageHint: 'Sardis ruins'
            },
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-p3/800/1200',
                imageHint: 'Kurşunlu hot springs'
            },
            {
                imageUrl: 'https://picsum.photos/seed/brochure1-p4/800/1200',
                imageHint: 'local cuisine'
            },
        ]
    }
];
