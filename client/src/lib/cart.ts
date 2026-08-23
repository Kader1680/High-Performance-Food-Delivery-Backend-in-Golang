import { api } from "./api";

export type CartItem = {
  id: number;
  cart_id: number;
  menu_id: number;
  quantity: number;
  amount: number;
  subtotal: number;
};

export type Cart = {
  id: number;
  user_id: number;
  total_amount: number;
  items: CartItem[] | null;
};

export const cartApi = {
  get: () => api.get<{ data: Cart }>("/api/cart"),

  addItem: (menu_id: number, quantity: number) =>
    api.post<{ message: string }>("/api/cart/items", { menu_id, quantity }),

  updateItem: (itemID: number, quantity: number) =>
    api.put<{ message: string }>(`/api/cart/items/${itemID}`, { quantity }),

  removeItem: (itemID: number) =>
    api.delete<{ message: string }>(`/api/cart/items/${itemID}`),
};
