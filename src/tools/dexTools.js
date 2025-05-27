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
 * 向MCP服务器注册OKX DEX工具
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP服务器实例
 */
function registerOkxDexTools(server) {
  // 检查OKX私有API配置
  if (!process.env.OKX_API_KEY || !process.env.OKX_SECRET_KEY || !process.env.OKX_PASSPHRASE) {
    console.warn(
      "[警告] 未设置OKX_API_KEY/OKX_SECRET_KEY/OKX_PASSPHRASE环境变量。OKX私有API相关工具将被注册，但调用会失败。\n" +
      "提示: 如需调用OKX DEX接口，请在.env文件中添加 OKX_API_KEY/OKX_SECRET_KEY/OKX_PASSPHRASE"
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