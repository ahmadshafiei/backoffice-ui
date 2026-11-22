/** Filters for the general ledger (دفتر کل). `branchId` is optional. */
export interface GeneralLedgerFilters {
  accountId: string;
  startDate: string;
  endDate: string;
  branchId: number | null;
}

export interface GeneralLedgerSummary {
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface GeneralLedgerItem {
  date: string;
  number: number;
  sequence: number;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  journalId: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Reads the result-page query string. Returns null when a required filter is missing or invalid. */
export function readLedgerFilters(params: { get(name: string): string | null }): GeneralLedgerFilters | null {
  const accountId = params.get('accountId')?.trim() ?? '';
  const startDate = params.get('startDate') ?? '';
  const endDate = params.get('endDate') ?? '';
  if (!accountId || !ISO_DATE.test(startDate) || !ISO_DATE.test(endDate) || startDate > endDate) return null;

  const branchRaw = params.get('branchId');
  if (branchRaw == null || branchRaw === '') return { accountId, startDate, endDate, branchId: null };
  const branchId = Number(branchRaw);
  if (!Number.isInteger(branchId)) return null;
  return { accountId, startDate, endDate, branchId };
}
