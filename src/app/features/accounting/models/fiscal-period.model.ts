export interface FiscalPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
}

export interface CreateFiscalPeriodRequest {
  name: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
}

/** True when the end date is strictly after the start date (ISO `YYYY-MM-DD` strings compare lexicographically). */
export function isValidPeriodRange(startDate: string | null, endDate: string | null): boolean {
  return !!startDate && !!endDate && endDate > startDate;
}

