import { GraduationCap } from 'lucide-react';
import type { Copy } from '../data/translations';
import { Reveal } from './ui';

export default function AboutDoctor({ t }: { t: Copy }) {
  return (
    <section id="about" className="section about-section">
      <div className="container about-grid">
        <Reveal className="about-summary">
          <span className="eyebrow">{t.aboutTag}</span>
          <h2>{t.doctor}</h2>
          <div className="doctor-education">
            <GraduationCap size={25} aria-hidden="true" />
            <div>
              <span>{t.educationLabel}</span>
              <strong>{t.education}</strong>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <h2>{t.aboutTitle}</h2>
          <p>{t.about}</p>
          <p className="care-note">{t.aboutCare}</p>
        </Reveal>
      </div>
    </section>
  );
}
