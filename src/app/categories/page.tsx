import { fetchCategories } from "@/app/lib/notion";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | B. Payenda",
  description: "Browse articles by category",
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-gray-600">Browse articles by category</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${encodeURIComponent(category.name)}`} className="p-6 border rounded-lg hover:bg-blue-50 transition-colors group">
              <div className="font-medium text-lg group-hover:text-blue-600 transition-colors">{category.name}</div>
            </Link>
          ))}

          {categories.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500">No categories found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
