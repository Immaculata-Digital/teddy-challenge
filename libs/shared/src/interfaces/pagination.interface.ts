export interface IPagination<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}
