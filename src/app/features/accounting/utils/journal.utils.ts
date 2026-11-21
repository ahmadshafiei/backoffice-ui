/** One row of a journal as edited on screen (either side may be empty). */
export interface JournalSideRow {
  accountId: string | null;
  debit: number | null;
  credit: number | null;
}

export type JournalAmountField = 'debit' | 'credit';

/** The two sides of a double-entry row; a row never carries both. */
export function oppositeSide(side: JournalAmountField): JournalAmountField {
  return side === 'debit' ? 'credit' : 'debit';
}

/**
 * Normalises a typed amount: negative values are clamped to 0 and non-finite / empty input becomes
 * `null` (the server receives 0 for an empty side).
 */
export function toNonNegativeAmount(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) return null;
  return value < 0 ? 0 : value;
}

export const JOURNAL_VALIDATION_MESSAGES = {
  minRows: 'برای ثبت سند حداقل دو ردیف (یک بدهکار و یک بستانکار) لازم است.',
  accountRequired: 'حساب همه ردیف‌ها را انتخاب کنید.',
  negative: 'مبلغ بدهکار و بستانکار نمی‌تواند منفی باشد.',
  bothSides: 'هر ردیف باید فقط بدهکار یا فقط بستانکار باشد.',
  noSides: 'حداقل یک ردیف بدهکار و یک ردیف بستانکار باید وجود داشته باشد.',
  unbalanced: 'جمع بدهکار و بستانکار سند باید برابر باشد.',
} as const;

const AMOUNT_EPSILON = 0.005;

function amountOf(value: number | null): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/**
 * Returns the first blocking problem of a journal's rows, or `null` when it is valid:
 * balanced totals, at least one debit and one credit, no row with both sides, no negative amounts.
 */
export function validateJournalItems(rows: readonly JournalSideRow[]): string | null {
  if (rows.length < 2) return JOURNAL_VALIDATION_MESSAGES.minRows;

  let debitTotal = 0;
  let creditTotal = 0;
  let debitRows = 0;
  let creditRows = 0;

  for (const row of rows) {
    if (!row.accountId) return JOURNAL_VALIDATION_MESSAGES.accountRequired;

    const debit = amountOf(row.debit);
    const credit = amountOf(row.credit);

    if (debit < 0 || credit < 0) return JOURNAL_VALIDATION_MESSAGES.negative;
    if (debit > 0 && credit > 0) return JOURNAL_VALIDATION_MESSAGES.bothSides;

    if (debit > 0) {
      debitRows++;
      debitTotal += debit;
    }
    if (credit > 0) {
      creditRows++;
      creditTotal += credit;
    }
  }

  if (debitRows === 0 || creditRows === 0) return JOURNAL_VALIDATION_MESSAGES.noSides;
  if (Math.abs(debitTotal - creditTotal) > AMOUNT_EPSILON) return JOURNAL_VALIDATION_MESSAGES.unbalanced;
  return null;
}
