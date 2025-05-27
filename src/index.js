require('dotenv').config();
const app = require('./app');
const config = require('./config');

const PORT = config.server.port;

const server = app.listen(PORT, (error) => {
  if (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
  console.log(`0xauto MCP server running on port ${PORT}`);
  console.log(`OKX API Base URL: ${config.okx.baseUrl}`);
  console.log(`Simulated trading mode: ${config.okx.simulatedTrading === '1' ? 'Enabled' : 'Disabled'}`);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.info('HTTP server closed');
    process.exit(0);
  });
});