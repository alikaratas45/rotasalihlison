import Image from 'next/image';

// The new logo is a colorful image, not a single-color SVG.
// We apply mixBlendMode: 'multiply' to hide the white background if the image itself is not transparent.
export function Logo({ className }: { className?: string }) {
  const logoUrl = '/logos.png';

  return (
    <div className={`relative ${className || 'h-8 w-8'}`}>
      <Image
        src={logoUrl}
        alt="Rota Salihli Logo"
        fill
        style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
        sizes="(max-width: 768px) 10vw, 5vw"
      />
    </div>
  );
}
