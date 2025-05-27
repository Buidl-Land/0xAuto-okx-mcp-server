const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Quote Tool Class
 */
class OkxQuoteTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string(),
      fromTokenAddress: z.string(),
      toTokenAddress: z.string(),
      amount: z.string(),
      slippage: z.string().optional(),
    });
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_get_quote",
      description: "Get OKX DEX aggregator quote",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Execute the tool
   * @param {unknown} args - Input parameters
   * @returns {Promise<Object>} - Execution result
   */
  async execute(args) {
    const params = this.inputSchema.parse(args);
    const result = await okxDexService.getQuote(params);
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

module.exports = OkxQuoteTool; 