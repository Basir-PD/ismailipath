import { PulseLoader, LoaderContainer } from "@/app/components/Loaders";

export default function GlobalLoading() {
  return (
    <LoaderContainer className="min-h-[70vh]">
      <PulseLoader text="Loading" />
    </LoaderContainer>
  );
}
