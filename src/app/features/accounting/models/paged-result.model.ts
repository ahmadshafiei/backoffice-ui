/** Server paging envelope returned by the projection endpoints. */
export interface PagedResult<T> {
  totalCount: number | string;
  items: T[];
}

/** `pageSize` value that asks the API for every row in one page. */
export const PAGE_SIZE_ALL = -1;
