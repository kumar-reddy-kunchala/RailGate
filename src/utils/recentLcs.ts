import { LevelCrossing } from "../types";

export interface RecentlyViewedLC {
  id: number;
  lc_number: string;
  lc_name: string;
  state: string;
  district: string;
  city: string;
  location: string;
  current_status: "OPEN" | "CLOSED";
  status_category?: string;
  last_updated?: string;
  viewed_at: number;
}

const STORAGE_KEY = "railgate_recently_viewed_lcs";

export const getRecentlyViewedLcs = (): RecentlyViewedLC[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

export const addRecentlyViewedLc = (lc: LevelCrossing | RecentlyViewedLC): RecentlyViewedLC[] => {
  if (!lc || !lc.id) return getRecentlyViewedLcs();
  try {
    const current = getRecentlyViewedLcs();
    const filtered = current.filter((item) => item.id !== lc.id);
    const updatedItem: RecentlyViewedLC = {
      id: lc.id,
      lc_number: lc.lc_number,
      lc_name: lc.lc_name,
      state: lc.state,
      district: lc.district,
      city: lc.city,
      location: lc.location,
      current_status: lc.current_status,
      status_category: lc.status_category,
      last_updated: lc.last_updated,
      viewed_at: Date.now(),
    };
    const nextList = [updatedItem, ...filtered].slice(0, 8); // Keep top 8 most recent
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    return nextList;
  } catch {
    return [];
  }
};

export const removeRecentlyViewedLc = (lcId: number): RecentlyViewedLC[] => {
  try {
    const current = getRecentlyViewedLcs();
    const nextList = current.filter((item) => item.id !== lcId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    return nextList;
  } catch {
    return [];
  }
};

export const clearRecentlyViewedLcs = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};
