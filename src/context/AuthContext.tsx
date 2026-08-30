import React, { createContext, useContext, useState, useEffect } from "react";
import { User, ScreenName, LevelCrossing, UserSettings } from "../types";
import { api, getStoredToken, clearStoredToken } from "../services/api";

interface Notification {
  message: string;
  type: "success" | "error" | "info";
}

const DEFAULT_SETTINGS: UserSettings = {
  soundAlerts: true,
  desktopNotifications: false,
  timeFormat: "24h",
  distanceUnit: "km",
  refreshRate: 3,
  highContrast: false,
  preferredZone: "South Central Railway (Vijayawada)",
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  currentScreen: ScreenName;
  selectedLcId: number | null;
  selectedLc: LevelCrossing | null;
  searchFilter: {
    lc_number: string;
    state: string;
    district: string;
    city: string;
  };
  notification: Notification | null;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateUserProfile: (data: { name?: string; mobile?: string; state?: string; district?: string }) => Promise<void>;
  playNotificationSound: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, mobile?: string, role?: string) => Promise<void>;
  logout: () => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  navigateTo: (screen: ScreenName, params?: { lcId?: number; lc?: LevelCrossing; stateFilter?: string; lcQuery?: string; authMode?: "login" | "register" }) => void;
  setSearchFilter: React.Dispatch<React.SetStateAction<{ lc_number: string; state: string; district: string; city: string }>>;
  setSelectedLc: (lc: LevelCrossing | null) => void;
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("WELCOME");
  const [selectedLcId, setSelectedLcId] = useState<number | null>(1); // Default LC-142B (id 1) or null
  const [selectedLc, setSelectedLc] = useState<LevelCrossing | null>(null);
  const [searchFilter, setSearchFilter] = useState({
    lc_number: "",
    state: "",
    district: "",
    city: "",
  });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Settings State with LocalStorage Persistence
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem("railgate_user_settings");
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Could not read settings from localStorage", e);
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem("railgate_user_settings", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save settings to localStorage", e);
      }
      return updated;
    });
  };

  const playNotificationSound = () => {
    if (!settings.soundAlerts) return;
    try {
      // Gentle railway audio chime synthesized via Web Audio API
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // Audio error suppressed silently
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          setUser(res.user);
          setToken(storedToken);
        } catch {
          clearStoredToken();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const updateUserProfile = async (data: { name?: string; mobile?: string; state?: string; district?: string }) => {
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
      showNotification("Profile updated successfully!", "success");
    } catch (err: any) {
      showNotification(err.message || "Failed to update profile", "error");
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
      showNotification(`Welcome back, ${res.user.name}!`, "success");

      // Auto route by role according to navigation spec!
      if (res.user.role === "ADMIN") {
        setCurrentScreen("ADMIN_DASHBOARD");
      } else if (res.user.role === "MANAGER") {
        setCurrentScreen("MY_LC");
      } else {
        setCurrentScreen("FIND_LC");
      }
    } catch (err: any) {
      showNotification(err.message || "Login failed", "error");
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, mobile?: string, role: string = "USER") => {
    try {
      const res = await api.register(name, email, password, mobile, role);
      setUser(res.user);
      setToken(res.token);
      showNotification("Registration successful! You are now logged in.", "success");

      if (res.user.role === "ADMIN") {
        setCurrentScreen("ADMIN_DASHBOARD");
      } else if (res.user.role === "MANAGER") {
        setCurrentScreen("MY_LC");
      } else {
        setCurrentScreen("FIND_LC");
      }
    } catch (err: any) {
      showNotification(err.message || "Registration failed", "error");
      throw err;
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setToken(null);
    setCurrentScreen("WELCOME");
    showNotification("You have been logged out.", "info");
  };

  const navigateTo = (screen: ScreenName, params?: { lcId?: number; lc?: LevelCrossing; stateFilter?: string; lcQuery?: string; authMode?: "login" | "register" }) => {
    if (params?.authMode) {
      setAuthMode(params.authMode);
    }
    
    // Access control: Protected screens require user to be logged in
    const isPublicScreen = screen === "WELCOME" || screen === "LOGIN";
    if (!user && !isPublicScreen) {
      showNotification("Please sign in or register to access Level Crossings.", "info");
      setCurrentScreen("LOGIN");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (params?.lcId) {
      setSelectedLcId(params.lcId);
    }
    if (params?.lc) {
      setSelectedLc(params.lc);
      setSelectedLcId(params.lc.id);
    }
    if (params?.stateFilter !== undefined) {
      setSearchFilter((prev) => ({ ...prev, state: params.stateFilter || "" }));
    }
    if (params?.lcQuery !== undefined) {
      setSearchFilter((prev) => ({ ...prev, lc_number: params.lcQuery || "" }));
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        currentScreen,
        selectedLcId,
        selectedLc,
        searchFilter,
        notification,
        authMode,
        setAuthMode,
        login,
        register,
        logout,
        navigateTo,
        setSearchFilter,
        setSelectedLc,
        showNotification,
        settings,
        updateSettings,
        updateUserProfile,
        playNotificationSound,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
