const okxService = require('../services/okxService');
const { mcpSuccessResponse } = require('../utils/mcpResponse');

async function getAccountBalance(req, res, next) {
  try {
    const { currency_codes } = req.query; // e.g., "BTC,ETH"
    const params = {};
    if (currency_codes) {
      params.ccy = currency_codes;
    }
    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_BALANCE, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function getAccountPositions(req, res, next) {
  try {
    const { instrument_type, instrument_id, posId } = req.query;
    const params = {};
    if (instrument_type) params.instType = instrument_type; // SWAP, FUTURES, MARGIN, OPTION
    if (instrument_id) params.instId = instrument_id;
    if (posId) params.posId = posId;

    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_POSITIONS, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function getAccountTransactionHistory(req, res, next) {
  try {
    const {
      instrument_type,
      currency,
      type, // OKX bill type (e.g., 1 for transfer, 2 for trade)
      after,
      before,
      limit,
      mgnMode, // cross, isolated
      ctType, // linear, inverse (for FUTURES/SWAP)
      subType,
      begin, // Begin timestamp (ms)
      end // End timestamp (ms)
    } = req.query;

    const params = {};
    if (instrument_type) params.instType = instrument_type; // SPOT, SWAP, FUTURES, OPTION
    if (currency) params.ccy = currency;
    if (mgnMode) params.mgnMode = mgnMode;
    if (ctType) params.ctType = ctType;
    if (type) params.type = type;
    if (subType) params.subType = subType;
    if (after) params.after = after; // Pagination cursor
    if (before) params.before = before; // Pagination cursor
    if (begin) params.begin = begin;
    if (end) params.end = end;
    if (limit) params.limit = limit; else params.limit = '100';


    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_BILLS, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getAccountBalance,
  getAccountPositions,
  getAccountTransactionHistory,
};