const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX报价工具类
 */
class OkxQuoteTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string(),
      fromTokenAddress: z.string(),
      toTokenAddress: z.string(),
      amount: z.string(),
      slippage: z.string().optional(),
    });
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_get_quote",
      description: "获取OKX DEX聚合器报价",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * 执行工具
   * @param {unknown} args - 输入参数
   * @returns {Promise<Object>} - 执行结果
   */
  async execute(args) {
    const params = this.inputSchema.parse(args);
    const result = await okxDexService.getQuote(params);
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

module.exports = OkxQuoteTool; 