"use client";

import { useEffect, useState } from "react";
import { CategoryType } from "@/lib/types";
import toast from "react-hot-toast";

export default function CategoryList() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load categories");
      }

      setCategories(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: number) {
    const ok = confirm("Delete this category?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      toast.success("Category deleted");
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="glass-card p-6">
      <h2 className="section-title">Category List</h2>

      <div className="mt-6 table-wrap">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-4">No categories found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => deleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}