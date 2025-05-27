const accountController = require('../controllers/accountController');

/**
 * Register account related tools
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP server instance
 */
function registerAccountTools(server) {
  // Get account information tool
  server.tool(
    "okx_get_account_info",
    "Get OKX Account Information",
    {},
    async () => {
      try {
        const result = await accountController.getAccountInfo();
        return result;
      } catch (error) {
        console.error('Get account information error:', error);
        throw new Error(`Get account information failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Get positions information tool
  server.tool(
    "okx_get_positions",
    "Get Account Positions Information",
    {
      instType: { type: "string", description: "Instrument type, options: MARGIN, SWAP, FUTURES, OPTION" },
      instId: { type: "string", description: "Instrument ID" }
    },
    async ({ instType, instId }) => {
      try {
        const result = await accountController.getPositions({ instType, instId });
        return result;
      } catch (error) {
        console.error('Get positions information error:', error);
        throw new Error(`Get positions information failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Get account balance tool
  server.tool(
    "okx_get_balance",
    "Get Account Balance Information",
    {
      ccy: { type: "string", description: "Currency" }
    },
    async ({ ccy }) => {
      try {
        const result = await accountController.getBalance({ ccy });
        return result;
      } catch (error) {
        console.error('Get account balance error:', error);
        throw new Error(`Get account balance failed: ${error.message || 'Unknown error'}`);
      }
    }
  );
}

module.exports = { registerAccountTools }; 