import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { LevelCrossing } from "../types";
import { api } from "../services/api";
import {
  Train,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  MapPin,
  Compass,
} from "lucide-react";

export const AdminLCManagementScreen: React.FC = () => {
  const { showNotification } = useAuth();

  // Core Data
  const [lcs, setLcs] = useState<LevelCrossing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingLc, setEditingLc] = useState<LevelCrossing | null>(null); // null = Create Mode
  const [deleteConfirmLc, setDeleteConfirmLc] = useState<LevelCrossing | null>(null);

  // LC Form State
  const [formData, setFormData] = useState({
    lc_number: "",
    lc_name: "",
    zone: "SCR",
    division: "BZA",
    state: "",
    district: "",
    city: "",
  });

  // Fetch LC data
  const fetchData = async () => {
    setLoading(true);
    try {
      const lcsRes = await api.getAdminLcs();
      setLcs(lcsRes.lcs || []);
    } catch (err: any) {
      showNotification(err.message || "Failed to load level crossings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Level Crossings
  const filteredLcs = useMemo(() => {
    return lcs.filter((lc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = (lc.lc_number || "").toLowerCase().includes(q);
        const matchName = (lc.lc_name || "").toLowerCase().includes(q);
        const matchCity = (lc.city || "").toLowerCase().includes(q);
        const matchDistrict = (lc.district || "").toLowerCase().includes(q);
        const matchState = (lc.state || "").toLowerCase().includes(q);
        const matchZone = (lc.zone || "").toLowerCase().includes(q);
        const matchDiv = (lc.division || "").toLowerCase().includes(q);

        if (!matchNumber && !matchName && !matchCity && !matchDistrict && !matchState && !matchZone && !matchDiv) {
          return false;
        }
      }
      return true;
    });
  }, [lcs, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingLc(null);
    setFormData({
      lc_number: "",
      lc_name: "",
      zone: "SCR",
      division: "BZA",
      state: "",
      district: "",
      city: "",
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (lc: LevelCrossing) => {
    setEditingLc(lc);
    setFormData({
      lc_number: lc.lc_number || "",
      lc_name: lc.lc_name || "",
      zone: lc.zone || "SCR",
      division: lc.division || "BZA",
      state: lc.state || "",
      district: lc.district || "",
      city: lc.city || "",
    });
    setIsFormModalOpen(true);
  };

  // Save (Create or Update) LC Gate
  const handleSaveLc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lc_number.trim() || !formData.lc_name.trim()) {
      showNotification("Please provide Gate Number and Gate Name", "error");
      return;
    }

    setActionLoading(true);
    try {
      const payload: any = {
        lc_number: formData.lc_number.trim(),
        lc_name: formData.lc_name.trim(),
        zone: formData.zone.trim() || "SCR",
        division: formData.division.trim() || "BZA",
        state: formData.state.trim() || "General",
        district: formData.district.trim() || "General District",
        city: formData.city.trim() || "General Town",
        location: formData.city.trim() && formData.state.trim()
          ? `${formData.city.trim()}, ${formData.state.trim()}`
          : (formData.city.trim() || formData.state.trim() || "Location not specified"),
      };

      if (editingLc) {
        // UPDATE
        const res = await api.updateAdminLc(editingLc.id, payload);
        showNotification(res.message || `Gate ${payload.lc_number} updated successfully`, "success");
      } else {
        // CREATE
        const res = await api.createAdminLc(payload);
        showNotification(res.message || `Gate ${payload.lc_number} created successfully`, "success");
      }

      setIsFormModalOpen(false);
      await fetchData();
    } catch (err: any) {
      showNotification(err.message || "Failed to save level crossing", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete LC Gate
  const handleDeleteLc = async () => {
    if (!deleteConfirmLc) return;
    setActionLoading(true);
    try {
      await api.deleteAdminLcPermanent(deleteConfirmLc.id);
      showNotification(`LC Gate ${deleteConfirmLc.lc_number} deleted successfully`, "success");
      setDeleteConfirmLc(null);
      await fetchData();
    } catch (err: any) {
      showNotification(err.message || "Failed to delete level crossing", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5" />
                <span>Level Crossings</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              LC Gates Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Add, update, and delete railway level crossing gates
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New LC Gate</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Gate Number, Name, City, State, or Railway Zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium"
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
        </div>

        {/* Main LC List Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading LC gates...
            </div>
          ) : filteredLcs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Train className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-600">No Level Crossings found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or click "Add New LC Gate"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Gate No & Name</th>
                    <th className="py-3.5 px-4">Location & Zone</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredLcs.map((lc) => {
                    return (
                      <tr key={lc.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Gate No & Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span>{lc.lc_number}</span>
                          </div>
                          <div className="text-xs text-slate-600 font-semibold mt-0.5">{lc.lc_name}</div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lc.city || lc.district}, {lc.state}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-slate-400" />
                            <span>{lc.zone || "SCR"} Zone • {lc.division || "BZA"} Div</span>
                          </div>
                        </td>

                        {/* Actions: Edit / Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(lc)}
                              title="Edit LC Gate"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmLc(lc)}
                              title="Delete LC Gate"
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
        {/* MODAL 1: ADD / EDIT LC GATE */}
        {/* ========================================================================= */}
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingLc ? `Edit LC Gate: ${editingLc.lc_number}` : "Add New Level Crossing Gate"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingLc ? "Update gate specifications and details" : "Enter railway level crossing details"}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveLc} className="space-y-4">
                {/* Gate Number & Landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gate Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LC-101"
                      value={formData.lc_number}
                      onChange={(e) => setFormData({ ...formData, lc_number: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gate Name / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Guntur West Market Gate"
                      value={formData.lc_name}
                      onChange={(e) => setFormData({ ...formData, lc_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Railway Zone & Division */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Railway Zone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SCR"
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-semibold focus:outline-none"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* State, District, City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Andhra Pradesh"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-semibold focus:outline-none"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City / Town / Mandal
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Guntur"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 text-xs font-semibold focus:outline-none"
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
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {actionLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    <span>{editingLc ? "Update Gate" : "Create Gate"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: DELETE CONFIRMATION */}
        {/* ========================================================================= */}
        {deleteConfirmLc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delete LC Gate?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-5">
                Are you sure you want to permanently delete gate{" "}
                <span className="font-bold text-slate-900">
                  {deleteConfirmLc.lc_number} ({deleteConfirmLc.lc_name})
                </span>
                ?
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmLc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleDeleteLc}
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
