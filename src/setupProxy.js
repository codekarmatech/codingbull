const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to the Django backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        // The context '/api' is stripped by app.use, so the path here starts after /api
        // e.g., for '/api/posts', the path here is '/posts'.
        // We need to prepend '/api' to make the target request '/api/posts'.
        '^/(.*)': '/api/$1',
      },
    })
  );
};