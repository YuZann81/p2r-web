export type UserRole = "admin" | "customer" | "user";

export type UserType = "siswa" | "guru" | "umum";

export type User = {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  user_type?: UserType | string | null;
  class_grade?: string | null;
  major?: string | null;
  teacher_role?: string | null;
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
  user_type?: string;
  class_grade?: string;
  major?: string;
  teacher_role?: string;
};

export type ProfileUpdateData = {
  name?: string;
  phone?: string;
  user_type?: string;
  class_grade?: string;
  major?: string;
  teacher_role?: string;
};
