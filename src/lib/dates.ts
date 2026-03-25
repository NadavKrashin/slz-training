import { APP_TIMEZONE } from './constants';
import { currentDate } from './clock';

export function getTodayDateKey(): string {
  return formatDateKey(currentDate());
}

export function formatDateKey(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

export function getHebrewDate(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getHebrewMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    timeZone: APP_TIMEZONE,
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { start, end };
}

export function dateKeyToDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isToday(dateKey: string): boolean {
  return dateKey === getTodayDateKey();
}

export function isFutureDate(dateKey: string): boolean {
  return dateKey > getTodayDateKey();
}

export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getMsUntilMidnight(): number {
  const d = currentDate();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '0';
  const h = parseInt(get('hour'));
  const m = parseInt(get('minute'));
  const s = parseInt(get('second'));
  const secondsSinceMidnight = h * 3600 + m * 60 + s;
  return (86400 - secondsSinceMidnight) * 1000;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
