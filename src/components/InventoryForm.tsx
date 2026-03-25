"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function InventoryForm() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stockQty: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price),
          stockQty: Number(form.stockQty),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add item");
      }

      toast.success("Item added successfully");
      setForm({
        name: "",
        category: "",
        price: "",
        stockQty: "",
      });
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">Add Stock Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          placeholder="Item name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="input"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <input
          className="input"
          type="number"
          placeholder="Stock quantity"
          value={form.stockQty}
          onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
          required
        />

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Saving..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}