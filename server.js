import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const jsonServer = require('json-server');
const express = require('express');

const app = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'server', 'db.json'));

const PORT = process.env.PORT || 3001;
const distPath = join(__dirname, 'dist');
const indexPath = join(distPath, 'index.html');

// json-server body parser (needed for POST/PUT/PATCH)
app.use(jsonServer.bodyParser);

// API routes: mount json-server under /api
app.use('/api', router);

// Serve built frontend from dist/
app.use(express.static(distPath));

// SPA fallback: any non-API GET returns index.html
app.get('*', (req, res) => {
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Build not found. Run: npm run build' });
  }
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   REConverge 2001 - Production Server    ║
  ╠══════════════════════════════════════════╣
  ║   App:  http://localhost:${PORT}            ║
  ║   API:  http://localhost:${PORT}/api        ║
  ╚══════════════════════════════════════════╝
  `);
});
