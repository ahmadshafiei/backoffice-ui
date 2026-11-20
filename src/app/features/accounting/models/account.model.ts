import { SelectOption } from '../../../shared/components/fields/select-field';
import { NormalBalance } from './normal-balance.model';

export const AccountLevel = { Group: 0, General: 1, Subsidiary: 2, Detail: 3 } as const;
export type AccountLevel = (typeof AccountLevel)[keyof typeof AccountLevel];

export const AccountType = { Asset: 0, Liability: 1, Equity: 2, Revenue: 3, Expense: 4, Memorandum: 5 } as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const ACCOUNT_LEVEL_LABEL: Record<number, string> = {
  [AccountLevel.Group]: 'گروه حساب کل',
  [AccountLevel.General]: 'حساب کل',
  [AccountLevel.Subsidiary]: 'حساب معین',
  [AccountLevel.Detail]: 'حساب تفصیلی',
};

export const ACCOUNT_TYPE_LABEL: Record<number, string> = {
  [AccountType.Asset]: 'دارایی',
  [AccountType.Liability]: 'بدهی',
  [AccountType.Equity]: 'سرمایه',
  [AccountType.Revenue]: 'درآمد',
  [AccountType.Expense]: 'هزینه',
  [AccountType.Memorandum]: 'انتظامی',
};

export const ACCOUNT_TYPE_OPTIONS: readonly SelectOption[] =
  Object.values(AccountType).map((value) => ({ value, label: ACCOUNT_TYPE_LABEL[value] }));

export interface Account {
  id: string;
  name: string;
  accountCode: string;
  accountType: AccountType;
  accountLevel: AccountLevel;
  normalBalance: NormalBalance | null;
  isActive: boolean;
  isDetailAllowed: boolean;
  parentId: string | null;
  parentName: string | null;
  detailClassId: string | null;
  canBeUsedAsParty: boolean | null;
}

export interface RegisterAccountRequest {
  name: string;
  accountCode: string;
  isActive: boolean;
  accountLevel: AccountLevel;
  accountType: AccountType | null;
  isDetailAllowed: boolean | null;
  normalBalance: NormalBalance | null;
  parentId: string | null;
  detailClassId: string | null;
  canBeUsedAsParty: boolean | null;
}

export interface ModifyAccountRequest {
  name: string;
  isActive: boolean;
  isDetailAllowed: boolean | null;
  canBeUsedAsParty: boolean | null;
}
