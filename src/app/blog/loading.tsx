import { PulseLoader, LoaderContainer } from "../components/Loaders";

export default function BlogLoading() {
  return (
    <LoaderContainer className="min-h-[70vh]">
      <PulseLoader text="Loading blog posts" />
    </LoaderContainer>
  );
}
