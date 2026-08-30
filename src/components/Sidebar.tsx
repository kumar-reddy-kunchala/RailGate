import React from "react";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Train, Users, UserCheck, MessageSquare, LogOut, Shield } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, logout, user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Admin Profile Box */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Administrator"}</p>
            <span className="text-xs text-indigo-600 font-semibold">System Admin</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Management</p>

          <button
            onClick={() => navigateTo("ADMIN_DASHBOARD")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentScreen === "ADMIN_DASHBOARD"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => navigateTo("ADMIN_LC")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentScreen === "ADMIN_LC"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Train className="w-4 h-4" />
            Level Crossings
          </button>

          <button
            onClick={() => navigateTo("ADMIN_MANAGERS")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentScreen === "ADMIN_MANAGERS"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            Managers
          </button>

          <button
            onClick={() => navigateTo("ADMIN_MAPPING")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentScreen === "ADMIN_MAPPING"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Manager Assignment
          </button>

          <button
            onClick={() => navigateTo("ADMIN_FEEDBACK")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentScreen === "ADMIN_FEEDBACK"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            User Feedback
          </button>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          Logout
        </button>
      </div>
    </aside>
  );
};
