import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
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
      { subsidiaryAccountId: 'account-1', debit: 100, credit: 0, sequence: 1, description: '' },
      { subsidiaryAccountId: 'account-2', debit: 0, credit: 100, sequence: 2, description: '' },
    ],
    ...overrides,
  };
}

function setup(id: string | null, journal: Journal = makeJournal()) {
  const service = {
    get: vi.fn(() => of(journal)),
    create: vi.fn(() => of(undefined)),
    update: vi.fn(() => of(undefined)),
    post: vi.fn(() => of(undefined)),
    list: vi.fn(),
  };
  const accountService = { get: vi.fn(() => of({ accountCode: '0', name: 'x' })), searchByLevel: vi.fn(() => of({ items: [] })) };
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
  // jsdom ships <dialog> without the modal methods the shared Modal component calls.
  beforeAll(() => {
    if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
      HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        this.open = true;
      };
      HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
        this.open = false;
        this.dispatchEvent(new Event('close'));
      };
    }
  });

  it('opens a posted journal read-only and blocks saving', async () => {
    const { fixture, service } = setup('journal-1', makeJournal({ state: 2 }));
    await settle(fixture);

    const page = fixture.componentInstance as any;
    expect(page.readOnly()).toBe(true);
    expect(page.header.disabled).toBe(true);
    expect(page.items.disabled).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('.readonly-banner')).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.post-btn')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.save-btn')).toBeNull();

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
    expect((fixture.nativeElement as HTMLElement).querySelector('.post-btn')).not.toBeNull();
  });

  it('asks for confirmation before posting a draft journal', async () => {
    const { fixture, service } = setup('journal-1');
    await settle(fixture);

    const page = fixture.componentInstance as any;
    page.askPost();
    fixture.detectChanges();

    expect(page.postOpen()).toBe(true);
    expect(service.post).not.toHaveBeenCalled();

    await page.confirmPost();
    fixture.detectChanges();

    expect(service.post).toHaveBeenCalledTimes(1);
    expect(service.post).toHaveBeenCalledWith('journal-1');
    expect(page.postOpen()).toBe(false);
  });

  it('turns the journal read-only after posting', async () => {
    const { fixture, notify, service } = setup('journal-1');
    await settle(fixture);
    service.get.mockReturnValue(of(makeJournal({
      state: 2,
      postedNumber: 7,
      postedByUser: 'admin',
      postedDate: '2026-11-20T10:30:00Z',
    })));

    const page = fixture.componentInstance as any;
    page.askPost();
    await page.confirmPost();
    fixture.detectChanges();

    expect(page.readOnly()).toBe(true);
    expect(page.isDraft()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('.post-btn')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.readonly-banner')).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.posted-info')).not.toBeNull();
    expect(service.get).toHaveBeenCalledTimes(2);
    expect(notify.success).toHaveBeenCalledWith('سند قطعی شد.');
  });

  it('does not post a journal that is not a draft', async () => {
    const { fixture, service } = setup('journal-1', makeJournal({ state: 2 }));
    await settle(fixture);

    const page = fixture.componentInstance as any;
    page.askPost();
    fixture.detectChanges();
    expect(page.postOpen()).toBe(false);

    await page.confirmPost();
    expect(service.post).not.toHaveBeenCalled();
  });

  it('keeps the journal as a draft when posting fails', async () => {
    const { fixture, service, notify } = setup('journal-1');
    await settle(fixture);
    service.post.mockReturnValueOnce(throwError(() => new Error('boom')));

    const page = fixture.componentInstance as any;
    page.askPost();
    await page.confirmPost();

    expect(page.isDraft()).toBe(true);
    expect(page.readOnly()).toBe(false);
    expect(page.postOpen()).toBe(true);
    expect(page.busy()).toBe(false);
    expect(notify.success).not.toHaveBeenCalled();
  });

  it('does not offer the post action on a new journal', async () => {
    const { fixture } = setup(null);
    await settle(fixture);

    expect((fixture.nativeElement as HTMLElement).querySelector('.post-btn')).toBeNull();
  });

  it('shows the finalisation details of a posted journal', async () => {
    const { fixture } = setup('journal-1', makeJournal({
      state: 2,
      postedNumber: 42,
      postedByUser: 'admin',
      postedDate: '2026-11-20T10:30:00Z',
    }));
    await settle(fixture);

    const info = (fixture.nativeElement as HTMLElement).querySelector('.posted-info');
    expect(info).not.toBeNull();
    expect(info!.textContent).toContain('۴۲');
    expect(info!.textContent).toContain('admin');
    expect(info!.textContent).toContain('۱۴۰۵/۰۸/۲۹');
  });

  it('does not show finalisation details for a draft journal', async () => {
    const { fixture } = setup('journal-1');
    await settle(fixture);

    expect((fixture.nativeElement as HTMLElement).querySelector('.posted-info')).toBeNull();
  });

  it('renders a dash for missing finalisation details', async () => {
    const { fixture } = setup('journal-1', makeJournal({ state: 2 }));
    await settle(fixture);

    const info = (fixture.nativeElement as HTMLElement).querySelector('.posted-info');
    expect(info).not.toBeNull();
    expect(info!.querySelectorAll('dd')).toHaveLength(3);
    for (const value of Array.from(info!.querySelectorAll('dd'))) expect(value.textContent?.trim()).toBe('—');
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
    debitRow.controls.subsidiaryAccountId.setValue('account-1');
    debitRow.controls.debit.setValue(100);
    creditRow.controls.subsidiaryAccountId.setValue('account-2');
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
    debitRow.controls.subsidiaryAccountId.setValue('account-1');
    debitRow.controls.debit.setValue(100);
    creditRow.controls.subsidiaryAccountId.setValue('account-2');
    creditRow.controls.credit.setValue(100);

    await page.save();

    expect(service.create).toHaveBeenCalledWith({
      date: '2026-11-10',
      branchId: 1,
      type: 1,
      description: '',
      items: [
        { subsidiaryAccountId: 'account-1', detailAccountId: null, debit: 100, credit: 0, sequence: 1, description: '' },
        { subsidiaryAccountId: 'account-2', detailAccountId: null, debit: 0, credit: 100, sequence: 2, description: '' },
      ],
    });
    expect(router.navigate).toHaveBeenCalledWith(['/accounting/journals']);
  });

  it('shows rows ordered by sequence and resolves account labels via the API', async () => {
    const { fixture, accountService } = setup('journal-1', makeJournal({
      items: [
        { subsidiaryAccountId: 'account-2', debit: 0, credit: 100, sequence: 2, description: '' },
        { subsidiaryAccountId: 'account-1', debit: 100, credit: 0, sequence: 1, description: '' },
      ],
    }));
    await settle(fixture);

    const page = fixture.componentInstance as any;
    expect(page.items.controls.map((group: any) => group.controls.subsidiaryAccountId.value)).toEqual(['account-1', 'account-2']);
    let label = '';
    page.resolveAccountLabel('account-1').subscribe((value: string) => (label = value));
    expect(label).toBe('0 - x');
    expect(accountService.get).toHaveBeenCalledWith('account-1');
  });

  it('groups debit and credit amounts three digits from the right', async () => {
    const { fixture } = setup('journal-1', makeJournal({
      items: [
        { subsidiaryAccountId: 'account-1', debit: 1234567, credit: 0, sequence: 1, description: '' },
        { subsidiaryAccountId: 'account-2', debit: 0, credit: 1234567.5, sequence: 2, description: '' },
      ],
    }));
    await settle(fixture);

    const amounts = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('table.items input.amount'),
    );
    expect(amounts[0].value).toBe('۱٬۲۳۴٬۵۶۷');
    expect(amounts[1].value).toBe('');
    expect(amounts[2].value).toBe('');
    expect(amounts[3].value).toBe('۱٬۲۳۴٬۵۶۷٫۵');
  });
});
