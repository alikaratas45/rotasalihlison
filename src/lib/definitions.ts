export type LocalizedString = {
    tr: string;
    en: string;
    fr: string;
    de: string;
    ja: string;
};

export type Coordinates = {
    lat: number;
    lng: number;
};

export type SubPoint = {
    id: string;
    name: LocalizedString;
    description: LocalizedString;
    coordinates: Coordinates;
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
    subPoints?: SubPoint[];
};

export type Route = {
    id: string;
    slug: LocalizedString;
    name: LocalizedString;
    description: LocalizedString;
    stops: string[]; // Array of place IDs
};

export type ExperienceItem = {
  id: string;
  name: LocalizedString;
  icon: string;
  link: string;
  order: number;
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
  isAdmin?: boolean;
}

export type Feedback = {
    id: string;
    placeId: string;
    placeName: string;
    cleanliness: number;
    accessibility: number;
    satisfaction: number;
    withTour: 'yes' | 'no';
    guided: 'yes' | 'no';
    infoBoards: 'yes' | 'no';
    createdAt: any;
};
