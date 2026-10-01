import React from 'react';

export function VisiMisiSection() {
  return (
    <section id="visi-misi" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-0 w-64 h-64 bg-[#e8f5ec]/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#fdf8eb]/50 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-10 h-px bg-[#c8a951]"></div>
            <span className="text-[#c8a951] font-semibold text-sm tracking-[0.2em] uppercase">Arah & Tujuan</span>
            <div className="w-10 h-px bg-[#c8a951]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#14462c]">Visi & Misi</h2>
        </div>

        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          
          {/* Visi — Big card */}
          <div className="gradient-primary rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 islamic-pattern"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl mb-6">
                🎯
              </div>
              <h3 className="text-2xl font-extrabold mb-5 tracking-tight">Visi</h3>
              <p className="text-white/90 text-xl font-bold leading-relaxed uppercase">
                Unggul dalam iman dan ilmu, berbudaya dalam akhlakul karimah serta peduli lingkungan.
              </p>
            </div>
          </div>

          {/* Misi — Modern list */}
          <div className="bg-[#faf9f6] rounded-3xl p-10 border border-[#edeae3]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#e8f5ec] to-[#c8e6d0] rounded-2xl flex items-center justify-center text-2xl">
                📋
              </div>
              <h3 className="text-2xl font-extrabold text-[#14462c] tracking-tight">Misi</h3>
            </div>
            <div className="space-y-5">
              {[
                "Mendidik santri agar memiliki keimanan yang kuat.",
                "Mengamalkan Al Qur'an dan Sunnah Rasulullah SAW.",
                "Melatih santri menjadi Hafizh Al Qur'an.",
                "Melatih kemampuan berkomunikasi secara aktif dalam berbahasa Arab dan Inggris.",
                "Membina santri agar menjadi manusia yang memiliki kecakapan hidup dan keterampilan sosial, teknologi informasi dan komunikasi.",
                "Mendidik santri untuk sukses dalam pendidikan formal.",
                "Membudayakan berkata sopan, tawadhu, qana'ah, saling menghargai dan beramal sholeh.",
                "Mendidik dan membina santri yang berjiwa mandiri, beretos kerja, wirausaha, kompetitif dan jujur.",
                "Membentuk kader persyarikatan, umat dan bangsa yang ikhlas, peka, peduli dan bertanggung jawab terhadap kemanusiaan dan lingkungan."
              ].map((misi, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#1b5e3b] to-[#2d7a50] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-[#1b5e3b]/15 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </span>
                  <p className="text-[#2a2824]/70 text-lg leading-relaxed pt-1.5">{misi}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
