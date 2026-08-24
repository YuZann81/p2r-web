import { getApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import type { ApiResponse } from "@/lib/api/types/api-response";

export { ApiError } from "@/lib/api/errors";

export type ApiRequestOptions = {
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  token?: string | null;
  revalidate?: number | false;
  cache?: RequestCache;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 8000;

function buildApiUrl(
  path: string,
  searchParams?: ApiRequestOptions["searchParams"],
): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(`${base}/${cleanPath}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function buildHeaders(
  options: ApiRequestOptions,
  hasBody = false,
): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers,
  };

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token.trim()}`;
  }

  return headers;
}

async function safeParseResponse<T>(response: Response): Promise<{
  payload: ApiResponse<T> | null;
  text: string;
}> {
  let text = "";

  if (typeof response.text === "function") {
    try {
      text = await response.text();
    } catch {
      text = "";
    }
  }

  if (text && text.trim().length > 0) {
    try {
      const json = JSON.parse(text) as ApiResponse<T>;
      return { payload: json, text };
    } catch {
      return { payload: null, text };
    }
  }

  // Fallback to response.json() if text() was not provided or empty
  if (typeof response.json === "function") {
    try {
      const json = (await response.json()) as ApiResponse<T>;
      return { payload: json, text: JSON.stringify(json) };
    } catch {
      return { payload: null, text: "" };
    }
  }

  return { payload: null, text: "" };
}

async function executeRequest<T>(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  if (typeof timeoutId.unref === "function") {
    timeoutId.unref();
  }

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    const { payload, text } = await safeParseResponse<T>(response);

    if (!response.ok || (payload && payload.success === false)) {
      const errorMessage =
        payload?.message ||
        (response.status === 401
          ? "Sesi otentikasi tidak valid atau telah berakhir."
          : response.status === 403
            ? "Anda tidak memiliki izin untuk mengakses sumber daya ini."
            : response.status === 404
              ? "Data atau endpoint tidak ditemukan."
              : response.status === 422
                ? payload?.message || "Data yang dikirimkan tidak valid."
                : response.status >= 500
                  ? "Server sedang mengalami gangguan. Silakan coba lagi nanti."
                  : `Permintaan API gagal dengan status ${response.status}`);

      console.error(
        `[p2r-api] ${init.method || "GET"} ${url} failed (${response.status}):`,
        errorMessage,
      );

      throw new ApiError(errorMessage, {
        status: response.status,
        data: payload?.data ?? null,
      });
    }

    if (payload) {
      return payload;
    }

    // If HTTP 200/204 but empty body or non-JSON success
    return {
      success: true,
      message: response.statusText || "Success",
      data: (text as unknown) as T,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      const timeoutMsg = `Permintaan ke server memakan waktu terlalu lama (timeout ${timeoutMs}ms).`;
      console.error(`[p2r-api] Timeout on ${init.method || "GET"} ${url}`);
      throw new ApiError(timeoutMsg, { isTimeout: true });
    }

    const networkMsg =
      error instanceof Error ? error.message : "Gagal terhubung ke server API.";
    console.error(`[p2r-api] Network error on ${init.method || "GET"} ${url}:`, networkMsg);
    throw new ApiError(networkMsg, { isNetworkError: true });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiGet<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(path, options.searchParams);
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const init: RequestInit = {
    method: "GET",
    headers: buildHeaders(options, false),
  };

  if (options.cache) {
    init.cache = options.cache;
  }

  if (options.revalidate !== undefined && options.revalidate !== false) {
    (init as Record<string, unknown>).next = { revalidate: options.revalidate };
  }

  return executeRequest<T>(url, init, timeoutMs);
}

export async function apiPost<T, B = unknown>(
  path: string,
  body: B,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(path, options.searchParams);
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const init: RequestInit = {
    method: "POST",
    headers: buildHeaders(options, true),
    body: JSON.stringify(body),
  };

  if (options.cache) {
    init.cache = options.cache;
  }

  return executeRequest<T>(url, init, timeoutMs);
}

export async function apiPut<T, B = unknown>(
  path: string,
  body: B,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(path, options.searchParams);
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const init: RequestInit = {
    method: "PUT",
    headers: buildHeaders(options, true),
    body: JSON.stringify(body),
  };

  if (options.cache) {
    init.cache = options.cache;
  }

  return executeRequest<T>(url, init, timeoutMs);
}

export async function apiPatch<T, B = unknown>(
  path: string,
  body: B,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(path, options.searchParams);
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const init: RequestInit = {
    method: "PATCH",
    headers: buildHeaders(options, true),
    body: JSON.stringify(body),
  };

  if (options.cache) {
    init.cache = options.cache;
  }

  return executeRequest<T>(url, init, timeoutMs);
}

export async function apiDelete<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(path, options.searchParams);
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const init: RequestInit = {
    method: "DELETE",
    headers: buildHeaders(options, false),
  };

  if (options.cache) {
    init.cache = options.cache;
  }

  return executeRequest<T>(url, init, timeoutMs);
}

export async function apiPostFormData<T>(
  path: string,
  formData: FormData,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildApiUrl(path, options.searchParams);
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers,
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token.trim()}`;
  }

  const init: RequestInit = {
    method: "POST",
    headers,
    body: formData,
  };

  return executeRequest<T>(url, init, timeoutMs);
}
