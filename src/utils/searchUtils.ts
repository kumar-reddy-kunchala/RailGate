/**
 * High-performance search normalization utility
 * Ignores casing, whitespace, and special characters (hyphens, dots, slashes, etc.)
 */

export function normalizeSearch(str: string | null | undefined): string {
  if (!str) return "";
  // Strip all non-alphanumeric characters and lowercase
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function tokenizeSearch(str: string | null | undefined): string[] {
  if (!str) return [];
  return str
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Checks if a Level Crossing record matches a user's search query.
 * Case-insensitive, whitespace-insensitive, special-character-insensitive.
 * Examples:
 * - "lc282", "LC-282", "lc 282", "282" all match "LC-282"
 * - "bapatla chirala", "bapatla-chirala", "bapatlachirala" all match "Bapatla - Chirala"
 */
export function matchesLcQuery(
  lc: {
    lc_number?: string;
    lc_name?: string;
    city?: string;
    district?: string;
    state?: string;
    location?: string;
    zone?: string;
    division?: string;
  },
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const rawQuery = query.trim();
  const normQuery = normalizeSearch(rawQuery);
  if (!normQuery) return true;

  const normLcNumber = normalizeSearch(lc.lc_number);
  const normLcName = normalizeSearch(lc.lc_name);
  const normCity = normalizeSearch(lc.city);
  const normDistrict = normalizeSearch(lc.district);
  const normState = normalizeSearch(lc.state);
  const normLocation = normalizeSearch(lc.location);
  const normZone = normalizeSearch(lc.zone);
  const normDivision = normalizeSearch(lc.division);

  // 1. Direct normalized match or normalized substring match
  if (
    normLcNumber.includes(normQuery) ||
    normLcName.includes(normQuery) ||
    normCity.includes(normQuery) ||
    normDistrict.includes(normQuery) ||
    normState.includes(normQuery) ||
    normLocation.includes(normQuery) ||
    normZone.includes(normQuery) ||
    normDivision.includes(normQuery)
  ) {
    return true;
  }

  // 2. Numeric-only match: e.g. user typed "282" and lc is "LC-282", or user typed "lc282"
  const queryDigits = rawQuery.replace(/\D/g, "");
  const lcDigits = (lc.lc_number || "").replace(/\D/g, "");
  if (queryDigits && lcDigits && lcDigits.includes(queryDigits)) {
    return true;
  }

  // 3. Multi-token match: every search word must exist in combined fields
  const tokens = tokenizeSearch(rawQuery);
  if (tokens.length > 1) {
    const combined = `${normLcNumber} ${normLcName} ${normCity} ${normDistrict} ${normState} ${normLocation} ${normZone} ${normDivision}`;
    const allTokensFound = tokens.every((tok) => {
      const normTok = normalizeSearch(tok);
      return combined.includes(normTok);
    });
    if (allTokensFound) return true;
  }

  return false;
}
