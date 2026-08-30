import { useState, useEffect } from "react";

/**
 * Parses any date representation (ISO string, timestamp, or human string like "2 min ago")
 * into a Date object or relative description.
 */
export function parseDate(dateVal?: string | number | Date | null): Date | null {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;
  if (typeof dateVal === "number") return new Date(dateVal);

  // If it's an ISO string or standard date parseable string
  const parsed = new Date(dateVal);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return null;
}

/**
 * Returns formatted relative time like "Just now", "12s ago", "2m ago", "1h ago", etc.
 */
export function formatLiveRelativeTime(
  updatedAt?: string | null,
  fallbackText?: string | null
): string {
  if (!updatedAt && !fallbackText) return "Just now";

  const date = parseDate(updatedAt);
  if (!date) {
    return fallbackText || "Just now";
  }

  const now = Date.now();
  const diffMs = Math.max(0, now - date.getTime());
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 10) {
    return "Just now";
  }
  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  }
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

/**
 * Formats full exact local time (e.g., "1:15:42 PM" or "Aug 30, 2026, 1:15:42 PM")
 */
export function formatExactTime(
  updatedAt?: string | null,
  includeDate = false
): string {
  const date = parseDate(updatedAt);
  if (!date) {
    return updatedAt || "Just now";
  }

  if (includeDate) {
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Hook that triggers a re-render every interval to update relative timestamps live
 */
export function useLiveTimestamp(
  updatedAt?: string | null,
  fallbackText?: string | null,
  intervalMs = 3000
): { relative: string; exact: string; fullExact: string } {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, updatedAt]);

  return {
    relative: formatLiveRelativeTime(updatedAt, fallbackText),
    exact: formatExactTime(updatedAt, false),
    fullExact: formatExactTime(updatedAt, true),
  };
}
