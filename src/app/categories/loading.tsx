import { CategoryLoader, LoaderContainer } from "@/app/components/Loaders";

export default function CategoriesLoading() {
  return (
    <LoaderContainer className="min-h-[70vh]">
      <CategoryLoader text="Loading categories" />
    </LoaderContainer>
  );
}
