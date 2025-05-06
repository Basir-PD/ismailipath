import { notFound } from "next/navigation";

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  console.log(`Test route executed with slug: "${slug}"`);

  // For testing, return a 404 if the slug is "404test"
  if (slug === "404test") {
    console.log("Test route intentionally returning 404");
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a test page to verify dynamic routing.</p>
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="font-bold">Slug parameter:</p>
        <code className="block p-2 bg-gray-200 mt-2 rounded">{slug}</code>
      </div>
    </div>
  );
}
