export interface TrialBalanceApiItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  level: number;
  debitUntilPeriod: number;
  creditUntilPeriod: number;
  debitDuringPeriod: number;
  creditDuringPeriod: number;
  debitBalance: number;
  creditBalance: number;
}