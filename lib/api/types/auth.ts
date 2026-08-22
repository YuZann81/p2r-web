export type User = {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
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
