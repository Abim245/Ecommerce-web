import { useMemo, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { categories, products, type CategoryId } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductsSearch {
  category?: CategoryId | undefined;
}

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    const category = search["category"] as CategoryId | undefined;
    const valid = categories.some((c) => c.id === category);
    if (valid) return { category };
    return {};
  },
  head: () => ({
    meta: [
      { title: "The full market — MarketDay" },
      {
        name: "description",
        content:
          "Search trusted everyday essentials and add exactly what you need.",
      },
      { property: "og:title", content: "The full market — MarketDay" },
      {
        property: "og:description",
        content:
          "Search trusted everyday essentials and add exactly what you need.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Products,
});

function Products() {
  const { category } = useSearch({ from: "/products/" });
  const activeCategory: CategoryId | "all" = category ?? "all";
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesQuery =
        q.length === 0 || product.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-cobalt">
            THE FULL MARKET
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] md:text-7xl">
            Find it fast. Get on with your day.
          </h1>
          <p className="mt-5 text-sm text-muted-foreground md:text-base">
            Search trusted everyday essentials and add exactly what you need.
          </p>

          {/* Search + category chips */}
          <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-secondary p-3 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-full bg-card px-5 py-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the catalogue"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <div className="flex flex-wrap items-center gap-1 px-1 lg:gap-5">
              {(
                [
                  { id: "all" as const, label: "All" },
                  ...categories.map((c) => ({ id: c.id, label: c.label })),
                ] as const
              ).map((chip) => (
                <Link
                  key={chip.id}
                  to="/products"
                  search={
                    chip.id === "all" ? {} : { category: chip.id }
                  }
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    activeCategory === chip.id
                      ? "bg-ink text-primary-foreground"
                      : "text-foreground hover:text-cobalt",
                  )}
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {visible.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Nothing matches "{query}" yet. Try another search.
            </p>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
