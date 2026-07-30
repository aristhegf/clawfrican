import { client } from "./client";
import { hasSanityConfig } from "../env";

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 3600,
  tags = [],
  fallback,
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
  fallback: T;
}): Promise<T> {
  if (!hasSanityConfig) return fallback;
  try {
    return await client.fetch<T>(query, params, {
      next: {
        revalidate,
        tags: tags.length ? tags : undefined,
      },
    });
  } catch (err) {
    console.error("Sanity fetch error:", err);
    return fallback;
  }
}
