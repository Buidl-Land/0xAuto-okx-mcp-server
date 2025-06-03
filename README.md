# 0xAuto OKX MCP Server

This server is based on the Model Context Protocol (MCP), providing a tool interface layer for OKX V5 API and OKX DEX API,
offering AI agents simplified access to OKX exchange (CEX) and decentralized exchange (DEX) functionalities.

## Features

### CEX (Centralized Exchange) Features
- Hides complex OKX API authentication and signature logic
- Provides standard MCP tool interfaces
- Covers core functionalities:
    - Account information (balances, positions, history)
    - Market data (quotes, K-lines)
    - Trading operations (place orders, cancel orders, order management)
    - Funding operations (deposit addresses, withdrawals)

### DEX (Decentralized Exchange) Features
- Provides access to OKX DEX aggregator
- Supports multi-chain transactions and token exchanges
- Covers functionalities:
    - Token quote retrieval
    - Token price queries and K-line data
    - On-chain balance queries
    - Token authorization operations
    - Intra-chain and cross-chain swaps

- Standardized JSON responses and error handling
- Support for MCP protocol session management and streaming

## System Requirements

- Node.js (v16 or higher)
- pnpm

## Installation Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env` file by copying the contents from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and fill in your OKX API credentials and other settings:
   ```
   # OKX API Configuration
   OKX_API_KEY=your_okx_api_key
   OKX_SECRET_KEY=your_okx_secret_key
   OKX_PASSPHRASE=your_okx_api_password
   OKX_API_BASE_URL=https://www.okx.com
   OKX_DEX_API_BASE=https://web3.okx.com/api/v5/dex
   
   # Simulated trading: 0 for live trading, 1 for demo account
   SIMULATED_TRADING=0
   
   SERVER_PORT=3000
   LOG_LEVEL=info
   ```
   **Important note:** Ensure your OKX API Key has the necessary permissions (read, trade).

## Running the Server

```bash
pnpm start
# or development mode
pnpm dev
```

The server will start on the port specified by `SERVER_PORT` (default 3000).

## MCP Tool List

The server implements the following MCP tools:

### CEX (Centralized Exchange) Tools

#### Account-related Tools
- `okx_get_account_info` - Get account information
- `okx_get_positions` - Get position information
- `okx_get_balance` - Get account balance

#### Trading-related Tools
- `okx_place_order` - Place trade order
- `okx_cancel_order` - Cancel order
- `okx_get_orders` - Get order information
- `okx_get_order_history` - Get historical orders

#### Market Data Tools
- `okx_get_ticker` - Get market quotes
- `okx_get_kline` - Get K-line data
- `okx_get_instruments` - Get product list

#### Funding-related Tools
- `okx_get_deposit_address` - Get deposit address
- `okx_get_deposit_history` - Get deposit records
- `okx_withdraw` - Withdraw funds

### DEX (Decentralized Exchange) Tools

#### Quotes and Market Data
- `okx_get_quote` - Get OKX DEX aggregator quotes (supports slippage settings)
- `okx_get_supported_chains` - Get chains supported by OKX DEX
- `okx_get_token_list` - Get token list supported by OKX DEX
- `okx_get_price` - Get latest price of tokens on OKX DEX
- `okx_get_kline` - Get K-line data for tokens on OKX DEX (supports different time granularities)

#### Trading-related Tools
- `okx_approve_transaction` - Get OKX DEX authorization transaction information
- `okx_swap` - Initiate OKX DEX swap
- `okx_cross_chain_swap` - Initiate OKX DEX cross-chain swap

#### Balance Queries
- `okx_get_balance` - Get all token balances for a wallet address on a specified chain

## Project Structure

```
src/
├── app.js              # Express application configuration
├── index.js            # Server startup entry
├── server.js           # MCP server creation and tool registration
├── config/             # Configuration files
├── controllers/        # Controller logic
├── middleware/         # Middleware
├── services/           # Service layer
│   ├── okxService.js   # OKX CEX API service
│   └── okxDexService.js# OKX DEX API service
├── tools/              # MCP tool implementation
│   ├── accountTools.js # CEX account tools
│   ├── fundingTools.js # CEX funding tools
│   ├── marketTools.js  # CEX market tools
│   ├── tradeTools.js   # CEX trading tools
│   ├── dexTools.js     # DEX tool registration
│   └── dex/            # DEX tool files
│       ├── quoteTool.js         # Quote tool
│       ├── supportedChainsTool.js# Supported chains tool
│       ├── tokenListTool.js     # Token list tool
│       ├── priceTool.js         # Price tool
│       ├── klineTool.js         # K-line tool
│       ├── balanceTool.js       # Balance tool
│       ├── approveTool.js       # Approval tool
│       ├── swapTool.js          # Swap tool
│       └── crossChainSwapTool.js# Cross-chain swap tool
└── utils/              # Utility functions
```

## MCP Client Connection

MCP clients can communicate with the server through the following endpoints:

- `/mcp` - Main MCP request endpoint
- `/sse` - Backward-compatible SSE endpoint
- `/messages` - Backward-compatible message endpoint

Uses standard MCP session management, including session ID and initialization requests.
