import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Store,
  Package,
  ShoppingCart,
  Plus,
  ArrowLeft,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/vendor-dashboard")({
  component: VendorDashboardPage,
});

function VendorDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to MarketDay
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Vendor workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Store Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your store, products and customer orders.
          </p>
        </div>

        {/* Store overview */}
        <section className="mb-8 rounded-3xl bg-ink p-6 text-primary-foreground sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <Store size={28} />
            </div>

            <div>
              <p className="text-sm text-white/70">Welcome to your store</p>
              <h2 className="text-2xl font-bold">Vendor Dashboard</h2>
            </div>
          </div>

          <p className="mt-4 max-w-xl text-sm text-white/70">
            Your workspace for managing products and growing your business
            on MarketDay.
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total Products
              </p>
              <Package className="text-muted-foreground" size={22} />
            </div>

            <p className="mt-4 text-3xl font-bold text-foreground">—</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your listed products
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Orders
              </p>
              <ShoppingCart className="text-muted-foreground" size={22} />
            </div>

            <p className="mt-4 text-3xl font-bold text-foreground">—</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Customer purchases
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Inventory
              </p>
              <Package className="text-muted-foreground" size={22} />
            </div>

            <p className="mt-4 text-3xl font-bold text-foreground">—</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Items in stock
            </p>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">
              Quick actions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your store from here.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <Plus size={24} className="text-muted-foreground" />

              <h3 className="mt-4 font-bold text-foreground">
                Add a product
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                List a new product in your store.
              </p>

              <p className="mt-4 text-sm font-semibold text-muted-foreground">
                Coming next
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <ShoppingCart size={24} className="text-muted-foreground" />

              <h3 className="mt-4 font-bold text-foreground">
                Manage orders
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                View purchases made from your store.
              </p>

              <p className="mt-4 text-sm font-semibold text-muted-foreground">
                Coming next
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}