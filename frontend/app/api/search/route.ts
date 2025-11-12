import { client } from "@/sanity/lib/client";
import { searchQuery } from "@/sanity/lib/queries";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const results = await client.fetch(searchQuery(), {query: query});

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Sanity search error:", error);
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
