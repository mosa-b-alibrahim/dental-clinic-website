import { useEffect, useState } from 'react';
import { CalendarDays, Globe, Menu, X } from 'lucide-react';
import type { Copy } from '../data/translations';
import type { Language } from '../data/clinic';
import { Tooth } from './ui';
import { sectionIds } from '../data/navigation';
import type { Theme } from '../hooks/useTheme';
import ThemeControl from './ThemeControl';
export default function Header({
  t,
  language,
  toggle,
  theme,
  onThemeChange,
}: {
  t: Copy;
  language: Language;
  toggle: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-100px 0px -55% 0px', threshold: 0 },
    );
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#home" className="brand" onClick={() => setOpen(false)}>
          <span className="logo">
            <Tooth />
          </span>
          <span>
            {t.name}
            <small>{t.doctor}</small>
          </span>
        </a>
        <nav
          aria-label={t.menu}
          className={open ? 'navigation open' : 'navigation'}
          id="navigation"
        >
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="button primary header-book"
            href="#appointments"
            onClick={() => setOpen(false)}
          >
            <CalendarDays size={19} />
            {t.book}
          </a>
          <ThemeControl t={t} theme={theme} onChange={onThemeChange} />
          <button
            className="language-button"
            onClick={() => {
              toggle();
              setOpen(false);
            }}
            aria-label={
              language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'
            }
          >
            <Globe size={18} />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="navigation"
            aria-label={open ? t.close : t.menu}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
