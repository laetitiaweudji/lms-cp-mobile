export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Matches the API's uniform list shape: { <itemsKey>: T[], total, page, pageSize }. */
export type Paginated<T, ItemsKey extends string> = {
  total: number;
  page: number;
  pageSize: number;
} & Record<ItemsKey, T[]>;
