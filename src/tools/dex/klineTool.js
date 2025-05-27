const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX K-line Tool Class
 */
class OkxKlineTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string().describe("Chain unique identifier"),
      tokenContractAddress: z.string().describe("Token contract address"),
      bar: z.string().optional().describe("Time granularity, e.g. 1m/5m/1H/1D"),
      limit: z.string().optional().describe("Number of results to return, max 299")
    });
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_get_kline",
      description: "Get OKX DEX token K-line data",
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
      chainIndex: args.chainIndex,
      tokenContractAddress: args.tokenContractAddress,
      ...(args.bar ? { bar: args.bar } : {}),
      ...(args.limit ? { limit: args.limit } : {})
    };
    
    const result = await okxDexService.getKline(params);
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

module.exports = OkxKlineTool; 