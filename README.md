# RailGateStatus - Railway Level Crossing Control & Monitoring System

RailGateStatus is a full-stack Railway Level Crossing Infrastructure Control and Monitoring web application built with **React, TypeScript, Express, Tailwind CSS, and RESTful APIs**.

---

## 🌟 Prototype Navigation & Screen Architecture

The application implements role-based navigation and screens:

1. **RailGateStatus - Welcome (`WELCOME`)**: Operational welcome screen with portal selection cards for Public Citizens, Station Managers, and Administrators.
2. **User Login - RailGateStatus (`LOGIN`)**: Unified authentication portal supporting JWT login and registration with fast-login demo credentials.
3. **Find Level Crossings - RailGateStatus (`FIND_LC`)**: Search directory allowing citizens and officials to search level crossings by LC number, state, district, or city.
4. **LC Details - RailGateStatus (`LC_DETAILS`)**: In-depth telemetry view displaying gate state (OPEN/CLOSED), traffic volume, next train schedule, assigned manager info, and operator maintenance logs.
5. **User Profile, Time Settings & Feedback Modal**: Full-screen user hub for citizens to configure 12h/24h time format, audio alerts, and submit feedback/defects.
6. **My Assigned LC - Manager Dashboard (`MY_LC`)**: Manager control console enabling mapped station managers to toggle real-time gate states (`OPEN` / `CLOSED`), select status categories, and submit operator maintenance logs.
7. **Admin Operations Console (`ADMIN_DASHBOARD`)**: Global command center overview displaying total crossings, active managers, assigned staff, and unassigned crossings.
8. **LC Infrastructure Management - Admin (`ADMIN_LC`)**: Administrator directory table to provision new level crossings, update unit locations, and activate/deactivate crossing units.
9. **Manager Accounts - Admin (`ADMIN_MANAGERS`)**: Administrator interface to provision and manage gate manager accounts.
10. **Infrastructure Mapping - Admin (`ADMIN_MAPPING`)**: Administrator 1:1 mapping authority enforcing single-manager assignment rules per level crossing.
11. **User Feedback & Reviews - Admin (`ADMIN_FEEDBACK`)**: Dedicated admin feedback inbox to review, filter, update status (`Received`, `Under Review`, `Resolved`), and manage citizen reports.

---

## 🔒 Security & Role-Based Access Control (RBAC)

The system enforces strict role-based authorization at both the API and UI layers:

* **USER (Citizen / Public)**: Read-only access to search level crossings, view gate telemetry, configure time formats, and submit issue reports/feedback.
* **MANAGER (Station / Gate Operator)**:
  * **Strict 1:1 Mapping Rule**: A manager can only manage their assigned Level Crossing.
  * **JWT Extraction**: `/api/manager/my-lc` extracts the manager ID directly from the authenticated JWT token. Managers cannot manipulate unassigned crossings.
* **ADMIN (System Administrator)**: Full control over level crossing provisioning, manager accounts, 1:1 mappings, global division command telemetry, and user feedback moderation.

---

## 🔑 Demo Login Credentials

For testing and verification, the system provides pre-configured credentials:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@railgatestatus.com` | `admin123` | System Command Center & Operations Console |
| **MANAGER** | `kumar@railgatestatus.com` | `12345` | Mapped Gate Manager (Default Demo Account) |
| **USER** | `user@railgatestatus.com` | `user123` | Public Directory & Citizen Feedback Portal |

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js** (version 18 or higher): [https://nodejs.org/](https://nodejs.org/)
- **npm** (comes bundled with Node.js)

### Step-by-Step Local Setup

1. **Clone or Extract the Project Directory**:
   ```bash
   cd /path/to/railgatestatus
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the App**:
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

5. **Build for Production (Optional)**:
   ```bash
   npm run build
   npm start
   ```

---

## 🗄️ Database Architecture & Storage

The application features dual-database compatibility:

### 1. Integrated Local Database (`.data/db.json`)
The application is pre-configured with a self-contained, disk-persisted JSON database engine (`.data/db.json`). All gate modifications, manager mappings, user records, and feedback entries are automatically written to this file immediately upon any user action. No external SQL server installation is needed to run locally.

### 2. Relational SQL Schema (`schema.sql`)
For production deployments using MySQL 8.x or PostgreSQL, a complete DDL schema is provided at `/schema.sql`.

#### Schema Tables Overview:
* `users`: `id`, `name`, `email`, `password_hash`, `mobile`, `role`, `status`, `created_at`
* `lcs`: `id`, `lc_number`, `lc_name`, `state`, `district`, `city`, `current_status`, `status_category`, `maintenance_information`
* `manager_lc_mapping`: `id`, `manager_id`, `lc_id`, `is_active`, `assigned_at` (Enforces unique active mapping per manager/LC)
* `feedback`: `id`, `user_id`, `user_name`, `user_email`, `rating`, `category`, `lc_number`, `subject`, `message`, `status`, `created_at`

---

## 📡 REST API Documentation

### Authentication APIs
* `POST /api/auth/register` — Register a new user account.
* `POST /api/auth/login` — Authenticate and receive JWT session token.
* `GET /api/auth/me` — Validate current JWT session and user profile.

### Public Crossing APIs
* `GET /api/lcs` — Search active level crossings by `lc_number`, `state`, `district`, `city`, or `status`.
* `GET /api/lcs/:id` — Retrieve detailed telemetry for a single level crossing.

### User Feedback APIs
* `POST /api/feedback` — Submit feedback, defect report, or rating.
* `GET /api/feedback` — Fetch submitted feedbacks (users get their submissions, admins get all).
* `PUT /api/feedback/:id/status` — Admin update feedback status (`Received`, `Under Review`, `Resolved`).
* `DELETE /api/feedback/:id` — Admin delete feedback record.

### Manager Operations APIs
* `GET /api/manager/my-lc` — Fetch the single active level crossing assigned to the authenticated manager.
* `PUT /api/manager/my-lc/status` — Update gate status (`OPEN` / `CLOSED`), status category, and maintenance log.

### Admin Infrastructure APIs
* `GET /api/admin/lcs` — List all level crossings.
* `POST /api/admin/lcs` — Provision a new level crossing unit.
* `PUT /api/admin/lcs/:id` — Edit level crossing attributes.
* `DELETE /api/admin/lcs/:id` — Activate or deactivate a level crossing unit.
* `GET /api/admin/managers` — List all registered manager accounts.
* `POST /api/admin/managers` — Create a new manager account.
* `GET /api/admin/mappings` — List all active and historical manager-LC mappings.
* `POST /api/admin/mappings` — Assign a manager to a level crossing (enforces 1:1 rule).
* `DELETE /api/admin/mappings/:id` — Unassign a manager mapping.
* `GET /api/admin/dashboard` — Fetch aggregated telemetry stats.
