"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { restaurantsApi, Restaurant } from "@/lib/restaurants";
import { ApiError } from "@/lib/api";

export default function RestaurantShowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    restaurantsApi
      .getById(id)
      .then((res) => setRestaurant(res.data))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load restaurant")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this restaurant? This can't be undone.")) return;
    setDeleting(true);
    try {
      await restaurantsApi.remove(id);
      router.push("/restaurants");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete restaurant");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-muted">Loading…</p>;
  }

  if (error || !restaurant) {
    return (
      <p className="mx-auto max-w-3xl px-5 py-16 text-chili">
        {error || "Restaurant not found"}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/restaurants" className="text-sm text-muted hover:text-chili">
        ← Back to restaurants
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold text-ink">
            {restaurant.Name}
          </h1>
          <span
            className={`inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full ${
              restaurant.IsOpen ? "bg-herb/10 text-herb" : "bg-line text-muted"
            }`}
          >
            {restaurant.IsOpen ? "Open" : "Closed"} · {restaurant.Status}
          </span>
        </div>

        <div className="flex gap-3 shrink-0">
          <Link
            href={`/restaurants/${restaurant.ID}/edit`}
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

      {restaurant.Description && (
        <p className="mt-6 text-ink/80 leading-relaxed">
          {restaurant.Description}
        </p>
      )}

      <div className="ticket-divider my-8" />

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <dt className="text-muted">Phone</dt>
          <dd className="text-ink mt-1">{restaurant.Phone}</dd>
        </div>
        <div>
          <dt className="text-muted">Address</dt>
          <dd className="text-ink mt-1">{restaurant.Address}</dd>
        </div>
      </dl>
    </div>
  );
}
