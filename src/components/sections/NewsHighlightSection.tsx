"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminContentEditor from '@/components/ui/AdminContentEditor';
import { uploadPublicImage } from '@/lib/supabase';

type NewsItem = {
  title: string;
  date: string;
  desc: string;
  thumbnail: string;
  link: string;
  tag: string;
};

const defaultNewsItems: NewsItem[] = [
  {
    title: "Penerimaan Santri Baru Gelombang 1",
    date: "15 Mei 2026",
    desc: "Pendaftaran santri baru untuk tahun ajaran depan telah resmi dibuka. Segera daftarkan putra-putri Anda sebelum kuota penuh.",
    thumbnail: "/berita-1.jpg",
    link: "/penerimaan-santri-baru",
    tag: "Pengumuman"
  },
  {
    title: "Prestasi Santri di MTQ Nasional",
    date: "02 Mei 2026",
    desc: "Alhamdulillah, kontingen santri PP Roudlotul Abror berhasil meraih juara 1 dalam cabang Musabaqah Hifdzil Qur'an 30 Juz.",
    thumbnail: "/berita-2.jpg",
    link: "/informasi/prestasi",
    tag: "Prestasi"
  },
  {
    title: "Kunjungan Studi Banding",
    date: "28 April 2026",
    desc: "Kunjungan studi banding dari ponpes se-Jawa Timur untuk mempelajari sistem madrasah diniyah.",
    thumbnail: "/berita-3.jpg",
    link: "/informasi/berita",
    tag: "Kegiatan"
  }
];

export function NewsHighlightSection() {
  const { isAdmin } = useAuth();
  const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNewsItems);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'content', 'berita'), (snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
        setNewsItems(snapshot.data().items as NewsItem[]);
      }
    }, () => undefined);
  }, []);

  const saveNews = async (nextItems: Record<string, string>[]) => {
    await setDoc(doc(db, 'content', 'berita'), { items: nextItems });
    setNewsItems(nextItems as NewsItem[]);
  };

  const uploadThumbnail = async (_index: number, _key: string, file: File, onProgress?: (progress: number) => void) => {
    if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran thumbnail maksimal 5 MB.');
    return uploadPublicImage(file, 'berita', onProgress);
  };

  return (
    <section className="py-24 bg-[#faf9f6]">
      <div className="container mx-auto px-4 max-w-7xl pt-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[#c8a951] font-semibold text-sm tracking-[0.2em] uppercase">Berita &amp; Artikel</span>
              <div className="w-16 h-px bg-[#c8a951]"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#14462c] leading-tight">
              Kabar Terbaru <br/>Seputar Pesantren
            </h2>
            {isAdmin && <button onClick={() => setEditing(true)} className="mt-6 rounded-lg bg-emerald-700 px-5 py-2.5 font-bold text-white">Edit Berita</button>}
          </div>
          <Link href="/informasi/berita" className="inline-flex items-center gap-2 text-[#1b5e3b] font-bold hover:text-[#c8a951] transition-colors group">
            Lihat Semua Berita
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/5 border border-gray-100 group hover:-translate-y-2 transition-transform duration-300">
              <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="relative block h-56 bg-gray-300 overflow-hidden flex items-center justify-center">
                <img 
                  src={item.thumbnail} 
                  alt={`Thumbnail ${item.title}`} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0" 
                />
                <div className="absolute inset-0 bg-[#1b5e3b]/20 group-hover:bg-transparent transition-colors z-10"></div>
                <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#14462c]">
                  {item.tag}
                </div>
              </a>
              <div className="p-8">
                <div className="text-gray-400 text-sm font-medium mb-3">{item.date}</div>
                <h3 className="text-xl font-bold text-[#14462c] mb-4 group-hover:text-[#1b5e3b] transition-colors leading-snug">
                  <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}>{item.title}</a>
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
                <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-sm font-bold text-[#c8a951] uppercase tracking-wider hover:text-[#a88730] transition-colors">
                  Baca Selengkapnya
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editing && <AdminContentEditor title="Edit Berita" items={newsItems} fields={[{ key: 'title', label: 'Judul berita' }, { key: 'date', label: 'Tanggal berita' }, { key: 'tag', label: 'Kategori/tag' }, { key: 'link', label: 'Link berita' }, { key: 'desc', label: 'Deskripsi', multiline: true }, { key: 'thumbnail', label: 'Upload thumbnail berita', image: true }, { key: 'thumbnail', label: 'URL thumbnail berita' }]} onSave={saveNews} onImageChange={uploadThumbnail} onClose={() => setEditing(false)} />}
    </section>
  );
}
