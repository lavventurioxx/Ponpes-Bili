"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100 ml-2">✕</button>
        </div>
      ))}
    </div>
  );
}

const PAGE_SIZE = 25;

interface SantriMerged {
  id?: string;
  no?: number;
  nama: string;
  nism: string;
  jk: string;
  alamat: string;
  jenisPendaftaran: 'Santri Tetap' | 'Santri Pesantren Kilat';
  source: 'Data Lama' | 'Pendaftar Baru';
}

export default function DataSantriAktifPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [mergedData, setMergedData] = useState<SantriMerged[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [jenisFilter, setJenisFilter] = useState<'Semua' | 'Santri Tetap' | 'Santri Pesantren Kilat'>('Semua');
  const [editingSantri, setEditingSantri] = useState<SantriMerged | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const toastId = useRef(0);

  const handleShowToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const fetchData = useCallback(async () => {
    try {
      // 1. Ambil data statis (santri lama) dari Firebase 'santri'
      const qLama = query(collection(db, 'santri'), orderBy('no', 'asc'));
      const snapshotLama = await getDocs(qLama);
      const dataLama: SantriMerged[] = [];
      
      snapshotLama.forEach((document) => {
        const d = document.data();
        dataLama.push({
          id: document.id,
          no: d.no,
          nama: d.nama,
          nism: d.nism,
          jk: d.jk,
          alamat: d.alamat,
          jenisPendaftaran: d.jenisPendaftaran || 'Santri Tetap',
          source: 'Data Lama'
        });
      });

      // 2. Ambil data pendaftar baru yang 'Diterima' dari Firestore
      const q = query(collection(db, 'pendaftaran'), where('status', '==', 'Diterima'));
      const querySnapshot = await getDocs(q);
      const dataBaru: SantriMerged[] = [];
      
      querySnapshot.forEach((document) => {
        const d = document.data();
        dataBaru.push({
          id: document.id,
          nama: d.namaLengkap,
          nism: d.nik, // Menggunakan NIK sementara sebagai NISM untuk santri baru
          jk: d.jenisKelamin,
          alamat: d.alamatLengkap || '-',
          jenisPendaftaran: d.jenisPendaftaran || 'Santri Tetap',
          source: 'Pendaftar Baru'
        });
      });

      // Gabungkan data
      setMergedData([...dataLama, ...dataBaru]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (!isAdmin) router.push('/dashboard');
      else void Promise.resolve().then(fetchData);
    }
  }, [user, loading, isAdmin, router, fetchData]);

  if (loading || !isAdmin || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data santri...</div>;
  }

  const handleDelete = async (santri: SantriMerged) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus santri ${santri.nama}?`);
    if (!confirmed) return;

    try {
      if (santri.source === 'Data Lama' && santri.id) {
        await deleteDoc(doc(db, 'santri', santri.id));
        setMergedData(prev => prev.filter(s => s.id !== santri.id));
        handleShowToast('success', `${santri.nama} berhasil dihapus dari Data Santri.`);
      } else if (santri.source === 'Pendaftar Baru' && santri.id) {
        await updateDoc(doc(db, 'pendaftaran', santri.id), { status: 'Ditolak' });
        setMergedData(prev => prev.filter(s => s.id !== santri.id));
        handleShowToast('info', `${santri.nama} dihapus dari daftar aktif.`);
      }
    } catch (error) {
      console.error("Error deleting santri:", error);
      handleShowToast('error', 'Terjadi kesalahan saat menghapus santri.');
    }
  };

  const filteredSantri = mergedData.filter(santri => {
    const matchesSearch = santri.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      santri.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      santri.nism.includes(searchTerm);
    const matchesType = jenisFilter === 'Semua' || santri.jenisPendaftaran === jenisFilter;
    return matchesSearch && matchesType;
  });

  // Paginasi
  const totalPages = Math.ceil(filteredSantri.length / PAGE_SIZE);
  const paginatedSantri = filteredSantri.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSantri.map((s, index) => ({
      'No': index + 1,
      'Nama Santri': s.nama,
      'NISM/NIK': s.nism,
      'L/P': s.jk,
      'Alamat': s.alamat,
      'Jenis Pendaftaran': s.jenisPendaftaran,
      'Sumber Data': s.source
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Santri Aktif");
    const fileLabel = jenisFilter === 'Semua' ? 'Semua' : jenisFilter.replaceAll(' ', '_');
    XLSX.writeFile(workbook, `Data_Santri_Aktif_${fileLabel}_${new Date().getTime()}.xlsx`);
  };

  const printAttendance = () => {
    if (filteredSantri.length === 0) {
      handleShowToast('error', 'Tidak ada data untuk dicetak.');
      return;
    }
    window.print();
  };

  const saveEditedSantri = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSantri?.id) return;
    setIsSavingEdit(true);
    try {
      const updatedFields = {
        nama: editingSantri.nama,
        nism: editingSantri.nism,
        jk: editingSantri.jk,
        alamat: editingSantri.alamat,
        jenisPendaftaran: editingSantri.jenisPendaftaran,
      };
      if (editingSantri.source === 'Data Lama') {
        await updateDoc(doc(db, 'santri', editingSantri.id), updatedFields);
      } else {
        await updateDoc(doc(db, 'pendaftaran', editingSantri.id), {
          namaLengkap: editingSantri.nama,
          nik: editingSantri.nism,
          jenisKelamin: editingSantri.jk,
          alamatLengkap: editingSantri.alamat,
          jenisPendaftaran: editingSantri.jenisPendaftaran,
        });
      }
      setMergedData((current) => current.map((item) => item.id === editingSantri.id ? editingSantri : item));
      setEditingSantri(null);
      handleShowToast('success', 'Data diri santri berhasil diperbarui.');
    } catch (error) {
      console.error('Error editing santri:', error);
      handleShowToast('error', 'Gagal memperbarui data diri santri.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="admin-active-page min-h-screen bg-gray-50 py-12">
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Navigation */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 pb-4">
          <Link href="/admin" className="text-gray-500 hover:text-emerald-700 font-medium px-4 py-2">
            Pendaftar Baru
          </Link>
          <Link href="/admin/data-santri" className="text-emerald-700 font-bold px-4 py-2 border-b-2 border-emerald-700">
            Data Santri Aktif
          </Link>
          <Link href="/profil/pengurus" className="text-gray-500 hover:text-emerald-700 font-medium px-4 py-2 flex items-center gap-1.5">
            <span>👥</span> Struktur Pengurus
          </Link>
        </div>

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Data Santri Aktif</h1>
            <p className="text-gray-600 mt-1">Daftar Santri Sesuai NISM</p>
          </div>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Cari nama, alamat, nism..." 
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button 
              onClick={exportToExcel}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              Export Excel
            </button>
            <button onClick={printAttendance} className="bg-amber-500 text-emerald-950 px-5 py-2 rounded-lg font-bold hover:bg-amber-400 transition-colors shadow-sm">
              Cetak Daftar Hadir
            </button>
          </div>
        </div>

        <div className="print:hidden mb-6 flex flex-wrap items-center gap-3">
          <span className="font-semibold text-gray-700">Filter:</span>
          {(['Semua', 'Santri Tetap', 'Santri Pesantren Kilat'] as const).map((jenis) => (
            <button key={jenis} onClick={() => { setJenisFilter(jenis); setCurrentPage(1); }} className={`rounded-lg px-4 py-2 text-sm font-bold ${jenisFilter === jenis ? 'bg-emerald-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50'}`}>
              {jenis}
            </button>
          ))}
          <span className="text-sm text-gray-500">{filteredSantri.length} data</span>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Santri</p>
              <p className="text-3xl font-bold text-emerald-900">{mergedData.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Santri Putra (L)</p>
              <p className="text-3xl font-bold text-blue-600">{mergedData.filter(s => s.jk === 'L').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Santri Putri (P)</p>
              <p className="text-3xl font-bold text-pink-600">{mergedData.filter(s => s.jk === 'P').length}</p>
            </div>
          </div>
        </div>
        
        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white text-sm uppercase tracking-wide">
                  <th className="p-4 font-semibold w-16 text-center">No</th>
                  <th className="p-4 font-semibold">Nama Santri</th>
                  <th className="p-4 font-semibold">NISM / NIK</th>
                  <th className="p-4 font-semibold text-center">L/P</th>
                  <th className="p-4 font-semibold">Alamat</th>
                  <th className="p-4 font-semibold text-center">Jenis Santri</th>
                  <th className="p-4 font-semibold text-center">Sumber</th>
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSantri.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      Santri tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedSantri.map((santri, idx) => (
                    <tr key={santri.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-center text-gray-500">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="p-4 font-bold text-gray-800">{santri.nama}</td>
                      <td className="p-4 text-gray-600">{santri.nism}</td>
                      <td className="p-4 text-center font-semibold text-gray-700">{santri.jk}</td>
                      <td className="p-4 text-gray-600 text-sm">{santri.alamat}</td>
                      <td className="p-4 text-center text-xs font-semibold text-emerald-700">{santri.jenisPendaftaran}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          santri.source === 'Data Lama' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                        }`}>
                          {santri.source}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                        <button onClick={() => setEditingSantri({ ...santri })} className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-semibold transition-colors">
                          Edit Data Diri
                        </button>
                        <button 
                          onClick={() => handleDelete(santri)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-1 rounded-md text-sm font-semibold transition-colors"
                        >
                          Hapus
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-500">
                Menampilkan {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filteredSantri.length)} dari {filteredSantri.length} santri
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm font-bold rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingSantri && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4 print:hidden">
          <form onSubmit={saveEditedSantri} className="mx-auto my-8 max-w-2xl space-y-5 rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-emerald-900">Edit Data Diri Santri</h2><button type="button" onClick={() => setEditingSantri(null)} className="text-gray-500">Tutup</button></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label><span className="mb-1 block text-sm font-semibold text-gray-700">Nama Lengkap</span><input required value={editingSantri.nama} onChange={(e) => setEditingSantri({ ...editingSantri, nama: e.target.value })} className="w-full rounded-lg border px-3 py-2" /></label>
              <label><span className="mb-1 block text-sm font-semibold text-gray-700">NISM / NIK</span><input required value={editingSantri.nism} onChange={(e) => setEditingSantri({ ...editingSantri, nism: e.target.value })} className="w-full rounded-lg border px-3 py-2" /></label>
              <label><span className="mb-1 block text-sm font-semibold text-gray-700">Jenis Kelamin</span><select required value={editingSantri.jk} onChange={(e) => setEditingSantri({ ...editingSantri, jk: e.target.value })} className="w-full rounded-lg border px-3 py-2"><option value="L">Laki-Laki</option><option value="P">Perempuan</option></select></label>
              <label><span className="mb-1 block text-sm font-semibold text-gray-700">Jenis Santri</span><select required value={editingSantri.jenisPendaftaran} onChange={(e) => setEditingSantri({ ...editingSantri, jenisPendaftaran: e.target.value as SantriMerged['jenisPendaftaran'] })} className="w-full rounded-lg border px-3 py-2"><option value="Santri Tetap">Santri Tetap</option><option value="Santri Pesantren Kilat">Santri Pesantren Kilat</option></select></label>
              <label className="md:col-span-2"><span className="mb-1 block text-sm font-semibold text-gray-700">Alamat</span><textarea required value={editingSantri.alamat} onChange={(e) => setEditingSantri({ ...editingSantri, alamat: e.target.value })} rows={3} className="w-full rounded-lg border px-3 py-2" /></label>
            </div>
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditingSantri(null)} className="rounded-lg border px-5 py-2 font-bold text-gray-600">Batal</button><button disabled={isSavingEdit} className="rounded-lg bg-emerald-700 px-5 py-2 font-bold text-white">{isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</button></div>
          </form>
        </div>
      )}

      <div className="admin-active-print-sheet hidden print:block">
        <h1 className="mb-2 text-center text-xl font-bold">DAFTAR HADIR SANTRI AKTIF</h1>
        <p className="mb-6 text-center">{jenisFilter} | PP Modern Roudlotul Abror</p>
        <table className="w-full border-collapse text-sm"><thead><tr><th className="border p-2">No</th><th className="border p-2 text-left">Nama</th><th className="border p-2">NISM / NIK</th><th className="border p-2">L/P</th><th className="border p-2">Jenis Santri</th><th className="border p-2">Paraf</th></tr></thead><tbody>{filteredSantri.map((santri, index) => <tr key={santri.id || index}><td className="border p-3 text-center">{index + 1}</td><td className="border p-3">{santri.nama}</td><td className="border p-3">{santri.nism}</td><td className="border p-3 text-center">{santri.jk}</td><td className="border p-3">{santri.jenisPendaftaran}</td><td className="border p-3">&nbsp;</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
