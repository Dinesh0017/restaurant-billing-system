"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  Package,
  ShoppingCart,
  ReceiptText,
} from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/inventory", label: "Add Items", icon: Package },
  { href: "/billing", label: "Billing", icon: ShoppingCart },
  { href: "/bills", label: "Bills", icon: ReceiptText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-glass hidden md:flex md:flex-col">
      <div className="border-b border-white/10 p-6">
        <h1 className="text-2xl font-bold">HOT Kitchen</h1>
        <p className="mt-2 text-sm text-slate-300">
          Add Items, billing and reports
        </p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                  active
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}