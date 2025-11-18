
import type { SVGProps } from 'react';

export function FlagTR(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 533.33" {...props}>
      <path fill="#e30a17" d="M0 0h800v533.33H0z" />
      <path
        fill="#fff"
        d="M375.46 386.9a133.33 133.33 0 1 0 0-240.27 106.67 106.67 0 1 1 0 240.27z"
      />
      <path
        fill="#fff"
        d="m416.82 266.67-42.66-30.9-42.67 30.9L354.2 222l-42.66-30.9h52.74l16.2-50.56 16.2 50.56h52.74l-42.67 30.9z"
      />
    </svg>
  );
}

export function FlagGB(props: SVGProps<SVGSVGElement>) {
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

export function FlagFR(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
      <path fill="#002395" d="M0 0h300v600H0z" />
      <path fill="#fff" d="M300 0h300v600H300z" />
      <path fill="#ed2939" d="M600 0h300v600H600z" />
    </svg>
  );
}

export function FlagDE(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" {...props}>
      <path d="M0 0h5v3H0z" />
      <path fill="#D00" d="M0 1h5v2H0z" />
      <path fill="#FFCE00" d="M0 2h5v1H0z" />
    </svg>
  );
}
