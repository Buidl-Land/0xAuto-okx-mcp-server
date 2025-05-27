const fundingController = require('../controllers/fundingController');

/**
 * Register funding related tools
 * @param {import('@modelcontextprotocol/sdk/server/mcp.js').McpServer} server MCP server instance
 */
function registerFundingTools(server) {
  // Get deposit address tool
  server.tool(
    "okx_get_deposit_address",
    "Get Deposit Address",
    {
      ccy: { type: "string", description: "Currency, e.g. BTC", required: true }
    },
    async ({ ccy }) => {
      try {
        const result = await fundingController.getDepositAddress({ ccy });
        return result;
      } catch (error) {
        console.error('Get deposit address error:', error);
        throw new Error(`Get deposit address failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Get deposit history tool
  server.tool(
    "okx_get_deposit_history",
    "Get Deposit History",
    {
      ccy: { type: "string", description: "Currency" },
      state: { type: "string", description: "Status: 0(Waiting for confirmation) 1(Confirmed) 2(Deposit successful)" }
    },
    async ({ ccy, state }) => {
      try {
        const result = await fundingController.getDepositHistory({ ccy, state });
        return result;
      } catch (error) {
        console.error('Get deposit history error:', error);
        throw new Error(`Get deposit history failed: ${error.message || 'Unknown error'}`);
      }
    }
  );

  // Withdrawal tool
  server.tool(
    "okx_withdraw",
    "Withdraw",
    {
      ccy: { type: "string", description: "Currency", required: true },
      amt: { type: "string", description: "Withdrawal amount", required: true },
      dest: { type: "string", description: "Withdrawal method, 4:Internal transfer, 3:On-chain withdrawal", required: true },
      toAddr: { type: "string", description: "Withdrawal address", required: true },
      fee: { type: "string", description: "Network fee" },
      chain: { type: "string", description: "Chain name, e.g. ETH" }
    },
    async ({ ccy, amt, dest, toAddr, fee, chain }) => {
      try {
        const result = await fundingController.withdraw({ ccy, amt, dest, toAddr, fee, chain });
        return result;
      } catch (error) {
        console.error('Withdrawal request error:', error);
        throw new Error(`Withdrawal request failed: ${error.message || 'Unknown error'}`);
      }
    }
  );
}

module.exports = { registerFundingTools }; 