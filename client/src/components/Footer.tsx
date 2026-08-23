import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="ticket-divider" />
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-display text-xl font-semibold text-ink">
            Forkful
          </span>
          <p className="text-sm text-muted mt-1">
            Food from your favorite places, delivered.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-ink/70">
          <Link href="/restaurants" className="hover:text-chili transition-colors">
            Restaurants
          </Link>
          <Link href="/orders" className="hover:text-chili transition-colors">
            Orders
          </Link>
          <Link href="/cart" className="hover:text-chili transition-colors">
            Cart
          </Link>
        </div>

        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Forkful. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
