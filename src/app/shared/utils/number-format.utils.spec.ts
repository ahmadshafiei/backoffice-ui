import { toFaDigits } from '../utils/digits.utils';
import { formatGroupedNumber, parseGroupedNumber } from './number-format.utils';

describe('formatGroupedNumber', () => {
  it('groups the integer part three digits from the right', () => {
    expect(formatGroupedNumber(1234567)).toBe(toFaDigits('1٬234٬567'));
    expect(formatGroupedNumber(999)).toBe(toFaDigits('999'));
    expect(formatGroupedNumber(1000)).toBe(toFaDigits('1٬000'));
    expect(formatGroupedNumber(0)).toBe(toFaDigits('0'));
  });

  it('accepts grouped, Persian and Arabic-Indic input', () => {
    expect(formatGroupedNumber('1,234,567')).toBe(toFaDigits('1٬234٬567'));
    expect(formatGroupedNumber('۱۲۳۴۵۶۷')).toBe(toFaDigits('1٬234٬567'));
    expect(formatGroupedNumber('١٢٣٤')).toBe(toFaDigits('1٬234'));
    expect(formatGroupedNumber(toFaDigits('1٬234٬567'))).toBe(toFaDigits('1٬234٬567'));
  });

  it('keeps at most the allowed number of decimals', () => {
    expect(formatGroupedNumber('1234.5')).toBe(toFaDigits('1٬234٫5'));
    expect(formatGroupedNumber('1234.567', 2)).toBe(toFaDigits('1٬234٫56'));
    expect(formatGroupedNumber('1234.567', 0)).toBe(toFaDigits('1٬234'));
    expect(formatGroupedNumber('1234٫5')).toBe(toFaDigits('1٬234٫5'));
  });

  it('drops redundant leading zeros and non-numeric characters', () => {
    expect(formatGroupedNumber('007')).toBe(toFaDigits('7'));
    expect(formatGroupedNumber('0')).toBe(toFaDigits('0'));
    expect(formatGroupedNumber('0.25')).toBe(toFaDigits('0٫25'));
    expect(formatGroupedNumber('12a3b4')).toBe(toFaDigits('1٬234'));
  });

  it('returns an empty string when nothing numeric is present', () => {
    expect(formatGroupedNumber(null)).toBe('');
    expect(formatGroupedNumber(undefined)).toBe('');
    expect(formatGroupedNumber('')).toBe('');
    expect(formatGroupedNumber('abc')).toBe('');
  });

  it('keeps a negative sign so callers can decide what to do with it', () => {
    expect(formatGroupedNumber(-1234)).toBe(`-${toFaDigits('1٬234')}`);
  });
});

describe('parseGroupedNumber', () => {
  it('reads grouped Persian values back into a number', () => {
    expect(parseGroupedNumber(toFaDigits('1٬234٬567'))).toBe(1234567);
    expect(parseGroupedNumber('1,234,567')).toBe(1234567);
    expect(parseGroupedNumber('۱۲۳۴')).toBe(1234);
    expect(parseGroupedNumber(toFaDigits('1٬234٫5'))).toBe(1234.5);
  });

  it('returns null for empty or unparsable input', () => {
    expect(parseGroupedNumber('')).toBeNull();
    expect(parseGroupedNumber(null)).toBeNull();
    expect(parseGroupedNumber('abc')).toBeNull();
    expect(parseGroupedNumber('.')).toBeNull();
  });
});
