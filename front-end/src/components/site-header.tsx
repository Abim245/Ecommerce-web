import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, ShoppingBasket, X } from "lucide-react";
import { formatNaira } from "@/data/products";
import { useCart } from "@/lib/cart";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { lines, count, total, remove } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const checkLogin = () => {
        setIsLoggedIn(Boolean(localStorage.getItem("marketday-token")));
      };

      checkLogin();

      window.addEventListener("storage", checkLogin);

      return () => window.removeEventListener("storage", checkLogin);
    }, []);
  return (
    <header className="relative z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-cobalt">
            <ShoppingBasket className="size-4.5 text-white" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            MARKET<span className="text-cobalt">DAY</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-foreground transition-colors hover:text-cobalt"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden flex-1 justify-end lg:flex">
          <label className="flex w-72 items-center gap-2 rounded-full bg-secondary px-4 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search for what you need"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        <div className="relative ml-auto lg:ml-0">
          <button
            type="button"
            aria-label={`Open bag${count > 0 ? `, ${count} items` : ""}`}
            onClick={() => setCartOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="size-4.5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-cobalt text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </button>

          {cartOpen ? (
            <div className="absolute right-0 top-12 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl">
              <p className="font-display text-sm font-extrabold">Your bag</p>
              {lines.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Your bag is empty. Add something you need.
                </p>
              ) : (
                <>
                  <ul className="mt-3 space-y-3">
                    {lines.map((line) => (
                      <li key={line.productId} className="flex items-center gap-3">
                        <img
                          src={line.image}
                          alt={line.name}
                          width={1024}
                          height={1024}
                          className="size-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold">{line.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {line.qty} × {formatNaira(line.price)}
                          </p>
                        </div>
                        <p className="text-xs font-bold text-cobalt">
                          {formatNaira(line.price * line.qty)}
                        </p>
                        <button
                          type="button"
                          aria-label={`Remove ${line.name} from bag`}
                          onClick={() => remove(line.productId)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-sm font-bold text-cobalt">{formatNaira(total)}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to="/bag"
                      onClick={() => setCartOpen(false)}
                      className="flex-1 rounded-full border border-border bg-background py-2.5 text-center text-xs font-bold text-foreground transition-colors hover:bg-accent"
                    >
                      View bag
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="flex-1 rounded-full bg-ink py-2.5 text-center text-xs font-bold text-primary-foreground transition-colors hover:bg-ink/85"
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link
            to="/vendor-dashboard"
            className="text-sm font-semibold text-foreground transition-colors hover:text-cobalt"
          >
            Vendor Dashboard
          </Link>
            <Link
              to="/my-orders"
              className="text-sm font-semibold text-foreground transition-colors hover:text-cobalt"
            >
              My Orders
            </Link>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("marketday-token");
                setIsLoggedIn(false);
              }}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
          >
            Log In
          </Link>
        )}

      </div>
    </header>
  );
}
