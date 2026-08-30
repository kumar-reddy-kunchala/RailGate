import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { UserSettings, UserFeedback } from "../types";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Settings,
  Bell,
  Volume2,
  Clock,
  Gauge,
  MessageSquarePlus,
  History,
  Send,
  Star,
  RotateCcw,
  Check,
  LogOut,
  ArrowLeft,
  Search,
  UserCheck,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

const RAILWAY_ZONES = [
  "South Central Railway (Vijayawada Division - Bapatla)",
  "South Central Railway (Guntur Division)",
  "Southern Railway (Chennai Division)",
  "East Coast Railway (Waltair Division)",
  "South Western Railway (Hubballi Division)",
];

const FEEDBACK_CATEGORIES = [
  { id: "Gate Status Accuracy", label: "Gate Status Accuracy / Timing" },
  { id: "Report Crossing Issue", label: "Report Crossing Issue or Defect" },
  { id: "Feature Suggestion", label: "App Feature Suggestion" },
  { id: "App Experience", label: "General Experience & Usability" },
  { id: "Other", label: "Other Inquiry" },
];

export const ProfileScreen: React.FC = () => {
  const {
    user,
    logout,
    navigateTo,
    updateUserProfile,
    settings,
    updateSettings,
    playNotificationSound,
    showNotification,
  } = useAuth();

  // Active section tab
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "feedback">("profile");

  // Profile state
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Settings state
  const [localSettings, setLocalSettings] = useState<UserSettings>({ ...settings });

  // Feedback state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackCategory, setFeedbackCategory] = useState<string>("Gate Status Accuracy");
  const [feedbackLc, setFeedbackLc] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [feedbackHistory, setFeedbackHistory] = useState<UserFeedback[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [feedbackSubTab, setFeedbackSubTab] = useState<"new" | "history">("new");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setMobile(user.mobile || "");
      setState(user.state || "Andhra Pradesh");
      setDistrict(user.district || "Bapatla");
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "feedback" && feedbackSubTab === "history") {
      fetchFeedbackHistory();
    }
  }, [activeTab, feedbackSubTab]);

  const fetchFeedbackHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.getFeedback();
      setFeedbackHistory(res.feedback || []);
    } catch {
      // Fallback
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification("Name cannot be empty", "error");
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        mobile: mobile.trim(),
        state: state.trim(),
        district: district.trim(),
      });
    } catch {
      // Handled in context
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveSettings = () => {
    updateSettings(localSettings);
    showNotification("Settings saved successfully!", "success");
  };

  const handleResetSettings = () => {
    const defaultVals: UserSettings = {
      soundAlerts: true,
      desktopNotifications: false,
      timeFormat: "24h",
      distanceUnit: "km",
      refreshRate: 3,
      highContrast: false,
      preferredZone: "South Central Railway (Vijayawada Division - Bapatla)",
    };
    setLocalSettings(defaultVals);
    updateSettings(defaultVals);
    showNotification("Settings reset to defaults.", "info");
  };

  const testAudio = () => {
    playNotificationSound();
    showNotification("Playing railway alert sound chime", "info");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !feedbackMessage.trim()) {
      showNotification("Please fill in the subject and message fields", "error");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      await api.submitFeedback({
        rating,
        category: feedbackCategory,
        lc_number: feedbackLc.trim() || undefined,
        subject: subject.trim(),
        message: feedbackMessage.trim(),
      });
      showNotification("Thank you! Your feedback was submitted successfully.", "success");
      setSubject("");
      setFeedbackMessage("");
      setRating(5);
      setFeedbackSubTab("history");
    } catch (err: any) {
      showNotification(err.message || "Failed to submit feedback", "error");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-slate-500">Please login to view your profile.</p>
          <button
            onClick={() => navigateTo("LOGIN")}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const getRoleLabel = () => {
    switch (user.role) {
      case "ADMIN":
        return "System Administrator";
      case "MANAGER":
        return "Railway Gate Manager";
      default:
        return "Registered User / Citizen";
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (user.role === "ADMIN") {
                navigateTo("ADMIN_DASHBOARD");
              } else if (user.role === "MANAGER") {
                navigateTo("MY_LC");
              } else {
                navigateTo("FIND_LC");
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>
              {user.role === "ADMIN"
                ? "Back to Admin Dashboard"
                : user.role === "MANAGER"
                ? "Back to Gate Manager"
                : "Back to Level Crossings"}
            </span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Hero Banner Card */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-50/80 via-indigo-50/40 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              {/* Big Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-linear-to-tr from-blue-600 via-blue-700 to-indigo-600 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0 ring-4 ring-blue-50">
                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-8 h-8" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {user.name}
                  </h1>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      user.role === "ADMIN"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : user.role === "MANAGER"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {getRoleLabel()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {user.district || "Bapatla"}, {user.state || "Andhra Pradesh"}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick action badges */}
            <div className="flex flex-wrap sm:flex-col items-end gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Account Active & Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Basic Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "feedback"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Feedback & Support</span>
          </button>
        </div>

        {/* Tab 1: Profile & Account Information */}
        {activeTab === "profile" && (
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your contact details and location preferences for accurate gate notifications
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile / Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    District / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Bapatla"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Andhra Pradesh"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Settings & Preferences */}
        {activeTab === "settings" && (
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Application Settings & Alerts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize audio chimes, auto-refresh polling intervals, and display formats
              </p>
            </div>

            {/* Audio & Live alerts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Bell className="w-3.5 h-3.5" />
                <span>Live Alerts & Audio Chimes</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span>Gate Status Sound Chime</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Play an audio tone whenever a level crossing changes status between OPEN and CLOSED
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {localSettings.soundAlerts && (
                      <button
                        type="button"
                        onClick={testAudio}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 shadow-2xs transition-colors cursor-pointer"
                      >
                        Test Tone
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setLocalSettings((prev) => ({ ...prev, soundAlerts: !prev.soundAlerts }))
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        localSettings.soundAlerts ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          localSettings.soundAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Desktop Notifications</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Show browser notifications when tracked gates undergo maintenance or close
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        desktopNotifications: !prev.desktopNotifications,
                      }))
                    }
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                      localSettings.desktopNotifications ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        localSettings.desktopNotifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Time & Polling formats */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Time Format & Auto-Refresh Interval</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">Time Format</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLocalSettings((prev) => ({ ...prev, timeFormat: "24h" }))}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        localSettings.timeFormat === "24h"
                          ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>24-Hour Railway Time</span>
                      <span className="text-[11px] opacity-75">(14:30)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLocalSettings((prev) => ({ ...prev, timeFormat: "12h" }))}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        localSettings.timeFormat === "12h"
                          ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>12-Hour Standard</span>
                      <span className="text-[11px] opacity-75">(02:30 PM)</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3">
                  <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-blue-600" />
                      <span>Live Status Auto-Refresh Polling Interval</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-600">
                      {localSettings.refreshRate} seconds
                    </span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 10, 30].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setLocalSettings((prev) => ({ ...prev, refreshRate: sec }))}
                        className={`py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          localSettings.refreshRate === sec
                            ? "bg-blue-600 border-blue-600 text-white shadow-2xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Distance Units</p>
                    <p className="text-xs text-slate-500">For proximity measurements</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => setLocalSettings((prev) => ({ ...prev, distanceUnit: "km" }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        localSettings.distanceUnit === "km" ? "bg-blue-600 text-white" : "text-slate-600"
                      }`}
                    >
                      Kilometers (KM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalSettings((prev) => ({ ...prev, distanceUnit: "mi" }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        localSettings.distanceUnit === "mi" ? "bg-blue-600 text-white" : "text-slate-600"
                      }`}
                    >
                      Miles
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Default Railway Zone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Default Railway Zone Preference
              </label>
              <select
                value={localSettings.preferredZone}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, preferredZone: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
              >
                {RAILWAY_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Settings Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetSettings}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Feedback & Support */}
        {activeTab === "feedback" && (
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Feedback & Support System</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Report crossing discrepancies, suggest new features, or contact railway staff
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setFeedbackSubTab("new")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    feedbackSubTab === "new"
                      ? "bg-white text-blue-600 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Feedback</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackSubTab("history")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    feedbackSubTab === "history"
                      ? "bg-white text-blue-600 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Past Submissions</span>
                </button>
              </div>
            </div>

            {feedbackSubTab === "new" ? (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Overall Experience Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 rounded-md text-slate-300 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300 hover:text-amber-200"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-slate-700 ml-2 px-3 py-1 rounded-full bg-slate-100">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
                    >
                      {FEEDBACK_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Level Crossing (Optional)</span>
                      <span className="text-[11px] text-slate-400 font-normal">e.g. LC-282</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LC-282 (Bapatla)"
                      value={feedbackLc}
                      onChange={(e) => setFeedbackLc(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your feedback or issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message / Observation *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your observation, status timing discrepancy, or suggestion..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingFeedback ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {isLoadingHistory ? (
                  <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading submissions...</span>
                  </div>
                ) : feedbackHistory.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No Feedback Submitted Yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Your feedback helps keep the railway level crossing database accurate.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFeedbackSubTab("new")}
                      className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Submit Feedback
                    </button>
                  </div>
                ) : (
                  feedbackHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{item.subject}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === "Resolved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.status === "Under Review"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{item.category}</span>
                            {item.lc_number && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-blue-600 font-bold">{item.lc_number}</span>
                              </>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
