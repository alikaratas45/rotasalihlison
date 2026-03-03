
import Image from 'next/image';

// The logo background is made transparent using CSS mixBlendMode.
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
