export interface IClient {
  uuid: string;
  seqid: number;
  name: string;
  salary: number | string;
  companyValue: number | string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deleted?: boolean;
  views: number;
}

export interface IClientFilters {
  name?: string;
  minSalary?: number;
  maxSalary?: number;
}
