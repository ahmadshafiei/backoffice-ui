import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { Account, AccountLevel, NORMAL_BALANCE_LABEL } from '../../accounting.model';
import { AccountFormModal } from '../../components/account-form-modal';
import { AccountListBase } from '../../components/account-list-base';

@Component({
  selector: 'app-subsidiary-accounts',
  imports: [PageHeader, SearchBox, Icon, DataTable, TableCell, TableRowActions, AccountFormModal, ConfirmDialog, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subsidiary-accounts.html',
  styleUrl: '../../components/list-page.css',
})
export class SubsidiaryAccounts extends AccountListBase {
  protected readonly level = AccountLevel.Subsidiary;
  protected readonly balanceLabel = NORMAL_BALANCE_LABEL;
  protected readonly columns: TableColumn<Account>[] = [
    { key: 'accountCode', header: 'کد', width: '120px' },
    { key: 'name', header: 'نام' },
    { key: 'parentId', header: 'نام حساب کل' },
    { key: 'normalBalance', header: 'ماهیت', width: '130px' },
    { key: 'isActive', header: 'وضعیت', width: '120px' },
    { key: 'isDetailAllowed', header: 'تفصیل‌پذیر', width: '120px' },
  ];
}
