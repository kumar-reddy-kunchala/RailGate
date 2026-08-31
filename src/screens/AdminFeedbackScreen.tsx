import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { UserFeedback } from "../types";
import { api } from "../services/api";
import {
  MessageSquare,
  Star,
  Search,
  RefreshCw,
  Trash2,
  Clock,
  Train,
  X,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  Mail,
  Filter,
} from "lucide-react";

export const AdminFeedbackScreen: React.FC = () => {
  const { showNotification } = useAuth();

  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.getFeedback();
      setFeedbacks(res.feedback || []);
    } catch {
      showNotification("Failed to load user feedbacks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: "Received" | "Under Review" | "Resolved") => {
    setUpdatingId(id);
    try {
      const res = await api.updateFeedbackStatus(id, newStatus);
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      );
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showNotification(res.message || `Status updated to ${newStatus}`, "success");
    } catch {
      showNotification("Failed to update feedback status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this feedback submission?")) return;
    setUpdatingId(id);
    try {
      await api.deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(null);
      }
      showNotification("Feedback removed successfully", "success");
    } catch {
      showNotification("Failed to delete feedback", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      if (statusFilter !== "ALL" && f.status !== statusFilter) return false;
      if (categoryFilter !== "ALL" && f.category !== categoryFilter) return false;
      if (ratingFilter !== "ALL" && f.rating !== parseInt(ratingFilter, 10)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUser =
          f.user_name.toLowerCase().includes(q) || f.user_email.toLowerCase().includes(q);
        const matchesSubject = f.subject.toLowerCase().includes(q);
        const matchesMessage = f.message.toLowerCase().includes(q);
        const matchesLc = f.lc_number ? f.lc_number.toLowerCase().includes(q) : false;
        const matchesCategory = f.category.toLowerCase().includes(q);
        if (!matchesUser && !matchesSubject && !matchesMessage && !matchesLc && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [feedbacks, statusFilter, categoryFilter, ratingFilter, searchQuery]);

  const feedbackCounts = useMemo(() => {
    const total = feedbacks.length;
    const received = feedbacks.filter((f) => f.status === "Received").length;
    const underReview = feedbacks.filter((f) => f.status === "Under Review").length;
    const resolved = feedbacks.filter((f) => f.status === "Resolved").length;
    const avgRating =
      total > 0
        ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / total).toFixed(1)
        : "0.0";
    return { total, received, underReview, resolved, avgRating };
  }, [feedbacks]);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Report Defect":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Gate Status Accuracy":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Feature Suggestion":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "App Experience":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Under Review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Received":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col w-full">
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
              <span>User Feedback & Reviews</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Monitor, review, and manage feedback submitted by public citizens and gate commuters
            </p>
          </div>

          <button
            onClick={fetchFeedbacks}
            className="self-start sm:self-auto px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Feedbacks</span>
          </button>
        </div>

        {/* 4 Feedback Metrics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Submissions */}
          <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
              <div className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 sm:mt-1">{feedbackCounts.total}</div>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Card 2: Average Rating */}
          <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Rating</p>
              <div className="text-lg sm:text-2xl font-extrabold text-amber-600 mt-0.5 sm:mt-1 flex items-center gap-1">
                <span>{feedbackCounts.avgRating}</span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">/ 5</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
            </div>
          </div>

          {/* Card 3: New / Pending Action */}
          <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <div className="text-lg sm:text-2xl font-extrabold text-amber-600 mt-0.5 sm:mt-1">
                {feedbackCounts.received + feedbackCounts.underReview}
              </div>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Card 4: Resolved Feedbacks */}
          <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
              <div className="text-lg sm:text-2xl font-extrabold text-emerald-600 mt-0.5 sm:mt-1">{feedbackCounts.resolved}</div>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* Main Feedbacks Filter & Records Container */}
        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
          {/* Search & Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-full lg:max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name, email, LC number, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 sm:p-1 rounded-xl overflow-x-auto max-w-full">
                {(["ALL", "Received", "Under Review", "Resolved"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === st
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {st === "ALL" ? "All" : st}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="App Experience">App Experience</option>
                <option value="Gate Status Accuracy">Gate Status Accuracy</option>
                <option value="Report Defect">Report Defect</option>
                <option value="Feature Suggestion">Feature Suggestion</option>
                <option value="Other">Other</option>
              </select>

              {/* Rating Selector */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Ratings</option>
                <option value="5">★ 5 Stars</option>
                <option value="4">★ 4 Stars</option>
                <option value="3">★ 3 Stars</option>
                <option value="2">★ 2 Stars</option>
                <option value="1">★ 1 Star</option>
              </select>
            </div>
          </div>

          {/* Feedbacks Grid */}
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
              <p className="text-sm font-medium">Loading user feedback records...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-700">No Feedback Records Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL" || ratingFilter !== "ALL"
                  ? "No feedback submissions match your active filter combination."
                  : "When users submit feedback or suggestions via the portal, they will appear here."}
              </p>
              {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL" || ratingFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setCategoryFilter("ALL");
                    setRatingFilter("ALL");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeedbacks.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 hover:border-slate-300 rounded-2xl p-5 bg-white shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* User header & Stars */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                          {item.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.user_name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{item.user_email}</p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 shrink-0 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < item.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Category & Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>

                      {item.lc_number && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md border bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1">
                          <Train className="w-2.5 h-2.5 text-blue-600" />
                          {item.lc_number}
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Subject & Message Content */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.subject}</h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Timestamp Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        title="View Full Feedback Details"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>View</span>
                      </button>

                      {/* Status select */}
                      <select
                        disabled={updatingId === item.id}
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            item.id,
                            e.target.value as "Received" | "Under Review" | "Resolved"
                          )
                        }
                        className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                      >
                        <option value="Received">Received</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      {/* Delete button */}
                      <button
                        disabled={updatingId === item.id}
                        onClick={() => handleDeleteFeedback(item.id)}
                        className="p-1 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-400 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FEEDBACK DETAIL MODAL */}
        {selectedFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block mb-1.5 ${getCategoryBadgeClass(
                      selectedFeedback.category
                    )}`}
                  >
                    {selectedFeedback.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{selectedFeedback.subject}</h3>
                </div>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">User Information</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedFeedback.user_name}</p>
                  <p className="text-slate-500 text-[11px] truncate">{selectedFeedback.user_email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Rating & Level Crossing</p>
                  <div className="flex items-center gap-1 text-amber-500 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedFeedback.rating} / 5</span>
                    {selectedFeedback.lc_number && (
                      <span className="text-slate-700 font-medium ml-1">({selectedFeedback.lc_number})</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(selectedFeedback.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-700">Submitted Feedback Message</p>
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedFeedback.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Status:</span>
                  <select
                    value={selectedFeedback.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedFeedback.id,
                        e.target.value as "Received" | "Under Review" | "Resolved"
                      )
                    }
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Received">Received</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
