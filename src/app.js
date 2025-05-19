const express = require('express');
const { randomUUID } = require('crypto');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { isInitializeRequest } = require('@modelcontextprotocol/sdk/types.js');
const { createServer } = require('./server.js');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');
const { globalErrorHandler } = require('./middleware/errorHandler');
const { mcpErrorResponse } = require('./utils/mcpResponse');

const app = express();
app.use(express.json());

// 使用原有的请求日志中间件
app.use(requestLogger);

// 创建MCP服务器
const server = createServer();

const transports = {
  streamable: {},
  sse: {}
};

// 处理客户端到服务器的POST请求
app.post('/mcp', async (req, res) => {
  // 添加CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');
  
  // 检查是否存在会话ID
  const sessionId = req.headers['mcp-session-id'];
  let transport;

  try {
    if (sessionId && transports.streamable[sessionId]) {
      // 重用现有的传输
      transport = transports.streamable[sessionId];
      console.log(`处理MCP请求，会话ID: ${transport.sessionId || '无'}`);
      await transport.handleRequest(req, res, req.body);
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // 新的初始化请求
      console.log("收到初始化请求...");
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          // 按会话ID存储传输
          console.log(`初始化会话ID: ${sessionId}`);
          transports.streamable[sessionId] = transport;
        }
      });

      // 传输关闭时进行清理
      transport.onclose = () => {
        if (transport.sessionId) {
          console.log(`关闭会话: ${transport.sessionId}`);
          delete transports.streamable[transport.sessionId];
        }
      };

      // 连接到MCP服务器
      await server.connect(transport);
      console.log("已连接到MCP服务器");
      
      // 处理请求
      console.log(`处理MCP请求，会话ID: ${transport.sessionId || '无'}`);
      await transport.handleRequest(req, res, req.body);
    } else {
      // 无效请求
      console.log("收到无效请求: 缺少会话ID");
      res.status(400).json(mcpErrorResponse(
        'MCP_BAD_REQUEST',
        'No valid session ID provided'
      ));
    }
  } catch (error) {
    console.error("MCP请求处理错误:", error);
    if (!res.headersSent) {
      res.status(500).json(mcpErrorResponse(
        'MCP_SERVER_ERROR',
        `Internal server error: ${error.message || 'Unknown error'}`
      ));
    }
  }
});

// OPTIONS请求处理 - 用于CORS预检请求
app.options('/mcp', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');
  res.status(200).end();
});

// GET请求处理
app.get('/mcp', (req, res) => {
  console.log('收到GET MCP请求');
  res.writeHead(405).end(JSON.stringify(mcpErrorResponse(
    'METHOD_NOT_ALLOWED',
    'Method not allowed.'
  )));
});

// DELETE请求处理
app.delete('/mcp', (req, res) => {
  console.log('收到DELETE MCP请求');
  res.writeHead(405).end(JSON.stringify(mcpErrorResponse(
    'METHOD_NOT_ALLOWED',
    'Method not allowed.'
  )));
});

// 为旧客户端提供的SSE端点
app.get('/sse', async (req, res) => {
  // 为旧客户端创建SSE传输
  const transport = new SSEServerTransport('/messages', res);
  transports.sse[transport.sessionId] = transport;
  
  res.on("close", () => {
    delete transports.sse[transport.sessionId];
  });
  
  await server.connect(transport);
});

// 为旧客户端提供的消息端点
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports.sse[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    res.status(400).json(mcpErrorResponse(
      'INVALID_SESSION',
      'No transport found for sessionId'
    ));
  }
});

// 添加健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json(mcpErrorResponse(
    'NOT_FOUND',
    `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`
  ));
});

// 使用原有的错误处理中间件
app.use(globalErrorHandler);

// 导出app实例供启动脚本使用
module.exports = app;