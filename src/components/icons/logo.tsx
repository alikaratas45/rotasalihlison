import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  const logoUrl = '/logos.png';

  return (
    <div className={`relative ${className || 'h-8 w-8'}`} style={{ mixBlendMode: 'multiply' }}>
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