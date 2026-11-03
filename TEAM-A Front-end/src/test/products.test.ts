import { describe, expect, it } from "vitest";
import { categories, formatNaira, products } from "@/data/products";

describe("MarketDay catalogue", () => {
  it("has the six products from the design with exact prices", () => {
    expect(products).toHaveLength(6);
    const byId = new Map(products.map((p) => [p.id, p]));
    expect(byId.get("pantry-pack")?.price).toBe(14800);
    expect(byId.get("commuter-backpack")?.price).toBe(24000);
    expect(byId.get("wireless-earbuds")?.price).toBe(19500);
    expect(byId.get("study-headphones")?.price).toBe(28500);
    expect(byId.get("cucumber-bundle")?.price).toBe(3200);
    expect(byId.get("tomato-basket")?.price).toBe(6500);
  });

  it("exposes the four shopping categories", () => {
    expect(categories.map((c) => c.id)).toEqual([
      "fresh-market",
      "study-tech",
      "everyday-carry",
      "home-pantry",
    ]);
  });

  it("formats prices in naira", () => {
    expect(formatNaira(14800)).toBe("₦14,800");
  });
});
