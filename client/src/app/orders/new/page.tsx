"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/orders";
import { ApiError } from "@/lib/api";

export default function NewOrderPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await ordersApi.create({
        address,
        delivery_fee: parseFloat(deliveryFee) || 0,
      });
      router.push(`/orders/${res.data.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Place an order
      </h1>
      <p className="text-sm text-muted mt-2">
        Note: this only records a delivery address and fee — it does not
        currently carry over your cart items. Ask your backend dev to wire
        cart→order item creation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Delivery address
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Delivery fee
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
          />
        </div>

        {error && <p className="text-sm text-chili">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-chili text-white font-medium py-3 hover:bg-chili/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
