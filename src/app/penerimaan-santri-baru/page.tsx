import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Penerimaan Santri Baru 2026/2027',
  description: 'Informasi syarat, program, biaya, fasilitas, dan pendaftaran santri baru PP Modern Roudlotul Abror, Maoslor, Cilacap.',
  alternates: { canonical: '/penerimaan-santri-baru/' },
};

export default function PenerimaanSantriBaru() {
  return (
    <>
      {/* Header */}
      <section className="bg-emerald-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase">Penerimaan Pendaftaran Santri Baru</h1>
          <p className="text-xl text-emerald-100 font-medium">Tahun Pelajaran 2026/2027</p>
          <p className="text-amber-400 font-semibold mt-2 text-lg max-w-3xl mx-auto italic">&quot;Hadiah Terbaik untuk Anak adalah Pendidikan Agama. Ayo Daftarkan Putra Putri Anda Mondok Di PPMRA&quot;</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Kolom Kiri: Syarat & Program */}
            <div>
              {/* Syarat Pendaftaran */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Syarat Pendaftaran</h2>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                <ul className="space-y-3">
                  {[
                    'Sehat jasmani dan rohani',
                    'Mendapatkan izin orang tua',
                    'Siap mentaati Peraturan Pesantren',
                    'Mengisi Formulir Pendaftaran',
                    'Fotokopi KK dan akta kelahiran',
                    'Pas foto 3x4 (2 lembar)',
                    'Membayar pendaftaran Rp. 75.000',
                    'Syahriyah Santri Mukim Rp. 200.000 (makan 3x sehari)',
                    'Syahriyah Santri Non Mukim Rp. 60.000 (makan 1x sehari)',
                    'Anak Yatim/Yatim Piyatu Tidak dipungut biaya',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Program Unggulan */}
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Program Unggulan</h2>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                <ul className="space-y-3">
                  {[
                    'Tahfidz 30 Juz',
                    "Al Qur'an Binnadzor 30 Juz",
                    'Hafalan Juz 30 & Suratan Pilihan',
                    "Tahsinul Al Qur'an",
                    'Kajian Kitab Kuning',
                    'Madrasah Diniyah Takmiliyah (TPQ, Ula, Wustho & Ulya)',
                    'Pidato Bahasa Inggris, Arab, Indonesia & Jawa',
                    'Life skill',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fasilitas */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Fasilitas Yang Didapat</h2>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Asrama Putra - Putri',
                    'Kasur & Almari',
                    'Tempat Belajar - Mengajar',
                    'Musholla',
                    'MCK',
                    'Halaman Luas',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-lg">✨</span>
                      <span className="text-gray-700 font-semibold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kolom Kanan: Tempat Pendaftaran & Kontak */}
            <div>
              {/* Tempat Pendaftaran */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Tempat Pendaftaran</h2>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                <p className="text-gray-700 font-semibold text-lg mb-1">PON-PES Modern Roudlotul Abror</p>
                <p className="text-gray-600 mb-4">Jl. Dukuh RT.01 RW.04, Maoslor, Maos, Cilacap</p>
                <Link
                  href="/penerimaan-santri-baru/daftar"
                  className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors shadow-md"
                >
                  Isi Formulir Pendaftaran →
                </Link>
                <Link
                  href="/penerimaan-santri-baru/status"
                  className="ml-2 inline-block px-6 py-3 text-emerald-700 hover:text-emerald-900 font-bold transition-colors"
                >
                  Cek Status
                </Link>
              </div>

              {/* Hubungi Kami */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Hubungi Kami</h2>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                      📞
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">0821 3550 5020</p>
                      <p className="text-gray-500 text-sm">Ust. Maftukhin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                      📞
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">0821 2600 6282</p>
                      <p className="text-gray-500 text-sm">Ustz. Laili M</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                      🏢
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Kantor Kesekretariatan</p>
                      <p className="text-gray-500 text-sm">PP Modern Roudlotul Abror</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Bawah */}
      <section className="py-12 bg-amber-500 text-emerald-950 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">Daftar Sekarang..!</h2>
          <p className="text-lg font-medium opacity-90 mb-6">Kuota terbatas. Segera daftarkan putra-putri Anda.</p>
          <Link
            href="/penerimaan-santri-baru/daftar"
            className="inline-block px-10 py-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-xl"
          >
            Formulir Pendaftaran Online
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-3xl font-extrabold text-emerald-950">Pertanyaan yang Sering Ditanyakan</h2>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-bold text-emerald-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                Bagaimana cara mendaftar secara online?
                <span aria-hidden="true" className="float-right text-emerald-700 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-gray-600">Pilih tombol Isi Formulir Pendaftaran, lengkapi data calon santri dan orang tua/wali, pilih program, lalu unggah berkas yang diminta. Setelah berhasil, simpan nomor pendaftaran untuk mengecek status.</p>
            </details>
            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-bold text-emerald-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                Berkas apa yang perlu disiapkan?
                <span aria-hidden="true" className="float-right text-emerald-700 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-gray-600">Formulir online meminta gambar Kartu Keluarga, akta kelahiran, dan bukti transfer pendaftaran. Setiap berkas harus berupa gambar dengan ukuran maksimal 1 MB.</p>
            </details>
            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-bold text-emerald-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                Bagaimana cara mengetahui hasil pendaftaran?
                <span aria-hidden="true" className="float-right text-emerald-700 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-gray-600">Buka halaman Cek Status dan masukkan nomor pendaftaran yang diberikan setelah formulir berhasil dikirim.</p>
            </details>
            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-bold text-emerald-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                Apakah rincian biaya dapat berubah?
                <span aria-hidden="true" className="float-right text-emerald-700 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-gray-600">Rincian biaya yang tercantum pada halaman ini dapat diperbarui. Silakan konfirmasi nominal dan tata cara pembayaran kepada pengelola melalui WhatsApp sebelum melakukan transfer.</p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
