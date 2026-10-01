import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section 
      className="relative min-h-[90vh] flex items-center text-white overflow-hidden bg-[#0a2b1a]"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Islamic Geometric Pattern & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a2b1a] via-[#0a2b1a]/80 to-[#0a2b1a]/40"></div>
      <div className="absolute inset-0 islamic-pattern opacity-30"></div>
      
      {/* Decorative floating shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#c8a951]/20 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#2d7a50]/30 rounded-full blur-[100px] animate-float delay-200"></div>

      <div className="container mx-auto px-4 relative z-10 py-20 pb-40">
        <div className="max-w-3xl">
          {/* Decorative line */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
            <div className="w-12 h-px bg-gradient-to-r from-[#c8a951] to-transparent"></div>
            <p className="text-[#f2d88e] font-semibold text-sm tracking-[0.25em] uppercase">
              Pondok Pesantren Modern
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 animate-fade-in-up delay-100">
            Roudlotul
            <span className="block bg-gradient-to-r from-[#f2d88e] via-[#d4a83a] to-[#c8a951] bg-clip-text text-transparent">
              Abror
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-4 max-w-xl leading-relaxed animate-fade-in-up delay-200">
            Membentuk generasi <strong className="text-white font-semibold">Qur&apos;ani</strong> yang berakhlakul karimah, berpengetahuan luas, dan siap menjadi pemimpin masa depan.
          </p>

          <p className="text-sm text-[#c8e6d0] mb-10 animate-fade-in-up delay-300">
            Jl. Dukuh Rt 01 Rw 04, Maoslor, Maos - Cilacap
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
            <Link
              href="/penerimaan-santri-baru"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4a83a] to-[#c8a951] hover:from-[#c8a951] hover:to-[#a88730] text-[#0a2b1a] rounded-2xl font-bold text-lg transition-all shadow-lg shadow-[#c8a951]/20 hover:shadow-xl hover:shadow-[#c8a951]/30 hover:-translate-y-1 animate-pulse-glow"
            >
              Daftar Santri Baru
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
            <Link
              href="/profil/visi-misi"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 hover:border-[#c8a951]/50 text-white rounded-2xl font-bold text-lg transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              Tentang Kami
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40L60 36C120 32 240 24 360 28C480 32 600 48 720 52C840 56 960 48 1080 40C1200 32 1320 24 1380 20L1440 16V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z" fill="var(--warm-white)"/>
        </svg>
      </div>
    </section>
  );
}
