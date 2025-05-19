const { mcpErrorResponse } = require('../utils/mcpResponse');

// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  console.error('Global Error Handler Caught:', err);

  if (err.isOkxApiError) {
    return res.status(err.status || 400).json(mcpErrorResponse( // OKX API errors often 200 OK with error code
      'OKX_API_ERROR',
      err.okxErrorMessage || 'An error occurred with the OKX API.',
      { okx_api_code: err.okxErrorCode, okx_api_message: err.okxErrorMessage, okx_error_data: err.okxErrorData }
    ));
  }

  if (err.isNetworkError) {
     return res.status(err.status || 503).json(mcpErrorResponse(
      'NETWORK_ERROR',
      `Failed to connect to OKX: ${err.message}`,
      err.data
    ));
  }

  if (err.isMcpInputError) { // Custom error type you might define for input validation
    return res.status(400).json(mcpErrorResponse(
        'INVALID_MCP_INPUT',
        err.message,
        err.details
    ));
  }


  // Default to 500 server error
  return res.status(err.httpStatusCode || 500).json(mcpErrorResponse(
    err.mcp_error_code || 'INTERNAL_MCP_SERVER_ERROR',
    err.message || 'An unexpected error occurred on the MCP server.',
    err.details
  ));
}

module.exports = { globalErrorHandler };