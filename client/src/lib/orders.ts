import { api } from "./api";

// Order/OrderItem have proper json tags on the backend, so these match
// the actual API output (snake_case).
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: number;
  order_id: number;
  menu_id: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: number;
  code_order: string;
  user_id: number;
  cart_id: number | null;
  status: OrderStatus;
  address: string;
  delivery_fee: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type OrderDetail = Order & {
  items: OrderItem[] | null;
};

export type CreateOrderInput = {
  address: string;
  delivery_fee?: number;
};

export const ordersApi = {
  getAll: () => api.get<{ data: Order[] }>("/api/orders"),

  getById: (id: number | string) =>
    api.get<{ data: OrderDetail }>(`/api/orders/${id}`),

  create: (input: CreateOrderInput) =>
    api.post<{ message: string; data: Order }>("/api/orders", input),

  updateStatus: (id: number | string, status: OrderStatus) =>
    api.put<{ message: string; data: Order }>(`/api/orders/${id}/status`, {
      status,
    }),

  remove: (id: number | string) =>
    api.delete<{ message: string }>(`/api/orders/${id}`),
};

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "delivering",
  "delivered",
  "cancelled",
];
