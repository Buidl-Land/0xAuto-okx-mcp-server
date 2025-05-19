# 0xAuto OKX MCP 服务器

该服务器基于Model Context Protocol (MCP)协议，为OKX V5 API提供了工具接口层，
为AI代理提供简化的OKX交易和账户功能访问。

## 功能特点

- 隐藏复杂的OKX API认证和签名逻辑
- 提供标准的MCP工具接口
- 涵盖核心功能：
    - 账户信息（余额、持仓、历史）
    - 市场数据（行情、K线）
    - 交易操作（下单、撤单、订单管理）
    - 资金操作（充值地址、提币）
- 标准化的JSON响应和错误处理
- 支持MCP协议的会话管理和流式传输

## 系统要求

- Node.js (v16或更高版本)
- pnpm

## 安装步骤

1. **安装依赖：**
   ```bash
   pnpm install
   ```

2. **设置环境变量：**
   创建一个`.env`文件，复制`.env.example`的内容：
   ```bash
   cp .env.example .env
   ```
   编辑`.env`文件，填入您的OKX API凭证和其他设置：
   ```
   OKX_API_KEY=你的_okx_api_key
   OKX_SECRET_KEY=你的_okx_secret_key
   OKX_PASSPHRASE=你的_okx_api_密码
   OKX_API_BASE_URL=https://www.okx.com
   # 模拟交易：0为实盘，1为模拟盘
   SIMULATED_TRADING=0
   
   SERVER_PORT=3000
   LOG_LEVEL=info
   ```
   **重要提示：** 确保您的OKX API Key拥有必要的权限（读取、交易）。

## 运行服务器

```bash
pnpm start
# 或者开发模式
pnpm dev
```

服务器将在`SERVER_PORT`指定的端口上启动（默认3000）。

## MCP工具列表

服务器实现了以下MCP工具：

### 账户相关工具
- `okx_get_account_info` - 获取账户信息
- `okx_get_positions` - 获取持仓信息
- `okx_get_balance` - 获取账户余额

### 交易相关工具
- `okx_place_order` - 下单交易
- `okx_cancel_order` - 撤销订单
- `okx_get_orders` - 获取订单信息
- `okx_get_order_history` - 获取历史订单

### 市场数据工具
- `okx_get_ticker` - 获取行情数据
- `okx_get_kline` - 获取K线数据
- `okx_get_instruments` - 获取产品列表

### 资金相关工具
- `okx_get_deposit_address` - 获取充值地址
- `okx_get_deposit_history` - 获取充值记录
- `okx_withdraw` - 提币

## 项目结构

```
src/
├── app.js              # Express应用配置
├── index.js            # 服务器启动入口
├── server.js           # MCP服务器创建和工具注册
├── config/             # 配置文件
├── controllers/        # 控制器逻辑
├── middleware/         # 中间件
├── services/           # 服务层
├── tools/              # MCP工具实现
│   ├── accountTools.js
│   ├── fundingTools.js
│   ├── marketTools.js
│   └── tradeTools.js
└── utils/              # 工具函数
```

## MCP客户端接入

MCP客户端可以通过以下端点与服务器通信：

- `/mcp` - 主要的MCP请求端点
- `/sse` - 向后兼容的SSE端点
- `/messages` - 向后兼容的消息端点

使用标准MCP会话管理，包括会话ID和初始化请求。
