const fundingController = require('../controllers/fundingController');

/**
 * 注册资金相关工具
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP服务器实例
 */
function registerFundingTools(server) {
  // 获取充值地址工具
  server.tool(
    "okx_get_deposit_address",
    "获取充值地址",
    {
      ccy: { type: "string", description: "币种，如 BTC", required: true }
    },
    async ({ ccy }) => {
      try {
        const result = await fundingController.getDepositAddress({ ccy });
        return result;
      } catch (error) {
        console.error('获取充值地址错误:', error);
        throw new Error(`获取充值地址失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 获取充值记录工具
  server.tool(
    "okx_get_deposit_history",
    "获取充值记录",
    {
      ccy: { type: "string", description: "币种" },
      state: { type: "string", description: "状态: 0(等待确认) 1(确认到账) 2(充值成功)" }
    },
    async ({ ccy, state }) => {
      try {
        const result = await fundingController.getDepositHistory({ ccy, state });
        return result;
      } catch (error) {
        console.error('获取充值记录错误:', error);
        throw new Error(`获取充值记录失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 提币工具
  server.tool(
    "okx_withdraw",
    "提币",
    {
      ccy: { type: "string", description: "币种", required: true },
      amt: { type: "string", description: "提币数量", required: true },
      dest: { type: "string", description: "提币方式，4:内部转账，3:链上提币", required: true },
      toAddr: { type: "string", description: "提币地址", required: true },
      fee: { type: "string", description: "网络手续费" },
      chain: { type: "string", description: "链名称，如ETH" }
    },
    async ({ ccy, amt, dest, toAddr, fee, chain }) => {
      try {
        const result = await fundingController.withdraw({ ccy, amt, dest, toAddr, fee, chain });
        return result;
      } catch (error) {
        console.error('提币请求错误:', error);
        throw new Error(`提币请求失败: ${error.message || '未知错误'}`);
      }
    }
  );
}

module.exports = { registerFundingTools }; 