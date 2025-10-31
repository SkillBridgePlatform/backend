import { SortDirection } from './enums';

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface SortOptions {
  sortBy?: string;
  sortDirection?: SortDirection;
}
