const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Token List Tool Class
 */
class OkxTokenListTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string().optional().describe("Chain unique identifier, optional")
    });
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_get_token_list",
      description: "Get the list of tokens supported by OKX DEX",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * Execute the tool
   * @param {Object} args - Input parameters
   * @returns {Promise<Object>} - Execution result
   */
  async execute(args) {
    const result = await okxDexService.getAllTokens(args);
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

module.exports = OkxTokenListTool; 