import pantryTote from "@/assets/pantry-tote.jpg";
import pantryToteDetail from "@/assets/pantry-tote-detail.jpg";
import backpack from "@/assets/backpack.jpg";
import backpackDetail from "@/assets/backpack-detail.jpg";
import earbuds from "@/assets/earbuds.jpg";
import earbudsDetail from "@/assets/earbuds-detail.jpg";
import headphones from "@/assets/headphones.jpg";
import headphonesDetail from "@/assets/headphones-detail.jpg";
import cucumbers from "@/assets/cucumbers.jpg";
import cucumbersDetail from "@/assets/cucumbers-detail.jpg";
import tomatoes from "@/assets/tomatoes.jpg";
import tomatoesDetail from "@/assets/tomatoes-detail.jpg";
import shopper from "@/assets/shopper.jpg";
import studyDesk from "@/assets/study-desk.jpg";
import marketVendor from "@/assets/market-vendor.jpg";

export type CategoryId = "fresh-market" | "study-tech" | "everyday-carry" | "home-pantry";

export type Badge = "VALUE" | "NEW" | "POPULAR";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  vendor: {
    _id: string;
    name: string;
    storeName: string;
    location: string;
    phone: string;
    bio: string;
    profilePicture: string;
  };
}

export const categories: { id: CategoryId; label: string }[] = [
  { id: "fresh-market", label: "Fresh market" },
  { id: "study-tech", label: "Study & tech" },
  { id: "everyday-carry", label: "Everyday carry" },
  { id: "home-pantry", label: "Home & pantry" },
];

export const products: Product[] = [
  {
    id: "pantry-pack",
    name: "Weekday pantry pack",
    price: 14800,
    badge: "VALUE",
    category: "home-pantry",
    image: pantryTote,
    images: [pantryTote, pantryToteDetail, shopper],
    description:
      "A week's worth of pantry staples gathered in one tote — rice, pasta, beans, tinned tomatoes, oil and spices, hand-picked from trusted market vendors the same morning it ships.",
    details: [
      "Feeds a household of four for about five days",
      "Packed fresh by the vendor on delivery morning",
      "Reusable canvas tote included",
    ],
  },
  {
    id: "commuter-backpack",
    name: "All-day commuter backpack",
    price: 24000,
    badge: "NEW",
    category: "everyday-carry",
    image: backpack,
    images: [backpack, backpackDetail, shopper],
    description:
      "A structured everyday backpack built for Lagos commutes — padded laptop protection, a water-resistant shell and straps that stay comfortable from first ride to last errand.",
    details: [
      "Padded sleeve fits laptops up to 15 inches",
      "Water-resistant shell with weatherproof zips",
      "22 litres with a breathable back panel",
    ],
  },
  {
    id: "wireless-earbuds",
    name: "Pocket wireless earbuds",
    price: 19500,
    badge: "NEW",
    category: "study-tech",
    image: earbuds,
    images: [earbuds, earbudsDetail, studyDesk],
    description:
      "Small, light earbuds that disappear into your day — clear sound for lectures and calls, a pocketable charging case and touch controls that work on the move.",
    details: [
      "Bluetooth 5.3 with instant pairing",
      "6 hours per charge, 24 hours with the case",
      "Touch controls and USB-C fast charging",
    ],
  },
  {
    id: "study-headphones",
    name: "Focus study headphones",
    price: 28500,
    badge: "POPULAR",
    category: "study-tech",
    image: headphones,
    images: [headphones, headphonesDetail, studyDesk],
    description:
      "Over-ear headphones tuned for deep work — active noise cancelling shuts out the compound, the danfo and the generator so only the lecture remains.",
    details: [
      "Active noise cancelling with a transparency mode",
      "30-hour battery life on a single charge",
      "Cushioned earcups that fold flat for travel",
    ],
  },
  {
    id: "cucumber-bundle",
    name: "Fresh cucumber bundle",
    price: 3200,
    badge: "VALUE",
    category: "fresh-market",
    image: cucumbers,
    images: [cucumbers, cucumbersDetail, marketVendor],
    description:
      "Crunchy, cool cucumbers hand-picked at dawn from partner farms — firm enough to snap, mild enough for salads, smoothies or a straight snack.",
    details: [
      "About 1kg, roughly 6–8 pieces",
      "Harvested the same morning it is delivered",
      "Sourced from partner farms around Ibadan",
    ],
  },
  {
    id: "tomato-basket",
    name: "Market tomato basket",
    price: 6500,
    badge: "POPULAR",
    category: "fresh-market",
    image: tomatoes,
    images: [tomatoes, tomatoesDetail, marketVendor],
    description:
      "Firm, ripe plum tomatoes in a traditional market basket — the base of every good stew, bought the way you would at the market, minus the trip.",
    details: [
      "About 2kg in a reusable woven basket",
      "Firm, ripe fruit selected for long stews",
      "Graded and packed by the vendor",
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
