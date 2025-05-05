import { fetchCategories } from "@/app/lib/notion";
import ClientNavbar from "@/app/components/ClientNavbar";

export default async function Navbar() {
  const categories = await fetchCategories();
  return <ClientNavbar categories={categories} />;
}
