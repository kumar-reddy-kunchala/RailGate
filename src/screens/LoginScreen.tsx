import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Train, Lock, Mail, User as UserIcon, Phone, ArrowLeft, KeyRound } from "lucide-react";

export const LoginScreen: React.FC = () => {
  const { login, register, navigateTo, authMode, setAuthMode } = useAuth();

  const [isRegistering, setIsRegistering] = useState<boolean>(authMode === "register");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    setIsRegistering(authMode === "register");
  }, [authMode]);

  const handleTabSwitch = (mode: "login" | "register") => {
    setIsRegistering(mode === "register");
    setAuthMode(mode);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (isRegistering) {
        if (!name.trim()) throw new Error("Full name is required");
        await register(name, email, password, mobile, "USER");
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoRole: "USER" | "MANAGER" | "ADMIN") => {
    handleTabSwitch("login");
    setEmail(demoEmail);
    if (demoRole === "ADMIN") setPassword("admin123");
    else if (demoRole === "MANAGER") setPassword("12345");
    else setPassword("user123");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={() => navigateTo("WELCOME")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div
          onClick={() => navigateTo("WELCOME")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
            <Train className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">RailGateStatus</h1>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-8 relative overflow-hidden">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegistering ? "Create New Profile" : "Sign In to Account"}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            {isRegistering
              ? "Register for citizen access to level crossing statuses"
              : "Enter your credentials to access your account"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Contact Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="+91-9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isRegistering ? "Creating Account..." : "Signing in..."}
              </span>
            ) : (
              <span>{isRegistering ? "Complete Registration" : "Sign In"}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => handleTabSwitch(isRegistering ? "login" : "register")}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            {isRegistering
              ? "Already registered? Click here to Sign In"
              : "Not registered yet? Click here to Create an Account"}
          </button>
        </div>

        {/* Demo Fast-Login Presets */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Instant Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@railgatestatus.com", "ADMIN")}
              className="px-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-[11px] text-indigo-700 font-bold transition-all text-center truncate"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("kumar@railgatestatus.com", "MANAGER")}
              className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] text-emerald-700 font-bold transition-all text-center truncate cursor-pointer"
            >
              Manager Demo
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("user@railgatestatus.com", "USER")}
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-bold transition-all text-center truncate"
            >
              User Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
