"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminContentEditor from '@/components/ui/AdminContentEditor';
import { uploadPublicImage } from '@/lib/supabase';

const ekskulData = [
  {
    nama: "Pembelajaran Seni Tilawah Al Qur'an",
    desc: "Pelatihan seni baca Al-Qur'an dengan berbagai langgam (MTQ) untuk mengasah keindahan vokal dan tajwid.",
    icon: "🎤",
    foto: "",
  },
  {
    nama: "Pagar Nusa",
    desc: "Seni bela diri pencak silat Nahdlatul Ulama untuk membentuk fisik dan mental santri yang tangguh.",
    icon: "🥋",
    foto: "",
  },
  {
    nama: "Maulid Al Barzanji",
    desc: "Kegiatan pembacaan kitab Maulid Al-Barzanji untuk menumbuhkan mahabbah (kecintaan) kepada Nabi Muhammad SAW.",
    icon: "📖",
    foto: "",
  },
  {
    nama: "Hadroh Rebana",
    desc: "Seni musik Islami dengan rebana sebagai media dakwah dan pengembangan kreativitas santri di bidang seni.",
    icon: "🥁",
    foto: "",
  },
  {
    nama: "Pembelajaran Pidato Ragam Bahasa",
    desc: "Pelatihan public speaking untuk melatih mental dan kepercayaan diri santri saat berdakwah di depan umum.",
    icon: "🗣️",
    foto: "",
  },
];

export default function EkstrakurikulerPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState(ekskulData);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'content', 'program_ekskul')).then((snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
        setItems(snapshot.data().items);
      }
    }).catch(() => undefined);
  }, []);

  const saveItems = async (nextItems: Record<string, string>[]) => {
    await setDoc(doc(db, 'content', 'program_ekskul'), { items: nextItems });
    setItems(nextItems as typeof ekskulData);
  };

  const uploadImage = async (_index: number, _key: string, file: File, onProgress?: (progress: number) => void) => uploadPublicImage(file, 'ekskul', onProgress);

  return (
    <>
      {/* Header */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Ekstrakurikuler</h1>
          <p className="text-[#c8e6d0] text-lg">PP Modern Roudlotul Abror</p>
        </div>
      </section>

      {/* Daftar Ekskul */}
      <section className="py-24 bg-[#faf9f6]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-gray-600 leading-relaxed text-lg">
              Kegiatan ekstrakurikuler di Pondok Pesantren Modern Roudlotul Abror dirancang untuk mengembangkan bakat, minat, dan karakter santri di luar kegiatan akademik.
            </p>
            {isAdmin && <button onClick={() => setEditing(true)} className="mt-6 px-5 py-2.5 bg-emerald-700 text-white rounded-lg font-bold">Edit Program &amp; Ekskul</button>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {items.map((ekskul, index) => (
              <div key={index} className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-black/5 hover:-translate-y-2 transition-transform duration-300 overflow-hidden group">
                {/* Foto Placeholder */}
                <div className="w-full h-48 bg-gray-300 relative overflow-hidden">
                  {ekskul.foto && <img src={ekskul.foto} alt={ekskul.nama} className="absolute inset-0 h-full w-full object-cover" />}
                  <div className="absolute inset-0 bg-[#1b5e3b]/20 group-hover:bg-transparent transition-colors z-10"></div>
                  {!ekskul.foto && <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
                    <span className="text-4xl mb-2">{ekskul.icon}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/80 px-2 py-1 rounded">Foto {ekskul.nama}</span>
                  </div>}
                </div>
                {/* Info */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#14462c] mb-3">{ekskul.nama}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{ekskul.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {editing && <AdminContentEditor title="Edit Program & Ekskul" items={items} fields={[{ key: 'icon', label: 'Ikon' }, { key: 'nama', label: 'Nama program' }, { key: 'desc', label: 'Deskripsi', multiline: true }, { key: 'foto', label: 'Upload gambar program', image: true }]} onSave={saveItems} onImageChange={uploadImage} onClose={() => setEditing(false)} />}
    </>
  );
}
