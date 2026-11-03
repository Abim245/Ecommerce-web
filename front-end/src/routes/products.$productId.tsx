import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { formatNaira } from "@/data/products";
import { apiFetch } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/delivery";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export const Route = createFileRoute("/products/$productId")({
  loader: async ({ params }) => {
    const products = await apiFetch<Product[]>("/products");

    const product = products.find(
      (item) => item._id === params.productId,
    );

    if (!product) {
      throw notFound();
    }

    const related = products.filter(
      (item) =>
        item.category === product.category &&
        item._id !== product._id,
    );

    return { product, related };
  },

  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.product.name} — MarketDay`
      : "Product — MarketDay";

    const description =
      loaderData?.product.description ??
      "Everyday essentials from trusted local vendors, delivered around your schedule.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },

  component: ProductDetail,
});

function ProductDetail() {
  const { product, related } = Route.useLoaderData();

  const { add } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const categoryLabel = product.category;
  const outOfStock = product.quantity <= 0;

  const handleAdd = () => {
    if (outOfStock) return;

    add(product, qty);
    setAdded(true);
    setQty(1);

    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link
              to="/products"
              className="transition-colors hover:text-cobalt"
            >
              Products
            </Link>

            <span>/</span>

            <Link
              to="/products"
              search={{ category: product.category }}
              className="transition-colors hover:text-cobalt"
            >
              {categoryLabel}
            </Link>

            <span>/</span>

            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Product image */}
            <div>
              <div className="overflow-hidden rounded-2xl bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>

            {/* Product details */}
            <div>
              <p className="mt-3 text-xs font-bold tracking-[0.25em] text-cobalt">
                {categoryLabel.toUpperCase()}
              </p>

              <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] md:text-5xl">
                {product.name}
              </h1>

              <p className="mt-4 font-display text-3xl font-extrabold text-cobalt">
                {formatNaira(product.price)}
              </p>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {product.description}
              </p>

              {/* Information from backend */}
              <ul className="mt-6 space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-cobalt" />
                  {outOfStock
                    ? "Currently out of stock"
                    : `${product.quantity} available`}
                </li>

                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-cobalt" />
                  Sold by {product.vendor.storeName}
                </li>

                <li className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-cobalt" />
                  Vendor location: {product.vendor.location}
                </li>
              </ul>

              {/* Add to bag */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Minus className="size-4" />
                  </button>

                  <span className="w-5 text-center text-sm font-bold">
                    {qty}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={qty >= product.quantity}
                    onClick={() =>
                      setQty((q) => Math.min(product.quantity, q + 1))
                    }
                    className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className={cn(
                    "flex-1 rounded-full bg-ink py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50",
                    added && "bg-lime text-ink hover:bg-lime",
                  )}
                >
                  {outOfStock
                    ? "Out of stock"
                    : added
                      ? "Added to bag ✓"
                      : "Add to bag"}
                </button>
              </div>

              <div className="mt-6 space-y-2.5 rounded-2xl bg-secondary p-5 text-xs text-muted-foreground">
                <p className="flex items-center gap-2.5">
                  <Truck className="size-4 shrink-0 text-cobalt" />
                  Delivery from {formatNaira(1500)} — free on standard orders
                  over {formatNaira(FREE_DELIVERY_THRESHOLD)}.
                </p>

                <p className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 shrink-0 text-cobalt" />
                  Pay on delivery. Not fresh? We'll replace it or refund you.
                </p>
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 ? (
            <div className="mt-16">
              <div className="flex items-end justify-between">
                <h2 className="font-display text-2xl font-extrabold md:text-3xl">
                  More from {categoryLabel.toLowerCase()}
                </h2>

                <Link
                  to="/products"
                  search={{ category: product.category }}
                  className="flex items-center gap-1.5 text-sm font-bold text-cobalt transition-colors hover:text-cobalt/80"
                >
                  See all
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4">
                {related.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}