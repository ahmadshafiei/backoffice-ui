/** Filters for the ledger (دفتر کل، معین، تفصیلی). `branchId` is optional. `level` 1=General, 2=Subsidiary, 3=Detail. */
export interface LedgerFilters {
  accountId: string;
  accountCode?: string;
  accountName?: string;
  startDate: string;
  endDate: string;
  branchId: number | null;
  level: number;
}

export interface LedgerSummary {
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface LedgerItem {
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
export function readLedgerFilters(params: { get(name: string): string | null }): LedgerFilters | null {
  const accountId = params.get('accountId')?.trim() ?? '';
  const accountCode = params.get('accountCode')?.trim() ?? '';
  const accountName = params.get('accountName')?.trim() ?? '';
  const startDate = params.get('startDate') ?? '';
  const endDate = params.get('endDate') ?? '';
  const levelRaw = params.get('level');
  if (!accountId || !ISO_DATE.test(startDate) || !ISO_DATE.test(endDate) || startDate > endDate) return null;

  let level = 1;
  if (levelRaw != null && levelRaw !== '') {
    const parsed = Number(levelRaw);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 3) {
      level = parsed;
    }
  }

  const branchRaw = params.get('branchId');
  if (branchRaw == null || branchRaw === '') return { accountId, accountCode, accountName, startDate, endDate, branchId: null, level };
  const branchId = Number(branchRaw);
  if (!Number.isInteger(branchId)) return null;
  return { accountId, accountCode, accountName, startDate, endDate, branchId, level };
}