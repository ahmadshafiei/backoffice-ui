/** Filters for trial balance (تراز آزمایشی). `branchId` is optional. `level` 1=General, 2=Subsidiary, 3=Detail. */
export interface TrialBalanceFilters {
  startDate: string;
  endDate: string;
  accountId?: string;
  accountCode?: string;
  accountName?: string;
  branchId: number | null;
  level: number;
}

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface TrialBalanceSummary {
  totalOpeningDebit: number;
  totalOpeningCredit: number;
  totalPeriodDebit: number;
  totalPeriodCredit: number;
  totalClosingDebit: number;
  totalClosingCredit: number;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Reads the result-page query string. Returns null when a required filter is missing or invalid. */
export function readTrialBalanceFilters(params: { get(name: string): string | null }): TrialBalanceFilters | null {
  const startDate = params.get('startDate') ?? '';
  const endDate = params.get('endDate') ?? '';
  const accountId = params.get('accountId')?.trim() ?? '';
  const accountCode = params.get('accountCode')?.trim() ?? '';
  const accountName = params.get('accountName')?.trim() ?? '';
  const levelRaw = params.get('level');
  if (!ISO_DATE.test(startDate) || !ISO_DATE.test(endDate) || startDate > endDate) return null;

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