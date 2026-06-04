'use client';

import React from 'react';
import { 
  HelpCircle, 
  Footprints, 
  Landmark, 
  Mountain, 
  Utensils, 
  Map, 
  MapPinned, 
  BookOpen, 
  MessageSquare, 
  Library, 
  Bed, 
  Star,
  Compass,
  Info,
  Bike,
  Hotel,
  ForkKnife,
  Trees,
  History,
  ShoppingBag,
  type LucideProps
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  // Standart İkonlar
  Landmark,
  Mountain,
  Utensils,
  Map,
  MapPinned,
  BookOpen,
  MessageSquare,
  Library,
  Bed,
  Star,
  Compass,
  Info,
  Footprints,
  Bike,
  Hotel,
  ForkKnife,
  Trees,
  History,
  ShoppingBag,
  
  // Akıllı Takma Adlar (Kategori isimleri veya varyasyonlar için)
  Food: Utensils,
  Cuisine: ForkKnife,
  Accommodation: Bed,
  Stay: Hotel,
  Nature: Mountain,
  Parks: Trees,
  Historical: Landmark,
  Chronology: History,
  Shopping: ShoppingBag,
  Climbing: Footprints,
  Bicycle: Bike,
  Help: HelpCircle
};

type LucideIconProps = {
  name: string;
  className?: string;
  [key: string]: any;
};

export const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  if (!name) return <HelpCircle {...props} />;

  // Veritabanından gelen ismi normalize et (İlk harf büyük, diğerleri küçük)
  const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
  // Önce tam eşleşme, sonra normalize edilmiş eşleşme, en son fallback
  const Icon = iconMap[name] || iconMap[normalizedName] || HelpCircle;
  
  return <Icon {...props} />;
};
