"use client";

import { formatCurrency } from "@/lib/utils";

export default function PrintBill({ bill }: { bill: any }) {
  return (
    <div className="glass-card print-area mx-auto max-w-3xl p-6">
      <div className="no-print mb-6 flex justify-end gap-3">
        <button className="btn-primary" onClick={() => window.print()}>
          Print Bill
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