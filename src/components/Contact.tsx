import {
  ArrowUpRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { clinic, type Language } from '../data/clinic';
import type { Copy } from '../data/translations';
import AppointmentForm from './AppointmentForm';

export default function Contact({
  t,
  language,
  selectedService,
  onSelect,
}: {
  t: Copy;
  language: Language;
  selectedService: string;
  onSelect: (value: string) => void;
}) {
  return (
    <section
      id="contact"
      className="section contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="contact-heading">
          <h2 id="contact-heading">{t.contactTitle}</h2>
          <p>{t.appointmentIntro}</p>
        </div>
        <div className="contact-hub">
          <aside className="contact-information" aria-label={t.addressTitle}>
            <div className="contact-item">
              <MapPin aria-hidden="true" />
              <div>
                <h3>{t.addressTitle}</h3>
                <p>{t.address}</p>
              </div>
            </div>
            <div className="contact-item">
              <Clock3 aria-hidden="true" />
              <div>
                <h3>{t.hoursTitle}</h3>
                <p>{t.hours}</p>
              </div>
            </div>
            <div className="contact-item">
              <Phone aria-hidden="true" />
              <div>
                <h3>{t.phoneLabel}</h3>
                <a
                  className="phone-number"
                  href={`tel:${clinic.phone}`}
                  dir="ltr"
                >
                  {clinic.phone}
                </a>
              </div>
            </div>
            <div className="contact-actions">
              <a
                className="button primary"
                href={clinic.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.maps}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a
                className="text-link"
                href={clinic.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={20} aria-hidden="true" />
                {t.whatsapp}
              </a>
            </div>
          </aside>
          <AppointmentForm
            t={t}
            language={language}
            selectedService={selectedService}
            onSelect={onSelect}
          />
        </div>
      </div>
    </section>
  );
}
