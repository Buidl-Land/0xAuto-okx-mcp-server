const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Balance Tool Class
 */
class OkxBalanceTool {
  constructor() {
    this.inputSchema = z.object({
      address: z.string().describe("Wallet address"),
      chains: z.string().describe("Chain IDs, comma separated for multiple")
    });
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_get_balance",
      description: "Get all token balances for an address on specified chains",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Execute the tool
   * @param {Object} args - Input parameters
   * @returns {Promise<Object>} - Execution result
   */
  async execute(args) {
    const params = {
      address: args.address,
      chains: args.chains
    };
    
    const result = await okxDexService.getBalance(params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        }
      ],
    };
  }
}

module.exports = OkxBalanceTool; 