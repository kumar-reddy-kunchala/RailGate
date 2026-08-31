import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Train,
  Users,
  UserCheck,
  MessageSquare,
} from "lucide-react";

export const AdminMobileNav: React.FC = () => {
  const { currentScreen, navigateTo } = useAuth();

  const navItems = [
    { id: "ADMIN_DASHBOARD", shortLabel: "Dashboard", fullLabel: "Dashboard", icon: LayoutDashboard },
    { id: "ADMIN_LC", shortLabel: "LC Gates", fullLabel: "Level Crossings", icon: Train },
    { id: "ADMIN_MANAGERS", shortLabel: "Managers", fullLabel: "Managers", icon: Users },
    { id: "ADMIN_MAPPING", shortLabel: "Assign", fullLabel: "Assignment", icon: UserCheck },
    { id: "ADMIN_FEEDBACK", shortLabel: "Feedback", fullLabel: "Feedback", icon: MessageSquare },
  ];

  return (
    <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2">
        <nav
          aria-label="Admin Navigation"
          className="grid grid-cols-5 gap-1 sm:gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id as any)}
                className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2 px-1 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
                  isActive
                    ? "bg-white text-blue-700 shadow-xs font-bold ring-1 ring-slate-900/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? "text-blue-600 scale-105" : "text-slate-400"
                  }`}
                />
                <span className="truncate leading-tight">
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.fullLabel}</span>
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full sm:hidden" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
