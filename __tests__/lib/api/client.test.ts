import { apiGet, apiPost, apiDelete, ApiError } from "@/lib/api/client";

// Save original global.fetch
const originalFetch = global.fetch;
// etch carries a static preconnect helper in the current lib definitions,
// which a bare jest.Mock does not implement. Route every mock assignment
// through this helper so the cast happens in exactly one place.
function mockFetch(): jest.Mock {
  const fn = jest.fn();
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe("API Client (Hardened Fetcher)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("performs GET request and parses JSON response successfully", async () => {
    const mockData = { id: 1, name: "Sample Item" };
    mockFetch().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValueOnce(
        JSON.stringify({ success: true, message: "OK", data: mockData }),
      ),
    });

    const result = await apiGet<typeof mockData>("/products", {
      searchParams: { limit: 5 },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products?limit=5"),
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
      }),
    );
    expect(result.data).toEqual(mockData);
  });

  it("attaches Authorization header only when token is provided", async () => {
    mockFetch().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValueOnce(
        JSON.stringify({ success: true, message: "OK", data: null }),
      ),
    });

    await apiGet("/auth/me", { token: "my-secret-token" });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-secret-token",
        }),
      }),
    );
  });

  it("performs POST request with JSON body and Content-Type header", async () => {
    const postBody = { email: "user@test.com", password: "123" };
    mockFetch().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValueOnce(
        JSON.stringify({
          success: true,
          message: "Login success",
          data: { token: "tok123" },
        }),
      ),
    });

    const result = await apiPost("/auth/login", postBody);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        body: JSON.stringify(postBody),
      }),
    );
    expect(result.success).toBe(true);
  });

  it("performs DELETE request correctly", async () => {
    mockFetch().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValueOnce(
        JSON.stringify({ success: true, message: "Deleted", data: null }),
      ),
    });

    const result = await apiDelete("/karyas/slug/vote", { token: "token-x" });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/karyas/slug/vote"),
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Bearer token-x",
        }),
      }),
    );
    expect(result.success).toBe(true);
  });

  it("throws ApiError with HTTP status when API returns error response", async () => {
    mockFetch().mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: jest.fn().mockResolvedValueOnce(
        JSON.stringify({
          success: false,
          message: "The email field is required.",
          data: null,
        }),
      ),
    });

    await expect(apiPost("/auth/login", {})).rejects.toThrow(ApiError);

    mockFetch().mockResolvedValueOnce({
      ok: false,
      status: 422,
      text: jest.fn().mockResolvedValueOnce(
        JSON.stringify({
          success: false,
          message: "The email field is required.",
          data: null,
        }),
      ),
    });

    try {
      await apiPost("/auth/login", {});
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(422);
      expect((err as ApiError).message).toBe("The email field is required.");
    }
  });

  it("gracefully handles HTML / non-JSON error pages without throwing syntax errors", async () => {
    mockFetch().mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      text: jest.fn().mockResolvedValueOnce("<html><body>502 Bad Gateway</body></html>"),
    });

    try {
      await apiGet("/products");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(502);
      expect((err as ApiError).message).toContain("Server sedang mengalami gangguan");
    }
  });

  it("handles request abort / timeout with typed ApiError", async () => {
    const abortError = new DOMException("The operation was aborted", "AbortError");
    mockFetch().mockRejectedValueOnce(abortError);

    try {
      await apiGet("/slow-endpoint", { timeoutMs: 100 });
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).isTimeout).toBe(true);
    }
  });
});
