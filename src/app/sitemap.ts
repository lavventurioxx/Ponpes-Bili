import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const publicPages = [
  '/',
  '/profil/sekolah/',
  '/profil/visi-misi/',
  '/profil/guru/',
  '/profil/pengurus/',
  '/profil/kepala-sekolah/',
  '/profil/ekstrakurikuler/',
  '/informasi/berita/',
  '/informasi/prestasi/',
  '/galeri/foto/',
  '/penerimaan-santri-baru/',
  '/kebijakan-privasi/',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((path) => ({
    url: `https://ponpes-bili.web.app${path}`,
  }));
}