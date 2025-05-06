import { CategoryLoader, LoaderContainer } from "@/app/components/Loaders";

export default function CategoryLoading() {
  return (
    <LoaderContainer className="min-h-[70vh]" withBackground={false}>
      <CategoryLoader text="Loading articles" />
    </LoaderContainer>
  );
}
