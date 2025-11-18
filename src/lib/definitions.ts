export type LangPair = {
    tr: string;
    en: string;
};

export type Coordinates = {
    lat: number;
    lng: number;
};

export type Place = {
    id: string;
    slug: LangPair;
    name: LangPair;
    description: LangPair;
    category: 'history' | 'nature' | 'food' | 'shopping' | 'poi';
    coordinates: Coordinates;
};

export type Route = {
    id: string;
    slug: LangPair;
    name: LangPair;
    description: LangPair;

    stops: string[]; // Array of place IDs
};

export type Story = {
    id: string;
    slug: LangPair;
    title: LangPair;
    author: LangPair;
    content: LangPair;
};

export type Cuisine = {
    id: string;
    slug: LangPair;
    name: LangPair;
    description: LangPair;
    mapSearchQuery: string;
};
