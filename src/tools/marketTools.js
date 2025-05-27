const marketController = require('../controllers/marketController');

/**
 * Register market data related tools
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP server instance
 */
function registerMarketTools(server) {
  // Get product ticker data tool
  server.tool(
    "okx_get_ticker",
    "Get Product Ticker Data",
    {
      instId: { type: "string", description: "Product ID, e.g. BTC-USDT", required: true }
    },
    async ({ instId }) => {
      try {
        const result = await marketController.getTicker({ instId });
        return result;
      } catch (error) {
        console.error('Get ticker data error:', error);
        throw new Error(`Get ticker data failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Get K-line data tool
  server.tool(
    "okx_get_kline",
    "Get K-line Data",
    {
      instId: { type: "string", description: "Product ID, e.g. BTC-USDT", required: true },
      bar: { type: "string", description: "Time granularity, e.g. 1m/1h/1d", required: true },
      limit: { type: "string", description: "Number of results to return, max 100" }
    },
    async ({ instId, bar, limit }) => {
      try {
        const result = await marketController.getKline({ instId, bar, limit });
        return result;
      } catch (error) {
        console.error('Get K-line data error:', error);
        throw new Error(`Get K-line data failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Get tradable instruments list tool
  server.tool(
    "okx_get_instruments",
    "Get Tradable Instruments List",
    {
      instType: { type: "string", description: "Instrument type, SPOT, SWAP, FUTURES, OPTION, etc.", required: true },
      uly: { type: "string", description: "Underlying index, e.g. BTC-USD" }
    },
    async ({ instType, uly }) => {
      try {
        const result = await marketController.getInstruments({ instType, uly });
        return result;
      } catch (error) {
        console.error('Get instruments list error:', error);
        throw new Error(`Get instruments list failed: ${error.message || 'Unknown error'}`);
      }
    }
  );
}

module.exports = { registerMarketTools }; 