"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export function PayButton({ orderId, amountCents }: { orderId: number | string; amountCents: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<{ checkout_url: string }>(
        `/api/orders/${orderId}/create-checkout-url/`,
        { amount: amountCents },
      );
      if (!data.checkout_url) {
        throw new Error("Checkout response did not include a checkout URL");
      }
      window.location.href = data.checkout_url; // redirect to Stripe
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handlePay} disabled={loading} className="...">
        {loading ? "Redirecting…" : "Pay now"}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-chili">{error}</p>}
    </>
  );
}