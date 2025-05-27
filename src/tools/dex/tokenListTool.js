const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX代币列表工具类
 */
class OkxTokenListTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string().optional().describe("链的唯一标识，可选")
    });
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_get_token_list",
      description: "获取OKX DEX支持的币种列表",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * 执行工具
   * @param {Object} args - 输入参数
   * @returns {Promise<Object>} - 执行结果
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