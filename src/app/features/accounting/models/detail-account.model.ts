export interface DetailAccount {
  id: string;
  /** The detail account's own name (the API calls it `accountName`). */
  accountName: string;
  accountCode: string;
  isActive: boolean;
  canBeUsedAsParty: boolean;
  detailClassId: string;
}

export interface RegisterDetailAccountRequest {
  name: string;
  accountCode: string;
  detailClassId: string;
  isActive: boolean;
  canBeUsedAsParty: boolean;
}

/** The code is fixed after creation, so it is not part of the modify request. */
export interface ModifyDetailAccountRequest {
  name: string;
  detailClassId: string;
  isActive: boolean;
  canBeUsedAsParty: boolean;
}
