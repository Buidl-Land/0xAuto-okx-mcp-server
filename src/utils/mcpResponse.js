function mcpSuccessResponse(data = {}) {
    return {
      success: true,
      data: data,
    };
  }
  
  function mcpErrorResponse(mcpErrorCode, message, details = null, httpStatusCode = 500) {
    const errorResponse = {
      success: false,
      error: {
        mcp_error_code: mcpErrorCode,
        message: message,
      },
    };
    if (details) {
      errorResponse.error.details = details;
    }
    // This structure is for the JSON body. The actual HTTP status code is set by res.status()
    // We return this for consistency in the error handler.
    return { ...errorResponse, httpStatusCode };
  }
  
  
  module.exports = {
    mcpSuccessResponse,
    mcpErrorResponse,
  };