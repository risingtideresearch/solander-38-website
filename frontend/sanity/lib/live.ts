import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { token } from "./token";

const isPreviewSite = process.env.NEXT_PUBLIC_PREVIEW_SITE === "true";

const { sanityFetch: liveFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  // On the preview site: bypass the Next.js data cache so every page load
  // fetches fresh draft content from Sanity instead of serving the SSG build.
  ...(isPreviewSite ? { fetchOptions: { revalidate: 0 } } : {}),
});

async function staticFetch({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}) {
  const data = await client.fetch(query, params);
  return { data };
}

export const sanityFetch = isPreviewSite
  ? (opts: Parameters<typeof liveFetch>[0]) =>
      liveFetch({ ...opts, perspective: "drafts" })
  : staticFetch;
export const sanityFetchStatic = staticFetch;
export { SanityLive };
