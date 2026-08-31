import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { LevelCrossing } from "../types";
import { api } from "../services/api";
import {
  MapPin,
  ChevronRight,
  Train,
  X,
  Search,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import { matchesLcQuery } from "../utils/searchUtils";
import { formatLiveRelativeTime } from "../utils/formatTime";
import { ALL_INDIAN_STATES, STATE_DISTRICT_TOWNS } from "../utils/hierarchy";

// Standard location data hierarchy covering all states and union territories
export const LOCATION_HIERARCHY: Record<string, Record<string, string[]>> = STATE_DISTRICT_TOWNS;

export const FindLCScreen: React.FC = () => {
  const { navigateTo, searchFilter, setSearchFilter, showNotification } = useAuth();

  const [lcs, setLcs] = useState<LevelCrossing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>(searchFilter.lc_number || "");
  const [selectedState, setSelectedState] = useState<string>(searchFilter.state || "");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(searchFilter.district || "");
  const [selectedTown, setSelectedTown] = useState<string>(searchFilter.city || "");

  // Fetch crossings from API
  const fetchLcs = async () => {
    setLoading(true);
    try {
      const res = await api.getLcs();
      setLcs(res.lcs || []);
    } catch {
      showNotification("Failed to load level crossings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLcs();
  }, []);

  // Update query state if global searchFilter changes
  useEffect(() => {
    if (searchFilter.lc_number !== undefined && searchFilter.lc_number !== searchQuery) {
      setSearchQuery(searchFilter.lc_number);
    }
  }, [searchFilter.lc_number]);

  // Derived available states from hierarchy & data
  const availableStates = useMemo(() => {
    const states = new Set<string>(ALL_INDIAN_STATES);
    Object.keys(LOCATION_HIERARCHY).forEach((st) => states.add(st));
    lcs.forEach((lc) => {
      if (lc.state) states.add(lc.state);
    });
    return Array.from(states).sort();
  }, [lcs]);

  // Derived available districts for selected state
  const availableDistricts = useMemo(() => {
    if (!selectedState) return [];
    const districts = new Set<string>();
    if (LOCATION_HIERARCHY[selectedState]) {
      Object.keys(LOCATION_HIERARCHY[selectedState]).forEach((d) => districts.add(d));
    }
    lcs
      .filter((lc) => lc.state?.toLowerCase() === selectedState.toLowerCase())
      .forEach((lc) => {
        if (lc.district) districts.add(lc.district);
      });
    return Array.from(districts).sort();
  }, [selectedState, lcs]);

  // Derived available towns for selected state & district
  const availableTowns = useMemo(() => {
    if (!selectedState || !selectedDistrict) return [];
    const towns = new Set<string>();
    if (LOCATION_HIERARCHY[selectedState]?.[selectedDistrict]) {
      LOCATION_HIERARCHY[selectedState][selectedDistrict].forEach((t) => towns.add(t));
    }
    lcs
      .filter(
        (lc) =>
          lc.state?.toLowerCase() === selectedState.toLowerCase() &&
          lc.district?.toLowerCase() === selectedDistrict.toLowerCase()
      )
      .forEach((lc) => {
        if (lc.city) towns.add(lc.city);
      });
    return Array.from(towns).sort();
  }, [selectedState, selectedDistrict, lcs]);

  // Check if any search or filter is actively set
  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedState || selectedDistrict || selectedTown
  );

  // Filtered List based on search query, state, district, town
  const filteredLcs = useMemo(() => {
    // If no search query and no location selected, return empty list
    if (!hasActiveFilters) {
      return [];
    }

    return lcs.filter((lc) => {
      // Search Query filter (case, whitespace, and special-character insensitive)
      if (searchQuery.trim()) {
        if (!matchesLcQuery(lc, searchQuery)) {
          return false;
        }
      }

      // State Filter
      if (selectedState && lc.state?.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // District Filter
      if (selectedDistrict && lc.district?.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }

      // Town / City Filter
      if (selectedTown && lc.city?.toLowerCase() !== selectedTown.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [lcs, searchQuery, selectedState, selectedDistrict, selectedTown, hasActiveFilters]);

  // Location Handlers
  const handleStateChange = (stateVal: string) => {
    setSelectedState(stateVal);
    setSelectedDistrict("");
    setSelectedTown("");
  };

  const handleDistrictChange = (distVal: string) => {
    setSelectedDistrict(distVal);
    setSelectedTown("");
  };

  const handleTownChange = (townVal: string) => {
    setSelectedTown(townVal);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedTown("");
    setSearchFilter({ lc_number: "", state: "", district: "", city: "" });
  };

  const handleInspectLc = (lc: LevelCrossing) => {
    navigateTo("LC_DETAILS", { lcId: lc.id, lc });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Level Crossings Directory
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Search by gate number or select your location to view level crossing status
            </p>
          </div>

          {hasActiveFilters && (
            <div>
              <button
                onClick={handleClearFilters}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
                <span>Clear Selection</span>
              </button>
            </div>
          )}
        </div>

        {/* Search & Location Filters Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-xs space-y-4">
          {/* Search by Gate Number / Name */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Gate Number (e.g. LC-101), Gate Name, or Landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Selectors Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            {/* State Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
              >
                <option value="">Select State</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                District
              </label>
              <select
                value={selectedDistrict}
                disabled={!selectedState}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                  !selectedState
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-600"
                }`}
              >
                <option value="">
                  {!selectedState ? "Select State first" : "Select District"}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Town / Mandal Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Town / Mandal
              </label>
              <select
                value={selectedTown}
                disabled={!selectedDistrict}
                onChange={(e) => handleTownChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer focus:outline-none ${
                  !selectedDistrict
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-600"
                }`}
              >
                <option value="">
                  {!selectedDistrict ? "Select District first" : "All Towns"}
                </option>
                {availableTowns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Town Chips (Visible when district is selected) */}
          {selectedDistrict && availableTowns.length > 0 && (
            <div className="pt-2 flex items-center flex-wrap gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-blue-600" />
                <span>Quick Filter:</span>
              </span>
              <button
                type="button"
                onClick={() => handleTownChange("")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !selectedTown
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Towns
              </button>
              {availableTowns.map((town) => (
                <button
                  key={town}
                  type="button"
                  onClick={() => handleTownChange(selectedTown === town ? "" : town)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedTown === town
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {town}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Area */}
        <div>
          {loading ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-500">Loading railway crossings...</p>
            </div>
          ) : !hasActiveFilters ? (
            /* Prompt State when no search query or location has been selected */
            <div className="bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Search or Select a Location</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                Enter a gate number or name in the search bar above, or select your State and District to display railway crossings.
              </p>
            </div>
          ) : filteredLcs.length === 0 ? (
            /* Empty State when search/location returns 0 results */
            <div className="bg-white border border-slate-200 rounded-2xl py-16 px-4 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Train className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Level Crossings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                No level crossings matched your search or selected location.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Crossings Grid - shown only after searching or selecting */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLcs.map((lc) => {
                const isOpen = lc.current_status === "OPEN";

                return (
                  <div
                    key={lc.id}
                    onClick={() => handleInspectLc(lc)}
                    className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      {/* LC Number & City Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-blue-600 group-hover:text-blue-700 transition-colors font-mono tracking-tight">
                            {lc.lc_number}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {lc.city || lc.district}
                        </span>
                      </div>

                      {/* LC Name */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-1">
                        {lc.lc_name}
                      </h3>

                      {/* Location & Railway Zone */}
                      <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                        <p className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>
                            {lc.city || lc.district}, {lc.state}
                          </span>
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium">
                              {lc.zone || "SCR"} Zone
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium">
                              {lc.division || "BZA"} Div
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formatLiveRelativeTime(lc.updated_at, lc.last_updated)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Inspect Button */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isOpen
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                        />
                        <span>{isOpen ? "GATE OPEN" : "GATE CLOSED"}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLc(lc);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-bold transition-all flex items-center gap-1 text-xs shadow-2xs"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
