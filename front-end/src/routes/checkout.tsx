import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatNaira } from "@/data/products";
import { useCart } from "@/lib/cart";
import {
  DELIVERY_OPTIONS,
  DEFAULT_DELIVERY_OPTION,
  deliveryFeeFor,
  deliveryLabelFor,
  type DeliveryOptionId,
} from "@/lib/delivery";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MarketDay" },
      {
        name: "description",
        content: "Add your delivery details, review your order and place it in under a minute.",
      },
      { property: "og:title", content: "Checkout — MarketDay" },
      {
        property: "og:description",
        content: "Add your delivery details, review your order and place it in under a minute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

interface ShippingDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  note: string;
  deliveryOption: DeliveryOptionId;
}

const EMPTY_DETAILS: ShippingDetails = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  note: "",
  deliveryOption: DEFAULT_DELIVERY_OPTION,
};

const inputClass =
  "mt-2 w-full rounded-full bg-input px-5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
const labelClass = "text-[11px] font-bold tracking-[0.15em] text-muted-foreground";

function Checkout() {
  const { lines, count, total, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"shipping" | "review">("shipping");
  const [details, setDetails] = useState<ShippingDetails>(EMPTY_DETAILS);

  const deliveryFee = deliveryFeeFor(total, details.deliveryOption);
  const grandTotal = total + deliveryFee;

  if (count === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
            <p className="text-xs font-bold tracking-[0.25em] text-cobalt">CHECKOUT</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Nothing to check out yet
            </h1>
            <div className="mt-8 flex max-w-md flex-col items-start gap-5 rounded-3xl bg-secondary p-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-card">
                <ShoppingBag className="size-5 text-cobalt" />
              </span>
              <p className="text-sm text-muted-foreground">
                Your bag is empty. Add a few things you need first.
              </p>
              <Link
                to="/products"
                className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
              >
                Browse the market
              </Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const update =
    (field: keyof ShippingDetails) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDetails((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const placeOrder = () => {
    const orderId = `MD-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      window.sessionStorage.setItem(
        "marketday-last-order",
        JSON.stringify({
          id: orderId,
          itemCount: count,
          subtotal: total,
          deliveryFee,
          total: grandTotal,
          deliveryOption: details.deliveryOption,
          fullName: details.fullName,
          address: details.address,
          city: details.city,
        }),
      );
    } catch {}
    clear();
    void navigate({ to: "/order-confirmed" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-cobalt">CHECKOUT</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
            {step === "shipping" ? "Where should we deliver?" : "Review your order"}
          </h1>

          {/* Step indicator */}
          <ol className="mt-8 flex items-center gap-3 text-xs font-bold">
            {(
              [
                { id: "shipping", label: "1 · Shipping details" },
                { id: "review", label: "2 · Review & place order" },
              ] as const
            ).map((entry) => (
              <li
                key={entry.id}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2",
                  step === entry.id
                    ? "bg-ink text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {step === "review" && entry.id === "shipping" ? (
                  <Check className="size-3.5" />
                ) : null}
                {entry.label}
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div>
              {step === "shipping" ? (
                <form
                  className="space-y-5 rounded-3xl bg-card p-6 shadow-sm md:p-8"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setStep("review");
                  }}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>FULL NAME</span>
                      <input
                        required
                        type="text"
                        value={details.fullName}
                        onChange={update("fullName")}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>PHONE NUMBER</span>
                      <input
                        required
                        type="tel"
                        value={details.phone}
                        onChange={update("phone")}
                        placeholder="+234"
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className={labelClass}>EMAIL ADDRESS</span>
                    <input
                      required
                      type="email"
                      value={details.email}
                      onChange={update("email")}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>DELIVERY ADDRESS</span>
                    <input
                      required
                      type="text"
                      value={details.address}
                      onChange={update("address")}
                      placeholder="Street, house number"
                      className={inputClass}
                    />
                  </label>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>CITY</span>
                      <input
                        required
                        type="text"
                        value={details.city}
                        onChange={update("city")}
                        placeholder="e.g. Lagos"
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>DELIVERY NOTE (OPTIONAL)</span>
                      <input
                        type="text"
                        value={details.note}
                        onChange={update("note")}
                        placeholder="Gate code, landmark…"
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <fieldset className="rounded-2xl bg-secondary p-5">
                    <legend className={cn("px-1", labelClass)}>DELIVERY SPEED</legend>
                    <div className="mt-3 space-y-2">
                      {DELIVERY_OPTIONS.map((option) => (
                        <label
                          key={option.id}
                          className="flex cursor-pointer items-center justify-between rounded-full bg-card px-5 py-3 text-sm"
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="delivery-option"
                              checked={details.deliveryOption === option.id}
                              onChange={() =>
                                setDetails((prev) => ({
                                  ...prev,
                                  deliveryOption: option.id,
                                }))
                              }
                              className="accent-[var(--cobalt)]"
                            />
                            <span className="font-semibold">{option.label}</span>
                          </span>
                          <span className="font-bold text-cobalt">
                            {deliveryFeeFor(total, option.id) === 0
                              ? "Free"
                              : formatNaira(deliveryFeeFor(total, option.id))}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-ink py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
                  >
                    Continue to review
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Shipping recap */}
                  <div className="rounded-3xl bg-card p-6 shadow-sm md:p-8">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-lg font-extrabold">Delivering to</p>
                      <button
                        type="button"
                        onClick={() => setStep("shipping")}
                        className="text-xs font-bold text-cobalt transition-colors hover:text-cobalt/80"
                      >
                        Edit details
                      </button>
                    </div>
                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-6">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd className="text-right font-semibold">{details.fullName}</dd>
                      </div>
                      <div className="flex justify-between gap-6">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="text-right font-semibold">{details.phone}</dd>
                      </div>
                      <div className="flex justify-between gap-6">
                        <dt className="text-muted-foreground">Address</dt>
                        <dd className="text-right font-semibold">
                          {details.address}, {details.city}
                        </dd>
                      </div>
                      {details.note ? (
                        <div className="flex justify-between gap-6">
                          <dt className="text-muted-foreground">Note</dt>
                          <dd className="text-right font-semibold">{details.note}</dd>
                        </div>
                      ) : null}
                      <div className="flex justify-between gap-6">
                        <dt className="text-muted-foreground">Delivery</dt>
                        <dd className="text-right font-semibold">
                          {deliveryLabelFor(details.deliveryOption)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Items recap */}
                  <div className="rounded-3xl bg-card p-6 shadow-sm md:p-8">
                    <p className="font-display text-lg font-extrabold">
                      {count} {count === 1 ? "item" : "items"} in this order
                    </p>
                    <ul className="mt-4 divide-y divide-border">
                      {lines.map((line) => (
                        <li key={line.productId} className="flex items-center gap-4 py-3">
                          <img
                            src={line.image}
                            alt={line.name}
                            loading="lazy"
                            width={1024}
                            height={1024}
                            className="size-14 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{line.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {line.qty} × {formatNaira(line.price)}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-cobalt">
                            {formatNaira(line.price * line.qty)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={placeOrder}
                    className="w-full rounded-full bg-ink py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85"
                  >
                    Place order · {formatNaira(grandTotal)}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    You'll pay on delivery. We'll text order updates to {details.phone}.
                  </p>
                </div>
              )}
            </div>

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
              <Link
                to="/bag"
                className="mt-6 block text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-cobalt"
              >
                Back to bag
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
