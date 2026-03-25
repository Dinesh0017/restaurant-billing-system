import { formatCurrency } from "@/lib/utils";

export default function DashboardCards({
  stats,
}: {
  stats: {
    totalCategories: number;
    totalItems: number;
    totalStock: number;
    totalBills: number;
    totalRevenue: number;
  };
}) {
  const cards = [
    { title: "Categories", value: stats.totalCategories },
    { title: "Items", value: stats.totalItems },
    { title: "Total Stock", value: stats.totalStock },
    { title: "Bills", value: stats.totalBills },
    { title: "Revenue", value: formatCurrency(stats.totalRevenue) },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.title} className="glass-card p-6">
          <p className="text-sm text-slate-500">{card.title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}