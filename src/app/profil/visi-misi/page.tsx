import { VisiMisiSection } from '@/components/sections/VisiMisiSection';

export default function VisiMisiPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="gradient-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-10 h-px bg-[#c8a951]"></div>
            <span className="text-[#c8a951] font-semibold text-sm tracking-[0.2em] uppercase">Arah & Tujuan</span>
            <div className="w-10 h-px bg-[#c8a951]"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Visi & Misi</h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
            Pondok Pesantren Modern Roudlotul Abror
          </p>
        </div>
      </div>

      {/* Visi Misi Content */}
      <VisiMisiSection />
    </div>
  );
}
