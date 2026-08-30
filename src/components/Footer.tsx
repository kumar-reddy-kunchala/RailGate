import React from "react";
import { Train } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Train className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-800">RailGateStatus</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Railway Level Crossing Infrastructure Platform</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <span>Official Public Safety & Monitoring System</span>
          <span className="text-slate-300">•</span>
          <span>© 2026 RailGateStatus</span>
        </div>
      </div>
    </footer>
  );
};
