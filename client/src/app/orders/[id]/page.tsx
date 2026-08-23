"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ordersApi, OrderDetail, OrderStatus, ORDER_STATUSES } from "@/lib/orders";
import { ApiError } from "@/lib/api";

export default function OrderShowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    ordersApi
      .getById(id)
      .then((res) => setOrder(res.data))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load order")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (status: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      await ordersApi.updateStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this order? This can't be undone.")) return;
    setDeleting(true);
    try {
      await ordersApi.remove(id);
      router.push("/orders");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete order");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-muted">Loading…</p>;
  }

  if (error || !order) {
    return (
      <p className="mx-auto max-w-3xl px-5 py-16 text-chili">
        {error || "Order not found"}
      </p>
    );
  }

  const items = order.items ?? [];

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/orders" className="text-sm text-muted hover:text-chili">
        ← Back to orders
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            {order.code_order}
          </h1>
          <p className="text-sm text-muted mt-2">{order.address}</p>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-full border border-chili text-chili text-sm font-medium hover:bg-chili hover:text-white transition-colors disabled:opacity-60 shrink-0"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium text-ink/80">Status</label>
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          disabled={updatingStatus}
          className="rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-chili transition-colors bg-white capitalize disabled:opacity-60"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="ticket-divider my-8" />

      <h2 className="font-medium text-ink mb-4">Items</h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted">
          No items on this order.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-line border border-line rounded-2xl overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between text-sm">
              <span className="text-ink">Menu item #{item.menu_id}</span>
              <span className="text-muted">${item.unit_price.toFixed(2)} each</span>
              <span className="font-medium text-ink">${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 mt-8 pt-6 border-t border-line text-sm">
        <div className="flex justify-between text-muted">
          <span>Delivery fee</span>
          <span>${order.delivery_fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-medium text-ink mt-1">
          <span>Total</span>
          <span className="font-display font-semibold text-chili">
            ${order.total_amount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
