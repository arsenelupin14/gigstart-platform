const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Use in-memory for serverless environment persistence
let inMemoryDb = {};

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Endpoints
app.get('/api/data', (req, res) => {
  res.json(inMemoryDb);
});

app.post('/api/data', (req, res) => {
  inMemoryDb = req.body;
  res.json({ message: "Database updated in memory" });
});

// Explicitly serve static files
const staticPath = fs.existsSync(path.join(__dirname, 'dist')) 
  ? path.join(__dirname, 'dist') 
  : __dirname;

app.use(express.static(staticPath));

// SPA Fallback
app.use((req, res) => {
  const indexPath = fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
    ? path.join(__dirname, 'dist', 'index.html')
    : path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

// For Vercel Serverless compatibility
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('[GigStart] Server running on port', PORT);
  });
}
