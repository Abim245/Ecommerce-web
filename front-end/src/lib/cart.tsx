import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  total: number;
  add: (productId: string, qty: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "marketday-bag-v1";
const MAX_QTY = 99;

function sanitize(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const clean: Record<string, number> = {};
  for (const [id, qty] of Object.entries(raw as Record<string, unknown>)) {
    if (
      products.some((p) => p.id === id) &&
      typeof qty === "number" &&
      Number.isInteger(qty) &&
      qty > 0
    ) {
      clean[id] = Math.min(MAX_QTY, qty);
    }
  }
  return clean;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setQuantities(sanitize(JSON.parse(raw)));
    } catch {
      // A broken stored bag falls back to an empty one.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
    } catch {}
  }, [quantities, hydrated]);

  const add = useCallback((productId: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.min(MAX_QTY, (prev[productId] ?? 0) + Math.max(1, qty)),
    }));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setQuantities((prev) => {
      const next = { ...prev };
      const clamped = Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));
      if (clamped <= 0) {
        delete next[productId];
      } else {
        next[productId] = clamped;
      }
      return next;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setQuantities({});
  }, []);

  const value = useMemo<CartValue>(() => {
    const lines: CartLine[] = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => {
        const product = products.find((p) => p.id === productId);
        return {
          productId,
          name: product?.name ?? productId,
          price: product?.price ?? 0,
          image: product?.image ?? "",
          qty,
        };
      });
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      total: lines.reduce((sum, line) => sum + line.qty * line.price, 0),
      add,
      setQty,
      remove,
      clear,
    };
  }, [quantities, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
