"use client";

import { CartItemType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function BillingCart({
  cart,
  total,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  increaseQty,
  decreaseQty,
  removeItem,
  createBill,
  billingLoading,
}: {
  cart: CartItemType[];
  total: number;
  customerName: string;
  setCustomerName: (value: string) => void;
  customerEmail: string;
  setCustomerEmail: (value: string) => void;
  customerPhone: string;
  setCustomerPhone: (value: string) => void;
  increaseQty: (itemId: number) => void;
  decreaseQty: (itemId: number) => void;
  removeItem: (itemId: number) => void;
  createBill: () => void;
  billingLoading: boolean;
}) {
  return (
    <div className="glass-card sticky top-6 h-fit p-6">
      <h2 className="section-title">Current Bill</h2>

      <input
        className="input mt-4"
        placeholder="Customer name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />

      <input
        className="input mt-3"
        placeholder="Customer email"
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        required
      />

      <input
        className="input mt-3"
        placeholder="Customer phone"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        required

      />

      <div className="mt-6 space-y-4">
        {cart.length === 0 ? (
          <p className="text-slate-500">No items selected yet.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.itemId}
              className="rounded-3xl border border-slate-200 bg-white p-4"
            >
              <div className="flex gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.categoryName}</p>
                  <p className="text-sm text-indigo-600">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    className="btn-secondary px-4 py-2"
                    onClick={() => decreaseQty(item.itemId)}
                  >
                    -
                  </button>
                  <button
                    className="btn-secondary px-4 py-2"
                    onClick={() => increaseQty(item.itemId)}
                  >
                    +
                  </button>
                  <button
                    className="btn-danger px-4 py-2"
                    onClick={() => removeItem(item.itemId)}
                  >
                    Remove
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">x {item.quantity}</p>
                  <p className="text-indigo-600">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-sm text-slate-300">Grand Total</p>
        <p className="mt-2 text-3xl font-bold">{formatCurrency(total)}</p>

        <button
          className="mt-4 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          onClick={createBill}
          disabled={billingLoading}
        >
          {billingLoading ? "Creating Bill..." : "Create & Print Bill"}
        </button>
      </div>
    </div>
  );
}