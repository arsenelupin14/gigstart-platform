const express = require('express');
const cors = require('cors');
const path = require('path');

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
app.use(express.static(__dirname));

// SPA Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// For Vercel Serverless compatibility
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('[GigStart] Server running on port', PORT);
  });
}
