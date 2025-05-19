const marketController = require('../controllers/marketController');

/**
 * 注册市场数据相关工具
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP服务器实例
 */
function registerMarketTools(server) {
  // 获取产品行情数据工具
  server.tool(
    "okx_get_ticker",
    "获取产品行情数据",
    {
      instId: { type: "string", description: "产品ID，如BTC-USDT", required: true }
    },
    async ({ instId }) => {
      try {
        const result = await marketController.getTicker({ instId });
        return result;
      } catch (error) {
        console.error('获取行情数据错误:', error);
        throw new Error(`获取行情数据失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 获取K线数据工具
  server.tool(
    "okx_get_kline",
    "获取K线数据",
    {
      instId: { type: "string", description: "产品ID，如BTC-USDT", required: true },
      bar: { type: "string", description: "时间粒度，如1m/1h/1d等", required: true },
      limit: { type: "string", description: "返回结果的数量，最大100" }
    },
    async ({ instId, bar, limit }) => {
      try {
        const result = await marketController.getKline({ instId, bar, limit });
        return result;
      } catch (error) {
        console.error('获取K线数据错误:', error);
        throw new Error(`获取K线数据失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 获取可交易产品列表工具
  server.tool(
    "okx_get_instruments",
    "获取可交易产品列表",
    {
      instType: { type: "string", description: "产品类型，SPOT, SWAP, FUTURES, OPTION等", required: true },
      uly: { type: "string", description: "标的指数，如BTC-USD" }
    },
    async ({ instType, uly }) => {
      try {
        const result = await marketController.getInstruments({ instType, uly });
        return result;
      } catch (error) {
        console.error('获取产品列表错误:', error);
        throw new Error(`获取产品列表失败: ${error.message || '未知错误'}`);
      }
    }
  );
}

module.exports = { registerMarketTools }; 