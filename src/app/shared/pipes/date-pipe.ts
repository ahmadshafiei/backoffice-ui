import { Pipe, PipeTransform } from '@angular/core';

const TIME_ZONE = 'Asia/Tehran';

/** {{ value | jalaliDate }} -> ۱۴۰۵/۰۸/۱۸ ; formats: 'date' | 'long' | 'time' | 'datetime'. */
@Pipe({ name: 'jalaliDate' })
export class JalaliDatePipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined, format: 'date' | 'long' | 'time' | 'datetime' = 'date'): string {
    if (value === null || value === undefined || value === '') return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    if (format === 'long') return longDate(date);
    return formatters[format].format(date);
  }
}

/** «سه‌شنبه ۱۹ آبان ۱۴۰۵» – composed from parts because ICU's own word order differs between engines. */
function longDate(date: Date): string {
  const parts = Object.fromEntries(longParts.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts['weekday']} ${parts['day']} ${parts['month']} ${parts['year']}`;
}

const base = 'fa-IR-u-ca-persian';
const longParts = new Intl.DateTimeFormat(base, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: TIME_ZONE });
const formatters = {
  date: new Intl.DateTimeFormat(base, { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TIME_ZONE }),
  long: new Intl.DateTimeFormat(base, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: TIME_ZONE }),
  time: new Intl.DateTimeFormat(base, { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: TIME_ZONE }),
  datetime: new Intl.DateTimeFormat(base, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: TIME_ZONE }),
};
