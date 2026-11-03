import { Link } from "@tanstack/react-router";
import { ShoppingBasket } from "lucide-react";

const exploreLinks = [
  { to: "/products", label: "All products" },
  { to: "/contact", label: "Sell on MarketDay" },
  { to: "/contact", label: "Track an order" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-lime">
              <ShoppingBasket className="size-4.5 text-ink" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              MARKETDAY
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Everyday essentials from trusted local vendors, delivered around your schedule.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-lime">EXPLORE</p>
          <ul className="mt-4 space-y-3">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-sm text-white/80 transition-colors hover:text-lime"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-lime">TALK TO US</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a href="mailto:hello@marketday.ng" className="transition-colors hover:text-lime">
                hello@marketday.ng
              </a>
            </li>
            <li>Lagos, Nigeria</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 MarketDay.</p>
          <p>Built for busy days and small wins.</p>
        </div>
      </div>
    </footer>
  );
}
