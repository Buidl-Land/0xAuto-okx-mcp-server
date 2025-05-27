const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Approval Tool Class
 */
class OkxApproveTool {
  constructor() {
    this.inputSchema = z.object({
      tokenContractAddress: z.string().describe("Token contract address"),
      approveAmount: z.string().describe("Approval amount, must include decimals")
    });
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_approve_transaction",
      description: "Get OKX DEX approval transaction information",
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
      tokenContractAddress: args.tokenContractAddress,
      approveAmount: args.approveAmount
    };
    
    const result = await okxDexService.getApproveTransaction(params);
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

module.exports = OkxApproveTool; 