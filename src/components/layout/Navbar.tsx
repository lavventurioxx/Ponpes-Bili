"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const toggleDropdown = (menu: string) => {
    if (openDropdown === menu) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menu);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-[#faf9f6] border-b border-[#edeae3] py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6 text-[#2a2824]/70">
            <a href="https://maps.app.goo.gl/JzJs7U9QktaAnAEeA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#1b5e3b] transition-colors">
              <svg className="w-4 h-4 text-[#1b5e3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Jl. Dukuh RT.01 RW.04, Maoslor, Cilacap
            </a>
            <a href="mailto:ponpesroudlotulabror3@gmail.com" className="flex items-center gap-2 hover:text-[#1b5e3b] transition-colors">
              <svg className="w-4 h-4 text-[#1b5e3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              ponpesroudlotulabror3@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4 text-[#2a2824]/70">
            <span className="font-semibold">Ikuti Kami:</span>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/maftukhin.abror" target="_blank" rel="noopener noreferrer" className="hover:text-[#1b5e3b] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://wa.me/6282135505020" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
            </div>
          </div>
        </div>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-white py-4'
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 z-50 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 overflow-hidden bg-gradient-to-br from-[#1b5e3b] to-[#2d7a50]">
              {/* Gambar logo. Jika file /logo-pesantren.png dimasukkan ke folder public, otomatis akan muncul */}
              <img 
                src="/logo-pesantren.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-[#14462c] leading-tight tracking-tight">Pondok Pesantren Modern</span>
              <span className="text-xs font-semibold text-[#1b5e3b] opacity-80">Roudlotul Abror</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            
            <Link href="/" className="text-[#2a2824] hover:text-[#1b5e3b] font-semibold text-sm px-3 py-2 rounded-lg hover:bg-[#e8f5ec]/50 transition-colors">Beranda</Link>

            {/* PROFIL Dropdown */}
            <div className="relative group">
              <button className="text-[#2a2824] hover:text-[#1b5e3b] font-semibold transition-colors flex items-center gap-1 text-sm px-3 py-2 rounded-lg hover:bg-[#e8f5ec]/50">
                Profil
                <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col py-2 translate-y-2 group-hover:translate-y-0">
                <Link href="/profil/sekolah" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Profil Sekolah</Link>
                <Link href="/profil/visi-misi" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Visi dan Misi</Link>
                <Link href="/profil/guru" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Asatidz &amp; Pengajar</Link>
                <Link href="/profil/pengurus" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Struktur Pengurus</Link>
              </div>
            </div>

            {/* INFORMASI Dropdown */}
            <div className="relative group">
              <button className="text-[#2a2824] hover:text-[#1b5e3b] font-semibold transition-colors flex items-center gap-1 text-sm px-3 py-2 rounded-lg hover:bg-[#e8f5ec]/50">
                Layanan &amp; Info
                <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col py-2 translate-y-2 group-hover:translate-y-0">
                <Link href="/profil/ekstrakurikuler" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Program &amp; Ekskul</Link>
                <Link href="/informasi/prestasi" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Prestasi</Link>
                <Link href="/informasi/berita" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Berita</Link>
                <Link href="/galeri/foto" className="px-4 py-2 text-sm text-[#2a2824] hover:bg-[#e8f5ec] hover:text-[#1b5e3b] transition-colors rounded-lg mx-1">Galeri Foto</Link>
              </div>
            </div>

            {/* Authentication & CTA */}
            <div className="flex items-center gap-3 ml-4">
              {!user ? (
                <>
                  <Link href="/login" className="text-[#2a2824] hover:text-[#1b5e3b] font-semibold text-sm px-3 py-2">
                    Login
                  </Link>
                  <Link href="/penerimaan-santri-baru" className="text-white font-bold text-sm bg-[#1b5e3b] hover:bg-[#14462c] px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    Daftar Sekarang &rarr;
                  </Link>
                </>
              ) : (
                <>
                  <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-white font-bold text-sm bg-[#1b5e3b] hover:bg-[#14462c] px-6 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => signOut(auth)}
                    className="text-[#2a2824]/60 hover:text-red-600 font-semibold transition-colors text-sm px-3 py-2"
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden z-50">
            <button 
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="text-[#2a2824] hover:text-[#1b5e3b] focus:outline-none p-2 rounded-lg hover:bg-[#e8f5ec]/50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div id="mobile-navigation" className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col px-4 space-y-1">
            <Link href="/" onClick={toggleMobileMenu} className="block text-[#2a2824] font-semibold py-3 border-b border-[#e8f5ec]">Beranda</Link>
            
            {/* PROFIL */}
            <div>
              <button 
                onClick={() => toggleDropdown('profil')}
                className="w-full text-left font-semibold text-[#2a2824] py-3 border-b border-[#e8f5ec] flex justify-between items-center"
              >
                Profil
                <svg className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'profil' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`flex flex-col pl-4 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'profil' ? 'max-h-96 py-2' : 'max-h-0'}`}>
                <Link href="/profil/sekolah" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Profil Sekolah</Link>
                <Link href="/profil/visi-misi" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Visi dan Misi</Link>
                <Link href="/profil/guru" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Asatidz & Pengajar</Link>
                <Link href="/profil/pengurus" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Struktur Pengurus</Link>
              </div>
            </div>

            {/* LAYANAN & INFO */}
            <div>
              <button
                onClick={() => toggleDropdown('info')}
                className="w-full text-left font-semibold text-[#2a2824] py-3 border-b border-[#e8f5ec] flex justify-between items-center"
              >
                Layanan &amp; Info
                <svg className={`w-4 h-4 transition-transform duration-300 ${openDropdown === 'info' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`flex flex-col pl-4 space-y-1 overflow-hidden transition-all duration-300 ${openDropdown === 'info' ? 'max-h-96 py-2' : 'max-h-0'}`}>
                <Link href="/profil/ekstrakurikuler" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Program &amp; Ekskul</Link>
                <Link href="/informasi/prestasi" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Prestasi</Link>
                <Link href="/informasi/berita" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Berita</Link>
                <Link href="/galeri/foto" onClick={toggleMobileMenu} className="text-[#2a2824]/70 py-1.5 text-sm">Galeri Foto</Link>
              </div>
            </div>

            {/* Auth Section */}
            <div className="pt-4 space-y-2">
              {!user ? (
                <>
                  <Link href="/login" onClick={toggleMobileMenu} className="block text-center text-[#1b5e3b] font-semibold py-2.5 rounded-full border border-[#e8f5ec] hover:bg-[#e8f5ec]">Login</Link>
                  <Link 
                    href="/penerimaan-santri-baru" 
                    onClick={toggleMobileMenu}
                    className="block text-center font-bold text-white bg-[#1b5e3b] py-3 rounded-full shadow-md"
                  >
                    Daftar Sekarang
                  </Link>
                </>
              ) : (
                <>
                  <Link href={isAdmin ? "/admin" : "/dashboard"} onClick={toggleMobileMenu} className="block text-center font-bold text-white bg-[#1b5e3b] py-3 rounded-full">Dashboard</Link>
                  <button onClick={() => { signOut(auth); toggleMobileMenu(); }} className="w-full text-center text-red-500 font-semibold py-2.5">Keluar</button>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
