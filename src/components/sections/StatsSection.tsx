import React from 'react';
import Link from 'next/link';

export function StatsSection() {
  const stats = [
    { title: "Tahun Berdiri", value: "2016", icon: "🏫" },
    { title: "Santri Aktif", value: "115+", icon: "👥" },
    { title: "Dewan Asatidz", value: "5+", icon: "👨‍🏫" },
    { title: "Prestasi", value: "30+", icon: "🏆" }
  ];

  return (
    <section className="py-20 bg-[#faf9f6]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-black/5 border border-gray-100">
          <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
            
            {/* Left side: Stats Grid */}
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className={`p-6 rounded-3xl ${i === 0 ? 'bg-white shadow-lg shadow-black/5 border border-gray-100' : 'bg-[#e8f5ec]/50'} flex flex-col items-center justify-center text-center`}>
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-extrabold text-[#14462c] mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</div>
                </div>
              ))}
            </div>

            {/* Right side: Content & Images */}
            <div className="flex-1 w-full space-y-8">
              <div>
                <span className="text-[#c8a951] font-bold text-sm tracking-[0.2em] uppercase mb-4 block">Data Pesantren</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#14462c] leading-tight mb-4">
                  Mendidik Ratusan Santri <br/>
                  Meraih Prestasi Gemilang
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Santri kami telah meraih berbagai kejuaraan, mulai dari Juara Umum PORSADIN tingkat Kecamatan, Kabupaten, hingga Provinsi. Kami memiliki ustadz dan ustadzah kompeten yang siap membimbing santri dengan sepenuh hati.
                </p>
              </div>

              <div>
                <Link href="/profil/guru" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1b5e3b] text-white font-bold rounded-full hover:bg-[#14462c] transition-all duration-300 shadow-md">
                  Lihat Profil Asatidz
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
