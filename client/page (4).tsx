import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-chili text-sm font-semibold tracking-wide uppercase mb-4">
          Hungry? We've got you.
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-ink leading-[1.05]">
          Your favorite kitchens,
          <br />
          on their way.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-lg">
          Browse restaurants near you, build your order, and track it — from
          the kitchen to your door.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/restaurants"
            className="px-6 py-3 rounded-full bg-chili text-white font-medium hover:bg-chili/90 transition-colors"
          >
            Browse restaurants
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-full border border-line font-medium hover:border-chili hover:text-chili transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
