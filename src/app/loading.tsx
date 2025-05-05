import { SpinnerLoader, LoaderContainer } from "@/app/components/Loaders";

export default function GlobalLoading() {
  return (
    <LoaderContainer className="min-h-[70vh]">
      <SpinnerLoader size="lg" text="Loading" />
    </LoaderContainer>
  );
}
