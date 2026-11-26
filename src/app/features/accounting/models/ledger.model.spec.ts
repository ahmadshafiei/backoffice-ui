import { readLedgerFilters } from './ledger.model';

describe('readLedgerFilters', () => {
  function params(values: Record<string, string | undefined>): { get(name: string): string | null } {
    return { get: (name) => values[name] ?? null };
  }

  it('reads required filters and an optional branch with default level 1', () => {
    expect(readLedgerFilters(params({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-12-29',
      branchId: '1',
    }))).toEqual({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-12-29',
      branchId: 1,
      level: 1,
    });
  });

  it('reads level parameter when provided', () => {
    expect(readLedgerFilters(params({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-12-29',
      level: '2',
    }))).toEqual({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-12-29',
      branchId: null,
      level: 2,
    });
  });

  it('leaves branch empty when it is omitted', () => {
    expect(readLedgerFilters(params({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-01-01',
    }))?.branchId).toBeNull();
  });

  it('rejects a missing account, a bad date, or an end date before the start', () => {
    expect(readLedgerFilters(params({ startDate: '2026-01-01', endDate: '2026-12-29' }))).toBeNull();
    expect(readLedgerFilters(params({ accountId: 'acc-1', startDate: '1405/01/01', endDate: '2026-12-29' }))).toBeNull();
    expect(readLedgerFilters(params({ accountId: 'acc-1', startDate: '2026-12-29', endDate: '2026-01-01' }))).toBeNull();
  });

  it('defaults level to 1 when not provided', () => {
    const result = readLedgerFilters(params({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-12-29',
    }));
    expect(result?.level).toBe(1);
  });

  it('rejects invalid level values', () => {
    expect(readLedgerFilters(params({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-12-29',
      level: 'invalid',
    }))?.level).toBe(1);

    expect(readLedgerFilters(params({
      accountId: 'acc-1',
      startDate: '2026-01-01',
      endDate: '2026-12-29',
      level: '4',
    }))?.level).toBe(1);
  });
});