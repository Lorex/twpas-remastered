/**
 * @file server.js
 * @description 簡易 Mock 伺服器，用於 E2E 測試
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MOCK_APP_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

// Route mapping (path without extension -> file)
const routes = {
  '/': '/index.html',
  '/login': '/login.html',
  '/dashboard': '/dashboard.html',
  '/register': '/register.html',
  '/patient': '/patient.html',
  '/patient/new': '/patient.html',
  '/claim': '/claim.html',
  '/claim/new': '/claim-form.html',
  '/valueset': '/valueset.html',
  '/fhir': '/fhir.html',
  '/nhi-upload': '/nhi-upload.html',
  '/settings': '/settings.html',
};

// Dynamic routes (patterns)
const dynamicRoutes = [
  { pattern: /^\/claim\/(\d+)(\/edit)?$/, file: '/claim-detail.html' },
  { pattern: /^\/patient\/(.+)$/, file: '/patient.html' },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = url.pathname;

  // Apply static route mapping
  if (routes[pathname]) {
    pathname = routes[pathname];
  } else {
    // Check dynamic routes
    for (const route of dynamicRoutes) {
      if (route.pattern.test(pathname)) {
        pathname = route.file;
        break;
      }
    }
  }

  // Default to .html extension if no extension
  if (!path.extname(pathname)) {
    pathname += '.html';
  }

  const filePath = path.join(MOCK_APP_DIR, pathname);
  const ext = path.extname(filePath);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 404 Not Found
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<h1>404 - 頁面不存在</h1><p>找不到：${pathname}</p><p><a href="/">回首頁</a></p>`);
      return;
    }

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>500 - 伺服器錯誤</h1>');
        return;
      }

      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  Object.keys(routes).forEach(route => {
    console.log(`  ${route} -> ${routes[route]}`);
  });
});
