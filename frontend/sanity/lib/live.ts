import { client } from "./client";

export async function sanityFetch({ query, params = {} }: { query: string; params?: Record<string, unknown> }) {
  const data = await client.fetch(query, params);
  return { data };
}

export async function sanityFetchStatic({ query, params = {} }) {
  return client.fetch(query, params);
}
