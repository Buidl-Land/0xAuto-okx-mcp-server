const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX跨链兑换工具类
 */
class OkxCrossChainSwapTool {
  constructor() {
    this.inputSchema = z.object({
      fromChainId: z.string().describe("源链ID"),
      toChainId: z.string().describe("目标链ID"),
      fromTokenAddress: z.string().describe("兑换币种合约地址"),
      toTokenAddress: z.string().describe("目标币种合约地址"),
      amount: z.string().describe("兑换数量，需包含精度"),
      slippage: z.string().optional().describe("滑点，百分比字符串"),
      userWalletAddress: z.string().describe("用户钱包地址")
    });
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_cross_chain_swap",
      description: "发起OKX DEX跨链兑换（模拟调用，实际链上需签名）",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * 执行工具
   * @param {Object} args - 输入参数
   * @returns {Promise<Object>} - 执行结果
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