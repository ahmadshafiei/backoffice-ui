import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { Journal } from '../../models/journal.model';
import { AccountService } from '../../services/account.service';
import { JournalService } from '../../services/journal.service';
import { JOURNAL_VALIDATION_MESSAGES } from '../../utils/journal.utils';
import { JournalEditPage } from './journal-edit';

function makeJournal(overrides: Partial<Journal> = {}): Journal {
  return {
    id: 'journal-1',
    number: 1,
    date: '2026-11-10',
    branchId: 1,
    state: 1,
    type: 1,
    description: 'test',
    debit: 100,
    credit: 100,
    items: [
      { accountId: 'account-1', debit: 100, credit: 0, sequence: 1, description: '' },
      { accountId: 'account-2', debit: 0, credit: 100, sequence: 2, description: '' },
    ],
    ...overrides,
  };
}

function setup(id: string | null, journal: Journal = makeJournal()) {
  const service = {
    get: vi.fn(() => of(journal)),
    create: vi.fn(() => of(undefined)),
    update: vi.fn(() => of(undefined)),
    list: vi.fn(),
  };
  const accountService = { get: vi.fn(() => of({ accountCode: '0', name: 'x' })), searchPostable: vi.fn(() => of({ items: [] })) };
  const notify = { success: vi.fn(), error: vi.fn(), info: vi.fn() };
  const router = { navigate: vi.fn(() => Promise.resolve(true)) };

  TestBed.configureTestingModule({
    providers: [
      { provide: JournalService, useValue: service },
      { provide: AccountService, useValue: accountService },
      { provide: NotificationApi, useValue: notify },
      { provide: Router, useValue: router },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } },
      },
    ],
  });

  return { fixture: TestBed.createComponent(JournalEditPage), service, accountService, notify, router };
}

async function settle(fixture: ReturnType<typeof TestBed.createComponent<JournalEditPage>>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('JournalEditPage', () => {
  it('opens a posted journal read-only and blocks saving', async () => {
    const { fixture, service } = setup('journal-1', makeJournal({ state: 2 }));
    await settle(fixture);

    const page = fixture.componentInstance as any;
    expect(page.readOnly()).toBe(true);
    expect(page.header.disabled).toBe(true);
    expect(page.items.disabled).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('.readonly-banner')).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.btn-primary')).toBeNull();

    await page.save();
    expect(service.update).not.toHaveBeenCalled();
  });

  it('keeps a draft journal editable', async () => {
    const { fixture } = setup('journal-1');
    await settle(fixture);

    const page = fixture.componentInstance as any;
    expect(page.readOnly()).toBe(false);
    expect(page.header.disabled).toBe(false);
    expect(page.items.disabled).toBe(false);
  });

  it('always keeps exactly one side of a row populated and rejects negative input', async () => {
    const { fixture } = setup(null);
    await settle(fixture);

    const page = fixture.componentInstance as any;
    const [first] = page.items.controls;

    first.controls.debit.setValue(120);
    expect(first.controls.credit.value).toBeNull();

    first.controls.credit.setValue(80);
    expect(first.controls.debit.value).toBeNull();

    first.controls.debit.setValue(-5);
    expect(first.controls.debit.value).toBe(0);
  });

  it('blocks saving an unbalanced journal', async () => {
    const { fixture, service, notify } = setup(null);
    await settle(fixture);

    const page = fixture.componentInstance as any;
    page.header.setValue({ date: '2026-11-10', branchId: 1, type: 1, description: '' });
    const [debitRow, creditRow] = page.items.controls;
    debitRow.controls.accountId.setValue('account-1');
    debitRow.controls.debit.setValue(100);
    creditRow.controls.accountId.setValue('account-2');
    creditRow.controls.credit.setValue(90);

    await page.save();

    expect(notify.error).toHaveBeenCalledWith(JOURNAL_VALIDATION_MESSAGES.unbalanced);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('returns zero for an empty side when saving a balanced journal', async () => {
    const { fixture, service, router } = setup(null);
    await settle(fixture);

    const page = fixture.componentInstance as any;
    page.header.setValue({ date: '2026-11-10', branchId: 1, type: 1, description: '  ' });
    const [debitRow, creditRow] = page.items.controls;
    debitRow.controls.accountId.setValue('account-1');
    debitRow.controls.debit.setValue(100);
    creditRow.controls.accountId.setValue('account-2');
    creditRow.controls.credit.setValue(100);

    await page.save();

    expect(service.create).toHaveBeenCalledWith({
      date: '2026-11-10',
      branchId: 1,
      type: 1,
      description: '',
      items: [
        { accountId: 'account-1', debit: 100, credit: 0, sequence: 1, description: '' },
        { accountId: 'account-2', debit: 0, credit: 100, sequence: 2, description: '' },
      ],
    });
    expect(router.navigate).toHaveBeenCalledWith(['/accounting/journals']);
  });

  it('shows rows ordered by sequence and takes account names from the journal without extra requests', async () => {
    const { fixture, accountService } = setup('journal-1', makeJournal({
      items: [
        { accountId: 'account-2', accountName: '2000 - B', debit: 0, credit: 100, sequence: 2, description: '' },
        { accountId: 'account-1', accountName: '1000 - A', debit: 100, credit: 0, sequence: 1, description: '' },
      ],
    }));
    await settle(fixture);

    const page = fixture.componentInstance as any;
    expect(page.items.controls.map((group: any) => group.controls.accountId.value)).toEqual(['account-1', 'account-2']);
    let label = '';
    page.resolveAccountLabel('account-1').subscribe((value: string) => (label = value));
    expect(label).toBe('1000 - A');
    expect(accountService.get).not.toHaveBeenCalled();
  });
});