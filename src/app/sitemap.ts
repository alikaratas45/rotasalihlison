import { MetadataRoute } from 'next'
import { places } from '@/lib/data/places'
import { routes } from '@/lib/data/routes'
import { stories } from '@/lib/data/stories'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rotasalihli.com'

  const staticPages = [
    '',
    '/yerler',
    '/rotalar',
    '/hikayeler',
    '/lezzetler',
    '/ziyaretci-defteri',
    '/rota-olustur',
    '/cevremde-ne-var',
    '/bisiklet-rotalari',
    '/yuruyus-rotalari',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const placePages = places.flatMap((p) => 
    Object.values(p.slug).map((slug) => ({
      url: `${baseUrl}/yerler/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const routePages = routes.flatMap((r) => 
    Object.values(r.slug).map((slug) => ({
      url: `${baseUrl}/rotalar/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  const storyPages = stories.flatMap((s) => 
    Object.values(s.slug).map((slug) => ({
      url: `${baseUrl}/hikayeler/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  return [...staticPages, ...placePages, ...routePages, ...storyPages]
}
