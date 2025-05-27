const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX支持链工具类
 */
class OkxSupportedChainsTool {
  constructor() {
    this.inputSchema = z.object({}).passthrough();
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_get_supported_chains",
      description: "获取OKX DEX支持的链信息",
      inputSchema: this.inputSchema,
    };
  }

  /**
   * 执行工具
   * @returns {Promise<Object>} - 执行结果
   */
  async execute() {
    const result = await okxDexService.getSupportedChains();
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

module.exports = OkxSupportedChainsTool; 