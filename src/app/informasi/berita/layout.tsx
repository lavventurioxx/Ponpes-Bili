export const metadata = {
  title: 'Berita Pesantren',
  description: 'Kabar terbaru, kegiatan, dan informasi dari Pondok Pesantren Modern Roudlotul Abror.',
  alternates: { canonical: '/informasi/berita/' },
};

export default function BeritaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}