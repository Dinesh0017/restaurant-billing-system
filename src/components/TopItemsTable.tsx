import { formatCurrency } from "@/lib/utils";

type Props = {
  items: {
    name: string;
    qty: number;
    revenue: number;
  }[];
};

export default function TopItemsTable({ items }: Props) {
  return (
    <div className="glass-card p-6">
      <h2 className="section-title">Top Selling Items</h2>
      <p className="section-subtitle mt-1">
        Best performing items in selected period
      </p>

      <div className="mt-6 table-wrap">
        {items.length === 0 ? (
          <div className="p-4">No data found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{formatCurrency(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}