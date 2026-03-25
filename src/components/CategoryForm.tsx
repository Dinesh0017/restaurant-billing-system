"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitCategory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      toast.success("Category added");
      setName("");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-6">
      <h2 className="section-title">Add Category</h2>
      <p className="section-subtitle mt-1">
        Create food and drink categories
      </p>

      <form onSubmit={submitCategory} className="mt-6 space-y-4">
        <input
          className="input"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Saving..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}