import { useState } from 'react';
import { ChevronDown, CalendarDays } from 'lucide-react';
import type { Copy } from '../data/translations';
import { asset, type Language } from '../data/clinic';
import { serviceGroups } from '../data/serviceGroups';
import { SectionHeading } from './ui';
import './Services.css';

export default function Services({
  t,
  language,
  onSelect,
}: {
  t: Copy;
  language: Language;
  onSelect: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  function toggle(id: string) {
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }
  return (
    <section
      id="services"
      className="section services-section image-services"
      aria-labelledby="services-heading"
    >
      <div className="container">
        <div id="services-heading">
          <SectionHeading
            tag={t.servicesTag}
            title={t.servicesTitle}
            intro={t.servicesIntro}
          />
        </div>
        <div className="services-image-grid">
          {serviceGroups.map((group) => {
            const copy = group[language];
            const open = expanded.includes(group.id);
            const panelId = `service-details-${group.id}`;
            return (
              <article
                key={group.id}
                className="service-card image-service-card"
                aria-labelledby={`service-title-${group.id}`}
              >
                <div className="service-image-wrap">
                  <img
                    src={asset(`images/${group.image}`)}
                    alt={copy.alt}
                    width="1536"
                    height="1024"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="image-service-body">
                  <h3 id={`service-title-${group.id}`}>{copy.title}</h3>
                  <p>{copy.description}</p>
                  <button
                    type="button"
                    className="service-details-toggle"
                    id={`service-toggle-${group.id}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(group.id)}
                  >
                    {open ? t.serviceLess : t.serviceMore}
                    <ChevronDown size={19} aria-hidden="true" />
                  </button>
                  <div
                    id={panelId}
                    className="service-details-panel"
                    role="region"
                    aria-labelledby={`service-title-${group.id}`}
                    hidden={!open}
                  >
                    <ul>
                      {copy.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                    <a
                      className="service-booking"
                      href="#appointments"
                      onClick={() => onSelect(group.id)}
                    >
                      <CalendarDays size={18} aria-hidden="true" />
                      {t.bookService}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
