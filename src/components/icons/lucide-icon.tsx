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
  type LucideProps
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
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
  Climbing: Footprints, // Alias for backward compatibility
  HelpCircle
};

type LucideIconProps = {
  name: string;
  className?: string;
  [key: string]: any;
};

export const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  // Veritabanından veya statik veriden gelen ikon isminin ilk harfini büyütüp map'te arıyoruz
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const Icon = iconMap[capitalizedName] || iconMap[name] || HelpCircle;
  return <Icon {...props} />;
};
