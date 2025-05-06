import { PulseLoader, LoaderContainer } from "@/app/components/Loaders";

export default function CategoryLoading() {
  return (
    <LoaderContainer className="min-h-[70vh]">
      <PulseLoader text="Loading articles" />
    </LoaderContainer>
  );
}
