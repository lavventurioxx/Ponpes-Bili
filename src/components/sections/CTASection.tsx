"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Program = {
  nama: string;
  foto?: string;
};

const defaultPrograms: Program[] = [
  { nama: "Pembelajaran Seni Tilawah Al Qur'an" },
  { nama: 'Pagar Nusa' },
];

export function CTASection() {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms);

  useEffect(() => {
    return onSnapshot(doc(db, 'content', 'program_ekskul'), (snapshot) => {
      if (snapshot.exists() && Array.isArray(snapshot.data().items)) {
        setPrograms(snapshot.data().items as Program[]);
      }
    }, () => undefined);
  }, []);

  return (
    <section className="relative z-20 pt-16 bg-white">
      {/* 
        This section uses a massive green banner design similar to the 
        "Start Your Garden Transformation Journey Now" section in the reference.
      */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10 -mb-24">
        <div className="bg-[#1b5e3b] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          
          {/* Background decoration inside the banner */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2d7a50] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Mulai Perjalanan Spiritual Santri Anda Sekarang
            </h2>
            <p className="text-[#e8f5ec]/80 text-lg mb-8 leading-relaxed">
              Pendaftaran santri baru tahun ajaran ini telah dibuka. Jangan lewatkan kesempatan emas ini untuk memberikan pendidikan terbaik bagi putra-putri tercinta.
            </p>
            <Link
              href="/penerimaan-santri-baru"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#c8a951] hover:bg-[#a88730] text-[#14462c] rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-lg"
            >
              Daftar Santri Baru
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          {/* Dua foto dari Program & Ekskul */}
          <div className="relative z-10 w-full md:w-1/3 grid grid-cols-2 gap-4">
            {programs.slice(0, 2).map((program, index) => (
              <div key={`${program.nama}-${index}`} className={`bg-gray-300 rounded-2xl ${index === 0 ? 'h-32 translate-y-8' : 'h-48'} flex items-center justify-center shadow-lg overflow-hidden`}>
                {program.foto ? (
                  <img src={program.foto} alt={program.nama} className="w-full h-full object-cover" />
                ) : (
                  <span className="px-2 text-center text-sm text-gray-500">{program.nama}</span>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
