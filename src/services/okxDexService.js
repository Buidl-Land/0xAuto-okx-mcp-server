const axios = require('axios');
const config = require('../config');

/**
 * OKX DEX服务类，提供与OKX DEX API交互的方法
 */
class OkxDexService {
  constructor() {
    this.baseUrl = config.okx.dexApiBase;
  }

  /**
   * 发送GET请求到OKX DEX API
   * @param {string} path - API路径
   * @param {Object} params - 查询参数
   * @returns {Promise<Object>} - 响应数据
   */
  async get(path, params = {}) {
    const url = `${this.baseUrl}${path}`;
    const searchParams = new URLSearchParams(params).toString();
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;
    
    try {
      const response = await axios.get(fullUrl);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OKX DEX API错误: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * 发送POST请求到OKX DEX API
   * @param {string} path - API路径
   * @param {Object} data - 请求体数据
   * @returns {Promise<Object>} - 响应数据
   */
  async post(path, data = {}) {
    const url = `${this.baseUrl}${path}`;
    
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OKX DEX API错误: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * 获取报价
   * @param {Object} params - 报价请求参数
   * @returns {Promise<Object>} - 报价结果
   */
  async getQuote(params) {
    return this.get('/aggregator/quote', params);
  }

  /**
   * 获取支持的链
   * @returns {Promise<Object>} - 支持的链信息
   */
  async getSupportedChains() {
    return this.get('/market/supported/chain');
  }

  /**
   * 获取所有代币
   * @param {Object} params - 请求参数
   * @returns {Promise<Object>} - 代币列表
   */
  async getAllTokens(params = {}) {
    return this.get('/aggregator/all-tokens', params);
  }

  /**
   * 获取代币价格
   * @param {Object} params - 价格请求参数
   * @returns {Promise<Object>} - 价格信息
   */
  async getPrice(params) {
    return this.get('/market/price', params);
  }

  /**
   * 获取K线数据
   * @param {Object} params - K线请求参数
   * @returns {Promise<Object>} - K线数据
   */
  async getKline(params) {
    return this.get('/market/historical-candles', params);
  }

  /**
   * 获取余额
   * @param {Object} params - 余额请求参数
   * @returns {Promise<Object>} - 余额信息
   */
  async getBalance(params) {
    return this.get('/balance/all-token-balances-by-address', params);
  }

  /**
   * 获取授权交易信息
   * @param {Object} params - 授权请求参数
   * @returns {Promise<Object>} - 授权信息
   */
  async getApproveTransaction(params) {
    return this.get('/aggregator/approve-transaction', params);
  }

  /**
   * 交换代币
   * @param {Object} params - 交换请求参数
   * @returns {Promise<Object>} - 交换结果
   */
  async swap(params) {
    return this.post('/aggregator/swap', params);
  }

  /**
   * 跨链交换
   * @param {Object} params - 跨链交换请求参数
   * @returns {Promise<Object>} - 跨链交换结果
   */
  async crossChainSwap(params) {
    return this.post('/cross-chain/build-tx', params);
  }
}

module.exports = new OkxDexService(); 