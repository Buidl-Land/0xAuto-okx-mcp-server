const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX代币价格工具类
 */
class OkxPriceTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string().describe("链的唯一标识"),
      tokenContractAddress: z.string().describe("币种合约地址")
    });
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_get_price",
      description: "获取OKX DEX代币最新价格",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * 执行工具
   * @param {Object} args - 输入参数
   * @returns {Promise<Object>} - 执行结果
   */
  async execute(args) {
    const result = await okxDexService.getPrice(args);
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

module.exports = OkxPriceTool; 