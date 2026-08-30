import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Train, LogIn, LayoutDashboard, UserCheck, User as UserIcon, LogOut } from "lucide-react";
import { FullScreenProfileModal } from "./FullScreenProfileModal";

export const Header: React.FC = () => {
  const { user, currentScreen, navigateTo, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
            onClick={() =>
              navigateTo(
                user
                  ? user.role === "ADMIN"
                    ? "ADMIN_DASHBOARD"
                    : user.role === "MANAGER"
                    ? "MY_LC"
                    : "FIND_LC"
                  : "WELCOME"
              )
            }
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs shrink-0">
              <Train className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1 leading-tight truncate">
                RailGate<span className="text-blue-600">Status</span>
              </h1>
              <p className="hidden xs:block text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight truncate">
                Railway Level Crossing System
              </p>
            </div>
          </div>

          {/* Navigation Links & User Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {user && (
              <nav className="hidden lg:flex items-center gap-1">
                {user.role === "MANAGER" && (
                  <button
                    onClick={() => navigateTo("MY_LC")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      currentScreen === "MY_LC"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>My Assigned LC</span>
                  </button>
                )}

                {user.role === "ADMIN" && (
                  <button
                    onClick={() => navigateTo("ADMIN_DASHBOARD")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      currentScreen.startsWith("ADMIN")
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
              </nav>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "USER" ? (
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs hover:shadow-md ring-2 ring-slate-200 hover:ring-blue-500 transition-all cursor-pointer select-none active:scale-95 shrink-0"
                    title={`Profile, Settings & Feedback (${user.name})`}
                    aria-label="User Profile, Settings and Feedback"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </button>
                ) : (
                  <button
                    onClick={logout}
                    className="px-3.5 py-2 min-h-[38px] rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            ) : currentScreen !== "WELCOME" ? (
              <button
                onClick={() => navigateTo("LOGIN", { authMode: "login" })}
                className="px-3 sm:px-4 py-2 min-h-[40px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Full-Screen Profile & Settings Modal for Regular Users */}
      {user && user.role === "USER" && (
        <FullScreenProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};
