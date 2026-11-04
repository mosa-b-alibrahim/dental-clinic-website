import { clinic, type Language } from '../data/clinic';
import { serviceGroups } from '../data/serviceGroups';
import type { Copy } from '../data/translations';

export type BookingField = 'name' | 'phone' | 'service' | 'date' | 'time';
type ValidationMessage =
  | 'invalidName'
  | 'invalidPhone'
  | 'invalidService'
  | 'invalidDate'
  | 'invalidTime';
export type BookingErrors = Partial<Record<BookingField, ValidationMessage>>;
type BookingResult =
  { ok: true; url: string } | { ok: false; errors: BookingErrors };

export function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function prepareAppointment(
  data: FormData,
  language: Language,
  t: Copy,
  minDate: string,
): BookingResult {
  const read = (field: string) => String(data.get(field) || '').trim();
  const name = read('name');
  const phone = read('phone');
  const date = read('date');
  const time = read('time');
  const service = serviceGroups.find((group) => group.id === read('service'));
  const errors: BookingErrors = {};

  if (name.length < 2 || name.length > 100) errors.name = 'invalidName';
  const digits = phone.replace(/\D/g, '');
  if (
    !/^\+?[\d\s()\-]+$/.test(phone) ||
    digits.length < 7 ||
    digits.length > 15
  )
    errors.phone = 'invalidPhone';
  if (!service) errors.service = 'invalidService';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < minDate)
    errors.date = 'invalidDate';
  if (!/^\d{2}:\d{2}$/.test(time) || time < '09:00' || time > '21:00')
    errors.time = 'invalidTime';
  if (!service || Object.keys(errors).length) return { ok: false, errors };

  const values = [
    name,
    phone,
    service[language].title,
    date,
    time,
    read('notes') || t.noNotes,
  ];
  const details = t.fields
    .map((label, index) => `${label}: ${values[index]}`)
    .join('\n\n');
  const message = `${t.messageIntro}\n\n${details}\n\n${t.messageEnd}`;
  return {
    ok: true,
    url: `${clinic.whatsapp}?text=${encodeURIComponent(message)}`,
  };
}
