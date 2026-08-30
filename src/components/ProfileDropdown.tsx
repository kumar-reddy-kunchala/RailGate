import React from "react";
import { useAuth } from "../context/AuthContext";
import { User as UserIcon } from "lucide-react";

export const ProfileDropdown: React.FC = () => {
  const { user, navigateTo, currentScreen } = useAuth();

  if (!user) return null;

  const isProfileActive = currentScreen === "PROFILE";

  return (
    <div id="header-profile-container" className="flex items-center">
      <button
        id="header-profile-avatar-btn"
        type="button"
        onClick={() => navigateTo("PROFILE")}
        title={`My Profile & Settings (${user.name})`}
        aria-label="User Profile and Settings"
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-xs transition-all cursor-pointer select-none active:scale-95 ring-2 shrink-0 ${
          isProfileActive
            ? "ring-blue-600 bg-linear-to-tr from-blue-700 to-indigo-700 ring-offset-2"
            : "ring-slate-200 hover:ring-blue-500 bg-linear-to-tr from-blue-600 to-indigo-600 hover:shadow-md"
        }`}
      >
        {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
      </button>
    </div>
  );
};
