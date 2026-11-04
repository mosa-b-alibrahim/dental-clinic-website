import type { Copy } from '../data/translations';
import { clinic } from '../data/clinic';
import { Tooth } from './ui';
import { sectionIds } from '../data/navigation';
export default function Footer({ t }: { t: Copy }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <a href="#home" className="brand">
            <span className="logo">
              <Tooth />
            </span>
            <span>{t.name}</span>
          </a>
          <p>{t.doctor}</p>
          <p className="footer-slogan">{t.slogan}</p>
        </div>
        <div>
          <h3>{t.quick}</h3>
          <nav aria-label={t.quick}>
            {sectionIds.map((id) => (
              <a key={id} href={`#${id}`}>
                {t.nav[id]}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <h3>{t.nav.contact}</h3>
          <a href={`tel:${clinic.phone}`} dir="ltr" className="phone-number">
            {clinic.phone}
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {t.name}. {t.rights}
        </span>
        <span>{t.place}</span>
      </div>
    </footer>
  );
}
