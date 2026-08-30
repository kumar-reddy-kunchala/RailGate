import { useState, useEffect } from "react";

/**
 * Normalizes text for search operations by:
 * - Converting to lowercase
 * - Stripping all non-alphanumeric characters (spaces, dashes, slashes, punctuation, symbols)
 * e.g., "LC-101" -> "lc101", "Bapatla (Town)" -> "bapatlatown", "lc - 282" -> "lc282"
 */
export function normalizeSearchString(text: string | null | undefined): string {
  if (!text) return "";
  return String(text).toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Checks if a target (or list of target fields) matches a search query with:
 * 1. Normalized alphanumeric substring match (ignoring case, spaces, dashes, special chars)
 * 2. Token-based sub-matching (all words/tokens in query match anywhere in target)
 * 3. Standard raw case-insensitive includes
 */
export function matchesSearch(
  target: string | (string | undefined | null)[] | undefined | null,
  query: string
): boolean {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const targets = Array.isArray(target) ? target.filter(Boolean) as string[] : [String(target)];
  if (targets.length === 0) return false;

  const rawQuery = query.trim().toLowerCase();
  const normQuery = normalizeSearchString(query);

  const combinedRaw = targets.join(" ").toLowerCase();
  const combinedNorm = normalizeSearchString(targets.join(" "));

  // 1. Direct normalized match (e.g., query "lc101" or "101" in "lc101" or "bapatlatown")
  if (normQuery && combinedNorm.includes(normQuery)) {
    return true;
  }

  // 2. Token-based matching: split query on whitespace and special characters
  const tokens = rawQuery.split(/[\s\-_,./#]+/).filter(Boolean);
  if (tokens.length > 0) {
    const allTokensMatch = tokens.every((token) => {
      const normToken = normalizeSearchString(token);
      return normToken ? combinedNorm.includes(normToken) : combinedRaw.includes(token);
    });
    if (allTokensMatch) return true;
  }

  // 3. Fallback: standard case-insensitive inclusion
  if (combinedRaw.includes(rawQuery)) {
    return true;
  }

  return false;
}

/**
 * Parses and formats an ISO timestamp or date string to accurate live relative and exact time
 */
export function formatLiveTimestamp(
  updatedAt?: string | null,
  fallbackLastUpdated?: string | null
): {
  exact: string;
  relative: string;
  display: string;
  isRecent: boolean;
} {
  let date: Date | null = null;

  if (updatedAt) {
    const parsed = Date.parse(updatedAt);
    if (!isNaN(parsed)) {
      date = new Date(parsed);
    }
  }

  // If no parseable ISO timestamp, check if fallbackLastUpdated is ISO or formatted
  if (!date && fallbackLastUpdated) {
    const parsed = Date.parse(fallbackLastUpdated);
    if (!isNaN(parsed)) {
      date = new Date(parsed);
    }
  }

  // If we couldn't parse a real Date object, use fallback or "Just now"
  if (!date) {
    const fb = fallbackLastUpdated || "Just now";
    return {
      exact: fb,
      relative: fb,
      display: fb,
      isRecent: true,
    };
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));

  let relative = "Just now";
  let isRecent = false;

  if (diffSecs < 10) {
    relative = "Just now";
    isRecent = true;
  } else if (diffSecs < 60) {
    relative = `${diffSecs}s ago`;
    isRecent = true;
  } else {
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) {
      relative = `${diffMins}m ago`;
      isRecent = diffMins < 5;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        relative = `${diffHours}h ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        relative = `${diffDays}d ago`;
      }
    }
  }

  // Exact localized time with hour:minute:second
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isToday = now.toDateString() === date.toDateString();
  const exact = isToday
    ? `Today, ${timeStr}`
    : `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;

  return {
    exact,
    relative,
    display: `${exact} (${relative})`,
    isRecent,
  };
}

/**
 * Custom React hook to re-render component every N milliseconds for live clock / relative time updates
 */
export function useLiveTick(intervalMs: number = 5000): number {
  const [tick, setTick] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(Date.now());
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return tick;
}
