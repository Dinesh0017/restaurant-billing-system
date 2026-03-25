"use client";

import { useEffect, useState } from "react";
import { CategoryType } from "@/lib/types";
import toast from "react-hot-toast";

export default function ItemForm() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [preview, setPreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stockQty: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch {}
    }
    loadCategories();
  }, []);

  function handleImageChange(file: File | null) {
    setImageFile(file);

    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/items/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.imageUrl;
  }

  async function submitItem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      const res = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stockQty: Number(form.stockQty),
          categoryId: Number(form.categoryId),
          imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create item");
      }

      toast.success("Item added successfully");
      setForm({
        name: "",
        price: "",
        stockQty: "",
        categoryId: "",
      });
      setImageFile(null);
      setPreview("");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to create item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-6">
      <h2 className="section-title">Add Inventory Item</h2>
      <p className="section-subtitle mt-1">
        Add new food, drinks and other items
      </p>

      <form onSubmit={submitItem} className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <input
            className="input"
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
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

          <select
            className="select"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            className="input"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          />

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Saving..." : "Add Item"}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex h-72 w-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-3xl object-cover"
              />
            ) : (
              <p className="text-slate-400">Image preview</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}