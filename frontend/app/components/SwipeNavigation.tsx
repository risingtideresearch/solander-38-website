"use client";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

/**
 * Renders nothing — purely attaches touch-swipe listeners to navigate
 * between prev/next URLs. Place this inside any Server Component page.
 */
export function SwipeNavigation({
  prevUrl,
  nextUrl,
}: {
  prevUrl: string | null;
  nextUrl: string | null;
}) {
  useSwipeNavigation(prevUrl, nextUrl);
  return null;
}
