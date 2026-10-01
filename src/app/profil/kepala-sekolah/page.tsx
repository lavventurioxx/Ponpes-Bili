import React from 'react';

export default function KepalaSekolahPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-emerald-800 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">Pengasuh Pondok Pesantren</h1>
          <p className="text-emerald-100">PP Modern Roudlotul Abror</p>
        </div>
      </section>

      {/* Profil Pengasuh */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-10 items-start">

              {/* Foto */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-64 h-80 bg-gray-200 rounded-2xl shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col">
                    <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span className="text-sm">Foto Ustadz Maftukhin</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-emerald-900 mb-1">Ustadz Maftukhin</h2>
                <p className="text-amber-600 font-semibold mb-4">Pengasuh PP Modern Roudlotul Abror</p>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="font-bold text-emerald-800 mb-1">Data Pribadi</h3>
                    <p>Lahir di Demak, 23 Oktober 1983</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-emerald-800 mb-2">Riwayat Pendidikan Pesantren</h3>
                    <ul className="space-y-2">
                      {[
                        'Pondok Pesantren Al-Azhar, Grobogan Purwodadi',
                        "Pondok Pesantren Miftahul 'Ulum, Wonosalam Demak",
                        "Pondok Pesantren Asshidiqiyah (Pondok Qur'an), Wonosalam Demak",
                        "Pondok Pesantren Al-Huda (Pondok Qur'an), Wonosalam Demak",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mt-6">
                    <p className="italic text-emerald-800">
                      &quot;Semoga Pondok Pesantren kita terus berkembang dan menjadi pusat pendidikan yang inovatif, relevan dengan zaman, dan mampu mencetak santri-santri yang berkualitas, unggul dalam iman dan ilmu, berbudaya dalam akhlaqul karimah serta peduli lingkungan.&quot;
                    </p>
                    <p className="text-right text-sm font-semibold text-emerald-700 mt-3">— Ustadz Maftukhin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
