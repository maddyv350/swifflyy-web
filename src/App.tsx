import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';

import { ScrollProgress } from './components/ScrollProgress';
import { PinDrops } from './components/PinDrops';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { HowItWorks } from './components/HowItWorks';
import { SwipeDeck } from './components/SwipeDeck';
import { Why } from './components/Why';
import { Safety } from './components/Safety';
import { Cities } from './components/Cities';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const animate = !reducedMotion;

  useSmoothScroll(animate);

  return (
    <>
      <ScrollProgress />
      <PinDrops enabled={animate} />
      <Navbar />
      <main id="main">
        <Hero animate={animate} />
        <Marquee />
        <HowItWorks animate={animate} />
        <SwipeDeck animate={animate} />
        <Why animate={animate} />
        <Safety animate={animate} />
        <Cities animate={animate} />
        <FAQ animate={animate} />
        <FinalCTA animate={animate} />
      </main>
      <Footer />
    </>
  );
}
