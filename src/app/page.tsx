import { HeroSection } from '@/components/sections/HeroSection';
import { ProgramOverlaySection } from '@/components/sections/ProgramOverlaySection';
import { WelcomeSection } from '@/components/sections/WelcomeSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ProgramsSection } from '@/components/sections/ProgramsSection';
import { CTASection } from '@/components/sections/CTASection';
import { NewsHighlightSection } from '@/components/sections/NewsHighlightSection';

export const metadata = {
  title: 'Pondok Pesantren Modern Roudlotul Abror di Cilacap',
  description: 'Kenali program tahfidz, madrasah diniyah, kegiatan santri, dan pendaftaran PP Modern Roudlotul Abror di Maoslor, Cilacap.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProgramOverlaySection />
      <WelcomeSection />
      <StatsSection />
      <ProgramsSection />
      <CTASection />
      <NewsHighlightSection />
    </>
  );
}
