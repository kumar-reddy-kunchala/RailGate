import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { UserFeedback } from "../types";
import {
  X,
  User as UserIcon,
  Clock,
  MessageSquare,
  LogOut,
  Star,
  Send,
  CheckCircle2,
  Bell,
  Volume2,
  Shield,
  Train,
  Check,
  ChevronRight,
  History,
  Sparkles,
} from "lucide-react";

interface FullScreenProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_CATEGORIES = [
  "Gate Status Accuracy",
  "Report Defect",
  "Feature Suggestion",
  "App Experience",
  "Other",
];

export const FullScreenProfileModal: React.FC<FullScreenProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout, settings, updateSettings, playNotificationSound, showNotification } =
    useAuth();

  const [activeTab, setActiveTab] = useState<"settings" | "feedback" | "history">("settings");

  // Feedback form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<string>("Gate Status Accuracy");
  const [lcNumber, setLcNumber] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackHistory, setFeedbackHistory] = useState<UserFeedback[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Live clock display to preview time format
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === "history") {
      fetchUserHistory();
    }
  }, [isOpen, activeTab]);

  const fetchUserHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.getFeedback();
      setFeedbackHistory(res.feedback || []);
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen || !user) return null;

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      showNotification("Please enter a subject", "error");
      return;
    }
    if (!message.trim()) {
      showNotification("Please enter your message", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitFeedback({
        rating,
        category,
        lc_number: lcNumber.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      showNotification("Thank you! Your feedback has been submitted.", "success");
      setSubject("");
      setMessage("");
      setRating(5);
      setActiveTab("history");
      fetchUserHistory();
    } catch (err: any) {
      showNotification(err.message || "Failed to submit feedback", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTimePreview = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: settings.timeFormat === "12h",
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200">
      {/* Full screen wrapper */}
      <div className="bg-slate-50 min-h-screen w-full flex flex-col overflow-y-auto">
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close Fullscreen View"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 space-y-8">
          {/* User Profile Overview Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      user.role === "ADMIN"
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                        : user.role === "MANAGER"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {user.role === "ADMIN"
                      ? "Administrator"
                      : user.role === "MANAGER"
                      ? "Gate Manager"
                      : "Registered User"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">{user.email}</p>
                {user.mobile && <p className="text-xs text-slate-400">Mobile: {user.mobile}</p>}
              </div>
            </div>

            {/* Quick Live Clock Preview */}
            <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center sm:text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center sm:justify-end gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Live System Clock
              </p>
              <p className="text-xl font-extrabold text-slate-900 font-mono">
                {formattedTimePreview}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Format: <span className="font-bold text-blue-600">{settings.timeFormat === "12h" ? "12-Hour (AM/PM)" : "24-Hour (Railway)"}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Settings, Submit Feedback, Submissions History) */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Time Format & Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("feedback")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "feedback"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "history"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <History className="w-4 h-4" />
              <span>My Submitted Feedbacks</span>
            </button>
          </div>

          {/* TAB 1: BASIC SETTINGS (Time Format & Preferences) */}
          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Time Format & Display Preferences
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose how gate timestamps, train schedules, and live clocks are rendered
                </p>
              </div>

              {/* Time Format Selection Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Time Representation</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select between standard 12-Hour AM/PM or 24-Hour Railway Military time
                    </p>
                  </div>

                  {/* 12h vs 24h Selector Buttons */}
                  <div className="inline-flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({ timeFormat: "12h" });
                        showNotification("Time format switched to 12-Hour (AM/PM)", "success");
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        settings.timeFormat === "12h"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      12-Hour (AM / PM)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({ timeFormat: "24h" });
                        showNotification("Time format switched to 24-Hour (Railway)", "success");
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        settings.timeFormat === "24h"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      24-Hour (Railway)
                    </button>
                  </div>
                </div>

                {/* Visual Preview comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => updateSettings({ timeFormat: "12h" })}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      settings.timeFormat === "12h"
                        ? "bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">12-Hour Format</span>
                      {settings.timeFormat === "12h" && (
                        <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold font-mono text-slate-900 mt-2">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Example: 02:45 PM, 08:30 AM</p>
                  </div>

                  <div
                    onClick={() => updateSettings({ timeFormat: "24h" })}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      settings.timeFormat === "24h"
                        ? "bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">24-Hour Railway Format</span>
                      {settings.timeFormat === "24h" && (
                        <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold font-mono text-slate-900 mt-2">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Example: 14:45, 20:30</p>
                  </div>
                </div>
              </div>

              {/* Sound and Audio Chime Settings */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    Audio Sound Alert
                  </h4>
                  <p className="text-xs text-slate-500">
                    Play audio alert when level crossing gate status changes
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {settings.soundAlerts && (
                    <button
                      type="button"
                      onClick={() => {
                        playNotificationSound();
                        showNotification("Played sample chime audio", "info");
                      }}
                      className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer shadow-2xs"
                    >
                      Test Audio
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      updateSettings({ soundAlerts: !settings.soundAlerts })
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      settings.soundAlerts ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings.soundAlerts ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBMIT FEEDBACK */}
          {activeTab === "feedback" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Submit Feedback & Issue Reports
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Share your experience, report gate accuracy issues, or suggest new features
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                {/* Star Rating */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Overall Satisfaction Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating || rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700 ml-2">
                      {rating === 5
                        ? "5 Stars - Excellent"
                        : rating === 4
                        ? "4 Stars - Very Good"
                        : rating === 3
                        ? "3 Stars - Good"
                        : rating === 2
                        ? "2 Stars - Fair"
                        : "1 Star - Poor"}
                    </span>
                  </div>
                </div>

                {/* Category & LC Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                    >
                      {FEEDBACK_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Level Crossing (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LC-142B or Bapatla Bypass"
                      value={lcNumber}
                      onChange={(e) => setLcNumber(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Feedback Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your review or inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder:text-slate-400 font-medium"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Detailed Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please describe your suggestion, question, or issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder:text-slate-400 leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MY SUBMISSIONS HISTORY */}
          {activeTab === "history" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    Submitted Feedbacks & Reviews
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Track the status of your reported inquiries and suggestions
                  </p>
                </div>

                <button
                  onClick={fetchUserHistory}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {loadingHistory ? (
                <div className="p-12 text-center text-slate-400 text-xs">Loading submissions...</div>
              ) : feedbackHistory.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No feedback submissions found</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    When you submit feedback or reports, they will be listed here with status updates.
                  </p>
                  <button
                    onClick={() => setActiveTab("feedback")}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Submit New Feedback
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbackHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{item.subject}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {item.category}
                          </span>
                          {item.lc_number && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                              <Train className="w-2.5 h-2.5" />
                              {item.lc_number}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                              item.status === "Resolved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "Under Review"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                      <p className="text-[11px] text-slate-400">
                        Submitted on: {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Direct Logout Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Close Preferences
            </button>

            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
