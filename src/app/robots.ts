import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/espace-compte'],
      },
    ],
    sitemap: 'https://eternity.video/sitemap.xml',
  };
}
