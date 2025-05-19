const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { registerAccountTools } = require('./tools/accountTools.js');
const { registerFundingTools } = require('./tools/fundingTools.js');
const { registerMarketTools } = require('./tools/marketTools.js');
const { registerTradeTools } = require('./tools/tradeTools.js');

/**
 * 创建并配置MCP服务器
 * @returns {McpServer} 配置好的MCP服务器实例
 */
function createServer() {
  const server = new McpServer();
  
  // 注册所有工具
  registerAccountTools(server);
  registerFundingTools(server);
  registerMarketTools(server);
  registerTradeTools(server);
  
  return server;
}

module.exports = { createServer }; 