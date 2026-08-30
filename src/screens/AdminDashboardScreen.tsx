import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { DashboardStats } from "../types";
import { api } from "../services/api";
import {
  Train,
  Users,
  UserCheck,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export const AdminDashboardScreen: React.FC = () => {
  const { showNotification } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.getAdminDashboardStats();
      setStats(res.stats);
    } catch {
      showNotification("Failed to load dashboard statistics", "error");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admin Operations Console</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time operational statistics and system overview
          </p>
        </div>

        {/* 5 Summary Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Level Crossings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total LCs</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Train className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {statsLoading ? "--" : stats?.totalLcs ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Registered rail gates</p>
          </div>

          {/* Card 2: Active Level Crossings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Gates</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {statsLoading ? "--" : stats?.activeLcs ?? 0}
            </div>
            <p className="text-[11px] text-emerald-600/80 font-medium mt-1">Operational in network</p>
          </div>

          {/* Card 3: Total Managers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gate Managers</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {statsLoading ? "--" : stats?.totalManagers ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Staff accounts</p>
          </div>

          {/* Card 4: Assigned Managers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Staff</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-blue-600">
              {statsLoading ? "--" : stats?.assignedManagers ?? 0}
            </div>
            <p className="text-[11px] text-blue-600/80 font-medium mt-1">Active gate mappings</p>
          </div>

          {/* Card 5: Unassigned Level Crossings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unassigned LCs</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-600">
              {statsLoading ? "--" : stats?.unassignedLcs ?? 0}
            </div>
            <p className="text-[11px] text-amber-600/80 font-medium mt-1">Awaiting manager</p>
          </div>
        </div>
      </main>
    </div>
  );
};
