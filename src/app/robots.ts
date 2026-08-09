import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/espace-compte', '/api/'],
      },
    ],
    sitemap: 'https://eternity.video/sitemap.xml',
  };
}
