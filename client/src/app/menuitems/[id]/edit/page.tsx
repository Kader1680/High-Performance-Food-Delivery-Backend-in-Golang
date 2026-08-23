"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { menuItemsApi, MenuItem } from "@/lib/menuitems";
import { ApiError } from "@/lib/api";

export default function EditMenuItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<MenuItem["Status"]>("active");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("0");
  const [availability, setAvailability] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    menuItemsApi
      .getById(id)
      .then((res) => {
        const item = res.data;
        setTitle(item.Title);
        setDescription(item.Description);
        setStatus(item.Status);
        setPrice(String(item.Price));
        setImage(item.Image);
        setStock(String(item.Stock));
        setAvailability(item.Availability);
      })
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load menu item")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await menuItemsApi.update(id, {
        title,
        description,
        status,
        price: parseFloat(price),
        image,
        stock: parseInt(stock, 10),
        availability,
      });
      router.push(`/menuitems/${id}`);
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
        Edit menu item
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Title
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">
              Price
            </label>
            <input
              type="number"
              required
              min={0.01}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5">
              Stock
            </label>
            <input
              type="number"
              required
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Image URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1.5">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MenuItem["Status"])}
            className="w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-chili transition-colors bg-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-ink/80">
          <input
            type="checkbox"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-chili)]"
          />
          Available for order
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
