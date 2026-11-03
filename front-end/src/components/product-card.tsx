import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { formatNaira, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
    setQty(1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex flex-col gap-3">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative block overflow-hidden rounded-xl bg-white"
      >
        {product.badge ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-lime px-3 py-1 text-[11px] font-bold tracking-widest text-ink">
            {product.badge}
          </span>
        ) : null}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="flex items-end justify-between gap-3">
        <div>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="text-sm font-bold leading-snug transition-colors hover:text-cobalt"
          >
            <h3>{product.name}</h3>
          </Link>
          <p className="mt-1 text-sm font-bold text-cobalt">{formatNaira(product.price)}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1">
          <button
            type="button"
            aria-label={`Decrease quantity of ${product.name}`}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-4 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            aria-label={`Increase quantity of ${product.name}`}
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "w-full rounded-full bg-ink py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-ink/85",
          added && "bg-lime text-ink hover:bg-lime",
        )}
      >
        {added ? "Added to bag ✓" : "Add to bag"}
      </button>
    </div>
  );
}
