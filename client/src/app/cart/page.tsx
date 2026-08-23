"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { cartApi, Cart } from "@/lib/cart";
import { menuItemsApi, MenuItem } from "@/lib/menuitems";
import { ApiError } from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [menuById, setMenuById] = useState<Record<number, MenuItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await cartApi.get();
      setCart(res.data);

      // Cart items only carry menu_id — fetch each menu item so we can
      // show a title/image/price. No batch endpoint exists, so fetch
      // whichever ones we don't already have cached.
      const items = res.data.items ?? [];
      const missingIds = [...new Set(items.map((i) => i.menu_id))].filter(
        (id) => !(id in menuById)
      );

      if (missingIds.length > 0) {
        const fetched = await Promise.all(
          missingIds.map((id) =>
            menuItemsApi.getById(id).then((r) => r.data).catch(() => null)
          )
        );
        setMenuById((prev) => {
          const next = { ...prev };
          fetched.forEach((m) => {
            if (m) next[m.ID] = m;
          });
          return next;
        });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setPendingItemId(itemId);
    try {
      await cartApi.updateItem(itemId, quantity);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update item");
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemove = async (itemId: number) => {
    setPendingItemId(itemId);
    try {
      await cartApi.removeItem(itemId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to remove item");
    } finally {
      setPendingItemId(null);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-muted">Loading…</p>;
  }

  const items = cart?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        Your cart
      </h1>

      {error && <p className="text-chili mb-6">{error}</p>}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted">Your cart is empty.</p>
          <Link
            href="/menuitems"
            className="inline-block mt-4 text-chili font-medium hover:underline"
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-line border border-line rounded-2xl overflow-hidden">
            {items.map((item) => {
              const menuItem = menuById[item.menu_id];
              const isPending = pendingItemId === item.id;

              return (
                <div key={item.id} className="p-5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-line/50 overflow-hidden shrink-0">
                    {menuItem?.Image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={menuItem.Image}
                        alt={menuItem.Title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-medium text-ink truncate">
                      {menuItem?.Title ?? `Item #${item.menu_id}`}
                    </h2>
                    <p className="text-sm text-muted mt-0.5">
                      ${item.amount.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={isPending || item.quantity <= 1}
                      className="w-8 h-8 rounded-full border border-line hover:border-chili hover:text-chili transition-colors disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={isPending}
                      className="w-8 h-8 rounded-full border border-line hover:border-chili hover:text-chili transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-16 text-right font-semibold text-ink shrink-0">
                    ${item.subtotal.toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={isPending}
                    className="text-muted hover:text-chili transition-colors shrink-0 disabled:opacity-40"
                    aria-label="Remove item"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-line">
            <span className="text-lg font-medium text-ink">Total</span>
            <span className="text-2xl font-display font-semibold text-chili">
              ${(cart?.total_amount ?? 0).toFixed(2)}
            </span>
          </div>

          <Link
            href="/orders/new"
            className="block text-center w-full mt-6 rounded-full bg-chili text-white font-medium py-3.5 hover:bg-chili/90 transition-colors"
          >
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}
