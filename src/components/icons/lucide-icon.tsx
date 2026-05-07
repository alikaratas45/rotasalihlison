'use client';

import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

// Uygulama genelinde 'Climbing' anahtarı ile profesyonel 'Footprints' (Ayak İzleri) simgesini kullanıyoruz.
// Bu simge lucide-react kütüphanesinin standart ve estetik bir simgesidir.
// @ts-ignore
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  ...icons,
  Climbing: icons.Footprints,
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
