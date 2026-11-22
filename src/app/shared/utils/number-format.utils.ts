import { toEnDigits, toFaDigits } from './digits.utils';

/** Persian thousands separator (U+066C). */
export const GROUP_SEPARATOR = '٬';
/** Persian decimal separator (U+066B). */
export const DECIMAL_SEPARATOR = '٫';

/**
 * Formats a number for display with a separator every three digits from the right, in Persian
 * digits: `1234567` -> `۱٬۲۳۴٬۵۶۷`. Working on the string keeps huge / partially-typed values intact.
 *
 * `.` / `٫` always mean a decimal point; `,` / `٬` are grouping, except a single `,` followed by
 * fewer than three digits (`1234,5`), which is read as a decimal point. Other characters are
 * ignored. `decimals` caps the fractional part (`0` drops it entirely) and `''` is returned when
 * there is nothing numeric to show.
 */
export function formatGroupedNumber(
  value: string | number | null | undefined,
  decimals = 2,
): string {
  if (value === null || value === undefined) return '';

  const raw = toEnDigits(String(value)).trim();
  if (!raw) return '';

  const negative = raw.startsWith('-');
  let body = raw.replace(/[^\d.,٫]/g, '');
  body = toDecimalPoint(raw, body);
  const [integerPart = '', ...fractionParts] = body.split('.');
  const fraction = fractionParts.join('').slice(0, Math.max(0, decimals));

  const integer = integerPart.replace(/^0+(?=\d)/, '');
  if (!integer && !fraction) return '';

  const grouped = (integer || '0').replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
  const result = fraction ? `${grouped}${DECIMAL_SEPARATOR}${fraction}` : grouped;
  return toFaDigits(negative ? `-${result}` : result);
}

/** Turns a lone `,` that cannot be grouping (1–2 trailing digits) into a decimal point. */
function toDecimalPoint(raw: string, body: string): string {
  if (/[.٫]/.test(raw)) return body.replace(/[.,٫]/g, '.');
  const commas = body.match(/,/g)?.length ?? 0;
  if (commas !== 1) return body.replace(/,/g, '');
  return /,\d{1,2}$/.test(body) ? body.replace(',', '.') : body.replace(/,/g, '');
}

/** Reads a formatted value (Persian digits, grouping, Persian/Latin decimal) back into a number. */
export function parseGroupedNumber(value: string | null | undefined): number | null {
  if (value === null || value === undefined) return null;

  const normalized = toEnDigits(value)
    .replace(/[^\d.,٫-]/g, '')
    .replace(/٫/g, '.')
    .replace(/,/g, '');
  if (!/\d/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
