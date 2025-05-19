const tradeController = require('../controllers/tradeController');

/**
 * 注册交易相关工具
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP服务器实例
 */
function registerTradeTools(server) {
  // 下单交易工具
  server.tool(
    "okx_place_order",
    "下单交易",
    {
      instId: { type: "string", description: "产品ID，如BTC-USDT", required: true },
      tdMode: { type: "string", description: "交易模式，cash(现货), cross(全仓), isolated(逐仓)", required: true },
      side: { type: "string", description: "订单方向, buy或sell", required: true },
      ordType: { type: "string", description: "订单类型，market(市价), limit(限价)", required: true },
      sz: { type: "string", description: "委托数量", required: true },
      px: { type: "string", description: "委托价格，仅适用于limit类型订单" }
    },
    async ({ instId, tdMode, side, ordType, sz, px }) => {
      try {
        const result = await tradeController.placeOrder({ instId, tdMode, side, ordType, sz, px });
        return result;
      } catch (error) {
        console.error('下单错误:', error);
        throw new Error(`下单失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 撤销订单工具
  server.tool(
    "okx_cancel_order",
    "撤销订单",
    {
      instId: { type: "string", description: "产品ID", required: true },
      ordId: { type: "string", description: "订单ID", required: true }
    },
    async ({ instId, ordId }) => {
      try {
        const result = await tradeController.cancelOrder({ instId, ordId });
        return result;
      } catch (error) {
        console.error('撤销订单错误:', error);
        throw new Error(`撤销订单失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 获取订单信息工具
  server.tool(
    "okx_get_orders",
    "获取订单信息",
    {
      instId: { type: "string", description: "产品ID", required: true },
      ordId: { type: "string", description: "订单ID" }
    },
    async ({ instId, ordId }) => {
      try {
        const result = await tradeController.getOrders({ instId, ordId });
        return result;
      } catch (error) {
        console.error('获取订单信息错误:', error);
        throw new Error(`获取订单信息失败: ${error.message || '未知错误'}`);
      }
    }
  );

  // 获取历史订单工具
  server.tool(
    "okx_get_order_history",
    "获取历史订单",
    {
      instType: { type: "string", description: "产品类型，SPOT等" },
      instId: { type: "string", description: "产品ID" },
      ordType: { type: "string", description: "订单类型" }
    },
    async ({ instType, instId, ordType }) => {
      try {
        const result = await tradeController.getOrderHistory({ instType, instId, ordType });
        return result;
      } catch (error) {
        console.error('获取历史订单错误:', error);
        throw new Error(`获取历史订单失败: ${error.message || '未知错误'}`);
      }
    }
  );
}

module.exports = { registerTradeTools }; 