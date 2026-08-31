import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { LevelCrossing } from "../types";
import { api } from "../services/api";
import {
  ALL_INDIAN_STATES,
  getDistrictsForState,
  getTownsForDistrict,
  getDefaultZoneForLocation,
} from "../utils/hierarchy";
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
    state: "",
    zone: "",
    division: "",
    district: "",
    city: "",
  });

  // Derived available options based on hierarchy
  const availableDistricts = useMemo(() => {
    return formData.state ? getDistrictsForState(formData.state) : [];
  }, [formData.state]);

  const availableTowns = useMemo(() => {
    return (formData.state && formData.district) ? getTownsForDistrict(formData.state, formData.district) : [];
  }, [formData.state, formData.district]);

  // Handlers for cascading selections (State -> District -> Mandal/Town)
  const handleStateChange = (selectedState: string) => {
    const defaultMapping = getDefaultZoneForLocation(selectedState, "");
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      zone: defaultMapping.zone,
      division: defaultMapping.division,
      district: "",
      city: "",
    }));
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    const defaultMapping = getDefaultZoneForLocation(formData.state, selectedDistrict);
    setFormData((prev) => ({
      ...prev,
      zone: defaultMapping.zone,
      division: defaultMapping.division,
      district: selectedDistrict,
      city: "",
    }));
  };

  const handleCityChange = (selectedCity: string) => {
    setFormData((prev) => ({
      ...prev,
      city: selectedCity,
    }));
  };

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
      state: "",
      zone: "",
      division: "",
      district: "",
      city: "",
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (lc: LevelCrossing) => {
    setEditingLc(lc);
    const defaultMapping = getDefaultZoneForLocation(lc.state || "", lc.district || "");
    setFormData({
      lc_number: lc.lc_number || "",
      lc_name: lc.lc_name || "",
      state: lc.state || "",
      zone: lc.zone || defaultMapping.zone || "SCR",
      division: lc.division || defaultMapping.division || "Vijayawada (BZA)",
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
    if (!formData.state.trim() || !formData.district.trim() || !formData.city.trim()) {
      showNotification("Please select State, District, and Mandal/Town", "error");
      return;
    }

    setActionLoading(true);
    try {
      const defaultMapping = getDefaultZoneForLocation(formData.state.trim(), formData.district.trim());
      const payload: any = {
        lc_number: formData.lc_number.trim(),
        lc_name: formData.lc_name.trim(),
        zone: formData.zone.trim() || defaultMapping.zone || "SCR",
        division: formData.division.trim() || defaultMapping.division || "BZA",
        state: formData.state.trim(),
        district: formData.district.trim(),
        city: formData.city.trim(),
        location: `${formData.city.trim()}, ${formData.district.trim()}, ${formData.state.trim()}`,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col w-full">
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full space-y-4 sm:space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5" />
                <span>Level Crossings</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              LC Gates Management
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Add, update, and delete railway level crossing gates
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex-1 sm:flex-none justify-center px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex-1 sm:flex-none justify-center px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Add LC Gate</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs">
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
        <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-8 sm:p-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs">Loading LC gates...</span>
            </div>
          ) : filteredLcs.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-slate-400">
              <Train className="w-9 h-9 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-600 text-sm">No Level Crossings found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or click "Add LC Gate"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3.5 sm:py-3.5 sm:px-4">Gate No & Name</th>
                    <th className="py-3 px-3.5 sm:py-3.5 sm:px-4">Location & Zone</th>
                    <th className="py-3 px-3.5 sm:py-3.5 sm:px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredLcs.map((lc) => {
                    return (
                      <tr key={lc.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Gate No & Name */}
                        <td className="py-3 px-3.5 sm:py-3.5 sm:px-4">
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span>{lc.lc_number}</span>
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">{lc.lc_name}</div>
                        </td>

                        {/* Location */}
                        <td className="py-3 px-3.5 sm:py-3.5 sm:px-4">
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{lc.city || lc.district}, {lc.state}</span>
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{lc.zone || "SCR"} • {lc.division || "BZA"}</span>
                          </div>
                        </td>

                        {/* Actions: Edit / Delete */}
                        <td className="py-3 px-3.5 sm:py-3.5 sm:px-4 text-right">
                          <div className="inline-flex items-center gap-1">
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
            <div className="bg-white border border-slate-200/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {editingLc ? `Edit Gate: ${editingLc.lc_number}` : "Add Level Crossing Gate"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {editingLc ? "Update level crossing specifications and location" : "Create and register a new railway crossing"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveLc} className="p-5 space-y-5">
                {/* Section 1: Gate Information */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Gate Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Gate Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LC-101"
                        value={formData.lc_number}
                        onChange={(e) => setFormData({ ...formData, lc_number: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Gate Name / Landmark <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Guntur West Market Gate"
                        value={formData.lc_name}
                        onChange={(e) => setFormData({ ...formData, lc_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Location Hierarchy */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Geographic Location
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* State */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs font-medium focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">-- Select State --</option>
                        {ALL_INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                        {formData.state && !ALL_INDIAN_STATES.includes(formData.state) && (
                          <option value={formData.state}>{formData.state}</option>
                        )}
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        District <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        disabled={!formData.state}
                        value={formData.district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                          formData.state
                            ? "bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 cursor-pointer"
                            : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <option value="">
                          {formData.state ? "-- Select District --" : "Select State First"}
                        </option>
                        {availableDistricts.map((dst) => (
                          <option key={dst} value={dst}>
                            {dst}
                          </option>
                        ))}
                        {formData.district && !availableDistricts.includes(formData.district) && (
                          <option value={formData.district}>{formData.district}</option>
                        )}
                      </select>
                    </div>

                    {/* Mandal / Town / City */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Mandal / Town <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        disabled={!formData.district}
                        value={formData.city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                          formData.district
                            ? "bg-white border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 cursor-pointer"
                            : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <option value="">
                          {formData.district ? "-- Select Mandal / Town --" : "Select District First"}
                        </option>
                        {availableTowns.map((town) => (
                          <option key={town} value={town}>
                            {town}
                          </option>
                        ))}
                        {formData.city && !availableTowns.includes(formData.city) && (
                          <option value={formData.city}>{formData.city}</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    <span>{editingLc ? "Save Changes" : "Create LC Gate"}</span>
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
