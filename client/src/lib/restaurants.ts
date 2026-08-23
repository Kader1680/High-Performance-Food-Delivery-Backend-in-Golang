import { api } from "./api";

// NOTE: matches the backend's actual (untagged) JSON output — PascalCase,
// since GetAll/FindByID/Update return the raw Restaurant struct, not
// RestaurantResponse. Update this if you add json tags on the backend.
export type Restaurant = {
  ID: number;
  OwnerID: number;
  Name: string;
  Description: string;
  Phone: string;
  Address: string;
  Status: "active" | "inactive" | "suspended" | "closed";
  IsOpen: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

export type CreateRestaurantInput = {
  name: string;
  description?: string;
  phone: string;
  address: string;
};

export type UpdateRestaurantInput = {
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  status?: Restaurant["Status"];
  is_open?: boolean;
};

export const restaurantsApi = {
  getAll: () => api.get<{ data: Restaurant[] }>("/api/restaurants"),

  getById: (id: number | string) =>
    api.get<{ data: Restaurant }>(`/api/restaurants/${id}`),

  create: (input: CreateRestaurantInput) =>
    api.post<{ message: string }>("/api/restaurants", input),

  update: (id: number | string, input: UpdateRestaurantInput) =>
    api.put<{ message: string; data: Restaurant }>(
      `/api/restaurants/${id}`,
      input
    ),

  remove: (id: number | string) =>
    api.delete<{ message: string }>(`/api/restaurants/${id}`),
};
