import { isValidPeriodRange } from './fiscal-period.model';

describe('fiscal period rules', () => {
  it('requires the end date to be after the start date', () => {
    expect(isValidPeriodRange('2026-03-21', '2027-03-20')).toBe(true);
    expect(isValidPeriodRange('2026-03-21', '2026-03-21')).toBe(false);
    expect(isValidPeriodRange('2026-03-21', '2026-01-01')).toBe(false);
    expect(isValidPeriodRange(null, '2026-01-01')).toBe(false);
  });
});
