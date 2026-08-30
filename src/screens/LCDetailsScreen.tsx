import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { LevelCrossing } from "../types";
import { api } from "../services/api";
import { addRecentlyViewedLc } from "../utils/recentLcs";
import { formatLiveTimestamp, useLiveTick } from "../utils/searchAndDate";
import { ArrowLeft, MapPin, Wrench, AlertTriangle, RefreshCw, Radio, Clock } from "lucide-react";

export const LCDetailsScreen: React.FC = () => {
  const { selectedLcId, selectedLc: contextLc, navigateTo, showNotification } = useAuth();

  const [lc, setLc] = useState<LevelCrossing | null>(contextLc);
  const [loading, setLoading] = useState<boolean>(!contextLc);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const targetIdRef = useRef<number | null>(contextLc ? contextLc.id : selectedLcId || null);

  useEffect(() => {
    if (contextLc) {
      targetIdRef.current = contextLc.id;
      setLc(contextLc);
    } else if (selectedLcId) {
      targetIdRef.current = selectedLcId;
    }
  }, [selectedLcId, contextLc]);

  // Initial load
  const fetchInitialDetails = async () => {
    const targetId = targetIdRef.current;
    if (!targetId) {
      navigateTo("FIND_LC");
      return;
    }
    setLoading(true);
    try {
      const res = await api.getLcDetails(targetId);
      setLc(res.lc);
      addRecentlyViewedLc(res.lc);
    } catch {
      showNotification("Failed to fetch Level Crossing details", "error");
    } finally {
      setLoading(false);
    }
  };

  // Silent background fetch for 2-second auto-refresh
  const fetchSilentDetails = async () => {
    const targetId = targetIdRef.current;
    if (!targetId) return;
    try {
      const res = await api.getLcDetails(targetId);
      setLc(res.lc);
    } catch {
      // Silent error handling for background polling
    }
  };

  // Manual refresh with visual spinner
  const handleManualRefresh = async () => {
    const targetId = targetIdRef.current;
    if (!targetId) return;
    setIsRefreshing(true);
    try {
      const res = await api.getLcDetails(targetId);
      setLc(res.lc);
    } catch {
      showNotification("Failed to refresh Level Crossing details", "error");
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  // Initial fetch on mount / ID change
  useEffect(() => {
    fetchInitialDetails();
  }, [selectedLcId]);

  // Auto-refresh every 2 seconds in background
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSilentDetails();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedLcId]);

  // Call all hooks unconditionally before any early returns
  useLiveTick(3000);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-semibold">Loading Level Crossing details...</p>
        </div>
      </div>
    );
  }

  if (!lc) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-extrabold text-slate-900">Level Crossing Not Found</h2>
          <p className="text-sm text-slate-500">The requested level crossing record could not be found.</p>
          <button
            onClick={() => navigateTo("FIND_LC")}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const isOpen = lc.current_status === "OPEN";
  const timeInfo = formatLiveTimestamp(lc.updated_at, lc.last_updated);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Breadcrumb & Live Polling Status */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => navigateTo("FIND_LC")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Back to Directory</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Live Polling Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-600">Auto-refresh (2s)</span>
            </div>

            <button
              onClick={handleManualRefresh}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              title="Manual Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Main Status Header Card */}
        <div
          className={`rounded-3xl p-6 sm:p-8 border mb-8 shadow-xs relative overflow-hidden transition-all ${
            isOpen
              ? "bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border-emerald-200 text-emerald-950"
              : "bg-gradient-to-r from-rose-50 via-red-50/40 to-white border-rose-200 text-rose-950"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-sm font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-blue-700 shadow-2xs">
                  {lc.lc_number}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {lc.status_category || "Operational"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{lc.lc_name}</h1>
              <p className="text-sm text-slate-600 mt-2 flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                {lc.city}, {lc.district}, {lc.state} ({lc.location})
              </p>
            </div>

            {/* Gate Status Badge with Last Updated positioned underneath */}
            <div className="flex flex-col items-start md:items-end justify-center bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0 min-w-[210px]">
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Gate Status</p>
              <div
                className={`text-3xl font-black tracking-wide my-1 ${
                  isOpen ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {isOpen ? "OPEN" : "CLOSED"}
              </div>
              {/* Last updated placed right under gate status */}
              <div className="mt-1 pt-2 border-t border-slate-100 w-full flex items-center justify-between md:justify-end gap-2 text-[11px]">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Last Updated:</span>
                <span className="text-slate-800 font-mono font-semibold">{timeInfo.exact} <span className="text-slate-500 font-normal">({timeInfo.relative})</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* LC Information Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Status & Operational Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
              Level Crossing Overview
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">LC Number</span>
                <span className="font-mono font-bold text-slate-900">{lc.lc_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Operational Category</span>
                <span className="font-bold text-blue-600">{lc.status_category || "Operational"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Gate Status</span>
                <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                  isOpen ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  {isOpen ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Last Status Change</span>
                <span className="text-slate-700 font-mono text-xs font-semibold">{timeInfo.exact} <span className="text-slate-400 font-normal">({timeInfo.relative})</span></span>
              </div>
            </div>
          </div>

          {/* Location & Assigned Manager */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
              Regional Assignment
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">State</span>
                <span className="text-slate-900 font-semibold">{lc.state}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">District</span>
                <span className="text-slate-900 font-semibold">{lc.district}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">City</span>
                <span className="text-slate-900 font-semibold">{lc.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Location Details</span>
                <span className="text-slate-700 text-xs font-medium">{lc.location}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Assigned Manager</span>
                {lc.assigned_manager && lc.assigned_manager.id ? (
                  <span className="text-blue-700 font-bold">{lc.assigned_manager.name}</span>
                ) : (
                  <span className="text-amber-600 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Unassigned</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Remarks Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>Maintenance & Operations Remarks</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
            {lc.maintenance_information || "No maintenance remarks entered."}
          </div>
        </div>
      </main>
    </div>
  );
};
