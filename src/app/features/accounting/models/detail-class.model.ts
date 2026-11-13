import { NormalBalance } from './normal-balance.model';

export interface DetailClass {
  id: string;
  name: string;
  detailClassCode: string;
  normalBalance: NormalBalance;
}

export interface CreateDetailClassRequest {
  name: string;
  detailClassCode: string;
  normalBalance: NormalBalance;
}
