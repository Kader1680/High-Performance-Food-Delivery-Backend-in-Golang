"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { restaurantsApi, Restaurant } from "@/lib/restaurants";
import { ApiError } from "@/lib/api";

export default function EditRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Restaurant["Status"]>("active");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    restaurantsApi
      .getById(id)
      .then((res) => {
        const r = res.data;
        setName(r.Name);
        setDescription(r.Description);
        setPhone(r.Phone);
        setAddress(r.Address);
        setStatus(r.Status);
        setIsOpen(r.IsOpen);
      })
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load restaurant")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await restaurantsApi.update(id, {
        name,
        description,
        phone,
        address,
        status,
        is_open: isOpen,
      });
      router.push(`/restaurants/${id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-md px-5 py-16 text-muted">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Edit restaurant
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Restaurant["Status"])}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors bg-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-ink/80">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={(e) => setIsOpen(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-chili)]"
          />
          Currently open
        </label>

        {error && <p className="text-sm text-chili">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-chili text-white font-medium py-3 hover:bg-chili/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
