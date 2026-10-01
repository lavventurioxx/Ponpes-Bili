"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// =================== INTERFACE ===================
export interface SeksiItem {
  nama: string;
  anggota: string[];
}

export interface StrukturPengurusData {
  periode: string;
  pengasuhPutra: string;
  pengasuhPutri: string;
  ketua: string;
  sekretaris: string;
  bendahara: string;
  seksi: SeksiItem[];
}

// =================== DATA DEFAULT ===================
const DEFAULT_STRUKTUR: StrukturPengurusData = {
  periode: "2024–2026",
  pengasuhPutra: "MAFTUKHIN, S.H.",
  pengasuhPutri: "LAILI MAFTUHAH",
  ketua: "ANAND BAHRUL ULUM",
  sekretaris: "MUHAMMAD NUR RAMDHANI",
  bendahara: "ROFIK AL FAKHRI KHAERODIN",
  seksi: [
    {
      nama: "SEKSI PENDIDIKAN",
      anggota: ["RIFAI WAHYU SYAHPUTRA"]
    },
    {
      nama: "SEKSI KEAMANAN",
      anggota: [
        "ANANDA PUTRA IMAN",
        "ROFIQ AL FAKHRI KHAERUDIN",
        "FARASS AMINUDDIN FITROH"
      ]
    },
    {
      nama: "SEKSI KEBERSIHAN",
      anggota: [
        "MUHAMMAD ALFA KAMAL TANAUN",
        "RIZKI RAHMAT RAMADHANI",
        "ZULFAN"
      ]
    },
    {
      nama: "SEKSI HUMAS",
      anggota: [
        "EET SYAHRANI",
        "NAUFAL",
        "RIZKI MAULANA",
        "HABSI AL-FAQIH"
      ]
    }
  ]
};

// =================== TOAST NOTIFIKASI ===================
interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

function ToastContainer({ toasts, removeToast }: { toasts: ToastItem[]; removeToast: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-sm transition-all ${
            t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-500' : 'bg-amber-500'
          }`}
        >
          <span className="text-base">{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100 ml-2">✕</button>
        </div>
      ))}
    </div>
  );
}

// =================== MAIN COMPONENT ===================
export default function StrukturPengurusPage() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<StrukturPengurusData>(DEFAULT_STRUKTUR);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<StrukturPengurusData>(DEFAULT_STRUKTUR);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Ambil data dari Firestore saat pertama kali dimuat
  useEffect(() => {
    const fetchStruktur = async () => {
      try {
        const docRef = doc(db, 'settings', 'struktur_pengurus');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetched = docSnap.data() as StrukturPengurusData;
          setData(fetched);
          setEditForm(fetched);
        } else {
          setData(DEFAULT_STRUKTUR);
          setEditForm(DEFAULT_STRUKTUR);
        }
      } catch {
        // Jika belum ada akses atau rules belum dipublish, gunakan data default
        setData(DEFAULT_STRUKTUR);
        setEditForm(DEFAULT_STRUKTUR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStruktur();
  }, []);

  const handleOpenEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(data)));
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const docRef = doc(db, 'settings', 'struktur_pengurus');
      await setDoc(docRef, editForm);
      setData(editForm);
      setIsEditing(false);
      showToast('success', 'Struktur kepengurusan berhasil diperbarui!');
    } catch (err) {
      console.error("Gagal menyimpan struktur pengurus:", err);
      showToast('error', 'Gagal menyimpan perubahan ke database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = async () => {
    if (!confirm('Apakah Anda yakin ingin mengembalikan struktur pengurus ke susunan standar 2024–2026?')) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'settings', 'struktur_pengurus');
      await setDoc(docRef, DEFAULT_STRUKTUR);
      setData(DEFAULT_STRUKTUR);
      setEditForm(DEFAULT_STRUKTUR);
      setIsEditing(false);
      showToast('info', 'Struktur kepengurusan dikembalikan ke susunan awal.');
    } catch (err) {
      console.error("Gagal mereset:", err);
      showToast('error', 'Gagal mereset struktur.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper untuk menambah anggota di seksi tertentu
  const handleAddAnggota = (seksiIdx: number) => {
    const updated = { ...editForm };
    updated.seksi[seksiIdx].anggota.push("");
    setEditForm(updated);
  };

  // Helper untuk mengubah nama anggota di seksi tertentu
  const handleAnggotaChange = (seksiIdx: number, anggotaIdx: number, val: string) => {
    const updated = { ...editForm };
    updated.seksi[seksiIdx].anggota[anggotaIdx] = val;
    setEditForm(updated);
  };

  // Helper untuk menghapus anggota di seksi tertentu
  const handleDeleteAnggota = (seksiIdx: number, anggotaIdx: number) => {
    const updated = { ...editForm };
    updated.seksi[seksiIdx].anggota = updated.seksi[seksiIdx].anggota.filter((_, idx) => idx !== anggotaIdx);
    setEditForm(updated);
  };

  // Helper untuk menambah seksi baru
  const handleAddSeksi = () => {
    const updated = { ...editForm };
    updated.seksi.push({ nama: "SEKSI BARU", anggota: [""] });
    setEditForm(updated);
  };

  // Helper untuk menghapus seksi
  const handleDeleteSeksi = (seksiIdx: number) => {
    if (!confirm(`Hapus seksi ${editForm.seksi[seksiIdx].nama}?`)) return;
    const updated = { ...editForm };
    updated.seksi = updated.seksi.filter((_, idx) => idx !== seksiIdx);
    setEditForm(updated);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header Banner */}
      <section className="bg-emerald-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-amber-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <span>✨</span> Susunan Kepengurusan <span>✨</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Pondok Pesantren Modern Roudlotul Abror
          </h1>
          <p className="text-emerald-200 font-medium text-lg">
            Maos – Cilacap &bull; Periode <span className="text-amber-400 font-bold">{data.periode}</span>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl -mt-6 relative z-20">
        {/* Admin Bar (Hanya tampil jika admin) */}
        {isAdmin && (
          <div className="bg-amber-500 text-emerald-950 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-10 border border-amber-400">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-bold text-sm">Mode Administrator Aktif</p>
                <p className="text-xs text-emerald-900 font-medium">Anda memiliki wewenang untuk mengubah atau menyesuaikan susunan pengurus ini secara langsung.</p>
              </div>
            </div>
            <button
              onClick={handleOpenEdit}
              className="px-6 py-2.5 bg-emerald-900 text-white hover:bg-emerald-950 font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <span>✏️</span> Edit Struktur Pengurus
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center text-gray-400 font-medium">Memuat struktur organisasi...</div>
        ) : (
          <div className="space-y-12">
            
            {/* LEVEL 1: PENGASUH */}
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#c8a951] uppercase">Dewan Pengasuh</span>
                <div className="w-12 h-1 bg-[#c8a951] mx-auto mt-1 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Pengasuh Putra */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border-2 border-[#c8a951]/40 text-center relative overflow-hidden group hover:border-[#c8a951] transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#c8a951]/10 rounded-bl-full pointer-events-none"></div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mx-auto mb-4 font-bold shadow-inner">
                    👳‍♂️
                  </div>
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-emerald-100">
                    Pengasuh Santri Putra
                  </span>
                  <h3 className="text-xl font-extrabold text-[#14462c]">{data.pengasuhPutra}</h3>
                </div>

                {/* Pengasuh Putri */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border-2 border-[#c8a951]/40 text-center relative overflow-hidden group hover:border-[#c8a951] transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#c8a951]/10 rounded-bl-full pointer-events-none"></div>
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mx-auto mb-4 font-bold shadow-inner">
                    🧕
                  </div>
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-amber-100">
                    Pengasuh Santri Putri
                  </span>
                  <h3 className="text-xl font-extrabold text-[#14462c]">{data.pengasuhPutri}</h3>
                </div>
              </div>
            </div>

            {/* Garis Penghubung Hierarki */}
            <div className="flex justify-center -my-6">
              <div className="w-0.5 h-10 bg-emerald-200"></div>
            </div>

            {/* LEVEL 2: PENGURUS HARIAN (Ketua di Puncak, Sekretaris di Kiri Bawah, Bendahara di Kanan Bawah) */}
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#1b5e3b] uppercase">Pengurus Harian</span>
                <div className="w-12 h-1 bg-[#1b5e3b] mx-auto mt-1 rounded-full"></div>
              </div>

              {/* KETUA (Tengah Atas) */}
              <div className="max-w-md mx-auto mb-4">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border-2 border-emerald-600/30 text-center hover:-translate-y-1 transition-all relative overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl mx-auto mb-3 font-bold shadow-md">
                    👑
                  </div>
                  <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
                    Ketua Pengurus
                  </span>
                  <h4 className="text-xl font-extrabold text-gray-900">{data.ketua}</h4>
                </div>
              </div>

              {/* Garis Penghubung Cabang Organisasi */}
              <div className="hidden md:flex flex-col items-center justify-center mb-4 max-w-xl mx-auto">
                <div className="w-0.5 h-5 bg-emerald-300"></div>
                <div className="w-2/3 h-0.5 bg-emerald-300"></div>
                <div className="w-2/3 flex justify-between">
                  <div className="w-0.5 h-4 bg-emerald-300"></div>
                  <div className="w-0.5 h-4 bg-emerald-300"></div>
                </div>
              </div>

              {/* SEKRETARIS (Kiri Bawah) & BENDAHARA (Kanan Bawah) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Sekretaris */}
                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-emerald-100 text-center hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#c8a951] text-emerald-950 flex items-center justify-center text-xl mx-auto mb-3 font-bold shadow-md">
                    📝
                  </div>
                  <span className="inline-block px-3 py-0.5 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                    Sekretaris
                  </span>
                  <h4 className="text-lg font-bold text-gray-900">{data.sekretaris}</h4>
                </div>

                {/* Bendahara */}
                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-emerald-100 text-center hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-xl mx-auto mb-3 font-bold shadow-md">
                    💰
                  </div>
                  <span className="inline-block px-3 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                    Bendahara
                  </span>
                  <h4 className="text-lg font-bold text-gray-900">{data.bendahara}</h4>
                </div>
              </div>
            </div>

            {/* Garis Penghubung Hierarki */}
            <div className="flex justify-center -my-6">
              <div className="w-0.5 h-10 bg-emerald-200"></div>
            </div>

            {/* LEVEL 3: SEKSI-SEKSI BIDANG */}
            <div>
              <div className="text-center mb-8">
                <span className="text-xs font-bold tracking-[0.2em] text-[#1b5e3b] uppercase">Seksi Bidang &amp; Operasional</span>
                <div className="w-12 h-1 bg-[#1b5e3b] mx-auto mt-1 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.seksi.map((s, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-md shadow-black/5 border border-gray-100 flex flex-col hover:border-emerald-300 transition-all group">
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <h4 className="font-extrabold text-[#14462c] text-sm uppercase tracking-wide leading-snug">
                        {s.nama}
                      </h4>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {s.anggota.map((ang, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                          <span className="font-medium leading-relaxed">{ang}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* =================== MODAL EDITOR ADMIN =================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8 animate-fade-in-up">
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Edit Struktur Kepengurusan</h3>
                <p className="text-emerald-200 text-xs mt-1">Perubahan akan langsung tersimpan di database dan tampil di website.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Periode */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Periode Kepengurusan</label>
                <input
                  type="text"
                  required
                  value={editForm.periode}
                  onChange={(e) => setEditForm({ ...editForm, periode: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Contoh: 2024–2026"
                />
              </div>

              {/* Pengasuh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pengasuh Santri Putra</label>
                  <input
                    type="text"
                    required
                    value={editForm.pengasuhPutra}
                    onChange={(e) => setEditForm({ ...editForm, pengasuhPutra: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pengasuh Santri Putri</label>
                  <input
                    type="text"
                    required
                    value={editForm.pengasuhPutri}
                    onChange={(e) => setEditForm({ ...editForm, pengasuhPutri: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Pengurus Harian */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ketua</label>
                  <input
                    type="text"
                    required
                    value={editForm.ketua}
                    onChange={(e) => setEditForm({ ...editForm, ketua: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sekretaris</label>
                  <input
                    type="text"
                    required
                    value={editForm.sekretaris}
                    onChange={(e) => setEditForm({ ...editForm, sekretaris: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bendahara</label>
                  <input
                    type="text"
                    required
                    value={editForm.bendahara}
                    onChange={(e) => setEditForm({ ...editForm, bendahara: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Seksi-Seksi */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-gray-900 text-base">Daftar Seksi &amp; Anggota</h4>
                  <button
                    type="button"
                    onClick={handleAddSeksi}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    + Tambah Seksi Baru
                  </button>
                </div>

                <div className="space-y-6">
                  {editForm.seksi.map((s, sIdx) => (
                    <div key={sIdx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 relative">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <input
                          type="text"
                          required
                          value={s.nama}
                          onChange={(e) => {
                            const updated = { ...editForm };
                            updated.seksi[sIdx].nama = e.target.value;
                            setEditForm(updated);
                          }}
                          className="font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-gray-300 text-sm flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteSeksi(sIdx)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1"
                        >
                          Hapus Seksi
                        </button>
                      </div>

                      {/* List Anggota */}
                      <div className="space-y-2 pl-2">
                        {s.anggota.map((ang, aIdx) => (
                          <div key={aIdx} className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">{aIdx + 1}.</span>
                            <input
                              type="text"
                              required
                              value={ang}
                              onChange={(e) => handleAnggotaChange(sIdx, aIdx, e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="Nama Pengurus"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteAnggota(sIdx, aIdx)}
                              className="text-gray-400 hover:text-red-500 px-1 text-base"
                              title="Hapus Nama"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddAnggota(sIdx)}
                          className="text-emerald-700 hover:text-emerald-900 text-xs font-bold mt-2 inline-flex items-center gap-1"
                        >
                          + Tambah Anggota
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="text-red-600 hover:text-red-800 font-bold text-xs"
                >
                  ↺ Reset ke Standar 2024–2026
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-colors disabled:opacity-50 shadow-md"
                  >
                    {isSaving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
