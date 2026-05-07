'use client';

import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

// Özel Dağcı / Yürüyüşçü İkonu (Daha temiz ve dengeli tasarım)
const HikerIcon = (props: LucideProps) => (
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
    {/* Baş */}
    <circle cx="13" cy="4" r="2" />
    {/* Gövde ve Bacaklar */}
    <path d="m13 6-3 3v5l-2 3v5" />
    <path d="M13 11l3 3v5" />
    {/* Kollar */}
    <path d="m13 8-4-1-2 2" />
    <path d="m13 8 4 1 2 3" />
    {/* Yürüyüş Batonu */}
    <path d="M7 4v16" />
  </svg>
);

// Lucide ikon listesine 'Climbing' adıyla dağcı figürünü ekliyoruz.
// @ts-ignore
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  ...icons,
  Climbing: HikerIcon,
};


type LucideIconProps = {
  name: string;
  [key: string]: any;
};

export const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  const Icon = iconMap[name];

  if (!Icon) {
    // İkon bulunamazsa varsayılan olarak HelpCircle döner
    return <icons.HelpCircle {...props} />;
  }

  return <Icon {...props} />;
};
