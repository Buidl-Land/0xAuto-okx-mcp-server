const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Swap Tool Class
 */
class OkxSwapTool {
  constructor() {
    this.inputSchema = z.object({
      chainId: z.string().describe("Chain ID"),
      fromTokenAddress: z.string().describe("Source token contract address"),
      toTokenAddress: z.string().describe("Target token contract address"),
      amount: z.string().describe("Swap amount, must include decimals"),
      slippage: z.string().optional().describe("Slippage, percentage as string"),
      userWalletAddress: z.string().describe("User wallet address")
    });
  }

  /**
   * Get tool definition
   * @returns {Object} Tool definition
   */
  getDefinition() {
    return {
      name: "okx_swap",
      description: "Initiate OKX DEX swap (simulation call, actual on-chain transaction requires signature)",
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
      chainId: args.chainId,
      fromTokenAddress: args.fromTokenAddress,
      toTokenAddress: args.toTokenAddress,
      amount: args.amount,
      slippage: args.slippage,
      userWalletAddress: args.userWalletAddress
    };
    
    const result = await okxDexService.swap(params);
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

module.exports = OkxSwapTool; 