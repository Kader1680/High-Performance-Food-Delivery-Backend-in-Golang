"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { menuItemsApi, MenuItem } from "@/lib/menuitems";
import { cartApi } from "@/lib/cart";
import { ApiError } from "@/lib/api";

export default function MenuItemShowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    menuItemsApi
      .getById(id)
      .then((res) => setItem(res.data))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load menu item")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this menu item? This can't be undone.")) return;
    setDeleting(true);
    try {
      await menuItemsApi.remove(id);
      router.push("/menuitems");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete menu item");
      setDeleting(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    setError(null);
    try {
      await cartApi.addItem(Number(id), 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-muted">Loading…</p>;
  }

  if (error || !item) {
    return (
      <p className="mx-auto max-w-3xl px-5 py-16 text-chili">
        {error || "Menu item not found"}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/menuitems" className="text-sm text-muted hover:text-chili">
        ← Back to menu items
      </Link>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[4/3] rounded-2xl bg-line/50 overflow-hidden">
          {item.Image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.Image}
              alt={item.Title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              No image
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold text-ink">
              {item.Title}
            </h1>
            <span className="text-xl font-semibold text-chili shrink-0">
              ${item.Price.toFixed(2)}
            </span>
          </div>

          <span
            className={`inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full ${
              item.Availability ? "bg-herb/10 text-herb" : "bg-line text-muted"
            }`}
          >
            {item.Availability ? "In stock" : "Unavailable"} · {item.Status}
          </span>

          {item.Description && (
            <p className="mt-4 text-ink/80 leading-relaxed">
              {item.Description}
            </p>
          )}

          <div className="ticket-divider my-6" />

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted">Stock</dt>
              <dd className="text-ink mt-1">{item.Stock}</dd>
            </div>
            <div>
              <dt className="text-muted">Category ID</dt>
              <dd className="text-ink mt-1">{item.CategoryID}</dd>
            </div>
          </dl>

          {error && <p className="mt-4 text-sm text-chili">{error}</p>}

          <button
            onClick={handleAddToCart}
            disabled={adding || !item.Availability}
            className="w-full mt-6 rounded-full bg-chili text-white font-medium py-3 hover:bg-chili/90 transition-colors disabled:opacity-50"
          >
            {added ? "Added ✓" : adding ? "Adding…" : "Add to cart"}
          </button>

          <div className="flex gap-3 mt-4">
            <Link
              href={`/menuitems/${item.ID}/edit`}
              className="px-4 py-2 rounded-full border border-line text-sm font-medium hover:border-chili hover:text-chili transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-full border border-chili text-chili text-sm font-medium hover:bg-chili hover:text-white transition-colors disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
