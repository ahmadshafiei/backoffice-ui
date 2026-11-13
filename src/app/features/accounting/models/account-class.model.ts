export interface AccountClass {
  accountId: string;
  accountName: string;
  detailClassesId: string[];
}

export interface AssignAccountClassRequest {
  accountId: string;
  detailClassesId: string[];
}
