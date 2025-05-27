require('dotenv').config();

const config = {
  okx: {
    apiKey: process.env.OKX_API_KEY,
    secretKey: process.env.OKX_SECRET_KEY,
    passphrase: process.env.OKX_PASSPHRASE,
    baseUrl: process.env.OKX_API_BASE_URL || 'https://www.okx.com',
    simulatedTrading: process.env.SIMULATED_TRADING || '0', // '0' for false, '1' for true
    dexApiBase: process.env.OKX_DEX_API_BASE || 'https://web3.okx.com/api/v5/dex'
  },
  server: {
    port: process.env.SERVER_PORT || 3000,
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
  // mcpServerApiKey: process.env.MCP_SERVER_API_KEY // Optional
};

if (!config.okx.apiKey || !config.okx.secretKey || !config.okx.passphrase) {
  console.error("FATAL ERROR: OKX API Key, Secret Key, or Passphrase is not defined in environment variables.");
  process.exit(1);
}

module.exports = config;