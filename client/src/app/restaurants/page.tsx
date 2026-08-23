"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { restaurantsApi, Restaurant } from "@/lib/restaurants";
import { ApiError } from "@/lib/api";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    restaurantsApi
      .getAll()
      .then((res) => setRestaurants(res.data ?? []))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load restaurants")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Restaurants
        </h1>
        <Link
          href="/restaurants/new"
          className="px-5 py-2.5 rounded-full bg-chili text-white text-sm font-medium hover:bg-chili/90 transition-colors"
        >
          Add restaurant
        </Link>
      </div>

      {loading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-chili">{error}</p>}

      {!loading && !error && restaurants.length === 0 && (
        <p className="text-muted">No restaurants yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurants.map((r) => (
          <Link
            key={r.ID}
            href={`/restaurants/${r.ID}`}
            className="block rounded-2xl border border-line p-5 hover:border-chili transition-colors"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                {r.Name}
              </h2>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  r.IsOpen
                    ? "bg-herb/10 text-herb"
                    : "bg-line text-muted"
                }`}
              >
                {r.IsOpen ? "Open" : "Closed"}
              </span>
            </div>
            {r.Description && (
              <p className="text-sm text-muted mt-2 line-clamp-2">
                {r.Description}
              </p>
            )}
            <p className="text-sm text-ink/70 mt-3">{r.Address}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
