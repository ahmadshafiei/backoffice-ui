import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AccountingApi } from './accounting-api';
import { Account } from './accounting.model';

const account = (n: number): Account => ({
  id: `id-${n}`, name: `حساب ${n}`, accountCode: String(n), accountType: 0, accountLevel: 0,
  normalBalance: null, isActive: true, isPostable: false, isDetailAllowed: false, parentId: null,
});

describe('AccountingApi.listAllAccounts', () => {
  let http: HttpTestingController;
  let api: AccountingApi;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    api = TestBed.inject(AccountingApi);
  });

  afterEach(() => http.verify());

  it('walks every page until totalCount is reached', () => {
    let result: Account[] = [];
    api.listAllAccounts(2).subscribe((all) => (result = all));

    http.expectOne((r) => r.params.get('PageNumber') === '1' && r.params.get('PageSize') === '2')
      .flush({ totalCount: 5, items: [account(1), account(2)] });
    http.expectOne((r) => r.params.get('PageNumber') === '2').flush({ totalCount: 5, items: [account(3), account(4)] });
    http.expectOne((r) => r.params.get('PageNumber') === '3').flush({ totalCount: 5, items: [account(5)] });

    expect(result.map((a) => a.accountCode)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('makes a single request when everything fits on one page', () => {
    let result: Account[] = [];
    api.listAllAccounts(200).subscribe((all) => (result = all));
    http.expectOne(() => true).flush({ totalCount: '1', items: [account(1)] }); // totalCount may arrive as a string
    expect(result).toHaveLength(1);
  });

  it('returns an empty list for an empty chart of accounts', () => {
    let result: Account[] | null = null;
    api.listAllAccounts().subscribe((all) => (result = all));
    http.expectOne(() => true).flush({ totalCount: 0, items: [] });
    expect(result).toEqual([]);
  });
});
