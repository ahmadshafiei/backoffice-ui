import {
  JOURNAL_VALIDATION_MESSAGES,
  oppositeSide,
  toNonNegativeAmount,
  validateJournalItems,
} from './journal.utils';

const row = (debit: number | null, credit: number | null, accountId: string | null = 'account-1') => ({
  accountId,
  debit,
  credit,
});

describe('validateJournalItems', () => {
  it('requires at least two rows', () => {
    expect(validateJournalItems([])).toBe(JOURNAL_VALIDATION_MESSAGES.minRows);
    expect(validateJournalItems([row(10, 0)])).toBe(JOURNAL_VALIDATION_MESSAGES.minRows);
  });

  it('requires an account on every row', () => {
    expect(validateJournalItems([row(10, 0, null), row(0, 10)])).toBe(JOURNAL_VALIDATION_MESSAGES.accountRequired);
  });

  it('rejects negative debit or credit values', () => {
    expect(validateJournalItems([row(-1, 0), row(0, 10)])).toBe(JOURNAL_VALIDATION_MESSAGES.negative);
    expect(validateJournalItems([row(10, 0), row(0, -0.5)])).toBe(JOURNAL_VALIDATION_MESSAGES.negative);
  });

  it('rejects a row that is both debit and credit', () => {
    expect(validateJournalItems([row(10, 5), row(0, 10)])).toBe(JOURNAL_VALIDATION_MESSAGES.bothSides);
  });

  it('requires at least one debit row and one credit row', () => {
    expect(validateJournalItems([row(10, 0), row(0, 0)])).toBe(JOURNAL_VALIDATION_MESSAGES.noSides);
    expect(validateJournalItems([row(0, 10), row(0, 0)])).toBe(JOURNAL_VALIDATION_MESSAGES.noSides);
    expect(validateJournalItems([row(0, 0), row(0, 0)])).toBe(JOURNAL_VALIDATION_MESSAGES.noSides);
    expect(validateJournalItems([row(null, null), row(null, null)])).toBe(JOURNAL_VALIDATION_MESSAGES.noSides);
  });

  it('rejects an unbalanced journal', () => {
    expect(validateJournalItems([row(100, 0), row(0, 90)])).toBe(JOURNAL_VALIDATION_MESSAGES.unbalanced);
    expect(validateJournalItems([row(100, 0), row(0, 100.01)])).toBe(JOURNAL_VALIDATION_MESSAGES.unbalanced);
  });

  it('accepts a balanced journal, ignoring floating-point noise', () => {
    expect(validateJournalItems([row(100, 0), row(0, 100)])).toBeNull();
    expect(validateJournalItems([row(0.1, 0), row(0.2, 0), row(0, 0.3)])).toBeNull();
  });
});

describe('amount helpers', () => {
  it('clamps negative amounts to zero and treats invalid numbers as empty', () => {
    expect(toNonNegativeAmount(-10)).toBe(0);
    expect(toNonNegativeAmount(Number.NaN)).toBeNull();
    expect(toNonNegativeAmount(Number.POSITIVE_INFINITY)).toBeNull();
    expect(toNonNegativeAmount(null)).toBeNull();
    expect(toNonNegativeAmount(0)).toBe(0);
    expect(toNonNegativeAmount(12.5)).toBe(12.5);
  });

  it('maps each side to its opposite', () => {
    expect(oppositeSide('debit')).toBe('credit');
    expect(oppositeSide('credit')).toBe('debit');
  });
});
