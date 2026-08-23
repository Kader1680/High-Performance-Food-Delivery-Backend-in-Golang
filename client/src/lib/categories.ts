import { api } from "./api";

// NOTE: matches the backend's actual (untagged) JSON output — PascalCase,
// since GetAll returns the raw Category struct, not CategoryResponse.
export type Category = {
  ID: number;
  RestaurantID: number;
  Title: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export type CreateCategoryInput = {
  title: string;
  description?: string;
  restaurant_id: number;
};

export const categoriesApi = {
  // NOTE: this route is /categories/ (no /api prefix, trailing slash) —
  // unlike every other resource in this app. Also returns a bare array,
  // not { data: [...] }.
  getAll: () => api.get<Category[]>("/categories/"),

  create: (input: CreateCategoryInput) =>
    api.post<{ message: string }>("/categories/", input),
};
