const http = require('http');
const fs = require('fs');
const path = require('path');

const publicDir = 'D:/store_Ratio/Ratio-Salla-Theme/public';
const PORT = 9000;

const mimeTypes = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const filePath = path.join(publicDir, decodeURIComponent(urlPath));
  const ext = path.extname(filePath).toLowerCase();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      return res.end('Not found: ' + urlPath);
    }
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
    });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, () => {
  console.log('Asset server running at http://localhost:' + PORT);
});
