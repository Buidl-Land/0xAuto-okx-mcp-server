const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Token Price Tool Class
 */
class OkxPriceTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string().describe("Chain unique identifier"),
      tokenContractAddress: z.string().describe("Token contract address")
    });
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_get_price",
      description: "Get latest price of tokens on OKX DEX",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Execute the tool
   * @param {Object} args - Input parameters
   * @returns {Promise<Object>} - Execution result
   */
  async execute(args) {
    const result = await okxDexService.getPrice(args);
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

module.exports = OkxPriceTool; 