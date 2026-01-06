import { client } from "@/sanity/lib/client";
import { searchQuery, sectionArticleOrderQuery } from "@/sanity/lib/queries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const sections = await client.fetch(sectionArticleOrderQuery());

    const articleIdMap = new Map<string, string>();

    sections?.sections.forEach((section, i) => {
      section.articles.forEach((article, j) => {
        const articleId = `${i + 1}–${String.fromCharCode(65 + j)}`;
        article.articleId = articleId;
        articleIdMap.set(article._id, articleId); 
      });
    });

    const results = await client.fetch(searchQuery(), { query: query });

    results?.forEach((result) => {
      if (result._type === "article" && articleIdMap.has(result._id)) {
        result.id = articleIdMap.get(result._id);
      }
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Sanity search error:", error);
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 },
    );
  }
}
