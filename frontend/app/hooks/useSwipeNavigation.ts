"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Attaches touch listeners to the document and navigates to prevUrl/nextUrl
 * when the user swipes right/left by at least `threshold` pixels.
 */
export function useSwipeNavigation(
  prevUrl: string | null,
  nextUrl: string | null,
  threshold = 60,
) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;

      if (Math.abs(deltaX) < threshold) return;

      if (deltaX > 0 && prevUrl) {
        // Swiped right → previous
        router.push(prevUrl);
      } else if (deltaX < 0 && nextUrl) {
        // Swiped left → next
        router.push(nextUrl);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [prevUrl, nextUrl, router, threshold]);
}
