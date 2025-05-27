const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX兑换工具类
 */
class OkxSwapTool {
  constructor() {
    this.inputSchema = z.object({
      chainId: z.string().describe("链ID"),
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
      name: "okx_swap",
      description: "发起OKX DEX兑换（模拟调用，实际链上需签名）",
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