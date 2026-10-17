"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/orders";
import { ApiError } from "@/lib/api";
import { cartApi } from "@/lib/cart";

export default function NewOrderPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [cartTotalAmount, setCartTotalAmount] = useState<number | null>(null);
  const [cartIsEmpty, setCartIsEmpty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cartApi
      .get()
      .then(({ data }) => {
        setCartTotalAmount(data.total_amount);
        setCartIsEmpty(!data.items?.length);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError ? err.message : "Failed to load your cart"
        );
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (cartTotalAmount === null || cartIsEmpty) return;

    setError(null);
    setSubmitting(true);
    try {
      const fee = Number(deliveryFee) || 0;
      const res = await ordersApi.create({
        address,
        delivery_fee: fee,
        total_amount: cartTotalAmount + fee,
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

        {cartTotalAmount !== null && !cartIsEmpty && (
          <div className="rounded-lg bg-line/30 p-4 text-sm">
            <div className="flex justify-between">
              <span>Cart subtotal</span>
              <span>${cartTotalAmount.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Total</span>
              <span>
                $
                {(
                  cartTotalAmount +
                  (Number(deliveryFee) || 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {cartIsEmpty && (
          <p className="text-sm text-chili">
            Your cart is empty. Add items before placing an order.
          </p>
        )}

        {error && <p className="text-sm text-chili">{error}</p>}

        <button
          type="submit"
          disabled={submitting || cartTotalAmount === null || cartIsEmpty}
          className="mt-2 rounded-full bg-chili text-white font-medium py-3 hover:bg-chili/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
