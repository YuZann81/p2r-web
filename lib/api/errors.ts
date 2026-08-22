export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;
  readonly isTimeout: boolean;
  readonly isNetworkError: boolean;

  constructor(
    message: string,
    options: {
      status?: number;
      data?: unknown;
      isTimeout?: boolean;
      isNetworkError?: boolean;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 0;
    this.data = options.data;
    this.isTimeout = options.isTimeout ?? false;
    this.isNetworkError = options.isNetworkError ?? false;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
