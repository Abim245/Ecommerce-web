
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface StoredCartItem {
  product: CartProduct;
  qty: number;
}

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  availableQuantity: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  total: number;
  add: (product: Product, qty: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "marketday-bag-v2";
const MAX_QTY = 99;

function sanitize(raw: unknown): Record<string, StoredCartItem> {
  if (!raw || typeof raw !== "object") return {};

  const clean: Record<string, StoredCartItem> = {};

  for (const [id, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;

    const item = value as StoredCartItem;
    const product = item.product;

    if (
      !product ||
      product._id !== id ||
      typeof product.name !== "string" ||
      typeof product.price !== "number" ||
      typeof product.image !== "string" ||
      typeof product.quantity !== "number" ||
      !Number.isInteger(item.qty) ||
      item.qty <= 0 ||
      product.quantity <= 0
    ) {
      continue;
    }

    clean[id] = {
      product,
      qty: Math.min(MAX_QTY, product.quantity, item.qty),
    };
  }

  return clean;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, StoredCartItem>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(sanitize(JSON.parse(raw)));
    } catch {
      // A broken stored bag falls back to an empty one.
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable.
    }
  }, [items, hydrated]);

  const add = useCallback((product: Product, qty: number) => {
    setItems((prev) => {
      const currentQty = prev[product._id]?.qty ?? 0;
      const requestedQty = Math.max(1, Math.floor(qty));
      const newQty = Math.min(
        MAX_QTY,
        product.quantity,
        currentQty + requestedQty,
      );

      if (newQty <= 0) return prev;

      return {
        ...prev,
        [product._id]: {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.quantity,
          },
          qty: newQty,
        },
      };
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => {
      const item = prev[productId];
      if (!item) return prev;

      const next = { ...prev };
      const clamped = Math.min(
        MAX_QTY,
        item.product.quantity,
        Math.max(0, Math.floor(qty)),
      );

      if (clamped <= 0) {
        delete next[productId];
      } else {
        next[productId] = { ...item, qty: clamped };
      }

      return next;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems({});
  }, []);

  const value = useMemo<CartValue>(() => {
    const lines: CartLine[] = Object.entries(items).map(
      ([productId, item]) => ({
        productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        qty: item.qty,
        availableQuantity: item.product.quantity,
      }),
    );

    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      total: lines.reduce((sum, line) => sum + line.qty * line.price, 0),
      add,
      setQty,
      remove,
      clear,
    };
  }, [items, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
}
