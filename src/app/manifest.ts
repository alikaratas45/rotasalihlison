import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'rota-salihli-pwa',
    scope: '/',
    name: 'Rota Salihli',
    short_name: 'Rota Salihli',
    description: "Sardes'in mirası, paranın merkezi Salihli'yi keşfedin.",
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFCE6',
    theme_color: '#2D5A27',
    icons: [
      {
        src: '/logos.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logos.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      }
    ],
  };
}