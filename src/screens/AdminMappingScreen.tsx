import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ManagerLcMapping, User, LevelCrossing } from "../types";
import { api } from "../services/api";
import { UserCheck, Trash2, UserPlus, RefreshCw, AlertCircle } from "lucide-react";

export const AdminMappingScreen: React.FC = () => {
  const { showNotification } = useAuth();

  const [mappings, setMappings] = useState<ManagerLcMapping[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [lcs, setLcs] = useState<LevelCrossing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form selections
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [selectedLcId, setSelectedLcId] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mappingRes, managerRes, lcRes] = await Promise.all([
        api.getAdminMappings(),
        api.getAdminManagers(),
        api.getAdminLcs(),
      ]);

      setMappings(mappingRes.mappings);
      setManagers(managerRes.managers);
      setLcs(lcRes.lcs);

      if (managerRes.managers.length > 0 && !selectedManagerId) {
        setSelectedManagerId(String(managerRes.managers[0].id));
      }
      if (lcRes.lcs.length > 0 && !selectedLcId) {
        setSelectedLcId(String(lcRes.lcs[0].id));
      }
    } catch (err: any) {
      showNotification("Failed to load mapping data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManagerId || !selectedLcId) {
      showNotification("Please select both a Manager and a Level Crossing", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.assignAdminMapping(Number(selectedManagerId), Number(selectedLcId));
      showNotification(res.message, "success");
      fetchData();
    } catch (err: any) {
      showNotification(err.message || "Failed to assign mapping", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async (mappingId: number) => {
    try {
      await api.unassignAdminMapping(mappingId);
      showNotification("Manager unassigned successfully", "success");
      fetchData();
    } catch (err: any) {
      showNotification(err.message || "Failed to unassign mapping", "error");
    }
  };

  const activeMappings = mappings.filter((m) => m.is_active);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Gate Manager Assignment</h1>
            <p className="text-slate-500 text-sm mt-1">
              Assign gate managers to level crossings (One manager can be assigned to only one LC)
            </p>
          </div>

          <button
            onClick={fetchData}
            className="self-start sm:self-auto px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Assignment Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Assign Gate Manager to Level Crossing</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Select a gate manager and the level crossing they are responsible for. Any previous active assignment will be replaced.
          </p>

          <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Manager Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Select Manager
              </label>
              <select
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-sm focus:outline-none transition-all"
              >
                <option value="">-- Choose Manager --</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email}) — {m.zone || "SCR"} ({m.division || "BZA"})
                  </option>
                ))}
              </select>
            </div>

            {/* LC Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Select Level Crossing
              </label>
              <select
                value={selectedLcId}
                onChange={(e) => setSelectedLcId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-sm focus:outline-none transition-all"
              >
                <option value="">-- Choose Level Crossing --</option>
                {lcs.map((lc) => (
                  <option key={lc.id} value={lc.id}>
                    {lc.lc_number} - {lc.lc_name} [{lc.zone || "SCR"} - {lc.division || "BZA"}] ({lc.district || lc.city}, {lc.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting || !selectedManagerId || !selectedLcId}
                className="w-full py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Assign Manager
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Current Assignments Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Current Active Assignments</h3>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {activeMappings.length} Active {activeMappings.length === 1 ? "Assignment" : "Assignments"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Manager</th>
                  <th className="py-3.5 px-4 font-bold">Assigned Level Crossing</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading assignments...
                    </td>
                  </tr>
                ) : activeMappings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                      No active manager assignments found.
                    </td>
                  </tr>
                ) : (
                  activeMappings.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{m.manager_name}</div>
                        <div className="text-xs text-slate-500">{m.manager_email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-blue-600 text-sm">{m.lc_number}</div>
                        <div className="text-xs text-slate-600">{m.lc_name}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleUnassign(m.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Unassign</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
