import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserSettings } from "../types";
import {
  X,
  Settings,
  Bell,
  Volume2,
  Clock,
  Gauge,
  MapPin,
  Check,
  RotateCcw,
  Sliders,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RAILWAY_ZONES = [
  "South Central Railway (Vijayawada Division - Bapatla)",
  "South Central Railway (Guntur Division)",
  "Southern Railway (Chennai Division)",
  "East Coast Railway (Waltair Division)",
  "South Western Railway (Hubballi Division)",
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, playNotificationSound, showNotification } = useAuth();

  const [localSettings, setLocalSettings] = useState<UserSettings>({ ...settings });

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(localSettings);
    showNotification("Settings saved successfully!", "success");
    onClose();
  };

  const handleReset = () => {
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
    showNotification("Playing railway alert audio chime", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">Application Settings</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">Configure alerts, time formats, and display preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Group 1: Live Status & Audio Alerts */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Bell className="w-3.5 h-3.5" />
              <span>Live Alerts & Audio</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Gate Status Sound Chime</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Play an audio tone when a crossing switches between OPEN and CLOSED
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {localSettings.soundAlerts && (
                    <button
                      type="button"
                      onClick={testAudio}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 shadow-2xs transition-colors cursor-pointer"
                    >
                      Test
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setLocalSettings((prev) => ({ ...prev, soundAlerts: !prev.soundAlerts }))}
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

              <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Desktop Notifications</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Show desktop banner alerts when tracked gates undergo maintenance or close
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

          {/* Group 2: Timing & Display Formats */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Time & Display Formats</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Time Format</label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalSettings((prev) => ({ ...prev, timeFormat: "24h" }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      localSettings.timeFormat === "24h"
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>24-Hour Railway Time</span>
                    <span className="text-[10px] opacity-75">(14:30)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalSettings((prev) => ({ ...prev, timeFormat: "12h" }))}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      localSettings.timeFormat === "12h"
                        ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>12-Hour Standard</span>
                    <span className="text-[10px] opacity-75">(02:30 PM)</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200/80 pt-3">
                <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-blue-600" />
                    <span>Auto-Refresh Polling Interval</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {localSettings.refreshRate}s
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 10, 30].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setLocalSettings((prev) => ({ ...prev, refreshRate: sec }))}
                      className={`py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
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

              <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">Distance Units</p>
                  <p className="text-[11px] text-slate-500">For proximity measurements</p>
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg shrink-0">
                  <button
                    type="button"
                    onClick={() => setLocalSettings((prev) => ({ ...prev, distanceUnit: "km" }))}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      localSettings.distanceUnit === "km" ? "bg-blue-600 text-white" : "text-slate-600"
                    }`}
                  >
                    KM
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalSettings((prev) => ({ ...prev, distanceUnit: "mi" }))}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      localSettings.distanceUnit === "mi" ? "bg-blue-600 text-white" : "text-slate-600"
                    }`}
                  >
                    Miles
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Group 3: Default Railway Zone Preference */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Default Railway Zone</span>
            </div>

            <select
              value={localSettings.preferredZone}
              onChange={(e) => setLocalSettings((prev) => ({ ...prev, preferredZone: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
            >
              {RAILWAY_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset Defaults</span>
            <span className="xs:hidden">Reset</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 sm:px-5 py-2 min-h-[40px] rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
