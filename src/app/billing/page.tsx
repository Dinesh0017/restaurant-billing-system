"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItemType, CategoryType, ItemType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import BillingCart from "@/components/BillingCart";
import toast from "react-hot-toast";

export default function BillingPage() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);

  async function loadData() {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/categories"),
      ]);

      const itemsData = await itemsRes.json();
      const categoriesData = await categoriesRes.json();

      if (!itemsRes.ok) throw new Error(itemsData.message || "Failed to load items");
      if (!categoriesRes.ok) throw new Error(categoriesData.message || "Failed to load categories");

      setItems(itemsData.filter((item: ItemType) => item.stockQty > 0));
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
      setItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function addToCart(item: ItemType) {
    const existing = cart.find((c) => c.itemId === item.id);

    if (existing) {
      if (existing.quantity >= item.stockQty) {
        toast.error("Stock limit reached");
        return;
      }

      setCart((prev) =>
        prev.map((c) =>
          c.itemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        stockQty: item.stockQty,
        imageUrl: item.imageUrl,
        categoryName: item.category.name,
      },
    ]);
  }

  function increaseQty(itemId: number) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          if (item.quantity >= item.stockQty) return item;
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  }

  function decreaseQty(itemId: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.itemId === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(itemId: number) {
    setCart((prev) => prev.filter((item) => item.itemId !== itemId));
  }

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => String(item.categoryId) === activeCategory);
  }, [items, activeCategory]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  async function createBill() {
    if (cart.length === 0) {
      toast.error("Please add items");
      return;
    }

    setBillingLoading(true);

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

      toast.success("Bill created");
      setCart([]);
      setCustomerName("");
      window.open(`/bills/${data.id}`, "_blank");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create bill");
    } finally {
      setBillingLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="section-title">POS Billing</h1>
        <p className="section-subtitle mt-1">
          Select category, choose items and print the bill
        </p>
      </div>

      <div className="pos-grid">
        <div className="glass-card p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              className={`category-chip ${activeCategory === "all" ? "category-chip-active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-chip ${activeCategory === String(category.id) ? "category-chip-active" : ""}`}
                onClick={() => setActiveCategory(String(category.id))}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading items...</p>
          ) : filteredItems.length === 0 ? (
            <p>No items available.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addToCart(item)}
                  className="item-card text-left"
                >
                  <div className="h-40 bg-slate-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <span className="badge-green">Stock {item.stockQty}</span>
                    </div>
                    <p className="text-sm text-slate-500">{item.category.name}</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <BillingCart
          cart={cart}
          total={total}
          customerName={customerName}
          setCustomerName={setCustomerName}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeItem={removeItem}
          createBill={createBill}
          billingLoading={billingLoading}
        />
      </div>
    </div>
  );
}