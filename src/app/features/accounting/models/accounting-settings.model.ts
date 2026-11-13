export interface AccountingSettings {
  groupAccountCodeLength: number;
  generalAccountLength: number;
  subsidiaryAccountLength: number;
  detailAccountLength: number;
  detailClassCodeLength: number;
}

export interface UpdateAccountingSettingsRequest {
  groupAccountLength: number;
  generalAccountLength: number;
  subsidiaryAccountLength: number;
  detailAccountLength: number;
  detailClassCodeLength: number;
}
