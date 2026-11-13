import { SelectOption } from '../../../shared/components/fields/select-field';

export const NormalBalance = { Debit: 0, Credit: 1, Both: 2 } as const;
export type NormalBalance = (typeof NormalBalance)[keyof typeof NormalBalance];

export const NORMAL_BALANCE_LABEL: Record<number, string> = {
  [NormalBalance.Debit]: 'بدهکار',
  [NormalBalance.Credit]: 'بستانکار',
  [NormalBalance.Both]: 'بد/بس',
};

export const NORMAL_BALANCE_OPTIONS: readonly SelectOption[] =
  Object.values(NormalBalance).map((value) => ({ value, label: NORMAL_BALANCE_LABEL[value] }));
