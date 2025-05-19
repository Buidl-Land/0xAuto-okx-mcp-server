const accountController = require('../controllers/accountController');

/**
 * 注册账户相关工具
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP服务器实例
 */
function registerAccountTools(server) {
  // 获取账户信息工具
  server.tool(
    "okx_get_account_info",
    "获取OKX账户信息",
    {},
    async () => {
      try {
        const result = await accountController.getAccountInfo();
        return result;
      } catch (error) {
        console.error('获取账户信息错误:', error);
        throw new Error(`获取账户信息失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 获取持仓信息工具
  server.tool(
    "okx_get_positions",
    "获取账户持仓信息",
    {
      instType: { type: "string", description: "产品类型，可选值：MARGIN, SWAP, FUTURES, OPTION" },
      instId: { type: "string", description: "产品ID" }
    },
    async ({ instType, instId }) => {
      try {
        const result = await accountController.getPositions({ instType, instId });
        return result;
      } catch (error) {
        console.error('获取持仓信息错误:', error);
        throw new Error(`获取持仓信息失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 获取账户余额工具
  server.tool(
    "okx_get_balance",
    "获取账户余额信息",
    {
      ccy: { type: "string", description: "币种" }
    },
    async ({ ccy }) => {
      try {
        const result = await accountController.getBalance({ ccy });
        return result;
      } catch (error) {
        console.error('获取账户余额错误:', error);
        throw new Error(`获取账户余额失败: ${error.message || '未知错误'}`);
      }
    }
  );
}

module.exports = { registerAccountTools }; 