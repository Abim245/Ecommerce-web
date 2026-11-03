import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatNaira } from "@/data/products";
import { deliveryLabelFor, type DeliveryOptionId } from "@/lib/delivery";

interface LastOrder {
  id: string;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryOption: DeliveryOptionId;
  fullName: string;
  address: string;
  city: string;
}

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Order confirmed — MarketDay" },
      {
        name: "description",
        content: "Your MarketDay order is confirmed and on its way.",
      },
      { property: "og:title", content: "Order confirmed — MarketDay" },
      {
        property: "og:description",
        content: "Your MarketDay order is confirmed and on its way.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  // The last order summary is written to sessionStorage by checkout.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("marketday-last-order");
      if (raw) setOrder(JSON.parse(raw) as LastOrder);
    } catch {
      // A broken record falls back to the generic confirmation.
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
          <div className="rounded-3xl bg-card p-8 text-center shadow-sm md:p-12">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-lime">
              <CheckCircle2 className="size-8 text-ink" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">
              Thank you{order?.fullName ? `, ${order.fullName.split(" ")[0]}` : ""}!
            </h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Your order is confirmed. Our vendor is packing it now, and your rider will be with you
              soon.
            </p>

            {order ? (
              <>
                <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm">
                  <Package className="size-4 text-cobalt" />
                  <span className="font-bold">Order</span>
                  <span className="font-mono font-bold text-cobalt">{order.id}</span>
                </div>

                <dl className="mt-8 space-y-3 rounded-2xl bg-secondary p-6 text-left text-sm">
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Delivering to</dt>
                    <dd className="text-right font-semibold">
                      {order.address}, {order.city}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Delivery speed</dt>
                    <dd className="text-right font-semibold">
                      {deliveryLabelFor(order.deliveryOption)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Items</dt>
                    <dd className="text-right font-semibold">
                      {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="text-right font-semibold">{formatNaira(order.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="text-right font-semibold">
                      {order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6 border-t border-border pt-3">
                    <dt className="font-bold">Total (pay on delivery)</dt>
                    <dd className="font-display text-lg font-extrabold text-cobalt">
                      {formatNaira(order.total)}
                    </dd>
                  </div>
                </dl>
              </>
            ) : null}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/products"
                className="rounded-full bg-ink px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
              >
                Continue shopping
              </Link>
              <Link
                to="/"
                className="rounded-full border border-border bg-background px-7 py-3 text-sm font-bold text-foreground transition-colors hover:bg-accent"
              >
                Back home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
