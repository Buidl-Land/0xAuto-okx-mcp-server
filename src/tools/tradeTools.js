const tradeController = require('../controllers/tradeController');

/**
 * Register trade related tools
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP server instance
 */
function registerTradeTools(server) {
  // Order placement tool
  server.tool(
    "okx_place_order",
    "Place Order",
    {
      instId: { type: "string", description: "Product ID, e.g. BTC-USDT", required: true },
      tdMode: { type: "string", description: "Trading mode, cash(spot), cross(cross margin), isolated(isolated margin)", required: true },
      side: { type: "string", description: "Order side, buy or sell", required: true },
      ordType: { type: "string", description: "Order type, market(market price), limit(limit price)", required: true },
      sz: { type: "string", description: "Order size", required: true },
      px: { type: "string", description: "Order price, only applicable for limit orders" }
    },
    async ({ instId, tdMode, side, ordType, sz, px }) => {
      try {
        const result = await tradeController.placeOrder({ instId, tdMode, side, ordType, sz, px });
        return result;
      } catch (error) {
        console.error('Order placement error:', error);
        throw new Error(`Order placement failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Cancel order tool
  server.tool(
    "okx_cancel_order",
    "Cancel Order",
    {
      instId: { type: "string", description: "Product ID", required: true },
      ordId: { type: "string", description: "Order ID", required: true }
    },
    async ({ instId, ordId }) => {
      try {
        const result = await tradeController.cancelOrder({ instId, ordId });
        return result;
      } catch (error) {
        console.error('Cancel order error:', error);
        throw new Error(`Cancel order failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Get order information tool
  server.tool(
    "okx_get_orders",
    "Get Order Information",
    {
      instId: { type: "string", description: "Product ID", required: true },
      ordId: { type: "string", description: "Order ID" }
    },
    async ({ instId, ordId }) => {
      try {
        const result = await tradeController.getOrders({ instId, ordId });
        return result;
      } catch (error) {
        console.error('Get order information error:', error);
        throw new Error(`Get order information failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Get order history tool
  server.tool(
    "okx_get_order_history",
    "Get Order History",
    {
      instType: { type: "string", description: "Product type, e.g. SPOT" },
      instId: { type: "string", description: "Product ID" },
      ordType: { type: "string", description: "Order type" }
    },
    async ({ instType, instId, ordType }) => {
      try {
        const result = await tradeController.getOrderHistory({ instType, instId, ordType });
        return result;
      } catch (error) {
        console.error('Get order history error:', error);
        throw new Error(`Get order history failed: ${error.message || 'Unknown error'}`);
      }
    }
  );
}

module.exports = { registerTradeTools }; 