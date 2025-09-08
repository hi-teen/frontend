'use client';

export function formatDateTime(datetime?: string): string {
  if (!datetime) return '';
  const [date, time] = datetime.split(/[ T]/);
  if (!date || !time) return datetime;
  const [year, month, day] = date.split('-');
  const [hh, mm] = time.split(':');
  return `${year.slice(2)}/${month}/${day} ${hh}:${mm}`;
}


