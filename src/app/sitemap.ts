import type { MetadataRoute } from 'next';

const BASE = 'https://eternity.video';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/mariage',
    '/naissance',
    '/anniversaire',
    '/diplome',
    '/amitie',
    '/in-memoriam',
    '/chantier',
    '/odyssee',
    '/registre',
    '/espace-compte',
    '/inscription',
    '/creation-capsule',
    '/mini-site',
    '/profil-public',
    '/doctrine',
    '/tarifs',
  ];
  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date('2026-08-09'),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/mariage' ? 0.9 : 0.7,
  }));
}
