"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ordersApi, Order, OrderStatus } from "@/lib/orders";
import { ApiError } from "@/lib/api";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-line text-muted",
  accepted: "bg-herb/10 text-herb",
  preparing: "bg-herb/10 text-herb",
  ready: "bg-herb/10 text-herb",
  delivering: "bg-chili/10 text-chili",
  delivered: "bg-herb/10 text-herb",
  cancelled: "bg-chili/10 text-chili",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersApi
      .getAll()
      .then((res) => setOrders(res.data ?? []))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load orders")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        Orders
      </h1>

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-chili">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-muted">No orders yet.</p>
      )}

      <div className="flex flex-col divide-y divide-line border border-line rounded-2xl overflow-hidden">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="p-5 flex items-center justify-between hover:bg-line/20 transition-colors"
          >
            <div>
              <p className="font-medium text-ink">{order.code_order}</p>
              <p className="text-sm text-muted mt-1">{order.address}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>
              <span className="font-semibold text-ink">
                ${order.total_amount.toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
