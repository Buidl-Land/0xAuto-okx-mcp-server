const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX余额工具类
 */
class OkxBalanceTool {
  constructor() {
    this.inputSchema = z.object({
      address: z.string().describe("钱包地址"),
      chains: z.string().describe("链ID，多个用逗号分隔")
    });
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_get_balance",
      description: "获取地址在指定链上的所有代币余额",
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
      address: args.address,
      chains: args.chains
    };
    
    const result = await okxDexService.getBalance(params);
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

module.exports = OkxBalanceTool; 