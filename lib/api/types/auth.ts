export type WalletSummary = {
  id: string;
  balance: number;
};

export type User = {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  user_type?: string | null;
  class_grade?: string | null;
  major?: string | null;
  teacher_role?: string | null;
  wallet?: WalletSummary | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AuthResponseData = {
  user: User;
  token?: string;
  access_token?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};
