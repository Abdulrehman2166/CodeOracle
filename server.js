/**
 * 🚀 CodeOracle Backend Bridge (ES Module Version)
 * 
 * 1. Run with: node server.js
 */

import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 🗄️ Connect to XAMPP MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'code_oracle_db'
});

db.connect((err) => {
    if (err) {
      console.error('\n❌ SQL CONNECTION ERROR:');
      console.error('--------------------------');
      console.error(`Message: ${err.message}`);
      console.error('Action: Ensure XAMPP MySQL is running and "code_oracle_db" exists.\n');
      return;
    }
    console.log('\n✅ SQL BRIDGE ACTIVE');
    console.log('-------------------');
    console.log('Database: code_oracle_db');
    console.log('Status: Listening for Workspace Sync...\n');
});

// 📁 Get all files
app.get('/api/files', (req, res) => {
    db.query('SELECT * FROM project_files', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 💾 Save/Update a file (With Logging)
app.post('/api/files', (req, res) => {
    const { id, name, content, language } = req.body;
    console.log(`[SYNC] Saving File: ${name} (${id})`);
    const query = 'INSERT INTO project_files (id, name, content, language) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE content = ?, name = ?';
    db.query(query, [id, name, content, language, content, name], (err, result) => {
        if (err) {
          console.error(`[ERROR] Failed to save ${name}:`, err.message);
          return res.status(500).json(err);
        }
        res.json({ message: 'Saved successfully', id });
    });
});

// 📊 Archive Analysis Result (With Logging)
app.post('/api/analysis', (req, res) => {
    const { file_id, type, result } = req.body;
    console.log(`[ARCHIVE] Storing ${type} for File ID: ${file_id}`);
    db.query('INSERT INTO analysis_history (file_id, analysis_type, result_text) VALUES (?, ?, ?)', [file_id, type, result], (err, result) => {
        if (err) {
          console.error('[ERROR] Failed to archive analysis:', err.message);
          return res.status(500).json(err);
        }
        res.json({ message: 'Analysis archived' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Bridge Server: http://localhost:${PORT}`);
    console.log('Use Ctrl+C to stop the server.\n');
});
