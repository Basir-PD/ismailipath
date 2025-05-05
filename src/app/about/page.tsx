import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | B. Payenda",
  description: "Learn more about B. Payenda and our mission",
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">About B. Payenda</h1>

      <div className="prose max-w-none">
        <p className="mb-4">B. Payenda is dedicated to providing thoughtful insights and resources for those interested in spiritual knowledge and teachings.</p>

        <p className="mb-4">Our content is carefully curated from various sources, with a focus on delivering authentic information that can help guide your spiritual journey.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Our Mission</h2>
        <p>To create a platform that shares valuable spiritual knowledge in an accessible and engaging way, helping readers deepen their understanding and connection.</p>
      </div>
    </main>
  );
}
