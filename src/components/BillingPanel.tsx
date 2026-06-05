"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItemType, ItemType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function BillingPanel() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();

      setItems(
        data.filter((item: ItemType) => item.stockQty > 0)
      );
    } catch {
      toast.error("Failed to load items");
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function addToCart(item: ItemType) {
    const existing = cart.find((c) => c.itemId === item.id);

    if (existing) {
      if (existing.quantity >= item.stockQty) {
        toast.error("Not enough stock");
        return;
      }

      setCart((prev) =>
        prev.map((c) =>
          c.itemId === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1,
          stockQty: item.stockQty,
          category: item.category?.name ?? "Uncategorized",
        },
      ]);
    }
  }

  function increaseQty(itemId: number) {
    setCart((prev) =>
      prev.map((c) => {
        if (c.itemId === itemId) {
          if (c.quantity >= c.stockQty) {
            toast.error("Stock limit reached");
            return c;
          }
          return { ...c, quantity: c.quantity + 1 };
        }
        return c;
      })
    );
  }

  function decreaseQty(itemId: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.itemId === itemId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  }

  function removeItem(itemId: number) {
    setCart((prev) =>
      prev.filter((c) => c.itemId !== itemId)
    );
  }

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  async function createBill() {
    if (cart.length === 0) {
      toast.error("Please add items to the bill");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          items: cart,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create bill");
      }

      toast.success("Bill created successfully");

      setCart([]);
      setCustomerName("");

      window.open(`/bills/${data.id}`, "_blank");

      fetchItems();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* LEFT: ITEMS */}
      <div className="card">
        <h2 className="mb-4 text-xl font-bold">Available Items</h2>

        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-500">
                  {formatCurrency(item.price)} | Stock:{" "}
                  {item.stockQty}
                </p>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="btn-primary"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: CART */}
      <div className="card">
        <h2 className="mb-4 text-xl font-bold">Current Bill</h2>

        <input
          className="input mb-4"
          placeholder="Customer name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {cart.length === 0 ? (
          <p>No items added yet.</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.itemId}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatCurrency(item.price)} x{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="font-bold">
                    {formatCurrency(
                      item.price * item.quantity
                    )}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      decreaseQty(item.itemId)
                    }
                    className="btn-secondary"
                  >
                    -
                  </button>

                  <button
                    onClick={() =>
                      increaseQty(item.itemId)
                    }
                    className="btn-secondary"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeItem(item.itemId)
                    }
                    className="btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <p className="text-lg font-bold">
                Total: {formatCurrency(total)}
              </p>
            </div>

            <button
              onClick={createBill}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "Creating Bill..."
                : "Create & Print Bill"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}