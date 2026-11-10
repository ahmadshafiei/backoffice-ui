import { SelectOption } from '../../shared/components/fields/select-field';

/* ---- Enums (mirror the C# byte enums; the API sends/receives the numeric value) ---- */

export const AccountLevel = { Group: 0, General: 1, Subsidiary: 2 } as const;
export type AccountLevel = (typeof AccountLevel)[keyof typeof AccountLevel];

export const AccountType = { Asset: 0, Liability: 1, Equity: 2, Revenue: 3, Expense: 4, Memorandum: 5 } as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const NormalBalance = { Debit: 0, Credit: 1, Both: 2 } as const;
export type NormalBalance = (typeof NormalBalance)[keyof typeof NormalBalance];

export const ACCOUNT_LEVEL_LABEL: Record<number, string> = {
  [AccountLevel.Group]: 'گروه حساب کل',
  [AccountLevel.General]: 'حساب کل',
  [AccountLevel.Subsidiary]: 'حساب معین',
};

export const ACCOUNT_TYPE_LABEL: Record<number, string> = {
  [AccountType.Asset]: 'دارایی',
  [AccountType.Liability]: 'بدهی',
  [AccountType.Equity]: 'سرمایه',
  [AccountType.Revenue]: 'درآمد',
  [AccountType.Expense]: 'هزینه',
  [AccountType.Memorandum]: 'انتظامی',
};

export const NORMAL_BALANCE_LABEL: Record<number, string> = {
  [NormalBalance.Debit]: 'بدهکار',
  [NormalBalance.Credit]: 'بستانکار',
  [NormalBalance.Both]: 'هر دو',
};

export const ACCOUNT_TYPE_OPTIONS: readonly SelectOption[] =
  Object.values(AccountType).map((value) => ({ value, label: ACCOUNT_TYPE_LABEL[value] }));

export const NORMAL_BALANCE_OPTIONS: readonly SelectOption[] =
  Object.values(NormalBalance).map((value) => ({ value, label: NORMAL_BALANCE_LABEL[value] }));

/* ---- DTOs (see swagger v1.json) ---- */

export interface Account {
  id: string;
  name: string;
  accountCode: string;
  accountType: AccountType;
  accountLevel: AccountLevel;
  normalBalance: NormalBalance | null;
  isActive: boolean;
  isPostable: boolean;
  isDetailAllowed: boolean;
  parentId: string | null;
}

export interface RegisterAccountRequest {
  name: string;
  accountCode: string;
  isActive: boolean;
  accountLevel: AccountLevel;
  accountType: AccountType | null;
  isPostable: boolean | null;
  isDetailAllowed: boolean | null;
  normalBalance: NormalBalance | null;
  parentId: string | null;
}

/** PATCH body – code, level, type, balance and parent are immutable after creation. */
export interface ModifyAccountRequest {
  name: string;
  isActive: boolean;
  isPostable: boolean;
  isDetailAllowed: boolean;
}

export interface DetailClass {
  id: string;
  name: string;
  detailClassCode: string;
  normalBalance: NormalBalance;
}

export interface CreateDetailClassRequest {
  name: string;
  detailClassCode: string;
  normalBalance: NormalBalance;
}

export interface PagedResult<T> {
  totalCount: number | string;
  items: T[];
}

/** Note: the GET response names the first field `groupAccountCodeLength`, the PUT body `groupAccountLength`. */
export interface AccountingSettings {
  groupAccountCodeLength: number;
  generalAccountLength: number;
  subsidiaryAccountLength: number;
  detailAccountLength: number;
}

export interface UpdateAccountingSettingsRequest {
  groupAccountLength: number;
  generalAccountLength: number;
  subsidiaryAccountLength: number;
  detailAccountLength: number;
}
