import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { ACCOUNT_TYPE_LABEL, Account, AccountLevel } from '../../accounting.model';
import { AccountFormModal } from '../../components/account-form-modal';
import { AccountListBase } from '../../components/account-list-base';

@Component({
  selector: 'app-group-accounts',
  imports: [PageHeader, SearchBox, Icon, DataTable, TableCell, TableRowActions, AccountFormModal, ConfirmDialog, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './group-accounts.html',
  styleUrl: '../../components/list-page.css',
})
export class GroupAccounts extends AccountListBase {
  protected readonly level = AccountLevel.Group;
  protected readonly typeLabel = ACCOUNT_TYPE_LABEL;
  protected readonly columns: TableColumn<Account>[] = [
    { key: 'accountCode', header: 'کد حساب', width: '140px' },
    { key: 'name', header: 'نام' },
    { key: 'isActive', header: 'وضعیت', width: '130px' },
    { key: 'accountType', header: 'نوع', width: '150px' },
  ];
}
