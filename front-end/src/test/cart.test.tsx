import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CartProvider, useCart } from "@/lib/cart";

const STORAGE_KEY = "marketday-bag-v1";

function Probe() {
  const { lines, count, total, add, setQty, remove } = useCart();
  return (
    <div>
      <p data-testid="count">{count}</p>
      <p data-testid="total">{total}</p>
      <ul>
        {lines.map((line) => (
          <li key={line.productId}>
            {line.productId} × {line.qty}
          </li>
        ))}
      </ul>
      <button onClick={() => add("cucumber-bundle", 2)}>add-cucumber</button>
      <button onClick={() => add("tomato-basket", 1)}>add-tomato</button>
      <button onClick={() => setQty("cucumber-bundle", 5)}>set-cucumber-5</button>
      <button onClick={() => remove("tomato-basket")}>remove-tomato</button>
    </div>
  );
}

function renderBag() {
  return render(
    <CartProvider>
      <Probe />
    </CartProvider>,
  );
}

describe("MarketDay bag", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts empty", () => {
    renderBag();
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(screen.getByTestId("total")).toHaveTextContent("0");
  });

  it("adds items with quantity and keeps the running total", () => {
    renderBag();
    fireEvent.click(screen.getByText("add-cucumber"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    // 2 × ₦3,200
    expect(screen.getByTestId("total")).toHaveTextContent("6400");
    expect(screen.getByText("cucumber-bundle × 2")).toBeInTheDocument();
  });

  it("updates quantity with the stepper controls", () => {
    renderBag();
    fireEvent.click(screen.getByText("add-cucumber"));
    fireEvent.click(screen.getByText("set-cucumber-5"));
    expect(screen.getByTestId("count")).toHaveTextContent("5");
    expect(screen.getByTestId("total")).toHaveTextContent("16000");
  });

  it("removes an item from the bag", () => {
    renderBag();
    fireEvent.click(screen.getByText("add-cucumber"));
    fireEvent.click(screen.getByText("add-tomato"));
    fireEvent.click(screen.getByText("remove-tomato"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.queryByText("tomato-basket × 1")).not.toBeInTheDocument();
  });

  it("keeps the bag across a simulated reload via localStorage", async () => {
    const first = renderBag();
    fireEvent.click(screen.getByText("add-cucumber"));
    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored).toContain("cucumber-bundle");
    first.unmount();

    // A fresh mount (what a reload looks like) restores the stored bag.
    renderBag();
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("total")).toHaveTextContent("6400");
  });

  it("ignores corrupted or unknown stored items", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ "cucumber-bundle": 2, "mystery-item": 7, bad: "x" }),
    );
    renderBag();
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.queryByText("mystery-item × 7")).not.toBeInTheDocument();
  });
});
