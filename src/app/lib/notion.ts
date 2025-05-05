import { cache } from "react";
import { Client } from "@notionhq/client";
import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Enhanced caching for page fetching
export const fetchPages = cache(async (categoryFilter?: string) => {
  console.log(`Fetching pages ${categoryFilter ? `for category: ${categoryFilter}` : "all"}`);

  const filter = categoryFilter
    ? {
        and: [
          {
            property: "Status",
            status: {
              equals: "Live",
            },
          },
          {
            property: "Category",
            select: {
              equals: categoryFilter,
            },
          },
        ],
      }
    : {
        property: "Status",
        status: {
          equals: "Live",
        },
      };

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    filter,
  });

  return response.results;
});

// Enhanced caching for categories fetching
export const fetchCategories = cache(async () => {
  console.log("Fetching categories");

  const response = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID as string,
  });

  // Extract categories from the database properties
  const categoryProperty = response.properties.Category;
  if (categoryProperty?.type === "select" && categoryProperty.select.options) {
    return categoryProperty.select.options.map((option) => ({
      id: option.id,
      name: option.name,
      color: option.color,
    }));
  }

  return [];
});

// Enhanced caching for slug-based page fetching
export const fetchBySlug = cache(async (slug: string) => {
  console.log(`Fetching page by slug: ${slug}`);

  return notion.databases
    .query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    })
    .then((res) => res.results[0] as PageObjectResponse | undefined);
});

// Enhanced caching for block fetching
export const fetchPageBlocks = cache(async (pageId: string) => {
  console.log(`Fetching blocks for page: ${pageId}`);

  return notion.blocks.children
    .list({
      block_id: pageId,
    })
    .then((res) => res.results as BlockObjectResponse[]);
});
