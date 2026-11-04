import { useState } from 'react';
import type { FormEvent } from 'react';
import { MessageCircle, Info } from 'lucide-react';
import { type Language } from '../data/clinic';
import { serviceGroups } from '../data/serviceGroups';
import type { Copy } from '../data/translations';

import {
  localDateString,
  prepareAppointment,
  type BookingField,
  type BookingErrors,
} from '../lib/booking';

export default function AppointmentForm({
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
  const [sentUrl, setSentUrl] = useState('');
  const [errors, setErrors] = useState<BookingErrors>({});
  const minDate = localDateString();
  const errorText = (field: BookingField) => {
    const key = errors[field];
    return key ? t[key] : undefined;
  };
  const errorProps = (field: BookingField, hint?: string) => ({
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby':
      [hint, errors[field] ? `error-${field}` : undefined]
        .filter(Boolean)
        .join(' ') || undefined,
  });
  const fieldError = (field: BookingField) =>
    errors[field] && (
      <span className="field-error" id={`error-${field}`}>
        {errorText(field)}
      </span>
    );

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const result = prepareAppointment(new FormData(form), language, t, minDate);
    setSentUrl('');
    if (!result.ok) {
      setErrors(result.errors);
      const firstInvalid = Object.keys(result.errors)[0];
      // Mount the error description before moving screen-reader focus.
      requestAnimationFrame(() =>
        (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus(),
      );
      return;
    }
    setErrors({});
    setSentUrl(result.url);
    window.open(result.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div id="appointments" className="appointment-anchor">
      <form
        className="booking-form"
        noValidate
        onSubmit={submit}
        onInput={(e) => {
          const field = (e.target as HTMLInputElement).name;
          setErrors((current) => {
            const next = { ...current };
            delete next[field as BookingField];
            return next;
          });
          setSentUrl('');
        }}
      >
        <p className="required-note">{t.requiredFields}</p>
        <div className="form-grid">
          <label>
            {t.fields[0]}{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
            <input
              name="name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              {...errorProps('name')}
            />
            {fieldError('name')}
          </label>
          <label>
            {t.fields[1]}{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
            <input
              name="phone"
              type="tel"
              dir="ltr"
              required
              maxLength={25}
              autoComplete="tel"
              {...errorProps('phone')}
            />
            {fieldError('phone')}
          </label>
          <label className="full">
            {t.fields[2]}{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
            <select
              name="service"
              required
              value={selectedService}
              onChange={(e) => onSelect(e.target.value)}
              {...errorProps('service')}
            >
              <option value="" disabled>
                {t.select}
              </option>
              {serviceGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group[language].title}
                </option>
              ))}
            </select>
            {fieldError('service')}
          </label>
          <label>
            {t.fields[3]}{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
            <input
              name="date"
              type="date"
              required
              min={minDate}
              {...errorProps('date', 'date-hint')}
            />
            <span className="field-hint" id="date-hint">
              {t.dateHint}
            </span>
            {fieldError('date')}
          </label>
          <label>
            {t.fields[4]}{' '}
            <span className="required-mark" aria-hidden="true">
              *
            </span>
            <input
              name="time"
              type="time"
              required
              min="09:00"
              max="21:00"
              {...errorProps('time', 'time-hint')}
            />
            <span className="field-hint" id="time-hint">
              {t.timeHint}
            </span>
            {fieldError('time')}
          </label>
          <label className="full">
            {t.fields[5]} <span className="optional">({t.optional})</span>
            <textarea name="notes" rows={2} maxLength={1000} />
          </label>
        </div>
        <p className="form-confirmation">
          <Info size={18} aria-hidden="true" />
          {t.confirmation}
        </p>
        <p className="privacy">{t.privacy}</p>
        <button className="button primary submit-button" type="submit">
          <MessageCircle size={20} aria-hidden="true" />
          {t.send}
        </button>
        {sentUrl && (
          <p className="submission-status" role="status">
            {t.sent}{' '}
            <a href={sentUrl} target="_blank" rel="noopener noreferrer">
              {t.continue}
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
