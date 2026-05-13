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
  }))

  const placePages = places.flatMap((p) => 
    Object.values(p.slug).map((slug) => ({
      url: `${baseUrl}/yerler/${slug}`,
      lastModified: new Date(),
    }))
  )

  const routePages = routes.flatMap((r) => 
    Object.values(r.slug).map((slug) => ({
      url: `${baseUrl}/rotalar/${slug}`,
      lastModified: new Date(),
    }))
  )

  const storyPages = stories.flatMap((s) => 
    Object.values(s.slug).map((slug) => ({
      url: `${baseUrl}/hikayeler/${slug}`,
      lastModified: new Date(),
    }))
  )

  return [...staticPages, ...placePages, ...routePages, ...storyPages]
}
