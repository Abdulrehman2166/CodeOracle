-- 🏛️ CodeOracle Enterprise Database Schema
-- Compatible with XAMPP (MySQL/MariaDB)

CREATE DATABASE IF NOT EXISTS code_oracle_db;
USE code_oracle_db;

-- 👤 User Accounts
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📁 Projects (Workspaces)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 📄 Project Files
CREATE TABLE IF NOT EXISTS project_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    name VARCHAR(100) NOT NULL,
    content LONGTEXT,
    language VARCHAR(20) DEFAULT 'javascript',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 🧠 AI Analysis Reports (The "Knowledge Base")
CREATE TABLE IF NOT EXISTS analysis_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT,
    analysis_type ENUM('analyze', 'diagram', 'optimize') NOT NULL,
    result_text LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES project_files(id) ON DELETE CASCADE
);

-- 🚀 USEFUL QUERIES FOR XAMPP ──────────────────────────────────────

-- 1. Get all files for a specific project
-- SELECT * FROM project_files WHERE project_id = 1;

-- 2. Find the latest architecture diagram for a file
-- SELECT * FROM analysis_history WHERE file_id = 1 AND analysis_type = 'diagram' ORDER BY created_at DESC LIMIT 1;

-- 3. Search for specific code patterns across all projects
-- SELECT * FROM project_files WHERE content LIKE '%class %';


-- 📥 PREVIOUS DATA MIGRATION QUERIES ──────────────────────────────────
-- Run these queries in phpMyAdmin to save your existing work!

-- 1. Create your Master User
INSERT INTO users (username, email, password_hash) 
VALUES ('Architect', 'admin@codeoracle.ai', 'PBKDF2_SECURE_HASH_EXAMPLE');

-- 2. Create the "CodeOracle" Enterprise Project
INSERT INTO projects (user_id, name, description) 
VALUES (1, 'CodeOracle SaaS', 'Industry-level architectural analyzer and logic engine.');

-- 3. Save your "Previous" Files (Main.js and Utils.js)
INSERT INTO project_files (project_id, name, content, language) 
VALUES 
(1, 'App.js', '// Master Entry Point\nclass AppCore { ... }', 'javascript'),
(1, 'Engine.js', 'function processData(input) { return input * 2; }', 'javascript');

-- 4. Save your Previous Analysis History
INSERT INTO analysis_history (file_id, analysis_type, result_text) 
VALUES 
(1, 'analyze', 'Logic Analysis: High cohesion, Enterprise scale detected.'),
(1, 'diagram', 'Architecture: Modular topology mapped successfully.');

-- ✅ DATA VERIFICATION QUERY
-- Run this to see your migrated data:
-- SELECT p.name as Project, f.name as File, f.content 
-- FROM projects p 
-- JOIN project_files f ON p.id = f.project_id;
