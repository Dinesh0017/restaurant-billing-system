"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function PrintBill({ bill }: { bill: any }) {
  const [sending, setSending] = useState(false);

  async function sendBill() {
    setSending(true);

    try {
      const res = await fetch("/api/bills/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billId: bill.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send bill");
      }

      toast.success("Bill sent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to send bill");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="glass-card print-area mx-auto max-w-3xl p-6">
      <div className="no-print mb-6 flex justify-end gap-3">
        <button className="btn-primary" onClick={() => window.print()}>
          Print Bill
        </button>

        <button
          className="btn-primary"
          onClick={sendBill}
          disabled={sending}
        >
          {sending ? "Sending..." : "Send Bill"}
        </button>

        <button className="btn-secondary" onClick={() => window.history.back()}>
          Back
        </button>
      </div>

      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold text-slate-900">Restaurant Bill</h1>
        <p className="mt-2 text-slate-600">Bill No: {bill.billNumber}</p>
        <p className="text-slate-600">
          Date: {new Date(bill.createdAt).toLocaleString()}
        </p>
        <p className="text-slate-600">
          Customer: {bill.customerName || "Walk-in Customer"}
        </p>
        <p className="text-slate-600">
          Email: {bill.customerEmail || "-"}
        </p>
        <p className="text-slate-600">
          Phone: {bill.customerPhone || "-"}
        </p>
      </div>

      <div className="mt-6 table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((row: any) => (
              <tr key={row.id}>
                <td>{row.item.name}</td>
                <td>{row.quantity}</td>
                <td>{formatCurrency(row.unitPrice)}</td>
                <td>{formatCurrency(row.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right">
        <p className="text-2xl font-bold text-slate-900">
          Grand Total: {formatCurrency(bill.total)}
        </p>
      </div>
    </div>
  );
}