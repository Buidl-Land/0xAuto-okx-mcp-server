const okxService = require('../services/okxService');
const { mcpSuccessResponse } = require('../utils/mcpResponse');

async function getTicker(req, res, next) {
  try {
    const { instrument_id } = req.query;
    if (!instrument_id) {
      return next({ isMcpInputError: true, message: 'instrument_id is required.', httpStatusCode: 400 });
    }
    const params = { instId: instrument_id };
    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_TICKER, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function getTickers(req, res, next) {
  try {
    const { instrument_type, underlying, inst_family } = req.query;
    if (!instrument_type) {
        return next({ isMcpInputError: true, message: 'instrument_type (instType) is required.', httpStatusCode: 400 });
    }
    const params = { instType: instrument_type };
    if (underlying) params.uly = underlying;
    if (inst_family) params.instFamily = inst_family;

    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_TICKERS, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function getOrderBook(req, res, next) {
  try {
    const { instrument_id, depth_limit } = req.query;
    if (!instrument_id) {
      return next({ isMcpInputError: true, message: 'instrument_id is required.', httpStatusCode: 400 });
    }
    const params = { instId: instrument_id };
    if (depth_limit) params.sz = depth_limit; // OKX uses 'sz' for depth size
    else params.sz = '20'; // Default depth

    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_ORDER_BOOK, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function getKlines(req, res, next) {
  try {
    const { instrument_id, interval, limit, after, before } = req.query;
    if (!instrument_id || !interval) {
      return next({ isMcpInputError: true, message: 'instrument_id and interval are required.', httpStatusCode: 400 });
    }
    const params = { instId: instrument_id, bar: interval };
    if (limit) params.limit = limit; else params.limit = '100';
    if (after) params.after = after;
    if (before) params.before = before;

    const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_KLINES, params);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

module.exports = { getTicker, getTickers, getOrderBook, getKlines };