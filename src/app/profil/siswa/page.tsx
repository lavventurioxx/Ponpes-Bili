import Link from 'next/link';

export default function SiswaPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-emerald-800 py-12 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-2 text-4xl font-bold">Data Santri</h1>
          <p className="text-emerald-100">Pondok Pesantren Modern Roudlotul Abror</p>
        </div>
      </section>

      <section className="min-h-[45vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl border-l-4 border-amber-500 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-emerald-950">Privasi santri kami jaga</h2>
          <p className="mt-4 leading-7 text-gray-700">
            Data pribadi seperti nama lengkap, nomor induk, jenis kelamin, dan alamat santri tidak ditampilkan pada halaman publik. Informasi administrasi hanya dapat diakses oleh pihak yang berwenang.
          </p>
          <Link href="/penerimaan-santri-baru/status" className="mt-6 inline-flex rounded-md bg-emerald-800 px-5 py-3 font-bold text-white hover:bg-emerald-900">
            Cek Status Pendaftaran
          </Link>
        </div>
      </section>
    </>
  );
}