import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';

import { ScrollProgress } from './components/ScrollProgress';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { HowItWorks } from './components/HowItWorks';
import { SwipeDeck } from './components/SwipeDeck';
import { Statement } from './components/Statement';
import { Features } from './components/Features';
import { VibePicker } from './components/VibePicker';
import { MapSection } from './components/MapSection';
import { FAQ } from './components/FAQ';
import { DownloadCTA } from './components/DownloadCTA';
import { Footer } from './components/Footer';

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const animate = !reducedMotion;

  useSmoothScroll(animate);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero animate={animate} />
        <Marquee />
        <HowItWorks animate={animate} />
        <SwipeDeck animate={animate} />
        <Statement animate={animate} />
        <Features animate={animate} />
        <VibePicker animate={animate} />
        <MapSection animate={animate} />
        <FAQ animate={animate} />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}
