const okxService = require('../services/okxService');
const { mcpSuccessResponse } = require('../utils/mcpResponse');

// Place Order (covers spot, margin, futures, swaps, options based on params)
async function placeOrder(req, res, next) {
  try {
    const {
      instrument_id, // instId
      trade_mode,    // tdMode: cash, cross, isolated
      side,          // buy, sell
      order_type,    // ordType: market, limit, post_only, fok, ioc, optimal_limit_ioc
      size,          // sz: quantity
      price,         // px (for limit orders)
      client_order_id, // clOrdId
      position_side, // posSide: long, short, net (for hedge mode in futures/swaps)
      reduce_only,   // reduceOnly: true/false
      target_currency, // tgtCcy: base_ccy, quote_ccy (for market spot orders)
      // ... other params like stpId, stpMode, quickMgnType, banAmend
    } = req.body;

    if (!instrument_id || !trade_mode || !side || !order_type || !size) {
      return next({ isMcpInputError: true, message: 'Missing required parameters for placing order (instrument_id, trade_mode, side, order_type, size).', httpStatusCode: 400 });
    }
    if ((order_type === 'limit' || order_type === 'post_only' || order_type === 'fok' || order_type === 'ioc') && !price) {
        return next({ isMcpInputError: true, message: 'Price (px) is required for limit, post_only, fok, ioc orders.', httpStatusCode: 400 });
    }


    const payload = {
      instId: instrument_id,
      tdMode: trade_mode,
      side: side,
      ordType: order_type,
      sz: size,
    };
    if (price) payload.px = price;
    if (client_order_id) payload.clOrdId = client_order_id;
    if (position_side) payload.posSide = position_side;
    if (typeof reduce_only === 'boolean') payload.reduceOnly = reduce_only;
    if (target_currency) payload.tgtCcy = target_currency;
    // Add other optional parameters from req.body to payload as needed...

    const result = await okxService.request('POST', okxService.OKX_API_PATHS.PLACE_ORDER, {}, payload);
    res.json(mcpSuccessResponse(result.data));
  } catch (error) {
    next(error);
  }
}

async function cancelOrder(req, res, next) {
    try {
        const { instrument_id, order_id, client_order_id } = req.body;
        if (!instrument_id || (!order_id && !client_order_id)) {
             return next({ isMcpInputError: true, message: 'instrument_id and either order_id or client_order_id are required.', httpStatusCode: 400 });
        }
        const payload = { instId: instrument_id };
        if (order_id) payload.ordId = order_id;
        if (client_order_id) payload.clOrdId = client_order_id;

        const result = await okxService.request('POST', okxService.OKX_API_PATHS.CANCEL_ORDER, {}, payload);
        res.json(mcpSuccessResponse(result.data));
    } catch (error) {
        next(error);
    }
}

async function amendOrder(req, res, next) {
    try {
        const {
            instrument_id, // instId
            order_id,      // ordId
            client_order_id, // clOrdId
            new_size,      // newSz
            new_price,     // newPx
            cancel_on_fail // cxlOnFail (boolean)
            // newInstId, reqId etc. can also be part of amend
        } = req.body;

        if (!instrument_id || (!order_id && !client_order_id)) {
            return next({ isMcpInputError: true, message: 'instrument_id and either order_id or client_order_id are required.', httpStatusCode: 400 });
        }
        if (!new_size && !new_price) {
             return next({ isMcpInputError: true, message: 'Either new_size or new_price must be provided for amendment.', httpStatusCode: 400 });
        }

        const payload = { instId: instrument_id };
        if (order_id) payload.ordId = order_id;
        if (client_order_id) payload.clOrdId = client_order_id;
        if (new_size) payload.newSz = new_size;
        if (new_price) payload.newPx = new_price;
        if (typeof cancel_on_fail === 'boolean') payload.cxlOnFail = cancel_on_fail;


        const result = await okxService.request('POST', okxService.OKX_API_PATHS.AMEND_ORDER, {}, payload);
        res.json(mcpSuccessResponse(result.data));
    } catch (error) {
        next(error);
    }
}

async function getOrderDetails(req, res, next) {
    try {
        const { instrument_id, order_id, client_order_id } = req.query;
         if (!instrument_id || (!order_id && !client_order_id)) {
             return next({ isMcpInputError: true, message: 'instrument_id and either order_id or client_order_id are required.', httpStatusCode: 400 });
        }
        const params = { instId: instrument_id };
        if (order_id) params.ordId = order_id;
        if (client_order_id) params.clOrdId = client_order_id;

        const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_ORDER_DETAILS, params);
        res.json(mcpSuccessResponse(result.data));
    } catch (error) {
        next(error);
    }
}

async function getOpenOrders(req, res, next) {
    try {
        const { instrument_type, underlying, instrument_id, order_type } = req.query;
        const params = {};
        if (instrument_type) params.instType = instrument_type;
        if (underlying) params.uly = underlying;
        if (instrument_id) params.instId = instrument_id;
        if (order_type) params.ordType = order_type;
        // add pagination params: after, before, limit

        const result = await okxService.request('GET', okxService.OKX_API_PATHS.GET_OPEN_ORDERS, params);
        res.json(mcpSuccessResponse(result.data));
    } catch (error) {
        next(error);
    }
}


module.exports = { placeOrder, cancelOrder, amendOrder, getOrderDetails, getOpenOrders };