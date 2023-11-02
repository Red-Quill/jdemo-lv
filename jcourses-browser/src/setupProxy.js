const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/api',
		createProxyMiddleware("/api",{
			target: 'http://localhost:3002', // Replace with your desired API endpoint
			changeOrigin: true,
		})
	);
};

/*
*/
