const okxService = require('../services/okxService');
const { mcpSuccessResponse } = require('../utils/mcpResponse');

async function getDepositAddress(req, res, next) {
  try {
    const { currency_code, network_chain } = req.query; // OKX uses ccy, chain
    if (!currency_code) {
      return next({ isMcpInputError: true, message: 'currency_code (ccy) is required.', httpStatusCode: 400 });
    }
    const params = { ccy: currency_code };
    if (network_chain) params.chain = network_chain;

    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_DEPOSIT_ADDRESS, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function getDepositHistory(req, res, next) {
  try {
    const { currency_code, after, before, limit, tx_id, chain } = req.query; // OKX: ccy, after, before, limit, txId, chain
    const params = {};
    if (currency_code) params.ccy = currency_code;
    if (tx_id) params.txId = tx_id;
    if (chain) params.chain = chain;
    if (after) params.after = after;
    if (before) params.before = before;
    if (limit) params.limit = limit; else params.limit = '100';


    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_DEPOSIT_HISTORY, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function getWithdrawalHistory(req, res, next) {
  try {
    const { currency_code, after, before, limit, withdrawal_id, chain } = req.query; // OKX: ccy, after, before, limit, wdId, chain
    const params = {};
    if (currency_code) params.ccy = currency_code;
    if (withdrawal_id) params.wdId = withdrawal_id;
    if (chain) params.chain = chain;
    if (after) params.after = after;
    if (before) params.before = before;
    if (limit) params.limit = limit; else params.limit = '100';

    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_WITHDRAWAL_HISTORY, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

module.exports = { getDepositAddress, getDepositHistory, getWithdrawalHistory };