import { CalendarDays, ShieldCheck, UsersRound } from 'lucide-react';
import { asset, clinic } from '../data/clinic';
import type { Copy } from '../data/translations';
import { Reveal, Tooth } from './ui';
export default function Hero({ t }: { t: Copy }) {
  return (
    <section
      id="home"
      className="hero reference-hero"
      style={{ backgroundImage: `url("${asset('images/hero-bg.jpg.png')}")` }}
    >
      <div className="container hero-grid">
        <Reveal className="hero-copy">
          <h1>
            {t.slogan}
            <span className="hero-smile" aria-hidden="true" />
          </h1>
          <p className="hero-doctor">{t.doctor}</p>
          <p className="hero-specialization">{t.specialization}</p>
          <p className="hero-intro">{t.intro}</p>
          <div className="button-row">
            <a className="button primary" href="#appointments">
              <CalendarDays size={25} />
              {t.book}
            </a>
            <a
              className="button outline"
              href={clinic.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              {t.contactWhatsapp}
            </a>
          </div>
          <ul className="hero-benefits" aria-label={t.benefitsLabel}>
            <li>
              <Tooth />
              <span>{t.benefits[0]}</span>
            </li>
            <li>
              <UsersRound size={32} strokeWidth={1.7} />
              <span>{t.benefits[1]}</span>
            </li>
            <li>
              <ShieldCheck size={31} strokeWidth={1.8} />
              <span>{t.benefits[2]}</span>
            </li>
          </ul>
        </Reveal>
        <Reveal className="hero-visual">
          <div className="photo-decoration" />
          <div className="hero-photo-frame">
            <img
              className="hero-photo"
              src={asset('images/doctor-original.jpg')}
              alt={t.doctor}
              width="688"
              height="1529"
              fetchPriority="high"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.6a8.6 8.6 0 0 1-12.8 7.5L3 20.5l1.3-4.6a8.6 8.6 0 1 1 16.2-4.3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 7.5c-.5 0-1.2.8-1.2 1.7 0 2.3 3.4 5.8 5.9 6.4 1.3.3 2.4-.7 2.5-1.4l-2.2-1.1-.9 1c-1.4-.6-2.6-1.7-3.2-3l.8-1-1-2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
