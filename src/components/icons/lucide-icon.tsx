'use client';

import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

// This is a workaround for the fact that TS cannot handle the dynamic import of icons.
// All available icons in lucide-react are listed here.
// You can find the list of icons at https://lucide.dev/
// @ts-ignore
const iconMap: { [key: string]: React.FC<LucideProps> } = icons;


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
