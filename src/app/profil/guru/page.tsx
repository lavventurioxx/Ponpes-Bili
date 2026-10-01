"use client";

import React, { useEffect, useState } from 'react';
import GuruImage from '@/components/ui/GuruImage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminContentEditor from '@/components/ui/AdminContentEditor';
import { uploadPublicImage } from '@/lib/supabase';

const guruData = [
  {
    nama: "Ust Maftukhin, S.H",
    jabatan: "Pengasuh PP Modern Roudlotul Abror, Wali Kelas Madin 2",
    kategori: "Dewan Asatidz",
    foto: "/guru-1.jpg",
    fallback: "https://ui-avatars.com/api/?name=Ust+Maftukhin&background=047857&color=fff&size=256",
  },
  {
    nama: "Ustz Laili Maftuhah",
    jabatan: "Pengasuh PP Modern Roudlotul Abror Putri, Wali Kelas Madin 1",
    kategori: "Dewan Asatidz",
    foto: "/guru-2.jpg",
    fallback: "https://ui-avatars.com/api/?name=Ustz+Laili+Maftuhah&background=047857&color=fff&size=256",
  },
  {
    nama: "Ust Anwar Suryadi",
    jabatan: "Wali Kelas Madin 3",
    kategori: "Dewan Asatidz",
    foto: "/guru-3.jpg",
    fallback: "https://ui-avatars.com/api/?name=Ust+Anwar+Suryadi&background=047857&color=fff&size=256",
  },
  {
    nama: "Muhammad Nur Ramadhani",
    jabatan: "Wali Kelas Madin 4",
    kategori: "Tenaga Pengajar",
    foto: "/guru-4.jpg",
    fallback: "https://ui-avatars.com/api/?name=Muhammad+Nur+Ramadhani&background=d97706&color=fff&size=256",
  },
  {
    nama: "Ust Choerul Bahro",
    jabatan: "Pengajar Ekstra Pagar Nusa",
    kategori: "Dewan Asatidz",
    foto: "/guru-5.jpg",
    fallback: "https://ui-avatars.com/api/?name=Ust+Choerul+Bahro&background=047857&color=fff&size=256",
  },
  {
    nama: "Masayu Dhia Ananti",
    jabatan: "Pengajar Life Skill dan Bahasa Inggris",
    kategori: "Tenaga Pengajar",
    foto: "/guru-6.jpg",
    fallback: "https://ui-avatars.com/api/?name=Masayu+Dhia+Ananti&background=d97706&color=fff&size=256",
  }
];

const normalizeGuruItems = (items: typeof guruData) => items.map((guru) => (
  guru.nama === 'Mas Ayu Dhia A' || guru.nama === 'Masayu Dhia Ananti'
    ? {
        ...guru,
        nama: 'Masayu Dhia Ananti',
        fallback: 'https://ui-avatars.com/api/?name=Masayu+Dhia+Ananti&background=d97706&color=fff&size=256',
      }
    : guru
));

export default function GuruPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState(guruData);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'content', 'guru')).then((snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
        setItems(normalizeGuruItems(snapshot.data().items as typeof guruData));
      }
    }).catch(() => undefined);
  }, []);

  const saveItems = async (nextItems: Record<string, string>[]) => {
    const normalizedItems = normalizeGuruItems(nextItems as typeof guruData);
    await setDoc(doc(db, 'content', 'guru'), { items: normalizedItems });
    setItems(normalizedItems);
  };

  const uploadImage = async (_index: number, _key: string, file: File, onProgress?: (progress: number) => void) => {
    if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 5 MB.');
    return uploadPublicImage(file, 'guru', onProgress);
  };

  return (
    <>
      {/* Header Section */}
      <section className="bg-emerald-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Dewan Asatidz & Tenaga Pengajar</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Membentuk generasi qur'ani yang berakhlakul karimah di bawah bimbingan para pengajar yang kompeten dan berdedikasi.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Profil Pengajar Kami</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
            {isAdmin && <button onClick={() => setEditing(true)} className="mt-6 px-5 py-2.5 bg-emerald-700 text-white rounded-lg font-bold">Edit Dewan Asatidz &amp; Pengajar</button>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {items.map((guru, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group">
                
                {/* Bagian Foto Placeholder */}
                <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                  <GuruImage 
                    src={guru.foto} 
                    alt={guru.nama}
                    fallback={guru.fallback}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge Kategori */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                      guru.kategori === 'Dewan Asatidz' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {guru.kategori}
                    </span>
                  </div>
                </div>

                {/* Bagian Info */}
                <div className="px-4 py-4 text-center min-h-[116px] flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{guru.nama}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-snug">{guru.jabatan}</p>
                </div>
                
              </div>
            ))}
          </div>

        </div>
      </section>
      {editing && <AdminContentEditor title="Edit Dewan Asatidz & Pengajar" items={items} fields={[{ key: 'nama', label: 'Nama guru' }, { key: 'jabatan', label: 'Jabatan' }, { key: 'kategori', label: 'Kategori', options: ['Dewan Asatidz', 'Tenaga Pengajar'] }, { key: 'foto', label: 'Pilih foto guru', image: true }]} onSave={saveItems} onImageChange={uploadImage} onClose={() => setEditing(false)} />}
    </>
  );
}
