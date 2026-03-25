import CategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";

export default function CategoriesPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <CategoryForm />
      <CategoryList />
    </div>
  );
}