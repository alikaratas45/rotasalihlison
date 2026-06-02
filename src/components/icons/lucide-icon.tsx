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
  Climbing: Footprints, // Alias for backward compatibility
  HelpCircle
};

type LucideIconProps = {
  name: string;
  className?: string;
  [key: string]: any;
};

export const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  const Icon = iconMap[name] || HelpCircle;
  return <Icon {...props} />;
};