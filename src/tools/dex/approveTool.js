const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX授权工具类
 */
class OkxApproveTool {
  constructor() {
    this.inputSchema = z.object({
      tokenContractAddress: z.string().describe("币种合约地址"),
      approveAmount: z.string().describe("授权数量，需包含精度")
    });
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_approve_transaction",
      description: "获取OKX DEX授权交易信息",
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