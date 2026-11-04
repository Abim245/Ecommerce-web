
import type { Product } from "@/types/product";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items?: OrderItem[];

  // Legacy fields for older orders
  product?: Product;
  quantity?: number;

  subtotal?: number;
  deliveryFee?: number;
  totalAmount: number;
  deliveryAddress: string;

  paymentStatus: "Pending" | "Paid" | "Failed";

  orderStatus:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";

  createdAt?: string;
  updatedAt?: string;
}
