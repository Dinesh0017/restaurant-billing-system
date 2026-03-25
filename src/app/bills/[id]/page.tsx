import PrintBill from "@/components/PrintBill";

async function getBill(id: string) {
  const res = await fetch(`http://localhost:3000/api/bills/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function BillDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bill = await getBill(id);

  if (!bill) {
    return <div className="glass-card p-6">Bill not found.</div>;
  }

  return <PrintBill bill={bill} />;
}