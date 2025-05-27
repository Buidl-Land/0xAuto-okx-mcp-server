const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX Cross-Chain Swap Tool Class
 */
class OkxCrossChainSwapTool {
  constructor() {
    this.inputSchema = z.object({
      fromChainId: z.string().describe("Source chain ID"),
      toChainId: z.string().describe("Destination chain ID"),
      fromTokenAddress: z.string().describe("Source token contract address"),
      toTokenAddress: z.string().describe("Destination token contract address"),
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
      name: "okx_cross_chain_swap",
      description: "Initiate OKX DEX cross-chain swap (simulation call, actual on-chain transaction requires signature)",
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
      fromChainId: args.fromChainId,
      toChainId: args.toChainId,
      fromTokenAddress: args.fromTokenAddress,
      toTokenAddress: args.toTokenAddress,
      amount: args.amount,
      slippage: args.slippage,
      userWalletAddress: args.userWalletAddress
    };
    
    const result = await okxDexService.crossChainSwap(params);
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

module.exports = OkxCrossChainSwapTool; 