import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import marketVendor from "@/assets/market-vendor.jpg";
import shopper from "@/assets/shopper.jpg";
import freshMarket from "@/assets/market-vendor.jpg";
import studyDesk from "@/assets/study-desk.jpg";
import backpack from "@/assets/backpack.jpg";
import pantryTote from "@/assets/pantry-tote.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { products, type CategoryId } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "MarketDay — Skip the market trip",
      },
      {
        name: "description",
        content:
          "Groceries, study essentials and everyday favourites from trusted vendors, delivered without rearranging your whole day.",
      },
      { property: "og:title", content: "MarketDay — Skip the market trip" },
      {
        property: "og:description",
        content:
          "Groceries, study essentials and everyday favourites from trusted vendors, delivered without rearranging your whole day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categoryTiles: {
  number: string;
  label: string;
  image: string;
  category: CategoryId;
}[] = [
  {
    number: "01",
    label: "Fresh market",
    image: freshMarket,
    category: "fresh-market",
  },
  { number: "02", label: "Study & tech", image: studyDesk, category: "study-tech" },
  {
    number: "03",
    label: "Everyday carry",
    image: backpack,
    category: "everyday-carry",
  },
  {
    number: "04",
    label: "Home & pantry",
    image: pantryTote,
    category: "home-pantry",
  },
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="px-2 pb-2 pt-2 md:px-4">
          <div className="grid overflow-hidden rounded-2xl bg-cobalt lg:grid-cols-[1fr_1.4fr_1fr]">
            <div className="relative min-h-64 lg:min-h-[30rem]">
              <img
                src={marketVendor}
                alt="Market vendor with baskets of fresh tomatoes"
                width={1024}
                height={1280}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center md:px-12">
              <span className="rounded-full bg-ink/90 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-white">
                YOUR DAY IS BUSY ENOUGH
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] text-white md:text-6xl xl:text-7xl">
                Skip the market trip.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
                Groceries, study essentials and everyday favourites from trusted vendors, delivered
                without rearranging your whole day.
              </p>
              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3 text-sm font-bold text-ink transition-transform hover:scale-105"
              >
                Shop now
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="relative hidden lg:block">
              <img
                src={shopper}
                alt="Happy shopper holding a phone"
                loading="lazy"
                width={1024}
                height={1280}
                className="absolute inset-0 h-full w-full rounded-3xl object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-cobalt">SHOP YOUR WAY</p>
          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-display text-4xl font-extrabold leading-tight md:text-5xl">
              Start with what's on your list.
            </h2>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground md:text-right">
              Hover to explore each tile. Everything is arranged to get you from "I need it" to
              "it's on the way" quickly.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.label}
                to="/products"
                search={{ category: tile.category }}
                className="group relative aspect-4/5 overflow-hidden rounded-xl bg-ink"
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-md bg-ink/80 px-2 py-0.5 text-[11px] font-bold text-lime">
                  {tile.number}
                </span>
                <span className="absolute bottom-4 left-4 font-display text-lg font-extrabold text-white md:text-xl">
                  {tile.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <div className="grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-lime">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
            <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-ink md:text-6xl">
              From your list to your door, without losing your Saturday.
            </h2>
            <Link
              to="/products"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              Fill your bag
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
