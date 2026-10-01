import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://ponpes-bili.web.app"),
  title: {
    default: "PP Modern Roudlotul Abror | Pondok Pesantren Cilacap",
    template: "%s | PP Modern Roudlotul Abror",
  },
  description: "Website Resmi Pondok Pesantren Modern Roudlotul Abror - Yayasan Paguwarman. Mendidik generasi Qur'ani yang berakhlakul karimah di Maoslor, Maos, Cilacap.",
  icons: {
    icon: "/logo-pesantren.png",
    apple: "/logo-pesantren.png",
  },
  keywords: ["pondok pesantren", "pesantren cilacap", "roudlotul abror", "tahfidz", "madrasah diniyah", "PPDB", "pesantren maos"],
  authors: [{ name: "PP Modern Roudlotul Abror" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ponpes-bili.web.app",
    siteName: "PP Modern Roudlotul Abror",
    title: "PP Modern Roudlotul Abror | Pondok Pesantren Cilacap",
    description: "Mendidik generasi Qur'ani yang berakhlakul karimah, berhaluan Ahlussunnah Wal Jama'ah, dan siap menghadapi tantangan global.",
    images: [
      {
        url: "/logo-pesantren.png",
        width: 512,
        height: 512,
        alt: "Logo PP Modern Roudlotul Abror",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "PP Modern Roudlotul Abror | Pondok Pesantren Cilacap",
    description: "Mendidik generasi Qur'ani yang berakhlakul karimah di Maoslor, Maos, Cilacap.",
    images: ["/logo-pesantren.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Pondok Pesantren Modern Roudlotul Abror",
  url: "https://ponpes-bili.web.app/",
  logo: "https://ponpes-bili.web.app/logo-pesantren.png",
  email: "ponpesroudlotulabror3@gmail.com",
  telephone: "+6282135505020",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Dukuh RT 01 RW 04",
    addressLocality: "Maoslor, Maos",
    addressRegion: "Cilacap, Jawa Tengah",
    addressCountry: "ID",
  },
  sameAs: ["https://www.facebook.com/maftukhin.abror"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
