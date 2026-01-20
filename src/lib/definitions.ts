export type LocalizedString = {
    tr: string;
    en: string;
    fr: string;
    de: string;
};

export type Coordinates = {
    lat: number;
    lng: number;
};

export type Place = {
    id: string;
    slug: LocalizedString;
    name: LocalizedString;
    description: LocalizedString;
    category: 'history' | 'nature' | 'food' | 'shopping' | 'poi';
    coordinates: Coordinates;
    imageUrl?: string;
    imageHint?: string;
};

export type Route = {
    id: string;
    slug: LocalizedString;
    name: LocalizedString;
    description: LocalizedString;
    stops: string[]; // Array of place IDs
};

export type Story = {
    id: string;
    slug: LocalizedString;
    title: LocalizedString;
    author: LocalizedString;
    content: LocalizedString;
    placeId?: string; // Optional place ID
};

export type Cuisine = {
    id: string;
    slug: LocalizedString;
    name: LocalizedString;
    description: LocalizedString;
    mapSearchQuery: string;
};

export type BrochurePage = {
    imageUrl: string;
    imageHint: string;
    title?: LocalizedString;
    text?: LocalizedString;
};

export type Brochure = {
    id: string;
    title: LocalizedString;
    pages: BrochurePage[];
};

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
