import { defineLive } from "next-sanity";
import { client } from "./client";
import { token } from "./token";

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

export const { sanityFetch: _sanityFetch, SanityLive } = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: token,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: token,
});

// In development, bypass defineLive and fetch directly with previewDrafts perspective
// so saved-but-unpublished content is visible locally without enabling Draft Mode.
export async function sanityFetch({ query, params = {} }: { query: string; params?: Record<string, unknown> }) {
  if (process.env.NODE_ENV === "development") {
    const data = await client.fetch(query, params);
    return { data };
  }
  return _sanityFetch({ query, params });
}

export async function sanityFetchStatic({ query, params = {} }) {
  return client.fetch(query, params);
}
