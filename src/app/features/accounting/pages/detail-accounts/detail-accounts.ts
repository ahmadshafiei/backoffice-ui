import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { Account, AccountLevel } from '../../models/account.model';
import { AccountFormModal } from '../../components/accounts/account-form-modal';
import { AccountListBase } from '../../components/accounts/account-list-base';

@Component({
  selector: 'app-detail-accounts',
  imports: [PageHeader, Icon, DataTable, TableCell, TableRowActions, AccountFormModal,
    ConfirmDialog, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-accounts.html',
  styleUrl: '../../components/accounts/list-page.css',
})
export class DetailAccounts extends AccountListBase {
  protected readonly level = AccountLevel.Detail;
  protected readonly columns: TableColumn<Account>[] = [
    { key: 'accountCode', header: 'کد', width: '160px' },
    { key: 'name', header: 'نام' },
    { key: 'detailClassName', header: 'طبقه تفصیلی' },
    { key: 'canBeUsedAsParty', header: 'طرف حساب', width: '120px' },
    { key: 'isActive', header: 'وضعیت', width: '120px' },
  ];
}
