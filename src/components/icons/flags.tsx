'use client';
import type { SVGProps } from 'react';
import Image from 'next/image';

export function TurkishFlagIcon(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
  const { width = 24, height = 16, ...rest } = props;
  return (
    <Image
      src="/Turkey.png"
      alt="Turkish Flag"
      width={width}
      height={height}
      {...rest}
    />
  );
}


export function UKFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
      <clipPath id="a">
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id="b">
        <path d="M30 15h30v15zv15H0zH0V0h30z" />
      </clipPath>
      <g clipPath="url(#a)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path
          d="M0 0L60 30m0-30L0 30"
          stroke="#fff"
          strokeWidth="6"
        />
        <path
          d="M0 0L60 30m0-30L0 30"
          clipPath="url(#b)"
          stroke="#c8102e"
          strokeWidth="4"
        />
        <path
          d="M30 0v30M0 15h60"
          stroke="#fff"
          strokeWidth="10"
        />
        <path
          d="M30 0v30M0 15h60"
          stroke="#c8102e"
          strokeWidth="6"
        />
      </g>
    </svg>
  );
}

export function FrenchFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
      <path fill="#002395" d="M0 0h300v600H0z" />
      <path fill="#fff" d="M300 0h300v600H300z" />
      <path fill="#ed2939" d="M600 0h300v600H600z" />
    </svg>
  );
}

export function GermanFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" {...props}>
      <path d="M0 0h5v3H0z" />
      <path fill="#D00" d="M0 1h5v2H0z" />
      <path fill="#FFCE00" d="M0 2h5v1H0z" />
    </svg>
  );
}

export function JapaneseFlagIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
        <path fill="#fff" d="M0 0h900v600H0z"/>
        <circle fill="#bc002d" cx="450" cy="300" r="180"/>
      </svg>
    );
  }
