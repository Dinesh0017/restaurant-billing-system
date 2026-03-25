import DashboardCards from "@/components/DashboardCards";

async function getStats() {
  const res = await fetch("http://localhost:3000/api/dashboard/stats", {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      totalCategories: 0,
      totalItems: 0,
      totalStock: 0,
      totalBills: 0,
      totalRevenue: 0,
    };
  }

  return res.json();
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle mt-1">
          Quick overview of your restaurant system
        </p>
      </div>

      <DashboardCards stats={stats} />
    </div>
  );
}