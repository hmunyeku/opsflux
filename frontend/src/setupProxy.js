/**
 * Configuration du proxy pour le développement
 * Ne proxifie que les routes API vers le backend
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxifier uniquement les routes API vers le backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend:8000',
      changeOrigin: true,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
      }
    })
  );

  // Proxifier les routes WebSocket
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'ws://backend:8000',
      changeOrigin: true,
      ws: true,
      logLevel: 'debug'
    })
  );
};
