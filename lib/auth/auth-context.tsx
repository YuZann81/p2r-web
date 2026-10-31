"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ApiError } from "@/lib/api/client";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/api/auth";
import type {
  LoginCredentials,
  RegisterData,
  User,
} from "@/lib/api/types/auth";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "p2r_auth_token";
const USER_KEY = "p2r_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrates the session from localStorage after mount. Reading storage cannot
  // happen during render without breaking SSR hydration, so the state update is
  // intentionally performed inside this effect.
  /* eslint-disable react-hooks/set-state-in-effect */
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
            if (err instanceof ApiError && err.status === 401) {
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
  /* eslint-enable react-hooks/set-state-in-effect */

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

      return { success: true, message: res.message };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mendaftar. Silakan coba lagi.";
      return { success: false, message };
    }
  }, []);

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
  logout: async () => {},
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
