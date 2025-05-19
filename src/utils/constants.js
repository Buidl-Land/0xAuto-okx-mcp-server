const OKX_API_PATHS = {
    // Account
    GET_BALANCE: '/api/v5/account/balance',
    GET_POSITIONS: '/api/v5/account/positions',
    GET_BILLS: '/api/v5/account/bills',
    // Market
    GET_TICKERS: '/api/v5/market/tickers',
    GET_TICKER: '/api/v5/market/ticker', // For single ticker
    GET_ORDER_BOOK: '/api/v5/market/books',
    GET_KLINES: '/api/v5/market/candles',
    // Trade
    PLACE_ORDER: '/api/v5/trade/order',
    CANCEL_ORDER: '/api/v5/trade/cancel-order',
    AMEND_ORDER: '/api/v5/trade/amend-order',
    GET_ORDER_DETAILS: '/api/v5/trade/order', // GET request with ordId or clOrdId
    GET_OPEN_ORDERS: '/api/v5/trade/orders-pending',
    // Funding
    GET_DEPOSIT_ADDRESS: '/api/v5/asset/deposit-address',
    GET_DEPOSIT_HISTORY: '/api/v5/asset/deposit-history',
    GET_WITHDRAWAL_HISTORY: '/api/v5/asset/withdrawal-history',
};

module.exports = {
    OKX_API_PATHS,
};