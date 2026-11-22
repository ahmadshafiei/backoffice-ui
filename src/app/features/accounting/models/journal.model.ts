import { SelectOption } from '../../../shared/components/fields/select-field';

/** `JournalState` / `JournalType` server enums (byte). */
export const JournalState = { Draft: 1, Posted: 2 } as const;
export type JournalState = (typeof JournalState)[keyof typeof JournalState];

export const JournalType = { Manual: 1, Automatic: 2 } as const;
export type JournalType = (typeof JournalType)[keyof typeof JournalType];

export const JOURNAL_STATE_LABEL: Record<number, string> = {
  [JournalState.Draft]: 'پیش‌ نویس',
  [JournalState.Posted]: 'قطعی شده',
};

export const JOURNAL_TYPE_LABEL: Record<number, string> = {
  [JournalType.Manual]: 'دستی',
  [JournalType.Automatic]: 'خودکار',
};

export const JOURNAL_TYPE_OPTIONS: readonly SelectOption[] =
  Object.values(JournalType).map((value) => ({ value, label: JOURNAL_TYPE_LABEL[value] }));

/** Branch dropdown is currently a static two-entry list (to be wired to an API later). */
export const BRANCH_OPTIONS: readonly SelectOption[] = [
  { value: 1, label: 'شعبه مرکزی' },
  { value: 2, label: 'شعبه شهرک غرب' },
];

export interface JournalItem {
  /** Present on items returned by the server; omitted (or ignored) on create. */
  journalItemId?: string;
  accountId: string;
  /** Returned by the server on read so the UI needs no per-row account lookup; ignored on save. */
  accountName?: string;
  credit: number;
  debit: number;
  sequence: number;
  description: string;
}

export interface Journal {
  id: string;
  number: number;
  date: string;
  branchId: number;
  state: number;
  type: number;
  description: string;
  credit: number;
  debit: number;
  items: JournalItem[];
  /** Set by the server once the journal is finalised (posted). */
  postedNumber?: number | null;
  postedByUser?: string | null;
  /** ISO date-time of the finalisation. */
  postedDate?: string | null;
}

export interface PagedJournals {
  totalCount: number | string;
  items: Journal[];
}

/** Create / update share one request body (the API is POST for create, PATCH for edit). */
export interface SaveJournalRequest {
  date: string;
  branchId: number;
  type: number;
  description: string;
  items: JournalItem[];
}
