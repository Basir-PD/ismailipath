import BackToTop from "../components/BackToTop";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  );
}
