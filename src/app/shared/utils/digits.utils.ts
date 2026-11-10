const FA_ZERO = 0x06f0;

/** 123 -> ۱۲۳ (works on any string; other characters are untouched). */
export function toFaDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\d/g, (d) => String.fromCharCode(FA_ZERO + Number(d)));
}

/** ۱۲۳ / ١٢٣ -> 123. Use on user input before sending it to the API. */
export function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - FA_ZERO))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}
