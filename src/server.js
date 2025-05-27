const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { registerAccountTools } = require('./tools/accountTools.js');
const { registerFundingTools } = require('./tools/fundingTools.js');
const { registerMarketTools } = require('./tools/marketTools.js');
const { registerTradeTools } = require('./tools/tradeTools.js');
const { registerOkxDexTools } = require('./tools/dexTools.js');

/**
 * Create and configure MCP server
 * @returns {McpServer} Configured MCP server instance
 */
function createServer() {
  const server = new McpServer();
  
  // Register all tools
  registerAccountTools(server);
  registerFundingTools(server);
  registerMarketTools(server);
  registerTradeTools(server);
  registerOkxDexTools(server);
  
  return server;
}

module.exports = { createServer }; 