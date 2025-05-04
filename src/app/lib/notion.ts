import "server-only";

import React from "react";
import { Client } from "@notionhq/client";
import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const fetchPages = React.cache(async (categoryFilter?: string) => {
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

export const fetchCategories = React.cache(async () => {
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

export const fetchBySlug = React.cache(async (slug: string) => {
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

export const fetchPageBlocks = React.cache(async (pageId: string) => {
  return notion.blocks.children
    .list({
      block_id: pageId,
    })
    .then((res) => res.results as BlockObjectResponse[]);
});
