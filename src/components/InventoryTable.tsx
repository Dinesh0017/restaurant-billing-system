"use client";

import { useEffect, useState } from "react";
import { ItemType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function InventoryTable() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load items");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid items response");
      }

      setItems(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: number) {
    const ok = confirm("Are you sure you want to delete this item?");
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
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">Stock Items</h2>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category || "-"}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.stockQty}</td>
                  <td className="no-print">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}