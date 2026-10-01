import React from 'react';

export function ProgramOverlaySection() {
  const highlights = [
    {
      title: "Tahfidz Al-Qur'an",
      desc: "Hafalan 30 Juz secara mutqin",
      icon: "🕌"
    },
    {
      title: "Kajian Kitab Kuning",
      desc: "Pendalaman Turats Pesantren",
      icon: "📚"
    },
    {
      title: "Madrasah Diniyah",
      desc: "Pendidikan keagamaan terstruktur",
      icon: "🎓"
    },
    {
      title: "Pendidikan Life Skill",
      desc: "Pembekalan kemandirian santri",
      icon: "💡"
    }
  ];

  return (
    <section className="relative z-30 -mt-24 mb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {highlights.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-xl shadow-black/5 border border-gray-100 flex items-start gap-4 hover:-translate-y-2 transition-transform duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#e8f5ec] text-[#1b5e3b] flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#1b5e3b] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#14462c] text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
