import { LevelCrossing, User, ManagerLcMapping, DashboardStats, UserFeedback } from "../types";

const TOKEN_KEY = "railgatestatus_jwt_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Request failed`);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async register(name: string, email: string, password: string, mobile?: string, role: string = "USER") {
    const res = await request<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, mobile, role }),
    });
    setStoredToken(res.token);
    return res;
  },

  async getCurrentUser() {
    return request<{ user: User }>("/api/auth/me");
  },

  async updateProfile(data: { name?: string; mobile?: string; state?: string; district?: string }) {
    return request<{ message: string; user: User }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async submitFeedback(data: { rating: number; category: string; lc_number?: string; subject: string; message: string }) {
    return request<{ message: string; feedback: any }>("/api/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getFeedback() {
    return request<{ feedback: UserFeedback[] }>("/api/feedback");
  },

  async updateFeedbackStatus(id: number, status: "Received" | "Under Review" | "Resolved") {
    return request<{ message: string; feedback: UserFeedback }>(`/api/feedback/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async deleteFeedback(id: number) {
    return request<{ message: string; feedback: UserFeedback }>(`/api/feedback/${id}`, {
      method: "DELETE",
    });
  },

  logout() {
    clearStoredToken();
  },

  // Level Crossings Public API
  async getLcs(filters?: { lc_number?: string; state?: string; district?: string; city?: string; status?: string }) {
    const params = new URLSearchParams();
    if (filters?.lc_number) params.append("lc_number", filters.lc_number);
    if (filters?.state) params.append("state", filters.state);
    if (filters?.district) params.append("district", filters.district);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.status) params.append("status", filters.status);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return request<{ lcs: LevelCrossing[]; total: number }>(`/api/lcs${queryString}`);
  },

  async getLcDetails(idOrNumber: string | number) {
    return request<{ lc: LevelCrossing }>(`/api/lcs/${idOrNumber}`);
  },

  // Manager APIs
  async getManagerMyLc() {
    return request<{ lc: LevelCrossing }>("/api/manager/my-lc");
  },

  async updateManagerLcStatus(data: {
    current_status: "OPEN" | "CLOSED";
    status_category: string;
    maintenance_information: string;
  }) {
    return request<{ message: string; lc: LevelCrossing }>("/api/manager/my-lc/status", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Admin APIs
  async getAdminLcs() {
    return request<{ lcs: LevelCrossing[]; total: number }>("/api/admin/lcs");
  },

  async createAdminLc(data: Partial<LevelCrossing>) {
    return request<{ message: string; lc: LevelCrossing }>("/api/admin/lcs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAdminLc(id: number, data: Partial<LevelCrossing>) {
    return request<{ message: string; lc: LevelCrossing }>(`/api/admin/lcs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async toggleAdminLcStatus(id: number) {
    return request<{ message: string; lc: LevelCrossing }>(`/api/admin/lcs/${id}`, {
      method: "DELETE",
    });
  },

  async deleteAdminLcPermanent(id: number) {
    return request<{ message: string }>(`/api/admin/lcs/${id}/permanent`, {
      method: "DELETE",
    });
  },

  async getAdminManagers() {
    return request<{
      managers: (User & {
        assignedLc: {
          id: number;
          lc_number: string;
          lc_name: string;
          state?: string;
          district?: string;
          city?: string;
          zone?: string;
          division?: string;
        } | null;
      })[];
    }>("/api/admin/managers");
  },

  async createAdminManager(data: {
    name: string;
    email: string;
    password: string;
    mobile?: string;
    zone?: string;
    division?: string;
    state?: string;
    district?: string;
  }) {
    return request<{ message: string; manager: User }>("/api/admin/managers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAdminManager(
    id: number,
    data: {
      name?: string;
      email?: string;
      mobile?: string;
      status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
      password?: string;
      zone?: string;
      division?: string;
      state?: string;
      district?: string;
    }
  ) {
    return request<{ message: string; manager: User }>(`/api/admin/managers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async updateAdminManagerCredentials(
    id: number,
    data: {
      password?: string;
      status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    }
  ) {
    return request<{ message: string; manager: User }>(`/api/admin/managers/${id}/credentials`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async updateAdminManagerStatus(id: number, status: "ACTIVE" | "INACTIVE" | "SUSPENDED") {
    return request<{ message: string; manager: User }>(`/api/admin/managers/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async deleteAdminManager(id: number) {
    return request<{ message: string }>(`/api/admin/managers/${id}`, {
      method: "DELETE",
    });
  },

  async getAdminMappings() {
    return request<{ mappings: ManagerLcMapping[] }>("/api/admin/mappings");
  },

  async assignAdminMapping(manager_id: number, lc_id: number) {
    return request<{ message: string; mapping: ManagerLcMapping }>("/api/admin/mappings", {
      method: "POST",
      body: JSON.stringify({ manager_id, lc_id }),
    });
  },

  async unassignAdminMapping(id: number) {
    return request<{ message: string }>(`/api/admin/mappings/${id}`, {
      method: "DELETE",
    });
  },

  async getAdminDashboardStats() {
    return request<{ stats: DashboardStats }>("/api/admin/dashboard");
  },
};
