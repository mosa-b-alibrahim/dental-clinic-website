import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { asset } from './data/clinic';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutDoctor from './components/AboutDoctor';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
export default function App() {
  const { language, t, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [selectedService, setSelectedService] = useState('');
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Header
        t={t}
        theme={theme}
        onThemeChange={setTheme}
        language={language}
        toggle={toggleLanguage}
      />
      <main id="main">
        <Hero t={t} />
        <AboutDoctor t={t} />
        <Services t={t} language={language} onSelect={setSelectedService} />
        <Gallery t={t} />
        {__HAS_PROMO_VIDEO__ && (
          <section className="section video-section">
            <div className="container">
              <h2>{t.video}</h2>
              <video
                controls
                preload="metadata"
                src={asset('videos/clinic-promo.mp4')}
                aria-label={t.video}
              />
            </div>
          </section>
        )}
        <Contact
          t={t}
          language={language}
          selectedService={selectedService}
          onSelect={setSelectedService}
        />
      </main>
      <Footer t={t} />
    </MotionConfig>
  );
}
