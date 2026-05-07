'use client';

import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

// Gönderilen görsele uygun ayak izi (Footprints) simgesi
const FootprintsIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Sol Ayak İzi */}
    <path d="M5 15.5c0-2.5 1.3-4.5 3-4.5s3 2 3 4.5-1.3 4.5-3 4.5-3-2-3-4.5z" />
    <path d="M5.5 14h5" />
    <path d="M5.5 17h5" />
    
    {/* Sağ Ayak İzi (Biraz yukarda ve sağda) */}
    <path d="M13 8.5c0-2.5 1.3-4.5 3-4.5s3 2 3 4.5-1.3 4.5-3 4.5-3-2-3-4.5z" />
    <path d="M13.5 7h5" />
    <path d="M13.5 10h5" />
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
