import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatNaira } from "@/data/products";
import { useCart } from "@/lib/cart";
import { DEFAULT_DELIVERY_OPTION, deliveryFeeFor } from "@/lib/delivery";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Your bag — MarketDay" },
      {
        name: "description",
        content: "Review the items in your bag, adjust quantities and head to checkout.",
      },
      { property: "og:title", content: "Your bag — MarketDay" },
      {
        property: "og:description",
        content: "Review the items in your bag, adjust quantities and head to checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bag,
});

function Bag() {
  const { lines, count, total, setQty, remove } = useCart();
  const deliveryFee = deliveryFeeFor(total, DEFAULT_DELIVERY_OPTION);
  const grandTotal = total + deliveryFee;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-cobalt">YOUR BAG</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
            {count > 0
              ? `${count} ${count === 1 ? "item" : "items"} ready to go`
              : "Your bag is empty"}
          </h1>

          {lines.length === 0 ? (
            <div className="mt-10 flex max-w-md flex-col items-start gap-5 rounded-3xl bg-secondary p-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-card">
                <ShoppingBag className="size-5 text-cobalt" />
              </span>
              <p className="text-sm text-muted-foreground">
                Nothing here yet. Add something you need and it will be waiting for you — even after
                you close the tab.
              </p>
              <Link
                to="/products"
                className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
              {/* Line items */}
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li
                    key={line.productId}
                    className="flex flex-col gap-4 rounded-2xl bg-card p-4 sm:flex-row sm:items-center"
                  >
                    <Link
                      to="/products/$productId"
                      params={{ productId: line.productId }}
                      className="shrink-0"
                    >
                      <img
                        src={line.image}
                        alt={line.name}
                        loading="lazy"
                        width={1024}
                        height={1024}
                        className="size-24 rounded-xl object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/products/$productId"
                        params={{ productId: line.productId }}
                        className="text-sm font-bold transition-colors hover:text-cobalt"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatNaira(line.price)} each
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-2 py-1">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${line.name}`}
                            onClick={() => setQty(line.productId, line.qty - 1)}
                            className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{line.qty}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${line.name}`}
                            onClick={() => setQty(line.productId, line.qty + 1)}
                            className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.productId)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-cobalt sm:self-center">
                      {formatNaira(line.price * line.qty)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Order summary */}
              <aside className="rounded-3xl bg-card p-6 shadow-sm">
                <p className="font-display text-lg font-extrabold">Order summary</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-semibold">{formatNaira(total)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="font-semibold">
                      {deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <dt className="font-bold">Total</dt>
                    <dd className="font-display text-lg font-extrabold text-cobalt">
                      {formatNaira(grandTotal)}
                    </dd>
                  </div>
                </dl>
                {total < 25000 ? (
                  <p className="mt-3 rounded-xl bg-secondary px-4 py-2.5 text-xs text-muted-foreground">
                    Add {formatNaira(25000 - total)} more to unlock free standard delivery.
                  </p>
                ) : null}
                <Link
                  to="/checkout"
                  className="mt-6 block rounded-full bg-ink py-3.5 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
                >
                  Proceed to checkout
                </Link>
                <Link
                  to="/products"
                  className="mt-3 block text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-cobalt"
                >
                  Continue shopping
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
