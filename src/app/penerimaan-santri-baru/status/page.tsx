"use client";

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const adminWhatsAppNumber = '';

type RegistrationStatus = {
  nomorPendaftaran: string;
  status: string;
  submittedAt: string;
};

export default function RegistrationStatusPage() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [result, setResult] = useState<RegistrationStatus | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = registrationNumber.trim().toUpperCase();
    setError('');
    setResult(null);

    if (!/^(?:[A-F0-9]{8}|[A-F0-9]{20})$/.test(code)) {
      setError('Masukkan nomor pendaftaran 20 karakter yang tertera pada bukti pendaftaran.');
      return;
    }

    setIsLoading(true);
    try {
      const snapshot = await getDoc(doc(db, 'status_pendaftaran', code));
      if (!snapshot.exists()) {
        setError('Nomor pendaftaran tidak ditemukan. Periksa kembali nomor yang dimasukkan.');
        return;
      }
      setResult(snapshot.data() as RegistrationStatus);
    } catch (lookupError) {
      console.error('Gagal mengecek status pendaftaran:', lookupError);
      setError('Status belum dapat dimuat. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusClass = result?.status === 'Diterima'
    ? 'bg-emerald-100 text-emerald-800'
    : result?.status === 'Ditolak'
      ? 'bg-red-100 text-red-800'
      : 'bg-amber-100 text-amber-800';

  return (
    <>
      <section className="bg-emerald-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Cek Status Pendaftaran</h1>
          <p className="mt-3 text-emerald-100">Masukkan nomor pendaftaran tanpa perlu membuat akun.</p>
        </div>
      </section>

      <section className="min-h-[60vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            <label htmlFor="registration-number" className="block text-sm font-semibold text-gray-700">Nomor Pendaftaran</label>
            <input
              id="registration-number"
              value={registrationNumber}
              onChange={(event) => setRegistrationNumber(event.target.value.toUpperCase())}
              maxLength={20}
              required
              placeholder="Contoh: A1B2C3D4E5F607182930"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 uppercase tracking-widest outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            />
            <button type="submit" disabled={isLoading} className="mt-4 w-full rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? 'Memeriksa...' : 'Lihat Status'}
            </button>
          </form>

          {error && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

          {result && (
            <div className="mt-6 rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Nomor Pendaftaran</p>
              <p className="font-bold tracking-widest text-gray-900">{result.nomorPendaftaran}</p>
              <p className="mt-4 text-sm text-gray-500">Status</p>
              <span className={`mt-1 inline-block rounded-full px-4 py-2 text-sm font-bold ${statusClass}`}>{result.status}</span>
              {result.status === 'Diterima' && (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-semibold">Selamat, pendaftaran Anda diterima.</p>
                  {adminWhatsAppNumber ? (
                    <a
                      href={`https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(`Halo Admin, saya ingin menindaklanjuti pendaftaran dengan nomor ${result.nomorPendaftaran}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block rounded-lg bg-emerald-700 px-4 py-2 font-bold text-white hover:bg-emerald-800"
                    >
                      Hubungi Admin melalui WhatsApp
                    </a>
                  ) : (
                    <p className="mt-2">Silakan hubungi admin melalui WhatsApp. Link WhatsApp admin akan ditambahkan setelah nomor tersedia.</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/penerimaan-santri-baru/daftar" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">Kembali ke formulir pendaftaran</Link>
          </div>
        </div>
      </section>
    </>
  );
}
