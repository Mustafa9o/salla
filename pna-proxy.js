// Proxy server that adds Private Network Access headers so Chrome allows
// http://localhost assets to load from an HTTPS page (Salla editor).
// Runs on port 8080, proxies to port 8000.
const http = require('http');

const PROXY_PORT = 8080;
const TARGET_PORT = 8002;

const PNA_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Private-Network': 'true',
};

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, PNA_HEADERS);
    return res.end();
  }

  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (proxyRes) => {
    const headers = Object.assign({}, proxyRes.headers, PNA_HEADERS);
    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    res.writeHead(502);
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxy);
}).listen(PROXY_PORT, () => {
  console.log(`PNA proxy running: http://localhost:${PROXY_PORT} -> http://localhost:${TARGET_PORT}`);
});
