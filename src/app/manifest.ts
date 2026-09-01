
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'rota-dijital-pwa',
    scope: '/',
    name: 'Rota Dijital',
    short_name: 'Rota Dijital',
    description: "Tarihin mirası ve kültürün merkezini keşfedin.",
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
