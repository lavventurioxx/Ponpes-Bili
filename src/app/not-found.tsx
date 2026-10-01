import Link from 'next/link';

export const metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang Anda cari tidak tersedia. Kunjungi beranda atau informasi penerimaan santri baru.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-[#f7f8f3] px-4 py-16">
      <div className="mx-auto w-full max-w-3xl border-l-4 border-amber-500 pl-6 sm:pl-10">
        <p className="text-sm font-bold uppercase text-emerald-800">Kesalahan 404</p>
        <h1 className="mt-3 text-3xl font-extrabold text-emerald-950 sm:text-5xl">Halaman tidak ditemukan</h1>
        <p className="mt-4 max-w-xl text-gray-600">Tautan yang dibuka mungkin sudah berubah atau alamatnya tidak tepat.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-md bg-emerald-800 px-5 py-3 font-bold text-white hover:bg-emerald-900">Kembali ke Beranda</Link>
          <Link href="/penerimaan-santri-baru" className="rounded-md border border-emerald-800 px-5 py-3 font-bold text-emerald-900 hover:bg-emerald-50">Info Pendaftaran</Link>
        </div>
      </div>
    </section>
  );
}