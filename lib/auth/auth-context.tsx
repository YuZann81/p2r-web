"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "@/lib/api/auth";
import type {
  LoginCredentials,
  ProfileUpdateData,
  RegisterData,
  User,
} from "@/lib/api/types/auth";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string; user?: User }>;
  updateProfile: (data: ProfileUpdateData) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "p2r_auth_token";
const USER_KEY = "p2r_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // ignore JSON parse error
          }
        }

        // Validate token with backend /auth/me in background
        getCurrentUser(storedToken)
          .then((res) => {
            if (res.data) {
              setUser(res.data);
              localStorage.setItem(USER_KEY, JSON.stringify(res.data));
            }
          })
          .catch((err) => {
            // Only clear token if explicitly rejected with 401 Unauthorized
            if (err && typeof err === "object" && "status" in err && err.status === 401) {
              setToken(null);
              setUser(null);
              try {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
              } catch {}
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
        return;
      }
    } catch {
      // localStorage may fail in SSR / restricted environments
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const res = await loginUser(credentials);
      const authToken = res.data?.token || res.data?.access_token || "";
      const authUser = res.data?.user || null;

      if (authToken) {
        setToken(authToken);
        try {
          localStorage.setItem(TOKEN_KEY, authToken);
        } catch {}
      }

      if (authUser) {
        setUser(authUser);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        } catch {}
      }

      return { success: true, message: res.message };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal masuk. Silakan coba lagi.";
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const res = await registerUser(data);
      const authToken = res.data?.token || res.data?.access_token || "";
      const authUser = res.data?.user || null;

      if (authToken) {
        setToken(authToken);
        try {
          localStorage.setItem(TOKEN_KEY, authToken);
        } catch {}
      }

      if (authUser) {
        setUser(authUser);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        } catch {}
      }

      return { success: true, message: res.message, user: authUser || undefined };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mendaftar. Silakan coba lagi.";
      return { success: false, message };
    }
  }, []);

  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      if (!token) {
        return { success: false, message: "Sesi tidak ditemukan. Silakan login kembali." };
      }
      try {
        const res = await updateUserProfile(data, token);
        const updatedUser = res.data;
        if (updatedUser) {
          setUser(updatedUser);
          try {
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
          } catch {}
        }
        return { success: true, message: res.message, user: updatedUser };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memperbarui profil.";
        return { success: false, message };
      }
    },
    [token],
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutUser(token);
      } catch {
        // silent fail on logout request
      }
    }
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("p2r_live_chat_history");
      localStorage.removeItem("p2r_live_chat_session_token");
      localStorage.removeItem("p2r_cart_items");
    } catch {}
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user || !!token,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  updateProfile: async () => ({ success: false }),
  logout: async () => {},
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
