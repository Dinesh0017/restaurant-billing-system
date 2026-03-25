import { formatCurrency } from "@/lib/utils";

type Props = {
  summary: {
    totalRevenue: number;
    totalBills: number;
    totalItemsSold: number;
    averageBill: number;
  };
};

export default function AnalyticsCards({ summary }: Props) {
  const cards = [
    { title: "Total Revenue", value: formatCurrency(summary.totalRevenue) },
    { title: "Total Bills", value: summary.totalBills },
    { title: "Items Sold", value: summary.totalItemsSold },
    { title: "Average Bill", value: formatCurrency(summary.averageBill) },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="glass-card p-6">
          <p className="text-sm text-slate-500">{card.title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}