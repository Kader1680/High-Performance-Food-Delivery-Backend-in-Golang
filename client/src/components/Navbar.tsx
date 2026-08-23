"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Forkful
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
          <Link href="/restaurants" className="hover:text-chili transition-colors">
            Restaurants
          </Link>
          <Link href="/menuitems" className="hover:text-chili transition-colors">
            Menu
          </Link>
          <Link href="/orders" className="hover:text-chili transition-colors">
            Orders
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="text-sm font-medium text-ink/80 hover:text-chili transition-colors"
          >
            Cart
          </Link>

          {loading ? (
            <div className="h-9 w-20 rounded-full bg-line animate-pulse" />
          ) : user ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded-full border border-line hover:border-chili hover:text-chili transition-colors"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-full hover:text-chili transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium px-4 py-2 rounded-full bg-chili text-white hover:bg-chili/90 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-line px-5 py-4 flex flex-col gap-4 text-sm font-medium text-ink/80 bg-paper">
          <Link href="/restaurants" onClick={() => setMenuOpen(false)}>
            Restaurants
          </Link>
          <Link href="/menuitems" onClick={() => setMenuOpen(false)}>
            Menu
          </Link>
          <Link href="/orders" onClick={() => setMenuOpen(false)}>
            Orders
          </Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            Cart
          </Link>
          <div className="ticket-divider" />
          {loading ? null : user ? (
            <button onClick={handleLogout} className="text-left text-chili">
              Log out
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="text-chili"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
