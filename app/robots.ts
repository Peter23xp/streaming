import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/'],
    },
    sitemap: `${process.env.NEXTAUTH_URL ?? 'https://streamvf.vercel.app'}/sitemap.xml`,
  }
}
