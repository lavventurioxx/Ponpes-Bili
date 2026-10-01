export const metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan pengumpulan, penggunaan, penyimpanan, dan perlindungan data pada situs PP Modern Roudlotul Abror.',
  alternates: { canonical: '/kebijakan-privasi/' },
};

export default function KebijakanPrivasiPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 text-gray-700 sm:py-20">
      <header className="mb-10 border-b border-emerald-100 pb-8">
        <p className="mb-3 text-sm font-bold uppercase text-emerald-800">PP Modern Roudlotul Abror</p>
        <h1 className="text-3xl font-extrabold text-emerald-950 sm:text-4xl">Kebijakan Privasi</h1>
        <p className="mt-3 text-sm text-gray-500">Terakhir diperbarui: 27 September 2026</p>
      </header>

      <div className="space-y-8 leading-7">
        <section>
          <h2 className="mb-2 text-xl font-bold text-emerald-950">Data yang kami kumpulkan</h2>
          <p>Saat mengisi pendaftaran, kami menerima data calon santri dan orang tua/wali seperti nama, NIK, jenis kelamin, tempat dan tanggal lahir, alamat, nomor telepon, pilihan program, serta gambar Kartu Keluarga, akta kelahiran, dan bukti pembayaran. Saat menggunakan fitur cek status, nomor pendaftaran digunakan untuk menemukan status permohonan.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-emerald-950">Tujuan penggunaan</h2>
          <p>Data digunakan untuk memproses dan memverifikasi pendaftaran, menghubungi keluarga terkait proses penerimaan, mengelola administrasi calon santri, serta menampilkan status pendaftaran. Kami tidak meminta data tersebut untuk dijual atau digunakan untuk iklan.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-emerald-950">Penyimpanan dan akses</h2>
          <p>Data pendaftaran disimpan pada layanan Firebase dan berkas pendaftaran disimpan pada layanan Supabase. Akses ditujukan kepada pengelola yang berwenang untuk menjalankan proses penerimaan. Data disimpan selama diperlukan untuk tujuan tersebut atau kewajiban yang berlaku, lalu dihapus atau ditangani sesuai kebijakan retensi lembaga.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-emerald-950">Calon santri di bawah umur</h2>
          <p>Jika calon santri belum dewasa, pendaftaran dan persetujuan pemrosesan data harus dilakukan oleh orang tua atau wali yang berwenang.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-emerald-950">Permintaan dan pertanyaan</h2>
          <p>Orang tua/wali atau pendaftar dapat meminta koreksi atau penghapusan data, atau bertanya tentang penggunaannya, melalui <a className="font-semibold text-emerald-800 underline" href="mailto:ponpesroudlotulabror3@gmail.com">ponpesroudlotulabror3@gmail.com</a> atau WhatsApp <a className="font-semibold text-emerald-800 underline" href="https://wa.me/6282135505020" target="_blank" rel="noopener noreferrer">0821 3550 5020</a>. Permintaan dapat memerlukan verifikasi untuk melindungi data pendaftar.</p>
        </section>

        <p className="border-t border-gray-200 pt-6 text-sm text-gray-500">Kebijakan ini dapat diperbarui apabila cara pengelolaan data atau layanan pendaftaran berubah.</p>
      </div>
    </article>
  );
}