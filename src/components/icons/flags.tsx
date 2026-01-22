'use client';
import type { SVGProps } from 'react';

export function TurkishFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" {...props}>
        <path fill="#e30a17" d="M0 0h36v24H0z"/>
        <path fill="#fff" d="M18 12a6 6 0 100-.001 4.8 4.8 0 110 .001"/>
        <path fill="#fff" d="m21 12-3.81 2.81 1.45-4.55-3.8-2.82h4.7l1.46-4.55 1.46 4.55h4.7l-3.8 2.82 1.45 4.55z"/>
    </svg>
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
