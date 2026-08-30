import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../types";
import { api } from "../services/api";
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Mail,
  Phone,
  Compass,
} from "lucide-react";

export const AdminManagersScreen: React.FC = () => {
  const { showNotification } = useAuth();

  // Core Data
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingManager, setEditingManager] = useState<User | null>(null); // null = Create Mode
  const [deleteConfirmManager, setDeleteConfirmManager] = useState<User | null>(null);

  // Manager Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    zone: "SCR",
    division: "BZA",
    state: "Andhra Pradesh",
    district: "Guntur",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  // Fetch managers data
  const fetchData = async () => {
    setLoading(true);
    try {
      const managersRes = await api.getAdminManagers();
      setManagers(managersRes.managers || []);
    } catch (err: any) {
      showNotification(err.message || "Failed to load gate managers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Managers
  const filteredManagers = useMemo(() => {
    return managers.filter((m) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (m.name || "").toLowerCase().includes(q);
        const matchEmail = (m.email || "").toLowerCase().includes(q);
        const matchMobile = (m.mobile || "").toLowerCase().includes(q);
        const matchZone = (m.zone || "").toLowerCase().includes(q);
        const matchDiv = (m.division || "").toLowerCase().includes(q);
        const matchState = (m.state || "").toLowerCase().includes(q);
        const matchDistrict = (m.district || "").toLowerCase().includes(q);

        if (!matchName && !matchEmail && !matchMobile && !matchZone && !matchDiv && !matchState && !matchDistrict) {
          return false;
        }
      }

      // Status
      const currentStatus = m.status || "ACTIVE";
      if (statusFilter !== "ALL" && currentStatus !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [managers, searchQuery, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingManager(null);
    setFormData({
      name: "",
      email: "",
      password: "Gatekeeper@123",
      mobile: "",
      zone: "SCR",
      division: "BZA",
      state: "Andhra Pradesh",
      district: "Guntur",
      status: "ACTIVE",
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (m: User) => {
    setEditingManager(m);
    setFormData({
      name: m.name || "",
      email: m.email || "",
      password: "", // leave empty to keep unchanged
      mobile: m.mobile || "",
      zone: m.zone || "SCR",
      division: m.division || "BZA",
      state: m.state || "Andhra Pradesh",
      district: m.district || "Guntur",
      status: (m.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    });
    setIsFormModalOpen(true);
  };

  // Save (Create or Update) Manager
  const handleSaveManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showNotification("Please enter Manager Name and Email", "error");
      return;
    }

    setActionLoading(true);
    try {
      if (editingManager) {
        // UPDATE
        const updatePayload: any = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          zone: formData.zone.trim(),
          division: formData.division.trim(),
          state: formData.state.trim(),
          district: formData.district.trim(),
          status: formData.status,
        };
        if (formData.password.trim()) {
          updatePayload.password = formData.password.trim();
        }

        const res = await api.updateAdminManager(editingManager.id, updatePayload);
        showNotification(res.message || "Manager updated successfully", "success");
      } else {
        // CREATE
        if (!formData.password.trim()) {
          showNotification("Please specify a password for new manager account", "error");
          setActionLoading(false);
          return;
        }

        const res = await api.createAdminManager({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          mobile: formData.mobile.trim(),
          zone: formData.zone.trim(),
          division: formData.division.trim(),
          state: formData.state.trim(),
          district: formData.district.trim(),
        });
        showNotification(res.message || "Gate manager created successfully", "success");
      }

      setIsFormModalOpen(false);
      await fetchData();
    } catch (err: any) {
      showNotification(err.message || "Failed to save manager", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Manager
  const handleDeleteManager = async () => {
    if (!deleteConfirmManager) return;
    setActionLoading(true);
    try {
      await api.deleteAdminManager(deleteConfirmManager.id);
      showNotification(`Manager ${deleteConfirmManager.name} deleted successfully`, "success");
      setDeleteConfirmManager(null);
      await fetchData();
    } catch (err: any) {
      showNotification(err.message || "Failed to delete manager", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // 1-Click Quick Toggle Manager Active Status
  const handleQuickToggleStatus = async (m: User) => {
    const currentStatus = m.status || "ACTIVE";
    const nextStatus: "ACTIVE" | "INACTIVE" = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.updateAdminManagerStatus(m.id, nextStatus);
      showNotification(`Manager ${m.name} set to ${nextStatus}`, "success");
      setManagers((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, status: nextStatus } : item))
      );
    } catch (err: any) {
      showNotification(err.message || "Failed to update manager status", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Gate Managers</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gate Managers Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Add, update, and delete railway gate managers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gate Manager</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-3.5 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Managers</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{managers.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Accounts</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {managers.filter((m) => (m.status || "ACTIVE") === "ACTIVE").length}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inactive Accounts</span>
            <div className="text-2xl font-extrabold text-slate-500 mt-1">
              {managers.filter((m) => (m.status || "ACTIVE") === "INACTIVE").length}
            </div>
          </div>
        </div>

        {/* Search and Status Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Manager Name, Email, Phone, Zone, State, or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Account Status:</span>
            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200 w-full sm:w-auto">
              {(["ALL", "ACTIVE", "INACTIVE"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st === "ALL" ? "All" : st === "ACTIVE" ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Managers List Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading gate managers...
            </div>
          ) : filteredManagers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-600">No Gate Managers found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or click "Add Gate Manager"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Manager Name</th>
                    <th className="py-3.5 px-4">Login & Contact</th>
                    <th className="py-3.5 px-4">Jurisdiction</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredManagers.map((m) => {
                    const isActive = (m.status || "ACTIVE") === "ACTIVE";

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Manager Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span>{m.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            ID: #{m.id}
                          </div>
                        </td>

                        {/* Login & Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{m.email}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{m.mobile || "No mobile added"}</span>
                          </div>
                        </td>

                        {/* Jurisdiction */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-semibold flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-slate-400" />
                            <span>{m.zone || "SCR"} Zone • {m.division || "BZA"} Div</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {m.district ? `${m.district}, ` : ""}{m.state || "Andhra Pradesh"}
                          </div>
                        </td>

                        {/* Status with 1-click toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleQuickToggleStatus(m)}
                            title="Click to toggle Active/Inactive account status"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                            <span>{isActive ? "ACTIVE" : "INACTIVE"}</span>
                          </button>
                        </td>

                        {/* Actions: Edit / Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(m)}
                              title="Edit Manager Profile"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmManager(m)}
                              title="Delete Manager Account"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: ADD / EDIT GATE MANAGER */}
        {/* ========================================================================= */}
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingManager ? `Edit Manager: ${editingManager.name}` : "Add New Gate Manager"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingManager ? "Update profile details and credentials" : "Create login credentials and staff profile"}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveManager} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Manager Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address (Login) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@railgate.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {editingManager ? "New Password (Optional)" : "Password *"}
                    </label>
                    <input
                      type="text"
                      required={!editingManager}
                      placeholder={editingManager ? "Leave blank to keep current" : "e.g. Gatekeeper@123"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mobile & Account Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Account Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE (Can Log In)</option>
                      <option value="INACTIVE">INACTIVE (Access Disabled)</option>
                    </select>
                  </div>
                </div>

                {/* Railway Zone & Division */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Railway Zone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SCR"
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Division
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BZA"
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* State & District */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Andhra Pradesh"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Guntur"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {actionLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    <span>{editingManager ? "Update Manager" : "Create Manager"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: DELETE CONFIRMATION */}
        {/* ========================================================================= */}
        {deleteConfirmManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delete Gate Manager?</h3>
                  <p className="text-xs text-slate-500">This user will lose system access.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-5">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-900">
                  {deleteConfirmManager.name} ({deleteConfirmManager.email})
                </span>
                ?
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmManager(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleDeleteManager}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>Yes, Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
