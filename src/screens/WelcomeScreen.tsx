import React from "react";
import { useAuth } from "../context/AuthContext";
import { Train, UserCheck, Shield, Search, ArrowRight, LogIn } from "lucide-react";

export const WelcomeScreen: React.FC = () => {
  const { user, navigateTo } = useAuth();

  const handlePublicUserClick = () => {
    if (user) {
      navigateTo("FIND_LC");
    } else {
      navigateTo("LOGIN", { authMode: "login" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center w-full">
        {/* Header Title */}
        <div className="text-center space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase shadow-xs">
            <Train className="w-3.5 h-3.5 text-blue-600" />
            <span>Railway Level Crossing Information System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            RailGate<span className="text-blue-600">Status</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Real-time railway level crossing status, schedule monitoring, and gate management portal.
          </p>
        </div>

        {/* 3 Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Public User Portal */}
          <div className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-lg shadow-sm group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                  Citizen Portal
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Public User</h2>
                <p className="text-sm text-slate-500 leading-relaxed mt-2">
                  Sign in or create a public account to search crossings and check live gate status.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100">
              {user ? (
                <button
                  onClick={handlePublicUserClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Level Crossings</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              ) : (
                <button
                  onClick={handlePublicUserClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Gate Manager Portal */}
          <div className="bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-lg shadow-sm group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  Operations
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gate Manager</h2>
                <p className="text-sm text-slate-500 leading-relaxed mt-2">
                  Update live gate status, log maintenance details, and oversee assigned crossing operations.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100">
              <button
                onClick={() => navigateTo(user?.role === "MANAGER" ? "MY_LC" : "LOGIN", { authMode: "login" })}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-600 border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{user?.role === "MANAGER" ? "Go to Manager Dashboard" : "Manager Login"}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Administrator Portal */}
          <div className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-lg shadow-sm group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
                  Control Panel
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Administrator</h2>
                <p className="text-sm text-slate-500 leading-relaxed mt-2">
                  System administration, crossing management, manager assignments, and operational logs.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100">
              <button
                onClick={() => navigateTo(user?.role === "ADMIN" ? "ADMIN_DASHBOARD" : "LOGIN", { authMode: "login" })}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-indigo-600 border border-slate-200 hover:border-indigo-600 text-slate-700 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{user?.role === "ADMIN" ? "Go to Admin Panel" : "Admin Login"}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

