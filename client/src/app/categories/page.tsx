"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoriesApi, Category } from "@/lib/categories";
import { ApiError } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi
      .getAll()
      .then((res) => setCategories(res ?? []))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load categories")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Categories
        </h1>
        <Link
          href="/categories/new"
          className="px-5 py-2.5 rounded-full bg-chili text-white text-sm font-medium hover:bg-chili/90 transition-colors"
        >
          Add category
        </Link>
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-chili">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="text-muted">No categories yet.</p>
      )}

      <div className="flex flex-col divide-y divide-line border border-line rounded-2xl overflow-hidden">
        {categories.map((c) => (
          <div key={c.ID} className="p-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                {c.Title}
              </h2>
              {c.Description && (
                <p className="text-sm text-muted mt-1">{c.Description}</p>
              )}
            </div>
            <span className="text-xs text-muted shrink-0">
              Restaurant #{c.RestaurantID}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
