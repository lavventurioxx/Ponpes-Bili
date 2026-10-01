import React from 'react';
import Link from 'next/link';

export function WelcomeSection() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#c8a951] font-bold text-sm tracking-[0.2em] uppercase">Sejarah Singkat &amp; Sambutan</span>
              <div className="w-12 h-px bg-[#c8a951]"></div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#14462c] leading-tight">
              Kiprah Yayasan Paguwarmas <br/>
              <span className="text-[#1b5e3b]">Sejak Tahun 2016</span>
            </h2>
            
            <div className="text-gray-600 text-lg leading-relaxed space-y-4">
              <p>
                Bismillahirrohmanirrohim. Pondok Pesantren Modern Roudlotul Abror berawal dari &quot;Pondok Yatim Rodlotul Abror&quot; yang didirikan oleh <strong>Yayasan Paguwarmas Maos</strong> pada 28 Maret 2016. Melalui proses perkembangan dan musyawarah, kini kami bertransformasi menjadi pesantren modern.
              </p>
              <p>
                Dengan ijin operasional resmi dari Kementerian Agama RI, kami berkomitmen mencetak santri yang unggul dalam iman dan ilmu, berbudaya akhlaqul karimah, serta siap menghadapi tantangan era digital dengan memadukan sistem tradisional dan metode modern.
              </p>
            </div>
            
            <div className="pt-4">
              <Link href="/profil/sekolah" className="inline-flex items-center gap-2 text-[#1b5e3b] font-bold hover:text-[#c8a951] transition-colors group">
                Baca Sejarah Lengkap
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </div>

          {/* Right Image/Quote Container */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="absolute inset-0 bg-[#e8f5ec] rounded-[3rem] transform translate-x-4 translate-y-4"></div>
            <div className="relative aspect-[4/5] bg-gray-300 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
              <img
                src="/welcome-ust-maftukhin.jpg"
                alt="Ustadz Maftukhin, Pengasuh PP Modern Roudlotul Abror"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Small floating quote card */}
            <div className="absolute -bottom-8 -left-8 bg-[#14462c] text-white p-6 rounded-2xl shadow-xl max-w-xs animate-float z-10">
              <svg className="w-8 h-8 text-[#c8a951] mb-3 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <p className="text-sm font-medium leading-relaxed italic mb-3">
                &quot;Pendidikan bukan sekadar transfer ilmu, melainkan transformasi hati dan akhlak menuju rida Ilahi.&quot;
              </p>
              <p className="text-[#c8a951] text-xs font-bold uppercase tracking-wider">— Ustadz Maftukhin (Pengasuh)</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
