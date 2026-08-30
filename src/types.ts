export type Role = "USER" | "MANAGER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  mobile?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  assignedLcId?: number | null;
  zone?: string;
  division?: string;
  state?: string;
  district?: string;
}

export interface AssignedManager {
  id: number | null;
  name: string;
  initials: string;
}

export interface LevelCrossing {
  id: number;
  lc_number: string;
  lc_name: string;
  zone?: string;
  division?: string;
  state: string;
  district: string;
  city: string;
  location: string;
  current_status: "OPEN" | "CLOSED";
  status_category: string;
  traffic_volume: "Low" | "Medium" | "High";
  next_train: string;
  open_closed_status: string;
  maintenance_information: string;
  additional_information: string;
  is_active: boolean;
  last_updated: string;
  created_at?: string;
  updated_at?: string;
  assigned_manager?: AssignedManager;
}

export interface ManagerLcMapping {
  id: number;
  manager_id: number;
  manager_name: string;
  manager_email: string;
  lc_id: number;
  lc_number: string;
  lc_name: string;
  assigned_at: string;
  is_active: boolean;
  status: string;
}

export interface DashboardStats {
  totalLcs: number;
  activeLcs: number;
  totalManagers: number;
  assignedManagers: number;
  openLcs: number;
  closedLcs: number;
  unassignedLcs: number;
}

export interface UserSettings {
  soundAlerts: boolean;
  desktopNotifications: boolean;
  timeFormat: "12h" | "24h";
  distanceUnit: "km" | "mi";
  refreshRate: number; // in seconds
  highContrast: boolean;
  preferredZone: string;
}

export interface UserFeedback {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  rating: number;
  category: string;
  lc_number?: string;
  subject: string;
  message: string;
  status: "Received" | "Under Review" | "Resolved";
  created_at: string;
}

export type ScreenName =
  | "WELCOME"
  | "LOGIN"
  | "FIND_LC"
  | "LC_DETAILS"
  | "MY_LC"
  | "ADMIN_DASHBOARD"
  | "ADMIN_LC"
  | "ADMIN_MANAGERS"
  | "ADMIN_MAPPING"
  | "ADMIN_FEEDBACK"
  | "PROFILE";
