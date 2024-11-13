export interface IPaginationResult<T> {
  data: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface APISuccessResponse {
    success: boolean;
    message: string;
    data: string | object | number | boolean;
}

export interface APIErrorResponse {
    success: boolean;
    message: string;
    error: string | object;
}

export interface IQuery {
    [key: string]: any;
}