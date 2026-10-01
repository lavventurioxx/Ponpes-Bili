"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { collection, getDocs, doc, updateDoc, writeBatch, serverTimestamp, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createPrivateDocumentUrl } from '@/lib/supabase';
import * as XLSX from 'xlsx';

// =================== TOAST ===================
interface ToastItem { id: number; type: 'success' | 'error' | 'info'; message: string; }

function Toast({ toasts, removeToast }: { toasts: ToastItem[]; removeToast: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-sm ${
          t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-500' : 'bg-amber-500'
        }`}>
          <span className="text-base">{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100 ml-2 pointer-events-auto">✕</button>
        </div>
      ))}
    </div>
  );
}

interface Pendaftar {
  id: string;
  userId: string;
  email: string;
  nomorPendaftaran?: string;
  jenisPendaftaran?: 'Santri Tetap' | 'Santri Pesantren Kilat';
  namaLengkap: string;
  nik: string;
  jenisKelamin: string;
  nomorHp: string;
  programPilihan: string;
  status: string;
  submittedAt: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  alamatLengkap?: string;
  namaAyah?: string;
  namaIbu?: string;
  kartuKeluargaUrl?: string;
  aktaKelahiranUrl?: string;
  buktiTransferUrl?: string;
}

export default function AdminDashboardPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  
  const [pendaftarList, setPendaftarList] = useState<Pendaftar[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [jenisFilter, setJenisFilter] = useState<'Semua' | 'Santri Tetap' | 'Santri Pesantren Kilat'>('Semua');
  const [editingPendaftar, setEditingPendaftar] = useState<Pendaftar | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [documentLinks, setDocumentLinks] = useState<{ label: string; url: string }[] | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState<string | null>(null);
  const toastId = useRef(0);

  const handleShowToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const fetchPendaftar = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pendaftaran'));
      const list: Pendaftar[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Pendaftar);
      });
      for (let start = 0; start < list.length; start += 450) {
        const statusBatch = writeBatch(db);
        list.slice(start, start + 450).forEach((pendaftar) => {
          const registrationNumber = pendaftar.nomorPendaftaran || pendaftar.id.slice(0, 8).toUpperCase();
          statusBatch.set(doc(db, 'status_pendaftaran', registrationNumber), {
            nomorPendaftaran: registrationNumber,
            namaLengkap: deleteField(),
            status: pendaftar.status,
            submittedAt: pendaftar.submittedAt,
          }, { merge: true });
        });
        if (list.length > 0) await statusBatch.commit();
      }
      // Sort by submitted date descending
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setPendaftarList(list);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const openDocuments = async (pendaftar: Pendaftar) => {
    const documents = [
      ['Kartu Keluarga', pendaftar.kartuKeluargaUrl],
      ['Akta Kelahiran', pendaftar.aktaKelahiranUrl],
      ['Bukti Transfer', pendaftar.buktiTransferUrl],
    ].filter((document): document is [string, string] => Boolean(document[1]));

    if (documents.length === 0) {
      handleShowToast('info', 'Belum ada dokumen yang tersimpan untuk pendaftar ini.');
      return;
    }

    setLoadingDocuments(pendaftar.id);
    try {
      const links = await Promise.all(documents.map(async ([label, path]) => ({
        label,
        url: await createPrivateDocumentUrl(path),
      })));
      setDocumentLinks(links);
    } catch (error) {
      console.error('Error membuka dokumen pendaftar:', error);
      handleShowToast('error', 'Dokumen tidak dapat dibuka. Pastikan policy SELECT bucket Supabase pendaftaran sudah dibuat.');
    } finally {
      setLoadingDocuments(null);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/dashboard');
      } else {
        void Promise.resolve().then(fetchPendaftar);
      }
    }
  }, [user, loading, isAdmin, router, fetchPendaftar]);

  const updateStatus = async (id: string, newStatus: string) => {
    const pendaftar = pendaftarList.find(p => p.id === id);
    if (!pendaftar) return;
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'pendaftaran', id), { status: newStatus });
      const registrationNumber = pendaftar.nomorPendaftaran || id.slice(0, 8).toUpperCase();
      batch.set(doc(db, 'status_pendaftaran', registrationNumber), {
        nomorPendaftaran: registrationNumber,
        namaLengkap: deleteField(),
        status: newStatus,
        submittedAt: pendaftar.submittedAt,
      }, { merge: true });

      // Gunakan ID deterministik agar penerimaan ulang tidak membuat santri duplikat.
      if (newStatus === 'Diterima') {
        batch.set(doc(db, 'santri', `pendaftaran_${id}`), {
          nama: pendaftar.namaLengkap,
          nism: pendaftar.nik,
          jk: pendaftar.jenisKelamin,
          alamat: pendaftar.alamatLengkap || '-',
          nomorHp: pendaftar.nomorHp,
          programPilihan: pendaftar.programPilihan,
          jenisPendaftaran: pendaftar.jenisPendaftaran || 'Santri Tetap',
          namaAyah: pendaftar.namaAyah || '-',
          namaIbu: pendaftar.namaIbu || '-',
          tempatLahir: pendaftar.tempatLahir || '-',
          tanggalLahir: pendaftar.tanggalLahir || '-',
          source: 'Pendaftar Baru',
          pendaftaranId: id,
          createdAt: serverTimestamp(),
        }, { merge: true });
      }

      await batch.commit();

      handleShowToast(
        newStatus === 'Diterima' ? 'success' : newStatus === 'Ditolak' ? 'error' : 'info',
        newStatus === 'Diterima'
          ? `${pendaftar.namaLengkap} diterima dan otomatis tersimpan ke Data Santri Aktif.`
          : `Status berhasil diubah menjadi ${newStatus}.`
      );

      setPendaftarList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (error) {
      console.error("Error updating status:", error);
      handleShowToast('error', 'Gagal mengubah status.');
    }
  };

  const filteredPendaftar = jenisFilter === 'Semua'
    ? pendaftarList
    : pendaftarList.filter((pendaftar) => pendaftar.jenisPendaftaran === jenisFilter);

  const exportToExcel = () => {
    if (filteredPendaftar.length === 0) {
      handleShowToast('error', 'Tidak ada data untuk diexport.');
      return;
    }

    // Format data for Excel
    const dataToExport = filteredPendaftar.map((p, index) => ({
      'No': index + 1,
      'Jenis Pendaftaran': p.jenisPendaftaran || 'Belum dipilih',
      'Nama Lengkap': p.namaLengkap,
      'NIK': p.nik,
      'Jenis Kelamin': p.jenisKelamin === 'L' ? 'Laki-Laki' : p.jenisKelamin === 'P' ? 'Perempuan' : p.jenisKelamin,
      'Tempat Lahir': p.tempatLahir || '-',
      'Tanggal Lahir': p.tanggalLahir || '-',
      'Nama Ayah': p.namaAyah || '-',
      'Nama Ibu': p.namaIbu || '-',
      'Nomor HP': p.nomorHp,
      'Program Pilihan': p.programPilihan,
      'Alamat Lengkap': p.alamatLengkap || '-',
      'Status': p.status,
      'Tanggal Daftar': new Date(p.submittedAt).toLocaleString('id-ID')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar");
    
    // Generate Excel file and trigger download
    const fileLabel = jenisFilter === 'Semua' ? 'Semua' : jenisFilter.replaceAll(' ', '_');
    XLSX.writeFile(workbook, `Data_Pendaftar_${fileLabel}_${new Date().getTime()}.xlsx`);
  };

  const printAttendance = () => {
    if (filteredPendaftar.length === 0) {
      handleShowToast('error', 'Tidak ada data untuk dicetak.');
      return;
    }
    window.print();
  };

  const saveEditedPendaftar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPendaftar) return;
    setIsSavingEdit(true);
    try {
      const { id, ...data } = editingPendaftar;
      await updateDoc(doc(db, 'pendaftaran', id), data);
      setPendaftarList((current) => current.map((item) => item.id === id ? editingPendaftar : item));
      setEditingPendaftar(null);
      handleShowToast('success', 'Data diri siswa berhasil diperbarui.');
    } catch (error) {
      console.error('Error editing pendaftar:', error);
      handleShowToast('error', 'Gagal memperbarui data diri siswa.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Calculate Statistics
  const stats = {
    total: pendaftarList.length,
    diterima: pendaftarList.filter(p => p.status === 'Diterima').length,
    ditolak: pendaftarList.filter(p => p.status === 'Ditolak').length,
    menunggu: pendaftarList.filter(p => p.status === 'Menunggu Proses').length,
  };

  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data admin...</div>;
  }

  return (
    <div className="admin-dashboard-page min-h-screen bg-gray-50 py-12">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Navigation */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 pb-4">
          <Link href="/admin" className="text-emerald-700 font-bold px-4 py-2 border-b-2 border-emerald-700">
            Pendaftar Baru
          </Link>
          <Link href="/admin/data-santri" className="text-gray-500 hover:text-emerald-700 font-medium px-4 py-2">
            Data Santri Aktif
          </Link>
          <Link href="/profil/pengurus" className="text-gray-500 hover:text-emerald-700 font-medium px-4 py-2 flex items-center gap-1.5">
            <span>👥</span> Struktur Pengurus
          </Link>
        </div>

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Dashboard Admin</h1>
            <p className="text-gray-600 mt-1">Sistem Informasi Penerimaan Santri Baru</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportToExcel}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Export Excel
            </button>
            <button
              onClick={printAttendance}
              className="bg-amber-500 text-emerald-950 px-5 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors shadow-sm"
            >
              Cetak Daftar Hadir
            </button>
            <button 
              onClick={() => {
                setLoadingData(true);
                void fetchPendaftar();
              }}
              className="bg-emerald-100 text-emerald-800 px-5 py-2 rounded-lg font-bold hover:bg-emerald-200 transition-colors shadow-sm"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="print:hidden mb-6 flex flex-wrap items-center gap-3">
          <span className="font-semibold text-gray-700">Filter:</span>
          {(['Semua', 'Santri Tetap', 'Santri Pesantren Kilat'] as const).map((jenis) => (
            <button
              key={jenis}
              onClick={() => setJenisFilter(jenis)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${jenisFilter === jenis ? 'bg-emerald-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50'}`}
            >
              {jenis}
            </button>
          ))}
          <span className="text-sm text-gray-500">{filteredPendaftar.length} data</span>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Pendaftar</p>
              <p className="text-3xl font-bold text-emerald-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Diterima</p>
              <p className="text-3xl font-bold text-green-600">{stats.diterima}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Menunggu</p>
              <p className="text-3xl font-bold text-amber-600">{stats.menunggu}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Ditolak</p>
              <p className="text-3xl font-bold text-red-600">{stats.ditolak}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>
        
        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white text-sm uppercase tracking-wide">
                  <th className="p-4 font-semibold">Nama Santri</th>
                  <th className="p-4 font-semibold">L/P</th>
                  <th className="p-4 font-semibold">Program</th>
                  <th className="p-4 font-semibold">Kontak</th>
                  <th className="p-4 font-semibold">Tanggal Daftar</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPendaftar.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Belum ada data pendaftar.
                    </td>
                  </tr>
                ) : (
                  filteredPendaftar.map((pendaftar) => (
                    <tr key={pendaftar.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{pendaftar.namaLengkap}</p>
                        <p className="text-xs text-gray-500">NIK: {pendaftar.nik}</p>
                        <p className="text-xs font-semibold text-emerald-700">{pendaftar.jenisPendaftaran || 'Belum dipilih'}</p>
                      </td>
                      <td className="p-4 text-gray-700">{pendaftar.jenisKelamin}</td>
                      <td className="p-4 text-gray-700 text-sm">{pendaftar.programPilihan}</td>
                      <td className="p-4">
                        <p className="text-sm text-gray-700">{pendaftar.nomorHp}</p>
                        <p className="text-xs text-gray-500">{pendaftar.email}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(pendaftar.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          pendaftar.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                          pendaftar.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {pendaftar.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <select 
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                            value={pendaftar.status}
                            onChange={(e) => updateStatus(pendaftar.id, e.target.value)}
                          >
                            <option value="Menunggu Proses">Menunggu</option>
                            <option value="Diterima">Terima</option>
                            <option value="Ditolak">Tolak</option>
                          </select>
                          <button onClick={() => setEditingPendaftar({ ...pendaftar })} className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-100">Edit Data Diri</button>
                          <button onClick={() => openDocuments(pendaftar)} disabled={loadingDocuments === pendaftar.id} className="rounded-md bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-60">{loadingDocuments === pendaftar.id ? 'Membuka...' : 'Lihat Dokumen'}</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingPendaftar && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4 print:hidden">
          <form onSubmit={saveEditedPendaftar} className="mx-auto my-8 max-w-3xl space-y-5 rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-emerald-900">Edit Data Diri Siswa</h2><button type="button" onClick={() => setEditingPendaftar(null)} className="text-gray-500">Tutup</button></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ['namaLengkap', 'Nama Lengkap'], ['nik', 'NIK'], ['tempatLahir', 'Tempat Lahir'], ['tanggalLahir', 'Tanggal Lahir'], ['namaAyah', 'Nama Ayah / Wali'], ['namaIbu', 'Nama Ibu'], ['nomorHp', 'Nomor HP / WhatsApp'], ['alamatLengkap', 'Alamat Lengkap'], ['programPilihan', 'Program Pilihan'],
              ].map(([key, label]) => (
                <label key={key} className={key === 'alamatLengkap' ? 'md:col-span-2' : ''}>
                  <span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>
                  {key === 'alamatLengkap' ? <textarea required value={String(editingPendaftar[key as keyof Pendaftar] || '')} onChange={(e) => setEditingPendaftar({ ...editingPendaftar, [key]: e.target.value })} rows={3} className="w-full rounded-lg border px-3 py-2" /> : <input required type={key === 'tanggalLahir' ? 'date' : 'text'} value={String(editingPendaftar[key as keyof Pendaftar] || '')} onChange={(e) => setEditingPendaftar({ ...editingPendaftar, [key]: e.target.value })} className="w-full rounded-lg border px-3 py-2" />}
                </label>
              ))}
              <label><span className="mb-1 block text-sm font-semibold text-gray-700">Jenis Pendaftaran</span><select required value={editingPendaftar.jenisPendaftaran || ''} onChange={(e) => setEditingPendaftar({ ...editingPendaftar, jenisPendaftaran: e.target.value as Pendaftar['jenisPendaftaran'] })} className="w-full rounded-lg border px-3 py-2"><option value="">Pilih jenis</option><option value="Santri Tetap">Santri Tetap</option><option value="Santri Pesantren Kilat">Santri Pesantren Kilat</option></select></label>
              <label><span className="mb-1 block text-sm font-semibold text-gray-700">Jenis Kelamin</span><select required value={editingPendaftar.jenisKelamin} onChange={(e) => setEditingPendaftar({ ...editingPendaftar, jenisKelamin: e.target.value })} className="w-full rounded-lg border px-3 py-2"><option value="L">Laki-Laki</option><option value="P">Perempuan</option></select></label>
            </div>
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditingPendaftar(null)} className="rounded-lg border px-5 py-2 font-bold text-gray-600">Batal</button><button disabled={isSavingEdit} className="rounded-lg bg-emerald-700 px-5 py-2 font-bold text-white">{isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</button></div>
          </form>
        </div>
      )}

      {documentLinks && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 print:hidden">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-emerald-900">Dokumen Pendaftar</h2>
              <button type="button" onClick={() => setDocumentLinks(null)} className="text-gray-500">Tutup</button>
            </div>
            <div className="space-y-3">
              {documentLinks.map((document) => (
                <a key={document.label} href={document.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 font-semibold text-emerald-800 hover:bg-emerald-100">
                  Buka {document.label}
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">Tautan dokumen berlaku selama 5 menit.</p>
          </div>
        </div>
      )}

      <div className="admin-print-sheet hidden print:block">
        <h1 className="mb-2 text-center text-xl font-bold">DAFTAR HADIR PESERTA DIDIK</h1>
        <p className="mb-6 text-center">{jenisFilter} | PP Modern Roudlotul Abror</p>
        <table className="w-full border-collapse text-sm"><thead><tr><th className="border p-2">No</th><th className="border p-2 text-left">Nama</th><th className="border p-2">L/P</th><th className="border p-2">Jenis Pendaftaran</th><th className="border p-2">Nomor HP</th><th className="border p-2">Paraf</th></tr></thead><tbody>{filteredPendaftar.map((pendaftar, index) => <tr key={pendaftar.id}><td className="border p-3 text-center">{index + 1}</td><td className="border p-3">{pendaftar.namaLengkap}</td><td className="border p-3 text-center">{pendaftar.jenisKelamin}</td><td className="border p-3">{pendaftar.jenisPendaftaran || '-'}</td><td className="border p-3">{pendaftar.nomorHp}</td><td className="border p-3">&nbsp;</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
