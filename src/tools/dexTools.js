const OkxQuoteTool = require('./dex/quoteTool');
const OkxSupportedChainsTool = require('./dex/supportedChainsTool');
const OkxTokenListTool = require('./dex/tokenListTool');
const OkxPriceTool = require('./dex/priceTool');
const OkxKlineTool = require('./dex/klineTool');
const OkxBalanceTool = require('./dex/balanceTool');
const OkxApproveTool = require('./dex/approveTool');
const OkxSwapTool = require('./dex/swapTool');
const OkxCrossChainSwapTool = require('./dex/crossChainSwapTool');

/**
 * Register OKX DEX tools to MCP server
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP server instance
 */
function registerOkxDexTools(server) {
  // Check OKX private API configuration
  if (!process.env.OKX_API_KEY || !process.env.OKX_SECRET_KEY || !process.env.OKX_PASSPHRASE) {
    console.warn(
      "[WARNING] OKX_API_KEY/OKX_SECRET_KEY/OKX_PASSPHRASE environment variables are not set. OKX private API tools will be registered, but calls will fail.\n" +
      "Tip: To use OKX DEX APIs, please add OKX_API_KEY/OKX_SECRET_KEY/OKX_PASSPHRASE to your .env file"
    );
  }

  const tools = [
    new OkxQuoteTool(),
    new OkxSupportedChainsTool(),
    new OkxTokenListTool(),
    new OkxPriceTool(),
    new OkxKlineTool(),
    new OkxBalanceTool(),
    new OkxApproveTool(),
    new OkxSwapTool(),
    new OkxCrossChainSwapTool(),
  ];

  for (const tool of tools) {
    const def = tool.getDefinition();
    server.tool(def.name, def.description, def.inputSchema, async (args) => tool.execute(args));
  }
}

module.exports = { registerOkxDexTools }; 