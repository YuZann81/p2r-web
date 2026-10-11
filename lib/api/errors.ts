export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;
  readonly isTimeout: boolean;
  readonly isNetworkError: boolean;
  readonly code?: string;

  constructor(
    message: string,
    options: {
      status?: number;
      data?: unknown;
      isTimeout?: boolean;
      isNetworkError?: boolean;
      code?: string;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 0;
    this.data = options.data;
    this.isTimeout = options.isTimeout ?? false;
    this.isNetworkError = options.isNetworkError ?? false;
    this.code = options.code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
