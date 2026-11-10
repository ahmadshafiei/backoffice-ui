import { formatJalali, jalaliMonthLength, parseJalali, toGregorian, toJalali } from './jalali.utils';

describe('jalali.utils', () => {
  it('converts known dates', () => {
    expect(toJalali(new Date(2026, 10, 9))).toEqual({ jy: 1405, jm: 8, jd: 18 });
    expect(toJalali(new Date(2025, 2, 21))).toEqual({ jy: 1404, jm: 1, jd: 1 });
    expect(toGregorian({ jy: 1405, jm: 1, jd: 1 })).toEqual(new Date(2026, 2, 21));
  });

  it('agrees with Intl (persian calendar) over 15 years and round-trips', () => {
    const intl = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' });
    for (let t = Date.UTC(2015, 0, 1); t < Date.UTC(2030, 0, 1); t += 86_400_000 * 3) {
      const utc = new Date(t);
      const parts = Object.fromEntries(intl.formatToParts(utc).map((p) => [p.type, p.value]));
      const local = new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
      const j = toJalali(local);
      expect([j.jy, j.jm, j.jd]).toEqual([Number(parts['relatedYear'] ?? parts['year']), Number(parts['month']), Number(parts['day'])]);
      expect(toGregorian(j).getTime()).toBe(local.getTime());
    }
  });

  it('knows month lengths, including leap Esfand', () => {
    expect(jalaliMonthLength(1405, 1)).toBe(31);
    expect(jalaliMonthLength(1405, 7)).toBe(30);
    expect(jalaliMonthLength(1403, 12)).toBe(30); // leap
    expect(jalaliMonthLength(1404, 12)).toBe(29);
  });

  it('parses Persian digits and rejects impossible dates', () => {
    expect(parseJalali('۱۴۰۵/۰۸/۱۸')).toEqual({ jy: 1405, jm: 8, jd: 18 });
    expect(parseJalali('1405/07/31')).toBeNull();
    expect(parseJalali('abc')).toBeNull();
    expect(formatJalali({ jy: 1405, jm: 8, jd: 8 })).toBe('1405/08/08');
  });
});
