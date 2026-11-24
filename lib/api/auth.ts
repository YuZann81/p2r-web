import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types/api-response";
import type {
  AuthResponseData,
  LoginCredentials,
  RegisterData,
  User,
} from "@/lib/api/types/auth";

export type {
  AuthResponseData,
  LoginCredentials,
  RegisterData,
  User,
} from "@/lib/api/types/auth";

export async function loginUser(
  credentials: LoginCredentials,
): Promise<ApiResponse<AuthResponseData>> {
  return apiPost<AuthResponseData, LoginCredentials>(
    "/auth/login",
    credentials,
  );
}

/**
 * Public self-registration (`/auth/register`) is not available on the
 * production API — participant accounts are provisioned by the committee
 * at the exhibition booth.
 */
export async function registerUser(
  _data: RegisterData,
): Promise<ApiResponse<AuthResponseData>> {
  void _data;
  return {
    success: false,
    message:
      "Pendaftaran akun dilakukan langsung melalui panitia di booth pameran.",
    data: null as unknown as AuthResponseData,
  };
}

export async function getCurrentUser(token: string): Promise<ApiResponse<User>> {
  return apiGet<User>("/auth/me", { token });
}

export async function logoutUser(token: string): Promise<ApiResponse<null>> {
  return apiPost<null, Record<string, never>>("/auth/logout", {}, { token });
}
