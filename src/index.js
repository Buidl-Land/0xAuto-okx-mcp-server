require('dotenv').config();
const app = require('./app');
const config = require('./config');

const PORT = config.server.port;

const server = app.listen(PORT, (error) => {
  if (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
  console.log(`0xauto MCP 服务器运行在端口 ${PORT}`);
  console.log(`OKX API Base URL: ${config.okx.baseUrl}`);
  console.log(`模拟交易模式: ${config.okx.simulatedTrading === '1' ? '已启用' : '已禁用'}`);
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