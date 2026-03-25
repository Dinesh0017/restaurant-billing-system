import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Restaurant Billing System</h1>
        <div className="flex gap-3">
          <Link href="/" className="btn-secondary">Dashboard</Link>
          <Link href="/inventory" className="btn-secondary">Inventory</Link>
          <Link href="/billing" className="btn-secondary">Billing</Link>
          <Link href="/bills" className="btn-secondary">Bills</Link>
        </div>
      </div>
    </nav>
  );
}