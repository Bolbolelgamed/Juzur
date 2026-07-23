import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, 'docs');
const port = Number(process.env.PORT) || 5173;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/' || urlPath === '/Juzur') urlPath = '/Juzur/';
  if (urlPath === '/Juzur/') urlPath = '/index.html';
  if (urlPath.startsWith('/Juzur/')) urlPath = urlPath.slice('/Juzur'.length);

  const file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }

    send(res, 200, data, types[path.extname(file).toLowerCase()] || 'application/octet-stream');
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Preview ready: http://127.0.0.1:${port}/Juzur/`);
});
