import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { ACCOUNT_TYPE_LABEL, Account, AccountLevel } from '../../models/account.model';
import { NORMAL_BALANCE_LABEL } from '../../models/normal-balance.model';
import { AccountFormModal } from '../../components/accounts/account-form-modal';
import { AccountListBase } from '../../components/accounts/account-list-base';

@Component({
  selector: 'app-general-accounts',
  imports: [PageHeader, Icon, DataTable, TableCell, TableRowActions, AccountFormModal, ConfirmDialog, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './general-accounts.html',
  styleUrl: '../../components/accounts/list-page.css',
})
export class GeneralAccounts extends AccountListBase {
  protected readonly level = AccountLevel.General;
  protected readonly typeLabel = ACCOUNT_TYPE_LABEL;
  protected readonly balanceLabel = NORMAL_BALANCE_LABEL;
  protected readonly columns: TableColumn<Account>[] = [
    { key: 'accountCode', header: 'کد', width: '120px' },
    { key: 'name', header: 'نام' },
    { key: 'parentId', header: 'گروه حساب' },
    { key: 'accountType', header: 'نوع حساب', width: '140px' },
    { key: 'normalBalance', header: 'ماهیت', width: '130px' },
    { key: 'isActive', header: 'وضعیت', width: '120px' },
  ];
}
