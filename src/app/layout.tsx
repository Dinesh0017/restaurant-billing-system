import "./globals.css";
import "@/styles/print.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata = {
  title: "Restaurant Billing System",
  description: "Modern restaurant POS and inventory system",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="page-shell">
        <div className="layout-grid">
          <Sidebar />
          <div className="bg-transparent">
            <Topbar />
            <main className="main-area">{children}</main>
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}