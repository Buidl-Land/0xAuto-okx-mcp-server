const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Supported Chains Tool Class
 */
class OkxSupportedChainsTool {
  constructor() {
    this.inputSchema = z.object({}).passthrough();
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_get_supported_chains",
      description: "Get information about chains supported by OKX DEX",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Execute the tool
   * @returns {Promise<Object>} - Execution result
   */
  async execute() {
    const result = await okxDexService.getSupportedChains();
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

module.exports = OkxSupportedChainsTool; 