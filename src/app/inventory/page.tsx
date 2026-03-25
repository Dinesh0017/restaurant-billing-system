import ItemForm from "@/components/ItemForm";
import ItemGrid from "@/components/ItemGrid";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <ItemForm />
      <ItemGrid />
    </div>
  );
}