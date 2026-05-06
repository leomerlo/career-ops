#!/usr/bin/env node
/**
 * career-ops web dashboard
 * Run: node dashboard-web/server.mjs
 * Open: http://localhost:3737
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = 3737;

// ── Parser ──────────────────────────────────────────────────────────────────

function parseMarkdownLinks(text) {
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    links.push({ label: m[1], href: m[2] });
  }
  return links;
}

function parseApplications() {
  const mdPath = path.join(ROOT, 'data', 'applications.md');
  if (!fs.existsSync(mdPath)) return [];

  const lines = fs.readFileSync(mdPath, 'utf8').split('\n');
  const apps = [];

  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
    if (cells.length < 8) continue;
    const [num, date, company, role, score, status, pdf, report, ...noteParts] = cells;
    if (!num || num === '#' || num.startsWith('-')) continue;

    const scoreNum = parseFloat(score);
    const pdfLinks = parseMarkdownLinks(pdf);
    const reportLinks = parseMarkdownLinks(report);
    const reportPath = reportLinks[0]?.href ?? null;

    // Detect HTML sources in output/ for this app
    const numPadded = String(parseInt(num) || num).padStart(3, '0');
    const outputDir = path.join(ROOT, 'output');
    const htmlSources = fs.existsSync(outputDir)
      ? fs.readdirSync(outputDir)
          .filter(f => f.startsWith(numPadded) && f.endsWith('.html'))
          .map(f => ({
            label: f.includes('cover') ? 'CL' : 'CV',
            htmlPath: `output/${f}`,
            pdfPath:  `output/${f.replace('.html', '.pdf')}`,
            pdfExists: fs.existsSync(path.join(outputDir, f.replace('.html', '.pdf'))),
          }))
      : [];

    apps.push({
      num: parseInt(num) || num,
      date,
      company,
      role,
      score,
      scoreNum: isNaN(scoreNum) ? null : scoreNum,
      status,
      pdfLinks,
      hasPdf: pdfLinks.length > 0,
      reportPath,
      reportLabel: reportLinks[0]?.label ?? null,
      notes: noteParts.join('|').trim(),
      htmlSources,
    });
  }

  return apps.sort((a, b) => {
    const na = typeof a.num === 'number' ? a.num : parseInt(a.num) || 0;
    const nb = typeof b.num === 'number' ? b.num : parseInt(b.num) || 0;
    return nb - na;
  });
}

// ── PDF generation ────────────────────────────────────────────────────────────

function generatePdf(htmlPath, pdfPath) {
  return new Promise((resolve, reject) => {
    // Validate paths stay within ROOT/output/
    const absHtml = path.resolve(ROOT, htmlPath);
    const absPdf  = path.resolve(ROOT, pdfPath);
    if (!absHtml.startsWith(path.join(ROOT, 'output')) ||
        !absPdf.startsWith(path.join(ROOT, 'output'))) {
      return reject(new Error('Path outside output/ not allowed'));
    }
    if (!fs.existsSync(absHtml)) {
      return reject(new Error(`HTML source not found: ${htmlPath}`));
    }

    const script = path.join(ROOT, 'generate-pdf.mjs');
    execFile('node', [script, absHtml, absPdf], { cwd: ROOT }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve({ stdout, pdfPath });
    });
  });
}

// ── Body reader ───────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

// ── MIME types ───────────────────────────────────────────────────────────────

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.pdf':  'application/pdf',
  '.md':   'text/plain; charset=utf-8',
  '.json': 'application/json',
};

// ── Server ────────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end(); return;
  }

  const json = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
  };

  // GET /api/apps
  if (pathname === '/api/apps' && req.method === 'GET') {
    return json(200, parseApplications());
  }

  // POST /api/generate-pdf  { htmlPath, pdfPath }
  if (pathname === '/api/generate-pdf' && req.method === 'POST') {
    const body = await readBody(req);
    const { htmlPath, pdfPath } = body;
    if (!htmlPath || !pdfPath) return json(400, { error: 'htmlPath and pdfPath required' });
    try {
      const result = await generatePdf(htmlPath, pdfPath);
      return json(200, { ok: true, pdfPath: result.pdfPath });
    } catch (err) {
      console.error('PDF generation error:', err.message);
      return json(500, { error: err.message });
    }
  }

  // Serve output/* and reports/* files
  if (pathname.startsWith('/output/') || pathname.startsWith('/reports/')) {
    const filePath = path.join(ROOT, pathname.slice(1));
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    const isDownload = url.searchParams.get('dl') === '1';
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Disposition': isDownload
        ? `attachment; filename="${path.basename(filePath)}"`
        : `inline; filename="${path.basename(filePath)}"`,
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Serve static files from dashboard-web/
  if (pathname !== '/' && pathname !== '/index.html') {
    const filePath = path.join(__dirname, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Fallback: serve index.html
  const indexPath = path.join(__dirname, 'index.html');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.createReadStream(indexPath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`career-ops dashboard → http://localhost:${PORT}`);
});
