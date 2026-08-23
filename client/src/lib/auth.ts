import { api } from "./api";

export type Me = {
  user_id: number;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const authApi = {
  register: (input: RegisterInput) =>
    api.post<{ message: string }>("/api/auth/register", input),

  login: (input: LoginInput) =>
    api.post<{ message: string }>("/api/auth/login", input),

  me: () => api.get<Me>("/api/users/me"),

  // Requires POST /api/auth/logout on the backend (see note below) —
  // an httpOnly cookie cannot be cleared from JS, only the server can do it.
  logout: () => api.post<{ message: string }>("/api/auth/logout"),
};
