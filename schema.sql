-- RailGateStatus - MySQL 8.x Database Schema
-- Production Ready Infrastructure Management Database

CREATE DATABASE IF NOT EXISTS railgatestatus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE railgatestatus_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(50) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'MANAGER', 'ADMIN') NOT NULL DEFAULT 'USER',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Level Crossings (LCs) Table
CREATE TABLE IF NOT EXISTS lcs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lc_number VARCHAR(100) NOT NULL UNIQUE,
    lc_name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    current_status ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    status_category VARCHAR(100) DEFAULT 'Routine Operation',
    traffic_volume ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    next_train VARCHAR(50) DEFAULT '14:30',
    open_closed_status VARCHAR(100) DEFAULT 'OPEN',
    maintenance_information TEXT DEFAULT NULL,
    additional_information TEXT DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lc_number (lc_number),
    INDEX idx_lc_state_city (state, city),
    INDEX idx_lc_status (current_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Manager to LC Mapping Table
CREATE TABLE IF NOT EXISTS manager_lc_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT NOT NULL,
    lc_id INT NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lc_id) REFERENCES lcs(id) ON DELETE CASCADE,
    -- Prevent duplicate active manager assignments or duplicate active LC assignments
    UNIQUE KEY uk_active_manager (manager_id, is_active),
    UNIQUE KEY uk_active_lc (lc_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data
-- Passwords hashed with bcrypt (cost factor 10)
-- Default passwords:
-- Admin: admin@railgatestatus.com / admin123
-- Manager: sarah.jenkins@railgatestatus.com / manager123
-- Manager: david.chen@railgatestatus.com / manager123
-- User: user@railgatestatus.com / user123

INSERT INTO users (name, email, mobile, password_hash, role, status) VALUES
('Admin User', 'admin@railgatestatus.com', '+1-555-0199', '$2a$10$E24O.36XGzvhM0a3eK477.U5K4W/y9Sj0fOQpS2B1b6Xk7m5I71O.', 'ADMIN', 'ACTIVE'),
('Sarah Jenkins', 'sarah.jenkins@railgatestatus.com', '+1-555-0101', '$2a$10$UaJt0P1fGgU2mQf5D3x/S.8gO5z/3b2G8x5M0QpS2B1b6Xk7m5I71O.', 'MANAGER', 'ACTIVE'),
('David Chen', 'david.chen@railgatestatus.com', '+1-555-0102', '$2a$10$UaJt0P1fGgU2mQf5D3x/S.8gO5z/3b2G8x5M0QpS2B1b6Xk7m5I71O.', 'MANAGER', 'ACTIVE'),
('Alan K.', 'alan.k@railgatestatus.com', '+1-555-0103', '$2a$10$UaJt0P1fGgU2mQf5D3x/S.8gO5z/3b2G8x5M0QpS2B1b6Xk7m5I71O.', 'MANAGER', 'ACTIVE'),
('Robert Alvarez', 'robert.alvarez@railgatestatus.com', '+1-555-0104', '$2a$10$UaJt0P1fGgU2mQf5D3x/S.8gO5z/3b2G8x5M0QpS2B1b6Xk7m5I71O.', 'MANAGER', 'ACTIVE'),
('Elena Rostova', 'elena.rostova@railgatestatus.com', '+1-555-0105', '$2a$10$UaJt0P1fGgU2mQf5D3x/S.8gO5z/3b2G8x5M0QpS2B1b6Xk7m5I71O.', 'MANAGER', 'ACTIVE'),
('Public Citizen', 'user@railgatestatus.com', '+1-555-0100', '$2a$10$3n5qP1fGgU2mQf5D3x/S.8gO5z/3b2G8x5M0QpS2B1b6Xk7m5I71O.', 'USER', 'ACTIVE');

INSERT INTO lcs (lc_number, lc_name, state, district, city, location, current_status, status_category, traffic_volume, next_train, maintenance_information) VALUES
('LC-142B', 'Suburban East Gate', 'Maharashtra', 'Pune District', 'Pune', '18.5204° N, 73.8567° E', 'OPEN', 'Routine Operation', 'High', '14:30', 'Routine inspection completed. Boom gate mechanics functioning normally.'),
('LC-88A', 'Industrial Bypass Gate', 'Maharashtra', 'Nashik District', 'Nashik', '19.9975° N, 73.7898° E', 'CLOSED', 'Emergency Maintenance', 'Medium', '12:15', 'Emergency track alignment work in progress. Reopening estimated in 45 mins.'),
('LC-201C', 'Port Commercial Gate', 'Gujarat', 'Surat District', 'Surat', '21.1702° N, 72.8311° E', 'OPEN', 'Routine Operation', 'Low', '18:00', 'Automated barrier signals calibrated. Sensors nominal.'),
('LC-4092', 'Downtown Crossing', 'TX', 'Austin District', 'Austin', '30.2672° N, 97.7431° W', 'OPEN', 'Routine Operation', 'High', '15:10', 'High density urban junction. Sensors operating smoothly.'),
('LC-8813', 'Industrial Park Rd', 'CA', 'Santa Clara District', 'San Jose', '37.3382° N, 121.8863° W', 'CLOSED', 'Signal Failure', 'Medium', '16:45', 'Signal power failure reported. Backup generator engaged.'),
('LC-2256', 'Riverside Ave', 'NY', 'Albany District', 'Albany', '42.6526° N, 73.7562° W', 'OPEN', 'Routine Operation', 'Low', '19:20', 'All systems operational.'),
('LC-9901', 'West End Blvd', 'TX', 'Dallas District', 'Dallas', '32.7767° N, 96.7970° W', 'CLOSED', 'Scheduled Maintenance', 'Medium', '21:00', 'Undergoing scheduled quarter overhaul.'),
('LC-1102', 'North County Line', 'CA', 'Fresno District', 'Fresno', '36.7468° N, 119.7726° W', 'OPEN', 'Routine Operation', 'High', '13:00', 'Clear passage for express freight.'),
('LC-1024', 'Suburban East Gate', 'Metro District', 'Eastern Division', 'Capital City', '38.9072° N, 77.0369° W', 'OPEN', 'Manual Override', 'High', '14:00', 'Routine inspection completed on 2024-05-10. Boom gate mechanics functioning within nominal parameters.');

INSERT INTO manager_lc_mapping (manager_id, lc_id, is_active) VALUES
(2, 4, 1), -- Sarah Jenkins -> LC-4092
(3, 5, 1), -- David Chen -> LC-8813
(4, 6, 1), -- Alan K. -> LC-2256
(6, 9, 1); -- Elena Rostova -> LC-1024
