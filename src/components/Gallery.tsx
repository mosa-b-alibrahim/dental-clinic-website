import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { asset } from '../data/clinic';
import type { Copy } from '../data/translations';
import { Reveal, SectionHeading } from './ui';
const photos = [
  'clinic-exterior.jpg',
  'treatment-room.jpg',
  'waiting-room.jpg',
];
export default function Gallery({ t }: { t: Copy }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const move = (delta: number) =>
    setIndex((i) => (i + delta + photos.length) % photos.length);
  useEffect(() => {
    const el = dialog.current;
    const cleanup = () => {
      document.body.style.overflow = '';
      opener.current?.focus();
    };
    el?.addEventListener('close', cleanup);
    return () => {
      el?.removeEventListener('close', cleanup);
      document.body.style.overflow = '';
    };
  }, []);
  return (
    <section id="gallery" className="section">
      <div className="container">
        <SectionHeading
          tag={t.galleryTag}
          title={t.galleryTitle}
          intro={t.galleryIntro}
        />
        <div className="gallery-grid">
          {photos.map((photo, i) => (
            <Reveal key={photo}>
              <button
                className="gallery-card"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setIndex(i);
                  dialog.current?.showModal();
                  document.body.style.overflow = 'hidden';
                }}
                aria-label={`${t.zoom}: ${t.captions[i]}`}
              >
                <img
                  src={asset(`images/${photo}`)}
                  alt={t.captions[i]}
                  width="1672"
                  height={i === 0 ? 940 : 941}
                  loading="lazy"
                />
                <span className="gallery-caption">
                  <span>
                    <small>0{i + 1} /</small> {t.captions[i]}
                  </span>
                  <Expand size={19} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={t.galleryTitle}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') move(1);
          if (e.key === 'ArrowLeft') move(-1);
        }}
      >
        <button
          className="lightbox-close icon-button"
          aria-label={t.close}
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <div className="lightbox-content">
          <img
            key={index}
            src={asset(`images/${photos[index]}`)}
            alt={t.captions[index]}
          />
          <div className="lightbox-bottom">
            <button
              className="icon-button"
              aria-label={t.prev}
              onClick={() => move(-1)}
            >
              <ChevronLeft />
            </button>
            <p aria-live="polite">
              {t.captions[index]} <span dir="ltr">({index + 1}/3)</span>
            </p>
            <button
              className="icon-button"
              aria-label={t.next}
              onClick={() => move(1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
