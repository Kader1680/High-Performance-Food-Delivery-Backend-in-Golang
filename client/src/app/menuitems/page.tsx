"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { menuItemsApi, MenuItem } from "@/lib/menuitems";
import { ApiError } from "@/lib/api";

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    menuItemsApi
      .getAll()
      .then((res) => setItems(res.data ?? []))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load menu items")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Menu items
        </h1>
        <Link
          href="/menuitems/new"
          className="px-5 py-2.5 rounded-full bg-chili text-white text-sm font-medium hover:bg-chili/90 transition-colors"
        >
          Add menu item
        </Link>
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-chili">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-muted">No menu items yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={item.ID}
            href={`/menuitems/${item.ID}`}
            className="block rounded-2xl border border-line overflow-hidden hover:border-chili transition-colors"
          >
            <div className="aspect-[4/3] bg-line/50 overflow-hidden">
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
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {item.Title}
                </h2>
                <span className="text-sm font-semibold text-chili shrink-0">
                  ${item.Price.toFixed(2)}
                </span>
              </div>
              {item.Description && (
                <p className="text-sm text-muted mt-1.5 line-clamp-2">
                  {item.Description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    item.Availability
                      ? "bg-herb/10 text-herb"
                      : "bg-line text-muted"
                  }`}
                >
                  {item.Availability ? "In stock" : "Unavailable"}
                </span>
                <span className="text-xs text-muted">
                  {item.Stock} left
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
