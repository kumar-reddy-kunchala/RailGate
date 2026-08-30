import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LevelCrossing } from "../types";
import { api } from "../services/api";
import { MapPin, Save, AlertTriangle, CheckCircle, RefreshCw, Train, Clock } from "lucide-react";
import { useLiveTimestamp } from "../utils/formatTime";

export const ManagerDashboardScreen: React.FC = () => {
  const { user, showNotification } = useAuth();

  const [lc, setLc] = useState<LevelCrossing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Form states
  const [gateStatus, setGateStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const [statusCategory, setStatusCategory] = useState<string>("Operational");
  const [remarks, setRemarks] = useState<string>("");

  const timeInfo = useLiveTimestamp(lc?.updated_at, lc?.last_updated);

  const statusCategories = [
    "Operational",
    "Under Maintenance",
    "Signal Failure",
    "Accident / Incident",
    "Manual Override",
  ];

  const fetchAssignedLc = async () => {
    setLoading(true);
    try {
      const res = await api.getManagerMyLc();
      setLc(res.lc);
      setGateStatus(res.lc.current_status || "OPEN");
      setStatusCategory(res.lc.status_category || "Operational");
      setRemarks(res.lc.maintenance_information || "");
    } catch (err: any) {
      setLc(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSilentAssignedLc = async () => {
    try {
      const res = await api.getManagerMyLc();
      setLc(res.lc);
    } catch {
      // Silent error
    }
  };

  useEffect(() => {
    fetchAssignedLc();
  }, []);

  // Background auto-refresh every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSilentAssignedLc();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.updateManagerLcStatus({
        current_status: gateStatus,
        status_category: statusCategory,
        maintenance_information: remarks,
      });
      setLc(res.lc);
      showNotification("Status updated successfully", "success");
    } catch (err: any) {
      showNotification(err.message || "Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Gate Manager Console</h1>
            <p className="text-slate-500 text-sm mt-1">
              Gate Manager: <span className="text-slate-800 font-semibold">{user?.name}</span> ({user?.email})
            </p>
          </div>

          <button
            onClick={fetchAssignedLc}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white border border-slate-200 rounded-2xl">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading assigned level crossing details...</p>
          </div>
        ) : !lc ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-xl font-extrabold text-slate-900">No Level Crossing Assigned</h3>
            <p className="text-sm text-slate-500">
              Your account currently has no active Level Crossing assigned. Please contact a System Administrator to assign a level crossing to your manager account.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* LC Info Overview Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-bold text-blue-600">{lc.lc_number}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-semibold">Assigned Gate</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{lc.lc_name}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {lc.city}, {lc.district}, {lc.state} ({lc.location})
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end justify-center bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 min-w-[190px]">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                    Current Gate Status
                  </span>
                  <span
                    className={`text-2xl font-black my-0.5 ${
                      lc.current_status === "OPEN" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {lc.current_status === "OPEN" ? "OPEN" : "CLOSED"}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-200 w-full flex items-center justify-between gap-2">
                    <span className="text-slate-400 font-semibold uppercase">Updated:</span>
                    <span className="text-slate-800 font-medium">{timeInfo.exact} <span className="text-slate-400 font-normal">({timeInfo.relative})</span></span>
                  </div>
                </div>
              </div>

              {/* LC Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Status Category</span>
                  <span className="text-slate-900 font-bold text-sm">{lc.status_category || "Operational"}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Gate Mode</span>
                  <span
                    className={`font-bold text-sm ${
                      lc.current_status === "OPEN" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {lc.current_status === "OPEN" ? "Open" : "Closed"}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Location</span>
                  <span className="text-slate-800 font-semibold">{lc.city}, {lc.state}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Last Timestamp</span>
                  <span className="text-slate-700 font-mono text-xs font-semibold">{timeInfo.exact} <span className="text-slate-400 font-normal">({timeInfo.relative})</span></span>
                </div>
              </div>

              {/* Existing Maintenance Remarks */}
              {lc.maintenance_information && (
                <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-700 block mb-1">Current Maintenance Remarks:</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{lc.maintenance_information}</p>
                </div>
              )}
            </div>

            {/* Simple Update Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Update Gate Operational Status</h2>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Update the operational gate status, condition category, and maintenance remarks for this level crossing.
              </p>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Gate Status Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Gate Physical Status
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGateStatus("OPEN")}
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                          gateStatus === "OPEN"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Open</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGateStatus("CLOSED")}
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                          gateStatus === "CLOSED"
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Closed</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Status Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Operational Condition
                    </label>
                    <select
                      value={statusCategory}
                      onChange={(e) => setStatusCategory(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-sm focus:outline-none transition-all"
                    >
                      {statusCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Maintenance Remarks Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Maintenance & Incident Remarks
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter current maintenance remarks, reason for closure, or operational notes..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all resize-y"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="py-2.5 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {updating ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Gate Status
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
