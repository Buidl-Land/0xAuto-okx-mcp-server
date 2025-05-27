const { z } = require("zod");
const okxDexService = require("../../../services/okxDexService");

/**
 * OKX K线工具类
 */
class OkxKlineTool {
  constructor() {
    this.inputSchema = z.object({
      chainIndex: z.string().describe("链的唯一标识"),
      tokenContractAddress: z.string().describe("币种合约地址"),
      bar: z.string().optional().describe("时间粒度，如1m/5m/1H/1D等"),
      limit: z.string().optional().describe("返回条数，最大299")
    });
  }

  /**
   * 获取工具定义
   * @returns {Object} 工具定义
   */
  getDefinition() {
    return {
      name: "okx_get_kline",
      description: "获取OKX DEX代币K线数据",
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
      chainIndex: args.chainIndex,
      tokenContractAddress: args.tokenContractAddress,
      ...(args.bar ? { bar: args.bar } : {}),
      ...(args.limit ? { limit: args.limit } : {})
    };
    
    const result = await okxDexService.getKline(params);
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

module.exports = OkxKlineTool; 