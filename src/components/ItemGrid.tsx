"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryType, ItemType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ItemGrid() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

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

      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
      setItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: number) {
    const ok = confirm("Delete this item?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete item");
      }

      toast.success("Item deleted");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    }
  }

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => String(item.categoryId) === activeCategory);
  }, [items, activeCategory]);

  useEffect(() => {
    loadData();
  }, []);

  function stockBadge(stockQty: number) {
    if (stockQty <= 0) {
      return <span className="badge-red">Out of Stock</span>;
    }
    if (stockQty <= 5) {
      return <span className="badge-yellow">Low Stock</span>;
    }
    return <span className="badge-green">In Stock</span>;
  }

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="section-title">Inventory Items</h2>
          <p className="section-subtitle mt-1">
            View items by category with image cards
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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
      </div>

      {loading ? (
        <div className="mt-6">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div className="mt-6">No items found.</div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              <div className="h-48 w-full bg-slate-100">
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

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {item.category.name}
                    </p>
                  </div>
                  {stockBadge(item.stockQty)}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-indigo-600">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Stock: {item.stockQty}
                  </p>
                </div>

                <button
                  className="btn-danger w-full"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}