import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "railgatestatus_super_secret_jwt_key_2026";

app.use(cors());
app.use(express.json());

// Persistent Database Layer
interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  password_hash: string;
  role: "USER" | "MANAGER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  zone?: string;
  division?: string;
  state?: string;
  district?: string;
  created_at: string;
  updated_at: string;
}

interface LevelCrossing {
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
  created_at: string;
  updated_at: string;
}

interface ManagerLcMapping {
  id: number;
  manager_id: number;
  lc_id: number;
  is_active: boolean;
  assigned_at: string;
  updated_at: string;
}

interface Database {
  users: User[];
  lcs: LevelCrossing[];
  mappings: ManagerLcMapping[];
  nextUserId: number;
  nextLcId: number;
  nextMappingId: number;
}

const DB_FILE = path.join(process.cwd(), ".data", "db.json");

function initDatabase(): Database {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to read db file, initializing default data", e);
    }
  }

  // Hash default passwords synchronously for initial seed
  const defaultUserHash = bcrypt.hashSync("user123", 10);
  const defaultManagerHash = bcrypt.hashSync("12345", 10);
  const defaultAdminHash = bcrypt.hashSync("admin123", 10);

  const initialDb: Database = {
    users: [
      {
        id: 1,
        name: "Admin User",
        email: "admin@railgatestatus.com",
        mobile: "+1-555-0199",
        password_hash: defaultAdminHash,
        role: "ADMIN",
        status: "ACTIVE",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-01T08:00:00Z",
      },
      {
        id: 2,
        name: "Kumar",
        email: "kumar@railgatestatus.com",
        mobile: "+1-555-0101",
        password_hash: defaultManagerHash,
        role: "MANAGER",
        status: "ACTIVE",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-01T08:00:00Z",
      },
      {
        id: 3,
        name: "David Chen",
        email: "david.chen@railgatestatus.com",
        mobile: "+1-555-0102",
        password_hash: defaultManagerHash,
        role: "MANAGER",
        status: "ACTIVE",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-01T08:00:00Z",
      },
      {
        id: 4,
        name: "Alan K.",
        email: "alan.k@railgatestatus.com",
        mobile: "+1-555-0103",
        password_hash: defaultManagerHash,
        role: "MANAGER",
        status: "ACTIVE",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-01T08:00:00Z",
      },
      {
        id: 5,
        name: "Public Citizen",
        email: "user@railgatestatus.com",
        mobile: "+1-555-0100",
        password_hash: defaultUserHash,
        role: "USER",
        status: "ACTIVE",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-01T08:00:00Z",
        state: "Andhra Pradesh",
        district: "Bapatla",
      },
    ],
    lcs: [
      {
        id: 1,
        lc_number: "LC-282",
        lc_name: "Bapatla Town Gate (Surya Lanka Rd)",
        state: "Andhra Pradesh",
        district: "Bapatla",
        city: "Bapatla",
        location: "15.9042° N, 80.4674° E (Surya Lanka Beach Road, Bapatla)",
        current_status: "OPEN",
        status_category: "Routine Operation",
        traffic_volume: "High",
        next_train: "14:15 - Janmabhoomi Express",
        open_closed_status: "OPEN",
        maintenance_information: "Automated interlocking boom barrier functioning normally. Routine inspection verified.",
        additional_information: "Primary arterial corridor connecting Bapatla town to coastal areas.",
        is_active: true,
        last_updated: "2 min ago",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-05-14T14:32:05Z",
      },
      {
        id: 2,
        lc_number: "LC-285",
        lc_name: "Chirala Bypass Gate",
        state: "Andhra Pradesh",
        district: "Bapatla",
        city: "Chirala",
        location: "15.8246° N, 80.3521° E (Chirala Bypass Junction, Bapatla Dist)",
        current_status: "CLOSED",
        status_category: "Routine Operation",
        traffic_volume: "High",
        next_train: "14:40 - Pinakini Express",
        open_closed_status: "CLOSED",
        maintenance_information: "Closed for scheduled express train pass-through.",
        additional_information: "Heavy vehicular traffic bypass road.",
        is_active: true,
        last_updated: "5 min ago",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-05-14T13:10:00Z",
      },
      {
        id: 3,
        lc_number: "LC-291",
        lc_name: "Vetapalem Market Gate",
        state: "Andhra Pradesh",
        district: "Bapatla",
        city: "Vetapalem",
        location: "15.7831° N, 80.3167° E (Vetapalem Main Market Road, Bapatla Dist)",
        current_status: "OPEN",
        status_category: "Routine Operation",
        traffic_volume: "Medium",
        next_train: "16:20 - Circar Express",
        open_closed_status: "OPEN",
        maintenance_information: "Interlocking signal circuits tested & certified nominal.",
        additional_information: "Market access crossing.",
        is_active: true,
        last_updated: "15 min ago",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-05-14T11:20:00Z",
      },
    ],
    mappings: [
      { id: 1, manager_id: 2, lc_id: 1, is_active: true, assigned_at: "2024-01-15T08:00:00Z", updated_at: "2024-01-15T08:00:00Z" }, // Sarah -> LC-282 (Bapatla)
      { id: 2, manager_id: 3, lc_id: 2, is_active: true, assigned_at: "2024-01-20T09:30:00Z", updated_at: "2024-01-20T09:30:00Z" }, // David -> LC-285 (Chirala)
      { id: 3, manager_id: 4, lc_id: 3, is_active: true, assigned_at: "2024-02-01T11:00:00Z", updated_at: "2024-02-01T11:00:00Z" }, // Alan -> LC-291 (Vetapalem)
    ],
    nextUserId: 6,
    nextLcId: 4,
    nextMappingId: 4,
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: Database) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save database", e);
  }
}

const db = initDatabase();

// Authentication middleware
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: "USER" | "MANAGER" | "ADMIN";
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired session token" });
    }
    const tokenUser = decoded as AuthRequest["user"];
    if (tokenUser?.id) {
      const dbUser = db.users.find((u) => u.id === tokenUser.id);
      if (!dbUser) {
        return res.status(401).json({ error: "User account no longer exists. Access revoked." });
      }
      if (dbUser.status === "INACTIVE" || dbUser.status === "SUSPENDED") {
        return res.status(403).json({ error: `Account access has been ${dbUser.status.toLowerCase()}. Please contact an Administrator.` });
      }
    }
    req.user = tokenUser;
    next();
  });
}

function requireRole(role: "USER" | "MANAGER" | "ADMIN") {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.user.role !== role && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: `Forbidden: Requires ${role} role permissions` });
    }
    next();
  };
}

// Helper function to resolve active assigned LC ID for a manager
function getManagerAssignedLcId(managerId: number): number | null {
  const activeMapping = db.mappings.find((m) => m.manager_id === managerId && m.is_active);
  return activeMapping ? activeMapping.lc_id : null;
}

// Helper function to build LC response object with manager details
function buildLcResponse(lc: LevelCrossing) {
  const activeMapping = db.mappings.find((m) => m.lc_id === lc.id && m.is_active);
  let managerInfo = { id: null, name: "Unassigned", initials: "UN" };

  if (activeMapping) {
    const manager = db.users.find((u) => u.id === activeMapping.manager_id);
    if (manager) {
      const initials = manager.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      managerInfo = {
        id: manager.id,
        name: manager.name,
        initials,
      };
    }
  }

  return {
    ...lc,
    assigned_manager: managerInfo,
  };
}

// REST API ROUTES

// 1. Auth APIs
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, password, mobile, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const userRole = "USER";

  const newUser: User = {
    id: db.nextUserId++,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    mobile: mobile || "",
    password_hash,
    role: userRole,
    status: "ACTIVE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  const assignedLcId = newUser.role === "MANAGER" ? getManagerAssignedLcId(newUser.id) : null;

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      assignedLcId,
    },
  });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email or username and password are required" });
  }

  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (user.status === "INACTIVE" || user.status === "SUSPENDED") {
    return res.status(403).json({ error: "Your account is deactivated. Please contact an Administrator." });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  const assignedLcId = user.role === "MANAGER" ? getManagerAssignedLcId(user.id) : null;

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedLcId,
    },
  });
});

app.get("/api/auth/me", authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = db.users.find((u) => u.id === req.user!.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const assignedLcId = user.role === "MANAGER" ? getManagerAssignedLcId(user.id) : null;

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      state: user.state,
      district: user.district,
      assignedLcId,
    },
  });
});

app.put("/api/auth/profile", authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = db.users.find((u) => u.id === req.user!.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { name, mobile, state, district } = req.body;
  if (name && typeof name === "string") user.name = name.trim();
  if (mobile !== undefined && typeof mobile === "string") user.mobile = mobile.trim();
  if (state !== undefined && typeof state === "string") user.state = state.trim();
  if (district !== undefined && typeof district === "string") user.district = district.trim();
  user.updated_at = new Date().toISOString();

  saveDatabase(db);

  const assignedLcId = user.role === "MANAGER" ? getManagerAssignedLcId(user.id) : null;

  return res.json({
    message: "Profile updated successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      state: user.state,
      district: user.district,
      assignedLcId,
    },
  });
});

interface UserFeedback {
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

const feedbackList: UserFeedback[] = [
  {
    id: 1,
    user_id: 2,
    user_name: "Public Citizen",
    user_email: "user@railgatestatus.com",
    rating: 5,
    category: "App Experience",
    lc_number: "LC-282",
    subject: "Accurate real-time gate status",
    message: "The live status updates for Bapatla Town gate helped me plan my commute without delays. Great app!",
    status: "Resolved",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

app.post("/api/feedback", authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const { rating, category, lc_number, subject, message } = req.body;
  if (!rating || !category || !subject || !message) {
    return res.status(400).json({ error: "Rating, category, subject, and message are required." });
  }

  const newFeedback: UserFeedback = {
    id: feedbackList.length + 1,
    user_id: req.user.id,
    user_name: req.user.name || "User",
    user_email: req.user.email || "",
    rating: Number(rating),
    category: String(category),
    lc_number: lc_number ? String(lc_number).trim() : undefined,
    subject: String(subject).trim(),
    message: String(message).trim(),
    status: "Received",
    created_at: new Date().toISOString(),
  };

  feedbackList.unshift(newFeedback);

  return res.status(201).json({
    message: "Thank you! Your feedback has been submitted successfully.",
    feedback: newFeedback,
  });
});

app.get("/api/feedback", authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  // If admin, return all; otherwise return user's submissions
  const results = req.user.role === "ADMIN" 
    ? feedbackList 
    : feedbackList.filter((f) => f.user_id === req.user!.id);

  return res.json({ feedback: results });
});

app.put("/api/feedback/:id/status", authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only administrators can update feedback status." });
  }

  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!["Received", "Under Review", "Resolved"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const feedbackItem = feedbackList.find((f) => f.id === id);
  if (!feedbackItem) {
    return res.status(404).json({ error: "Feedback not found." });
  }

  feedbackItem.status = status;
  return res.json({ message: "Feedback status updated successfully.", feedback: feedbackItem });
});

app.delete("/api/feedback/:id", authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Only administrators can delete feedback." });
  }

  const id = parseInt(req.params.id, 10);
  const index = feedbackList.findIndex((f) => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Feedback not found." });
  }

  const deleted = feedbackList.splice(index, 1)[0];
  return res.json({ message: "Feedback deleted successfully.", feedback: deleted });
});

// Helper for search normalization (ignores casing, whitespace, and special characters)
function normalizeSearchStr(str?: string | null): string {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchesLcSearch(lc: LevelCrossing, query: string): boolean {
  if (!query || !query.trim()) return true;
  const raw = query.trim();
  const normQuery = normalizeSearchStr(raw);
  if (!normQuery) return true;

  const normNumber = normalizeSearchStr(lc.lc_number);
  const normName = normalizeSearchStr(lc.lc_name);
  const normCity = normalizeSearchStr(lc.city);
  const normDistrict = normalizeSearchStr(lc.district);
  const normState = normalizeSearchStr(lc.state);
  const normLocation = normalizeSearchStr(lc.location);
  const normZone = normalizeSearchStr(lc.zone);
  const normDivision = normalizeSearchStr(lc.division);

  // 1. Direct normalized substring match
  if (
    normNumber.includes(normQuery) ||
    normName.includes(normQuery) ||
    normCity.includes(normQuery) ||
    normDistrict.includes(normQuery) ||
    normState.includes(normQuery) ||
    normLocation.includes(normQuery) ||
    normZone.includes(normQuery) ||
    normDivision.includes(normQuery)
  ) {
    return true;
  }

  // 2. Numeric digits match (e.g. searching "282" matches "LC-282")
  const queryDigits = raw.replace(/\D/g, "");
  const lcDigits = (lc.lc_number || "").replace(/\D/g, "");
  if (queryDigits && lcDigits && lcDigits.includes(queryDigits)) {
    return true;
  }

  // 3. Multi-term match (all space/punctuation separated tokens match)
  const tokens = raw.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (tokens.length > 1) {
    const combined = `${normNumber} ${normName} ${normCity} ${normDistrict} ${normState} ${normLocation} ${normZone} ${normDivision}`;
    const allFound = tokens.every((tok) => combined.includes(normalizeSearchStr(tok)));
    if (allFound) return true;
  }

  return false;
}

// 2. Public Level Crossing Search APIs
app.get("/api/lcs", (req: Request, res: Response) => {
  const { lc_number, state, district, city, status } = req.query;

  let results = db.lcs.filter((lc) => lc.is_active);

  if (lc_number) {
    const q = String(lc_number);
    results = results.filter((lc) => matchesLcSearch(lc, q));
  }

  if (state && state !== "All States" && state !== "") {
    const normState = normalizeSearchStr(String(state));
    results = results.filter((lc) => normalizeSearchStr(lc.state) === normState);
  }

  if (district) {
    const normDist = normalizeSearchStr(String(district));
    results = results.filter((lc) => normalizeSearchStr(lc.district).includes(normDist));
  }

  if (city) {
    const normCity = normalizeSearchStr(String(city));
    results = results.filter((lc) => normalizeSearchStr(lc.city).includes(normCity));
  }

  if (status) {
    const normStatus = normalizeSearchStr(String(status));
    results = results.filter((lc) => normalizeSearchStr(lc.current_status) === normStatus);
  }

  const formatted = results.map(buildLcResponse);
  return res.json({ lcs: formatted, total: formatted.length });
});

app.get("/api/lcs/search", (req: Request, res: Response) => {
  const query = String(req.query.q || "");
  const results = db.lcs
    .filter((lc) => lc.is_active && matchesLcSearch(lc, query))
    .map(buildLcResponse);

  return res.json({ lcs: results });
});

app.get("/api/lcs/:id", (req: Request, res: Response) => {
  const param = req.params.id;
  let lc = db.lcs.find((l) => String(l.id) === param);
  if (!lc) {
    const normParam = normalizeSearchStr(param);
    lc = db.lcs.find((l) => normalizeSearchStr(l.lc_number) === normParam);
  }
  if (!lc) {
    lc = db.lcs.find((l) => l.lc_number.toLowerCase() === param.toLowerCase());
  }

  if (!lc) {
    return res.status(404).json({ error: "Level Crossing not found" });
  }

  return res.json({ lc: buildLcResponse(lc) });
});

// 3. Manager APIs (CRITICAL LC-ACCESS ENFORCEMENT)
app.get("/api/manager/my-lc", authenticateToken, requireRole("MANAGER"), (req: AuthRequest, res: Response) => {
  const managerId = req.user!.id;
  const lcId = getManagerAssignedLcId(managerId);

  if (!lcId) {
    return res.status(404).json({
      error: "No active Level Crossing assigned to your manager account. Please request assignment from an Administrator.",
    });
  }

  const lc = db.lcs.find((l) => l.id === lcId);
  if (!lc) {
    return res.status(404).json({ error: "Assigned Level Crossing record not found" });
  }

  return res.json({ lc: buildLcResponse(lc) });
});

app.put("/api/manager/my-lc/status", authenticateToken, requireRole("MANAGER"), (req: AuthRequest, res: Response) => {
  const managerId = req.user!.id;
  const lcId = getManagerAssignedLcId(managerId);

  if (!lcId) {
    return res.status(403).json({ error: "Forbidden: You do not have an assigned Level Crossing to update" });
  }

  const lc = db.lcs.find((l) => l.id === lcId);
  if (!lc) {
    return res.status(404).json({ error: "Assigned Level Crossing not found" });
  }

  const { current_status, status_category, maintenance_information } = req.body;

  if (current_status && current_status !== "OPEN" && current_status !== "CLOSED") {
    return res.status(400).json({ error: "Invalid status value. Must be OPEN or CLOSED" });
  }

  if (current_status) {
    lc.current_status = current_status;
    lc.open_closed_status = current_status;
  }
  if (status_category) {
    lc.status_category = status_category;
  }
  if (maintenance_information !== undefined) {
    lc.maintenance_information = maintenance_information;
  }

  const now = new Date();
  lc.last_updated = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  lc.updated_at = now.toISOString();

  saveDatabase(db);

  return res.json({
    message: "Status updated successfully for assigned level crossing",
    lc: buildLcResponse(lc),
  });
});

app.put("/api/manager/my-lc", authenticateToken, requireRole("MANAGER"), (req: AuthRequest, res: Response) => {
  const managerId = req.user!.id;
  const lcId = getManagerAssignedLcId(managerId);

  if (!lcId) {
    return res.status(403).json({ error: "Forbidden: No assigned Level Crossing" });
  }

  const lc = db.lcs.find((l) => l.id === lcId);
  if (!lc) return res.status(404).json({ error: "LC not found" });

  const { additional_information, next_train, traffic_volume } = req.body;
  if (additional_information !== undefined) lc.additional_information = additional_information;
  if (next_train !== undefined) lc.next_train = next_train;
  if (traffic_volume !== undefined) lc.traffic_volume = traffic_volume;

  lc.updated_at = new Date().toISOString();
  saveDatabase(db);

  return res.json({ message: "Updated successfully", lc: buildLcResponse(lc) });
});

// 4. Admin Management APIs
app.get("/api/admin/lcs", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const allLcs = db.lcs.map(buildLcResponse);
  return res.json({ lcs: allLcs, total: allLcs.length });
});

app.post("/api/admin/lcs", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const {
    lc_number,
    lc_name,
    state,
    district,
    city,
    location,
    status_category,
    traffic_volume,
    zone,
    division,
    current_status,
    next_train,
    maintenance_information,
    additional_information,
  } = req.body;

  if (!lc_number || !lc_name) {
    return res.status(400).json({ error: "Gate Number and Gate Name are required" });
  }

  const trimmedNumber = String(lc_number).trim();
  const existing = db.lcs.find((l) => l.lc_number.toLowerCase() === trimmedNumber.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: `Gate Number "${trimmedNumber}" already exists` });
  }

  const stateVal = state ? String(state).trim() : "General";
  const cityVal = city ? String(city).trim() : (district ? String(district).trim() : "General Area");
  const districtVal = district ? String(district).trim() : (cityVal || "General District");
  const locationVal = location ? String(location).trim() : (cityVal && stateVal ? `${cityVal}, ${stateVal}` : "Location not specified");

  const now = new Date();
  const newLc: LevelCrossing = {
    id: db.nextLcId++,
    lc_number: trimmedNumber,
    lc_name: String(lc_name).trim(),
    state: stateVal,
    district: districtVal,
    city: cityVal,
    zone: zone ? String(zone).trim() : "SCR",
    division: division ? String(division).trim() : "BZA",
    location: locationVal,
    current_status: (current_status === "CLOSED" ? "CLOSED" : "OPEN"),
    status_category: status_category ? String(status_category).trim() : "Operational",
    traffic_volume: (traffic_volume as any) || "Medium",
    next_train: next_train ? String(next_train).trim() : "--:--",
    open_closed_status: (current_status === "CLOSED" ? "CLOSED" : "OPEN"),
    maintenance_information: maintenance_information ? String(maintenance_information).trim() : "Operational",
    additional_information: additional_information ? String(additional_information).trim() : "",
    is_active: true,
    last_updated: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }),
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  db.lcs.push(newLc);
  saveDatabase(db);

  return res.status(201).json({ message: "Level Crossing created successfully", lc: buildLcResponse(newLc) });
});

app.put("/api/admin/lcs/:id", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const lc = db.lcs.find((l) => l.id === id);

  if (!lc) return res.status(404).json({ error: "Level Crossing not found" });

  const {
    lc_number,
    lc_name,
    state,
    district,
    city,
    current_status,
    status_category,
    traffic_volume,
    next_train,
    maintenance_information,
    additional_information,
    is_active,
    zone,
    division,
    location,
  } = req.body;

  // 1. Update Gate Number if provided & verify uniqueness
  if (lc_number !== undefined && lc_number !== null) {
    const trimmedNum = String(lc_number).trim();
    if (!trimmedNum) {
      return res.status(400).json({ error: "Gate Number cannot be empty" });
    }
    const duplicate = db.lcs.find((l) => l.id !== id && l.lc_number.toLowerCase() === trimmedNum.toLowerCase());
    if (duplicate) {
      return res.status(400).json({ error: `Gate Number "${trimmedNum}" is already used by another level crossing (${duplicate.lc_name})` });
    }
    lc.lc_number = trimmedNum;
  }

  // 2. Update Gate Name
  if (lc_name !== undefined && lc_name !== null) {
    const trimmedName = String(lc_name).trim();
    if (trimmedName) {
      lc.lc_name = trimmedName;
    }
  }

  // 3. Location fields (state, district, city, zone, division, location)
  if (state !== undefined) lc.state = String(state).trim();
  if (district !== undefined) lc.district = String(district).trim();
  if (city !== undefined) lc.city = String(city).trim();
  if (zone !== undefined) lc.zone = String(zone).trim();
  if (division !== undefined) lc.division = String(division).trim();
  if (location !== undefined) {
    lc.location = String(location).trim();
  } else if (city !== undefined || state !== undefined) {
    const c = lc.city || "";
    const s = lc.state || "";
    lc.location = c && s ? `${c}, ${s}` : (c || s || lc.location);
  }

  // Admin updates metadata specifications (status changes are reserved for Gate Managers)
  if (status_category !== undefined) lc.status_category = String(status_category).trim();
  if (traffic_volume !== undefined) lc.traffic_volume = traffic_volume;
  if (next_train !== undefined) lc.next_train = String(next_train).trim();
  if (maintenance_information !== undefined) lc.maintenance_information = String(maintenance_information).trim();
  if (additional_information !== undefined) lc.additional_information = String(additional_information).trim();
  if (is_active !== undefined) lc.is_active = Boolean(is_active);

  const now = new Date();
  lc.last_updated = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  lc.updated_at = now.toISOString();
  saveDatabase(db);

  return res.json({ message: `Gate ${lc.lc_number} updated successfully`, lc: buildLcResponse(lc) });
});

app.delete("/api/admin/lcs/:id", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const lc = db.lcs.find((l) => l.id === id);

  if (!lc) return res.status(404).json({ error: "LC not found" });

  lc.is_active = !lc.is_active;
  lc.updated_at = new Date().toISOString();
  saveDatabase(db);

  return res.json({
    message: `LC ${lc.lc_number} set to ${lc.is_active ? "Active" : "Inactive"}`,
    lc: buildLcResponse(lc),
  });
});

app.delete("/api/admin/lcs/:id/permanent", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const lcIndex = db.lcs.findIndex((l) => l.id === id);

  if (lcIndex === -1) return res.status(404).json({ error: "LC not found" });

  const removedLc = db.lcs.splice(lcIndex, 1)[0];

  // Also remove any manager-to-LC mappings
  db.mappings = db.mappings.filter((m) => m.lc_id !== id);

  saveDatabase(db);

  return res.json({
    message: `Level Crossing ${removedLc.lc_number} permanently deleted`,
  });
});

app.get("/api/admin/managers", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const managers = db.users
    .filter((u) => u.role === "MANAGER")
    .map((m) => {
      const assignedLcId = getManagerAssignedLcId(m.id);
      const assignedLc = assignedLcId ? db.lcs.find((l) => l.id === assignedLcId) : null;
      const zone = m.zone || (assignedLc?.zone) || "South Central Railway (SCR)";
      const division = m.division || (assignedLc?.division) || "Vijayawada (BZA)";
      const state = m.state || (assignedLc?.state) || "Andhra Pradesh";
      const district = m.district || (assignedLc?.district) || "Bapatla";

      return {
        id: m.id,
        name: m.name,
        email: m.email,
        mobile: m.mobile,
        status: m.status,
        zone,
        division,
        state,
        district,
        assignedLc: assignedLc
          ? {
              id: assignedLc.id,
              lc_number: assignedLc.lc_number,
              lc_name: assignedLc.lc_name,
              state: assignedLc.state,
              district: assignedLc.district,
              city: assignedLc.city,
              zone: assignedLc.zone || zone,
              division: assignedLc.division || division,
            }
          : null,
      };
    });

  return res.json({ managers });
});

app.post("/api/admin/managers", authenticateToken, requireRole("ADMIN"), async (req: Request, res: Response) => {
  const { name, email, password, mobile, zone, division, state, district } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newManager: User = {
    id: db.nextUserId++,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    mobile: mobile || "",
    password_hash,
    role: "MANAGER",
    status: "ACTIVE",
    zone: zone ? zone.trim() : "South Central Railway (SCR)",
    division: division ? division.trim() : "Vijayawada (BZA)",
    state: state ? state.trim() : "Andhra Pradesh",
    district: district ? district.trim() : "Bapatla",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.users.push(newManager);
  saveDatabase(db);

  return res.status(201).json({ message: "Manager created successfully", manager: newManager });
});

app.put("/api/admin/managers/:id", authenticateToken, requireRole("ADMIN"), async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const manager = db.users.find((u) => u.id === id && u.role === "MANAGER");

  if (!manager) return res.status(404).json({ error: "Manager not found" });

  const { name, email, mobile, status, password, zone, division, state, district } = req.body;
  if (name) manager.name = name.trim();
  if (email) {
    const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== id);
    if (existing) {
      return res.status(400).json({ error: "Another user is already registered with this email" });
    }
    manager.email = email.trim().toLowerCase();
  }
  if (mobile !== undefined) manager.mobile = mobile.trim();
  if (status && (status === "ACTIVE" || status === "INACTIVE" || status === "SUSPENDED")) {
    manager.status = status;
  }
  if (zone !== undefined) manager.zone = zone.trim();
  if (division !== undefined) manager.division = division.trim();
  if (state !== undefined) manager.state = state.trim();
  if (district !== undefined) manager.district = district.trim();

  if (password && password.trim().length >= 4) {
    manager.password_hash = await bcrypt.hash(password.trim(), 10);
  }

  manager.updated_at = new Date().toISOString();
  saveDatabase(db);

  return res.json({ message: "Manager details updated successfully", manager });
});

// Update / Reset Manager Credentials
app.put("/api/admin/managers/:id/credentials", authenticateToken, requireRole("ADMIN"), async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const manager = db.users.find((u) => u.id === id && u.role === "MANAGER");

  if (!manager) return res.status(404).json({ error: "Manager not found" });

  const { password, status } = req.body;

  if (password) {
    if (password.trim().length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long" });
    }
    manager.password_hash = await bcrypt.hash(password.trim(), 10);
  }

  if (status && (status === "ACTIVE" || status === "INACTIVE" || status === "SUSPENDED")) {
    manager.status = status;
  }

  manager.updated_at = new Date().toISOString();
  saveDatabase(db);

  return res.json({
    message: `Credentials updated successfully for ${manager.name}. New access status: ${manager.status}`,
    manager,
  });
});

// Update Manager Access Status
app.put("/api/admin/managers/:id/status", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const manager = db.users.find((u) => u.id === id && u.role === "MANAGER");

  if (!manager) return res.status(404).json({ error: "Manager not found" });

  const { status } = req.body;
  if (!status || (status !== "ACTIVE" && status !== "INACTIVE" && status !== "SUSPENDED")) {
    return res.status(400).json({ error: "Invalid status. Must be ACTIVE, INACTIVE, or SUSPENDED" });
  }

  manager.status = status;
  manager.updated_at = new Date().toISOString();
  saveDatabase(db);

  return res.json({
    message: `Manager ${manager.name} access status set to ${manager.status}`,
    manager,
  });
});

// Permanently Delete Manager & Revoke All Access
app.delete("/api/admin/managers/:id", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const managerIndex = db.users.findIndex((u) => u.id === id && u.role === "MANAGER");

  if (managerIndex === -1) return res.status(404).json({ error: "Manager not found" });

  const manager = db.users[managerIndex];

  // 1. Remove all mappings associated with this manager
  db.mappings = db.mappings.filter((m) => m.manager_id !== id);

  // 2. Remove manager from users list
  db.users.splice(managerIndex, 1);

  // 3. Persist changes
  saveDatabase(db);

  return res.json({
    message: `Manager "${manager.name}" (${manager.email}) and all credential access have been permanently deleted`,
  });
});

app.get("/api/admin/mappings", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const list = db.mappings.map((m) => {
    const manager = db.users.find((u) => u.id === m.manager_id);
    const lc = db.lcs.find((l) => l.id === m.lc_id);
    return {
      id: m.id,
      manager_id: m.manager_id,
      manager_name: manager ? manager.name : `Manager #${m.manager_id}`,
      manager_email: manager ? manager.email : "",
      lc_id: m.lc_id,
      lc_number: lc ? lc.lc_number : `LC #${m.lc_id}`,
      lc_name: lc ? lc.lc_name : "",
      assigned_at: m.assigned_at,
      is_active: m.is_active,
      status: m.is_active ? "ACTIVE" : manager?.status === "SUSPENDED" ? "SUSPENDED" : "INACTIVE",
    };
  });

  return res.json({ mappings: list });
});

// Admin Mappings Assignment API - Enforces Strict 1-to-1 Rule!
app.post("/api/admin/mappings", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const { manager_id, lc_id } = req.body;

  const manager = db.users.find((u) => u.id === Number(manager_id) && u.role === "MANAGER");
  if (!manager) {
    return res.status(400).json({ error: "Invalid Manager ID selected" });
  }

  const lc = db.lcs.find((l) => l.id === Number(lc_id));
  if (!lc) {
    return res.status(400).json({ error: "Invalid Level Crossing selected" });
  }

  // Strict Rule Enforcement: Deactivate any existing active mapping for this manager
  db.mappings.forEach((m) => {
    if (m.manager_id === manager.id && m.is_active) {
      m.is_active = false;
      m.updated_at = new Date().toISOString();
    }
  });

  // Strict Rule Enforcement: Deactivate any existing active mapping for this LC
  db.mappings.forEach((m) => {
    if (m.lc_id === lc.id && m.is_active) {
      m.is_active = false;
      m.updated_at = new Date().toISOString();
    }
  });

  const newMapping: ManagerLcMapping = {
    id: db.nextMappingId++,
    manager_id: manager.id,
    lc_id: lc.id,
    is_active: true,
    assigned_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.mappings.push(newMapping);
  saveDatabase(db);

  return res.status(201).json({
    message: `Successfully mapped Manager ${manager.name} to ${lc.lc_number}`,
    mapping: newMapping,
  });
});

app.delete("/api/admin/mappings/:id", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const mapping = db.mappings.find((m) => m.id === id);

  if (!mapping) return res.status(404).json({ error: "Mapping not found" });

  mapping.is_active = false;
  mapping.updated_at = new Date().toISOString();
  saveDatabase(db);

  return res.json({ message: "Mapping unassigned successfully" });
});

app.get("/api/admin/dashboard", authenticateToken, requireRole("ADMIN"), (req: Request, res: Response) => {
  const totalLcs = db.lcs.length;
  const activeLcs = db.lcs.filter((l) => l.is_active).length;
  const totalManagers = db.users.filter((u) => u.role === "MANAGER").length;
  const openLcs = db.lcs.filter((l) => l.current_status === "OPEN").length;
  const closedLcs = db.lcs.filter((l) => l.current_status === "CLOSED").length;

  const assignedLcIds = new Set(db.mappings.filter((m) => m.is_active).map((m) => m.lc_id));
  const unassignedLcs = db.lcs.filter((l) => !assignedLcIds.has(l.id)).length;
  const assignedManagers = new Set(db.mappings.filter((m) => m.is_active).map((m) => m.manager_id)).size;

  return res.json({
    stats: {
      totalLcs,
      activeLcs,
      totalManagers,
      assignedManagers,
      openLcs,
      closedLcs,
      unassignedLcs,
    },
  });
});

// Serve Vite App for frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RailGateStatus Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
