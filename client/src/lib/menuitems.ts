import { api } from "./api";

// NOTE: matches the backend's actual (untagged) JSON output — PascalCase,
// since GetAll/FindByID/Update return the raw MenuItem struct, not
// MenuItemResponse. Update this if you add json tags on the backend.
export type MenuItem = {
  ID: number;
  Title: string;
  Description: string;
  Status: "active" | "inactive";
  Price: number;
  Image: string;
  CategoryID: number;
  Stock: number;
  Availability: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

export type CreateMenuItemInput = {
  title: string;
  description?: string;
  price: number;
  image?: string;
  category_id: number;
  stock: number;
  availability: boolean;
};

export type UpdateMenuItemInput = {
  title: string;
  description?: string;
  status: MenuItem["Status"];
  price: number;
  image?: string;
  stock: number;
  availability: boolean;
};

export const menuItemsApi = {
  getAll: () => api.get<{ data: MenuItem[] }>("/api/menuitems"),

  getById: (id: number | string) =>
    api.get<{ data: MenuItem }>(`/api/menuitems/${id}`),

  create: (input: CreateMenuItemInput) =>
    api.post<{ message: string }>("/api/menuitems", input),

  update: (id: number | string, input: UpdateMenuItemInput) =>
    api.put<{ message: string; data: MenuItem }>(
      `/api/menuitems/${id}`,
      input
    ),

  remove: (id: number | string) =>
    api.delete<{ message: string }>(`/api/menuitems/${id}`),
};
