import { client } from "@/sanity/lib/client";
import { searchQuery } from "@/sanity/lib/queries";
import { fetchArticleIdMap } from "@/sanity/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const [results, articleIdMap] = await Promise.all([
      client.fetch(searchQuery(), { query: query }),
      fetchArticleIdMap(),
    ]);

    const enriched = results.map((result: any) =>
      result._type === "article"
        ? { ...result, articleId: articleIdMap[result._id] }
        : result
    );

    return NextResponse.json({ results: enriched });
  } catch (error) {
    console.error("Sanity search error:", error);
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 },
    );
  }
}
