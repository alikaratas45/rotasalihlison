import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rota Salihli',
    short_name: 'RotaSalihli',
    description: "Sardes'in mirası, paranın merkezi Salihli'yi keşfedin.",
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFCE6',
    theme_color: '#2D5A27',
    icons: [
      {
        src: '/logos.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/logos.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
  };
}
