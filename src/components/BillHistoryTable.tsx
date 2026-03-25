"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { BillType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function BillHistoryTable() {
  const [bills, setBills] = useState<BillType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBills() {
      try {
        const res = await fetch("/api/bills");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load bills");
        }

        setBills(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load bills");
        setBills([]);
      } finally {
        setLoading(false);
      }
    }

    loadBills();
  }, []);

  return (
    <div className="glass-card p-6">
      <h1 className="section-title">Bill History</h1>
      <p className="section-subtitle mt-1">View all created bills</p>

      <div className="mt-6 table-wrap">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : bills.length === 0 ? (
          <div className="p-4">No bills found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.billNumber}</td>
                  <td>{bill.customerName || "-"}</td>
                  <td>{formatCurrency(bill.total)}</td>
                  <td>{new Date(bill.createdAt).toLocaleString()}</td>
                  <td>
                    <Link href={`/bills/${bill.id}`} className="btn-primary">
                      Open
                    </Link>
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