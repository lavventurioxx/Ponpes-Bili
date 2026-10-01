"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadPrivateDocument } from '@/lib/supabase';

export default function DaftarPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [programError, setProgramError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    jenisPendaftaran: '',
    kelas: '',
    namaLengkap: '',
    nik: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    alamatLengkap: '',
    namaAyah: '',
    namaIbu: '',
    nomorHp: '',
    programPilihan: ''
  });
  const [kartuKeluarga, setKartuKeluarga] = useState<File | null>(null);
  const [aktaKelahiran, setAktaKelahiran] = useState<File | null>(null);
  const [buktiTransfer, setBuktiTransfer] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jenisPendaftaran = e.target.value;
    setFormData({
      ...formData,
      jenisPendaftaran,
      programPilihan: jenisPendaftaran === 'Santri Pesantren Kilat' ? 'Pesantren Kilat' : '',
    });
    setSelectedPrograms([]);
    setProgramError('');
  };

  const handleProgramToggle = (program: string, checked: boolean) => {
    const nextPrograms = checked
      ? [...selectedPrograms, program]
      : selectedPrograms.filter((selectedProgram) => selectedProgram !== program);

    if (nextPrograms.length > 3) {
      setProgramError('Santri Tetap dapat memilih maksimal 3 program.');
      return;
    }

    setSelectedPrograms(nextPrograms);
    setFormData({ ...formData, programPilihan: nextPrograms.join(', ') });
    setProgramError('');
  };

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) throw new Error('Berkas harus berupa gambar.');
    if (file.size > 1 * 1024 * 1024) throw new Error('Ukuran setiap berkas maksimal 1 MB.');
  };

  const uploadDocument = (file: File, registrationId: string, fieldName: string, fileIndex: number) => {
    validateFile(file);
    return uploadPrivateDocument(file, registrationId, fieldName, (progress) => {
      setUploadProgress(Math.round((fileIndex * 100 + progress) / 3));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      if (!kartuKeluarga || !aktaKelahiran || !buktiTransfer) {
        throw new Error('Semua berkas wajib diunggah.');
      }
      if (formData.jenisPendaftaran === 'Santri Tetap' && (selectedPrograms.length < 1 || selectedPrograms.length > 3)) {
        throw new Error('Pilih minimal 1 dan maksimal 3 program untuk Santri Tetap.');
      }

      const newRegistrationId = crypto.randomUUID();

      const kartuKeluargaUrl = await uploadDocument(kartuKeluarga, newRegistrationId, 'kartu-keluarga', 0);
      const aktaKelahiranUrl = await uploadDocument(aktaKelahiran, newRegistrationId, 'akta-kelahiran', 1);
      const buktiTransferUrl = await uploadDocument(buktiTransfer, newRegistrationId, 'bukti-transfer', 2);

      const registrationNumber = newRegistrationId.replaceAll('-', '').slice(0, 20).toUpperCase();
      const batch = writeBatch(db);
      batch.set(doc(db, 'pendaftaran', newRegistrationId), {
        ...formData,
        nomorPendaftaran: registrationNumber,
        kartuKeluargaUrl,
        aktaKelahiranUrl,
        buktiTransferUrl,
        userId: newRegistrationId,
        email: null,
        status: 'Menunggu Proses',
        submittedAt: new Date().toISOString(),
        privacyAcceptedAt: new Date().toISOString()
      });
      batch.set(doc(db, 'status_pendaftaran', registrationNumber), {
        nomorPendaftaran: registrationNumber,
        status: 'Menunggu Proses',
        submittedAt: new Date().toISOString()
      });
      await batch.commit();
      setUploadProgress(100);
      setRegistrationId(registrationNumber);
      setIsSuccess(true);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
      const message = code === 'permission-denied'
        ? 'Firebase menolak penyimpanan pendaftaran. Minta admin memperbarui Firestore Rules dengan menjalankan: firebase deploy --only firestore:rules --project ponpes-bili'
        : error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data. Pastikan koneksi internet Anda lancar.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-8">
            Terima kasih telah mendaftar di Pondok Pesantren Modern Roudlotul Abror. Kami akan segera memproses data Anda.
          </p>
          <p className="text-gray-700 mb-8">
            Nomor pendaftaran Anda: <strong className="break-all">{registrationId}</strong>. Simpan nomor ini untuk mengecek status pendaftaran.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/penerimaan-santri-baru/status" className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
              Cek Status Pendaftaran
            </Link>
            <Link href="/" className="inline-block px-8 py-3 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold rounded-lg transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-emerald-800 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">Formulir Pendaftaran</h1>
          <p className="text-emerald-100">Penerimaan Santri Baru Tahun Ajaran 2026/2027</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-amber-500 text-emerald-950 p-6 text-center border-b border-amber-600">
              <h2 className="text-xl font-bold">Mohon Isi Data Dengan Benar Sesuai KK/KTP</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Data Santri */}
              <div>
                <h3 className="text-lg font-bold text-emerald-900 border-b border-gray-200 pb-2 mb-4">A. Data Calon Santri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Pendaftaran</label>
                    <select name="jenisPendaftaran" value={formData.jenisPendaftaran} onChange={handleRegistrationTypeChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                      <option value="">-- Pilih Jenis Pendaftaran --</option>
                      <option value="Santri Tetap">Santri Tetap</option>
                      <option value="Santri Pesantren Kilat">Santri Pesantren Kilat</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kelas</label>
                    <div className="space-y-2 rounded-lg border border-gray-200 p-4">
                      {['Kelas TK/PAUD - TK A', 'Kelas TK/PAUD - TK B', 'SD/MI - Kelas 1', 'SD/MI - Kelas 2', 'SD/MI - Kelas 3', 'SD/MI - Kelas 4', 'SD/MI - Kelas 5', 'SD/MI - Kelas 6', 'Kelas SMP/MTS - Kelas 7', 'Kelas SMP/MTS - Kelas 8', 'Kelas SMP/MTS - Kelas 9', 'Kelas SMA/SMK/MAN - Kelas 10', 'Kelas SMA/SMK/MAN - Kelas 11', 'Kelas SMA/SMK/MAN - Kelas 12'].map((kelas) => (
                        <label key={kelas} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-emerald-50">
                          <input type="radio" name="kelas" value={kelas} checked={formData.kelas === kelas} onChange={handleChange} required className="h-5 w-5 text-emerald-600 focus:ring-emerald-500" />
                          <span className="text-gray-700">{kelas}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <input name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Contoh: Muhammad Al Fatih" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">NIK (Nomor Induk Kependudukan)</label>
                    <input name="nik" value={formData.nik} onChange={handleChange} required type="text" inputMode="numeric" pattern="[0-9]{16}" maxLength={16} title="NIK harus terdiri dari 16 angka." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="16 digit NIK" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                    <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="L">Laki-Laki (Putra)</option>
                      <option value="P">Perempuan (Putri)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tempat Lahir</label>
                    <input name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Contoh: Cilacap" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Lahir</label>
                    <input name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
                    <textarea name="alamatLengkap" value={formData.alamatLengkap} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota"></textarea>
                  </div>
                </div>
              </div>

              {/* Data Orang Tua */}
              <div>
                <h3 className="text-lg font-bold text-emerald-900 border-b border-gray-200 pb-2 mb-4 mt-8">B. Data Orang Tua / Wali</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Ayah / Wali</label>
                    <input name="namaAyah" value={formData.namaAyah} onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Ibu</label>
                    <input name="namaIbu" value={formData.namaIbu} onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor HP / WhatsApp Aktif</label>
                    <input name="nomorHp" value={formData.nomorHp} onChange={handleChange} required type="tel" pattern="[0-9+() -]{8,20}" maxLength={20} title="Masukkan nomor telepon 8 sampai 20 karakter." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Contoh: 081234567890" />
                  </div>

                </div>
              </div>

              {/* Program Pilihan */}
              <div>
                <h3 className="text-lg font-bold text-emerald-900 border-b border-gray-200 pb-2 mb-4 mt-8">C. Program Pilihan Utama</h3>
                {formData.jenisPendaftaran === 'Santri Tetap' ? (
                  <>
                    <p className="mb-3 text-sm text-gray-600">Pilih minimal 1 dan maksimal 3 program.</p>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        'Madrasah Diniyyah Takmiliyyah (Formal Agama)',
                        "Tahfidz 30 Juz & Tahsinul Qur'an",
                        'Fokus Kitab Kuning / Pendalaman Turats',
                      ].map((program) => {
                        const isSelected = selectedPrograms.includes(program);
                        return (
                          <label key={program} className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-emerald-50">
                            <input
                              type="checkbox"
                              name="programPilihan"
                              value={program}
                              checked={isSelected}
                              disabled={!isSelected && selectedPrograms.length === 3}
                              onChange={(event) => handleProgramToggle(program, event.target.checked)}
                              className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-medium text-gray-700">{program}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-sm text-gray-600" aria-live="polite">{selectedPrograms.length} dari 3 program dipilih.</p>
                  </>
                ) : formData.jenisPendaftaran === 'Santri Pesantren Kilat' ? (
                  <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">✓</span>
                    <span className="font-semibold text-emerald-950">Pesantren Kilat</span>
                  </div>
                ) : (
                  <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">Pilih jenis pendaftaran terlebih dahulu untuk melihat program.</p>
                )}
                {programError && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{programError}</p>}
              </div>

              {/* Berkas Pendaftaran */}
              <div>
                <h3 className="text-lg font-bold text-emerald-900 border-b border-gray-200 pb-2 mb-4 mt-8">D. Berkas Pendaftaran</h3>
                <div className="space-y-5">
                  {([
                    ['Kartu Keluarga', kartuKeluarga, setKartuKeluarga],
                    ['Akta Kelahiran Anak', aktaKelahiran, setAktaKelahiran],
                    ['Bukti Transfer Pendaftaran', buktiTransfer, setBuktiTransfer],
                  ] as [string, File | null, React.Dispatch<React.SetStateAction<File | null>>][]).map(([label, file, setFile]) => (
                    <label key={label as string} className="block rounded-lg border border-gray-200 p-4">
                      <span className="mb-2 block font-semibold text-gray-700">{label as string} <span className="text-red-500">*</span></span>
                      <input type="file" accept="image/*" required onChange={(event) => { const selectedFile = event.target.files?.[0]; if (!selectedFile) return; try { validateFile(selectedFile); (setFile as React.Dispatch<React.SetStateAction<File | null>>)(selectedFile); } catch (error) { event.currentTarget.value = ''; alert(error instanceof Error ? error.message : 'Berkas tidak valid.'); } }} className="w-full rounded-lg border px-3 py-2" />
                      <span className="mt-1 block text-xs text-gray-500">Format gambar, maksimal 1 MB. {file ? `Dipilih: ${file.name}` : ''}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Persetujuan */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} className="w-5 h-5 mt-1 text-emerald-600 rounded focus:ring-emerald-500" />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Saya menyatakan data yang diberikan benar, berwenang mengisi data calon santri, dan telah membaca serta menyetujui pemrosesan data sesuai <Link href="/kebijakan-privasi" className="font-semibold text-emerald-800 underline">Kebijakan Privasi</Link>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl transform hover:-translate-y-1'}`}
                >
                  {isSubmitting ? `Mengunggah berkas... ${uploadProgress}%` : 'Kirim Pendaftaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
