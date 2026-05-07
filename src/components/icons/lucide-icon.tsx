'use client';

import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

// Custom Hiker / Climbing Icon
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
    <circle cx="16" cy="4" r="2" />
    <path d="m7 22 2.5-6L11 12l2-1 3 1" />
    <path d="M7 22 5 18" />
    <path d="M11 12 9 9l-2 1" />
    <path d="m11 12 1.5 3 2 5" />
    <path d="m16 11 2 2 3-1" />
    <path d="M12 9h-2" />
  </svg>
);

// This is a workaround for the fact that TS cannot handle the dynamic import of icons.
// All available icons in lucide-react are listed here.
// You can find the list of icons at https://lucide.dev/
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
    // Return a default icon or null if the icon name is not found
    return <icons.HelpCircle {...props} />;
  }

  return <Icon {...props} />;
};
