"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type GalleryItem = {
  judul: string;
  deskripsi: string;
  url: string;
};

const defaultGalleryItems: GalleryItem[] = [
  { judul: 'Kegiatan Santri', deskripsi: 'Dokumentasi kegiatan santri.', url: '' },
  { judul: 'Lingkungan Pondok', deskripsi: 'Lingkungan PP Modern Roudlotul Abror.', url: '' },
  { judul: 'Kegiatan Pembelajaran', deskripsi: 'Kegiatan belajar dan mengajar.', url: '' },
];

export default function ProfilSekolahPage() {
  const [galleryItems, setGalleryItems] = useState(defaultGalleryItems);

  useEffect(() => {
    getDoc(doc(db, 'content', 'galeri_foto')).then((snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
        setGalleryItems(snapshot.data().items as GalleryItem[]);
      }
    }).catch(() => undefined);
  }, []);

  const milestones = [
    { year: "2016", title: "Pendirian Pondok", desc: "Yayasan Paguwarmas Maos mendirikan \"Pondok Yatim Rodlotul Abror\" pada 28 Maret 2016, berupa satu ruangan belajar mengajar, dua ruang kamar tidur, dan dua kamar mandi. Awalnya dihuni khusus 15 anak yatim piatu putra." },
    { year: "2019", title: "Masa Pandemi", desc: "Terjadi penurunan santri karena sebagian lulus SMP, tidak adanya santri berstatus yatim/piatu baru, serta wabah COVID-19. Santri tersisa 7 orang." },
    { year: "2020", title: "Pembangunan Gedung Asrama Dua", desc: "Yayasan Paguwarmas membangun Gedung Asrama Dua di belakang Gedung Asrama Satu, berupa asrama (sekarang asrama putri), rumah ustadz, dapur, dan dua kamar mandi." },
    { year: "2021", title: "Perubahan Nama & Penerimaan Santri Putri", desc: "Nama berubah dari \"Pondok Yatim Rodlotul Abror\" → \"Pon-Pes Rodlotul Abror\" → \"Pon-Pes Modern Roudlotul Abror\". Bulan Oktober mulai menerima santri putri, diawali 3 santri putri." },
    { year: "2022", title: "Pembangunan Mushola & Ijin Operasional", desc: "Pembangunan Mushola Roudlotul Abror pada Januari 2022 sebagai tempat ibadah dan belajar mengajar. Pada 23 September 2022, pondok resmi mendapat Ijin Operasional dari Kementerian Agama RI." },
    { year: "2023-2024", title: "Pesantren Kilat & Prestasi", desc: "Menggelar Pesantren Kilat tahunan yang diminati 150-160 siswa dari berbagai kecamatan. Meraih Juara Umum PORSADIN Tk. Kecamatan Maos 2024 dari 41 lembaga." },
    { year: "2024", title: "Ijin Madrasah Diniyah", desc: "26 November 2024, resmi mendapat ijin operasional Madrasah Diniyah Takmiliyah Ula Roudlotul 'Ulum (NSMDT: 3111233011117) dari Kementerian Agama RI, dengan kurang lebih 80 santri." },
    { year: "2025", title: "Perkembangan Pesat", desc: "Jumlah santri tercatat 115 santri (Mei 2025). Mendapat tiga bidang tanah wakaf. Penambahan kamar mandi putra & putri, pelebaran tempat parkir, penambahan teras mushola, dan saluran drainase." },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-emerald-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Profil Sekolah</h1>
          <p className="text-xl text-emerald-100">Pondok Pesantren Modern Roudlotul Abror</p>
          <p className="text-sm text-emerald-200 mt-2">Yayasan Paguwarman — Jl. Dukuh RT.01 RW.04, Buaran-Maos Lor-Maos, Cilacap 53272</p>
        </div>
      </section>

      {/* Identitas Pondok */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Foto Pondok */}
            <div className="w-full h-80 bg-gray-200 rounded-2xl shadow-lg overflow-hidden relative">
              <img src="/profil-gedung-pondok.jpg" alt="Gedung Pondok Pesantren Modern Roudlotul Abror" className="h-full w-full object-cover" />
            </div>

            {/* Identitas */}
            <div>
              <h2 className="text-3xl font-bold text-emerald-900 mb-4">Identitas Pondok</h2>
              <div className="w-16 h-1 bg-amber-500 mb-6"></div>
              <div className="space-y-3">
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">Nama Pondok</span><span className="text-gray-600">: PP Modern Roudlotul Abror</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">Yayasan</span><span className="text-gray-600">: Paguwarmas Maos</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">NSP</span><span className="text-gray-600">: 510033010287</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">NSMDT</span><span className="text-gray-600">: 3111233011117</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">Alamat</span><span className="text-gray-600">: Jl. Dukuh RT.01 RW.04, Buaran, Maoslor, Maos, Cilacap 53272</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">Telepon</span><span className="text-gray-600">: (0282) 695333</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">Email</span><span className="text-gray-600">: ponpesroudlotulabror3@gmail.com</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">Didirikan</span><span className="text-gray-600">: 28 Maret 2016</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-700 w-44 flex-shrink-0">Ijin Operasional</span><span className="text-gray-600">: 23 September 2022 (Kemenag RI)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah & Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Sejarah Singkat &amp; Perkembangan</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-600">
              Perjalanan Pondok Pesantren Modern Roudlotul Abror dari tahun 2016 hingga saat ini.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((item, index) => (
              <div key={index} className="flex gap-4 md:gap-6 pb-8">
                {/* Year badge */}
                <div className="flex-shrink-0 w-24 md:w-32 text-right pt-5">
                  <span className="inline-block bg-emerald-700 text-white text-sm font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-sm">
                    {item.year}
                  </span>
                </div>
                {/* Line & Dot */}
                <div className="flex flex-col items-center relative w-4">
                  {/* The dot */}
                  <div className="absolute top-6 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow z-10"></div>
                  {/* The continuous line to next item */}
                  {index < milestones.length - 1 && (
                    <div className="absolute top-8 bottom-[-64px] w-0.5 bg-emerald-200 z-0"></div>
                  )}
                </div>
                {/* Content */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-grow">
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Foto Pondok */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-emerald-900 mb-2">Galeri Pondok</h2>
          <div className="w-16 h-1 bg-amber-500 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.slice(0, 4).map((item) => (
              <div key={`${item.judul}-${item.url}`} className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden relative group">
                {item.url ? (
                  <img src={item.url} alt={item.judul} className="h-full w-full object-cover" />
                ) : <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-xs text-center px-2">{item.judul}</span>
                </div>}
                <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 text-white text-xs text-center py-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.judul}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/galeri/foto" className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
              Lihat Semua Foto
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
