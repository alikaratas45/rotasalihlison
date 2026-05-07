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
    <path d="M7 9a2.5 2.5 0 0 1 5 0v6a2.5 2.5 0 0 1-5 0V9z" />
    <path d="M7 12h5" />
    {/* Sağ Ayak İzi (Biraz yukarda) */}
    <path d="M13 6a2.5 2.5 0 0 1 5 0v6a2.5 2.5 0 0 1-5 0V6z" />
    <path d="M13 9h5" />
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
