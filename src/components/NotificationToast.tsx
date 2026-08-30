import React from "react";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export const NotificationToast: React.FC = () => {
  const { notification } = useAuth();

  if (!notification) return null;

  const badgeColors = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 max-w-md">
      <div className={`p-1.5 rounded-lg border ${badgeColors[notification.type]}`}>
        {icons[notification.type]}
      </div>
      <p className="text-sm font-semibold text-slate-800">{notification.message}</p>
    </div>
  );
};
