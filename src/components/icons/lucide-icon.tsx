'use client';

import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

// İsteğe özel ayak izi (Footprints) simgesi
const FootprintsIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Sol Ayak İzi */}
    <path d="M4 15c0-2.2 1.3-4 3-4s3 1.8 3 4-1.3 4-3 4-3-1.8-3-4z" />
    <line x1="4.5" y1="13.5" x2="9.5" y2="13.5" />
    <line x1="4.5" y1="16.5" x2="9.5" y2="16.5" />
    
    {/* Sağ Ayak İzi (Biraz yukarda ve sağda) */}
    <path d="M14 9c0-2.2 1.3-4 3-4s3 1.8 3 4-1.3 4-3 4-3-1.8-3-4z" />
    <line x1="14.5" y1="7.5" x2="19.5" y2="7.5" />
    <line x1="14.5" y1="10.5" x2="19.5" y2="10.5" />
  </svg>
);

// Lucide ikon listesine 'Climbing' adıyla bu yeni figürü ekliyoruz.
// @ts-ignore
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  ...icons,
  Climbing: FootprintsIcon,
};


type LucideIconProps = {
  name: string;
  [key: string]: any;
};

export const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  const Icon = iconMap[name];

  if (!Icon) {
    return <icons.HelpCircle {...props} />;
  }

  return <Icon {...props} />;
};
