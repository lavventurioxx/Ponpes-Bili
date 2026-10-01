"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Program = {
  nama: string;
  desc: string;
  icon: string;
  foto?: string;
};

const defaultPrograms: Program[] = [
  {
    nama: "Pembelajaran Seni Tilawah Al Qur'an",
    desc: "Pelatihan seni baca Al-Qur'an dengan berbagai langgam (MTQ) untuk mengasah keindahan vokal dan tajwid.",
    icon: "🎤",
  },
  {
    nama: "Pagar Nusa",
    desc: "Seni bela diri pencak silat Nahdlatul Ulama untuk membentuk fisik dan mental santri yang tangguh.",
    icon: "🥋",
  },
  {
    nama: "Maulid Al Barzanji",
    desc: "Kegiatan pembacaan kitab Maulid Al-Barzanji untuk menumbuhkan mahabbah kepada Nabi Muhammad SAW.",
    icon: "📖",
  },
  {
    nama: "Hadroh Rebana",
    desc: "Seni musik Islami dengan rebana sebagai media dakwah dan pengembangan kreativitas santri.",
    icon: "🥁",
  },
  {
    nama: "Pembelajaran Pidato Ragam Bahasa",
    desc: "Pelatihan public speaking untuk melatih mental dan kepercayaan diri santri saat berdakwah.",
    icon: "🗣️",
  },
];

export function ProgramsSection() {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms);

  useEffect(() => {
    return onSnapshot(doc(db, 'content', 'program_ekskul'), (snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
        setPrograms(snapshot.data().items as Program[]);
      }
    }, () => undefined);
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-10 h-px bg-[#c8a951]"></div>
            <span className="text-[#c8a951] font-semibold text-sm tracking-[0.2em] uppercase">Layanan Pendidikan</span>
            <div className="w-10 h-px bg-[#c8a951]"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#14462c] mb-6 leading-tight">
            Program Unggulan <br/>Untuk Masa Depan Santri
          </h2>
          <p className="text-gray-600 text-lg">
            Kami merancang kurikulum yang menyeimbangkan antara spiritualitas, intelektualitas, dan keterampilan praktis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/5 border border-gray-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              {/* Large Image Placeholder at top */}
              <div className="h-48 bg-gray-300 relative overflow-hidden flex items-center justify-center">
                {program.foto && <img src={program.foto} alt={program.nama} className="absolute inset-0 h-full w-full object-cover" />}
                <div className="absolute inset-0 bg-[#1b5e3b]/20 group-hover:bg-transparent transition-colors z-10"></div>
                {!program.foto && <span className="text-gray-500 font-bold text-sm tracking-wide z-20 px-4 text-center">
                  <span className="text-4xl mb-2">{program.icon}</span>
                  <span className="text-gray-500 font-bold text-sm tracking-wide">FOTO: {program.nama}</span>
                </span>}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#14462c] mb-3 group-hover:text-[#1b5e3b] transition-colors">{program.nama}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                  {program.desc}
                </p>
                <Link href="/profil/ekstrakurikuler" className="inline-flex items-center gap-2 text-sm font-bold text-[#1b5e3b] hover:text-[#c8a951] transition-colors mt-auto">
                  Pelajari Lebih Lanjut
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
