import Image from 'next/image';

// The new logo is a colorful image, not a single-color SVG.
// We accept a className to allow for sizing, but other SVG-specific props are not applicable.
export function Logo({ className }: { className?: string }) {
  const logoUrl = '/logos.png';

  return (
    <div className={`relative ${className || 'h-8 w-8'}`}>
      <Image
        src={logoUrl}
        alt="Rota Salihli Logo"
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 10vw, 5vw"
      />
    </div>
  );
}
