import Link from 'next/link';

export default function RegisterPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-900">Pendaftaran Tanpa Akun</h1>
        <p className="mt-4 text-gray-600">Silakan isi data diri melalui formulir pendaftaran santri baru.</p>
        <Link href="/penerimaan-santri-baru/daftar" className="mt-8 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700">
          Isi Formulir Pendaftaran
        </Link>
      </div>
    </section>
  );
}