
import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Package, ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { apiFetch } from "@/lib/api";
import { formatNaira } from "@/data/products";
import type { Order } from "@/types/order";

export const Route = createFileRoute("/my-orders")({
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiFetch<Order[]>("/orders");
        setOrders(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your orders.",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Continue shopping
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">
            My Orders
          </h1>
          <p className="mt-2 text-muted-foreground">
            View and track your purchases.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              Loading your orders...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-border p-10 text-center">
            <ShoppingBag
              size={40}
              className="mx-auto text-muted-foreground"
            />
            <h2 className="mt-4 text-xl font-bold text-foreground">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your purchases will appear here once you place an order.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items =
                order.items ??
                (order.product
                  ? [
                      {
                        product: order.product,
                        quantity: order.quantity ?? 1,
                        price: order.product.price,
                      },
                    ]
                  : []);

              return (
                <article
                  key={order._id}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order ID
                      </p>
                      <p className="mt-1 break-all text-sm font-bold text-foreground">
                        {order._id}
                      </p>
                    </div>

                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-4 py-5">
                    {items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center gap-4"
                      >
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
                            <Package size={24} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground">
                            {item.product?.name ?? "Product unavailable"}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-bold text-foreground">
                          {formatNaira(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-border pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Subtotal
                      </span>
                      <span>
                        {formatNaira(
                          order.subtotal ??
                            items.reduce(
                              (sum, item) =>
                                sum + item.price * item.quantity,
                              0,
                            ),
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery fee
                      </span>
                      <span>
                        {formatNaira(order.deliveryFee ?? 0)}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                      <span>Total</span>
                      <span>{formatNaira(order.totalAmount)}</span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">
                        Payment status
                      </span>
                      <span>{order.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">
                      Delivery address
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
