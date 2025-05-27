const axios = require('axios');
const config = require('../config');

/**
 * OKX DEX Service class, provides methods for interacting with OKX DEX API
 */
class OkxDexService {
  constructor() {
    this.baseUrl = config.okx.dexApiBase;
  }

  /**
   * Send GET request to OKX DEX API
   * @param {string} path - API path
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Response data
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
        throw new Error(`OKX DEX API error: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Send POST request to OKX DEX API
   * @param {string} path - API path
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} - Response data
   */
  async post(path, data = {}) {
    const url = `${this.baseUrl}${path}`;
    
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OKX DEX API error: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Get quote
   * @param {Object} params - Quote request parameters
   * @returns {Promise<Object>} - Quote result
   */
  async getQuote(params) {
    return this.get('/aggregator/quote', params);
  }

  /**
   * Get supported chains
   * @returns {Promise<Object>} - Supported chain information
   */
  async getSupportedChains() {
    return this.get('/market/supported/chain');
  }

  /**
   * Get all tokens
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} - Token list
   */
  async getAllTokens(params = {}) {
    return this.get('/aggregator/all-tokens', params);
  }

  /**
   * Get token price
   * @param {Object} params - Price request parameters
   * @returns {Promise<Object>} - Price information
   */
  async getPrice(params) {
    return this.get('/market/price', params);
  }

  /**
   * Get K-line data
   * @param {Object} params - K-line request parameters
   * @returns {Promise<Object>} - K-line data
   */
  async getKline(params) {
    return this.get('/market/historical-candles', params);
  }

  /**
   * Get balance
   * @param {Object} params - Balance request parameters
   * @returns {Promise<Object>} - Balance information
   */
  async getBalance(params) {
    return this.get('/balance/all-token-balances-by-address', params);
  }

  /**
   * Get approval transaction information
   * @param {Object} params - Approval request parameters
   * @returns {Promise<Object>} - Approval information
   */
  async getApproveTransaction(params) {
    return this.get('/aggregator/approve-transaction', params);
  }

  /**
   * Swap tokens
   * @param {Object} params - Swap request parameters
   * @returns {Promise<Object>} - Swap result
   */
  async swap(params) {
    return this.post('/aggregator/swap', params);
  }

  /**
   * Cross-chain swap
   * @param {Object} params - Cross-chain swap request parameters
   * @returns {Promise<Object>} - Cross-chain swap result
   */
  async crossChainSwap(params) {
    return this.post('/cross-chain/build-tx', params);
  }
}

module.exports = new OkxDexService(); 