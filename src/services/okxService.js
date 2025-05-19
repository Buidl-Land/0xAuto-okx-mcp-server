const axios = require('axios');
const CryptoJS = require('crypto-js');
const config = require('../config');
const { OKX_API_PATHS } = require('../utils/constants');


function getSignature(timestamp, method, requestPath, body = '') {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  const message = `${timestamp}${method.toUpperCase()}${requestPath}${bodyString}`;
  const signature = CryptoJS.HmacSHA256(message, config.okx.secretKey);
  return CryptoJS.enc.Base64.stringify(signature);
}

async function request(method, path, queryParams = {}, body = {}) {
  const timestamp = new Date().toISOString();
  let requestPath = path;

  if (Object.keys(queryParams).length > 0) {
    requestPath += '?' + new URLSearchParams(queryParams).toString();
  }

  const signature = getSignature(timestamp, method, requestPath, Object.keys(body).length > 0 ? body : '');

  const headers = {
    'OK-ACCESS-KEY': config.okx.apiKey,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': config.okx.passphrase,
    'Content-Type': 'application/json',
  };

  if (config.okx.simulatedTrading === '1') {
    headers['X-SIMULATED-TRADING'] = '1';
  }

  const url = `${config.okx.baseUrl}${requestPath}`;

  if (config.log.level === 'debug') {
      console.debug(`OKX Request -> ${method} ${url}`);
      console.debug(`OKX Headers -> ${JSON.stringify(headers)}`);
      if (Object.keys(body).length > 0) console.debug(`OKX Body -> ${JSON.stringify(body)}`);
  }


  try {
    let response;
    if (method.toUpperCase() === 'GET') {
      response = await axios.get(url, { headers });
    } else if (method.toUpperCase() === 'POST') {
      response = await axios.post(url, body, { headers });
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    if (config.log.level === 'debug') {
        console.debug(`OKX Response Status <- ${response.status}`);
        console.debug(`OKX Response Data <- ${JSON.stringify(response.data)}`);
    }


    // OKX API typically returns a 'code' field. '0' usually means success.
    if (response.data.code !== '0') {
      // This is an OKX API error, not an HTTP error
      throw {
        isOkxApiError: true,
        okxErrorCode: response.data.code,
        okxErrorMessage: response.data.msg || 'Unknown OKX API error',
        okxErrorData: response.data.data || [], // Some errors provide more details in `data`
        status: response.status, // HTTP status
      };
    }
    return response.data; // This contains { code: "0", msg: "", data: [...] }
  } catch (error) {
    if (error.isOkxApiError) {
        console.error(`OKX API Error: Code ${error.okxErrorCode}, Message: ${error.okxErrorMessage}`, error.okxErrorData.length > 0 ? error.okxErrorData : '');
        throw error;
    }
    if (axios.isAxiosError(error)) {
      console.error(`Axios Error calling OKX: ${error.message}`, error.response ? { status: error.response.status, data: error.response.data } : '');
      throw {
        isNetworkError: true,
        message: error.message,
        status: error.response ? error.response.status : 500,
        data: error.response ? error.response.data : null,
      };
    }
    console.error(`Generic Error in OKX service: ${error.message}`);
    throw error; // Re-throw other errors
  }
}

module.exports = {
  request,
  OKX_API_PATHS, // Export paths for use in controllers
};