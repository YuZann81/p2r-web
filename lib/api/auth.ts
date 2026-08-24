import { apiGet, apiPost, apiPut } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types/api-response";
import type {
  AuthResponseData,
  LoginCredentials,
  ProfileUpdateData,
  RegisterData,
  User,
} from "@/lib/api/types/auth";

export type {
  AuthResponseData,
  LoginCredentials,
  ProfileUpdateData,
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

export async function registerUser(
  data: RegisterData,
): Promise<ApiResponse<AuthResponseData>> {
  return apiPost<AuthResponseData, RegisterData>("/auth/register", data);
}

export async function getCurrentUser(token: string): Promise<ApiResponse<User>> {
  return apiGet<User>("/auth/me", { token });
}

export async function updateUserProfile(
  data: ProfileUpdateData,
  token: string,
): Promise<ApiResponse<User>> {
  return apiPut<User, ProfileUpdateData>("/auth/profile", data, { token });
}

export async function logoutUser(token: string): Promise<ApiResponse<null>> {
  return apiPost<null, Record<string, never>>("/auth/logout", {}, { token });
}
