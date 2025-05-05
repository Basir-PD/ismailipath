import { NextRequest, NextResponse } from "next/server";
import { notion } from "@/app/lib/notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Define types based on the Notion properties we need
type NotionTitle = {
  title: Array<{ plain_text: string }>;
};

type NotionRichText = {
  rich_text: Array<{ plain_text: string }>;
};

type NotionSelect = {
  select: {
    name: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    // Fetch all live pages from Notion
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID as string,
      filter: {
        property: "Status",
        status: {
          equals: "Live",
        },
      },
    });

    // Process the pages to match our search result format
    const allPages = response.results as PageObjectResponse[];

    // Filter the pages by searching through title, description, and category
    const results = allPages
      .filter((page) => {
        const title = (page.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "";
        const excerpt = (page.properties.Description as NotionRichText)?.rich_text?.[0]?.plain_text || "";
        const category = (page.properties.Category as NotionSelect)?.select?.name || "";
        const slug = (page.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "";

        // Create a searchable text combining all relevant fields
        const searchableText = `${title} ${excerpt} ${category} ${slug}`.toLowerCase();

        return searchableText.includes(query.toLowerCase());
      })
      .map((page) => {
        // Transform the page into the format expected by the frontend
        return {
          id: page.id,
          title: (page.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled",
          excerpt: (page.properties.Description as NotionRichText)?.rich_text?.[0]?.plain_text || "No description available",
          slug: (page.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "",
          date: page.created_time,
          category: (page.properties.Category as NotionSelect)?.select?.name || "Uncategorized",
        };
      });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
