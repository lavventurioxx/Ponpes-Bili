"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendaftaranData, setPendaftaranData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (isAdmin) {
        router.push('/admin');
      } else {
        // Fetch pendaftaran status
        const fetchStatus = async () => {
          try {
            const docRef = doc(db, 'pendaftaran', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setPendaftaranData(docSnap.data());
            } else {
              setPendaftaranData(null);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoadingData(false);
          }
        };
        fetchStatus();
      }
    }
  }, [user, loading, isAdmin, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  const status = pendaftaranData?.status || 'Belum Mengisi Formulir';

  return (
    <>
      {/* --- TAMPILAN NORMAL (DISEMBUNYIKAN SAAT PRINT) --- */}
      <div className="min-h-screen bg-gray-50 py-12 print:hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-emerald-900 mb-8">Dashboard Calon Santri</h1>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <p className="text-gray-500">Masuk sebagai:</p>
              <p className="font-bold text-lg">{user?.email}</p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Status Pendaftaran</h2>
                
                {status !== 'Belum Mengisi Formulir' && (
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Cetak Bukti Pendaftaran
                  </button>
                )}
              </div>
              
              {status === 'Belum Mengisi Formulir' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                  <p className="text-amber-800 mb-4">Anda belum mengisi formulir pendaftaran santri baru.</p>
                  <Link href="/penerimaan-santri-baru/daftar" className="inline-block bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors">
                    Isi Formulir Sekarang
                  </Link>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <p className="text-blue-800 font-semibold mb-2">Status Saat Ini:</p>
                  <div className="inline-block bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-full uppercase tracking-wide">
                    {status}
                  </div>
                  <p className="mt-4 text-sm text-blue-600">Terima kasih telah mendaftar. Pihak pondok sedang memproses data Anda. Silakan download/cetak bukti pendaftaran Anda dan simpan baik-baik.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- TAMPILAN KHUSUS CETAK (DISEMBUNYIKAN SAAT NORMAL) --- */}
      {pendaftaranData && (
        <div className="hidden print:block bg-white text-black p-8 max-w-4xl mx-auto">
          {/* Kop Surat */}
          <div className="text-center border-b-4 border-emerald-900 pb-6 mb-8">
            <h1 className="text-2xl font-bold uppercase">YAYASAN PONDOK PESANTREN ROUDLOTUL ABROR</h1>
            <h2 className="text-xl font-bold uppercase mt-1">Penerimaan Santri Baru Tahun Ajaran 2026/2027</h2>
            <p className="text-sm mt-2">Jl. Contoh No. 123, Desa Maju, Kecamatan Damai, Kabupaten Sejahtera</p>
            <p className="text-sm">Email: ponpesroudlotulabror3@gmail.com | Telp: 0812-3456-7890</p>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-bold underline">KARTU BUKTI PENDAFTARAN</h3>
            <p className="mt-2 text-gray-700">Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <table className="w-full text-left border-collapse mb-10">
            <tbody>
              <tr>
                <td className="py-3 px-4 font-bold border border-gray-300 w-1/3 bg-gray-50">Nomor Registrasi</td>
                <td className="py-3 px-4 border border-gray-300">{pendaftaranData.userId.substring(0, 10).toUpperCase()}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold border border-gray-300 bg-gray-50">Nama Lengkap</td>
                <td className="py-3 px-4 border border-gray-300">{pendaftaranData.namaLengkap}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold border border-gray-300 bg-gray-50">NIK</td>
                <td className="py-3 px-4 border border-gray-300">{pendaftaranData.nik}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold border border-gray-300 bg-gray-50">Jenis Kelamin</td>
                <td className="py-3 px-4 border border-gray-300">{pendaftaranData.jenisKelamin === 'L' ? 'Laki-Laki (Putra)' : 'Perempuan (Putri)'}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold border border-gray-300 bg-gray-50">Program Pilihan</td>
                <td className="py-3 px-4 border border-gray-300">{pendaftaranData.programPilihan}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold border border-gray-300 bg-gray-50">Tanggal Mendaftar</td>
                <td className="py-3 px-4 border border-gray-300">{new Date(pendaftaranData.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              </tr>
            </tbody>
          </table>

          <div className="border border-dashed border-gray-400 p-6 rounded-lg text-sm text-center">
            <p className="font-bold mb-2">CATATAN PENTING:</p>
            <p>1. Simpan bukti pendaftaran ini (Screenshot atau Cetak Kertas).</p>
            <p>2. Bukti ini harus ditunjukkan pada saat proses seleksi atau daftar ulang di Pondok Pesantren.</p>
            <p>3. Pastikan nomor kontak / WhatsApp yang Anda daftarkan selalu aktif.</p>
          </div>
          
          <div className="mt-16 text-right">
            <p className="mb-20">Panitia Penerimaan Santri Baru,</p>
            <p className="font-bold underline">Ketua Panitia</p>
          </div>
        </div>
      )}
    </>
  );
}
