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

// Use existing request logger middleware
app.use(requestLogger);

// Create MCP server
const server = createServer();

const transports = {
  streamable: {},
  sse: {}
};

// Handle client-to-server POST requests
app.post('/mcp', async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');
  
  // Check if session ID exists
  const sessionId = req.headers['mcp-session-id'];
  let transport;

  try {
    if (sessionId && transports.streamable[sessionId]) {
      // Reuse existing transport
      transport = transports.streamable[sessionId];
      console.log(`Processing MCP request, session ID: ${transport.sessionId || 'none'}`);
      await transport.handleRequest(req, res, req.body);
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      console.log("Received initialization request...");
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          // Store transport by session ID
          console.log(`Initialized session ID: ${sessionId}`);
          transports.streamable[sessionId] = transport;
        }
      });

      // Clean up when transport closes
      transport.onclose = () => {
        if (transport.sessionId) {
          console.log(`Closing session: ${transport.sessionId}`);
          delete transports.streamable[transport.sessionId];
        }
      };

      // Connect to MCP server
      await server.connect(transport);
      console.log("Connected to MCP server");
      
      // Handle request
      console.log(`Processing MCP request, session ID: ${transport.sessionId || 'none'}`);
      await transport.handleRequest(req, res, req.body);
    } else {
      // Invalid request
      console.log("Received invalid request: Missing session ID");
      res.status(400).json(mcpErrorResponse(
        'MCP_BAD_REQUEST',
        'No valid session ID provided'
      ));
    }
  } catch (error) {
    console.error("MCP request processing error:", error);
    if (!res.headersSent) {
      res.status(500).json(mcpErrorResponse(
        'MCP_SERVER_ERROR',
        `Internal server error: ${error.message || 'Unknown error'}`
      ));
    }
  }
});

// OPTIONS request handling - for CORS preflight requests
app.options('/mcp', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');
  res.status(200).end();
});

// GET request handling
app.get('/mcp', (req, res) => {
  console.log('Received GET MCP request');
  res.writeHead(405).end(JSON.stringify(mcpErrorResponse(
    'METHOD_NOT_ALLOWED',
    'Method not allowed.'
  )));
});

// DELETE request handling
app.delete('/mcp', (req, res) => {
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(JSON.stringify(mcpErrorResponse(
    'METHOD_NOT_ALLOWED',
    'Method not allowed.'
  )));
});

// SSE endpoint for legacy clients
app.get('/sse', async (req, res) => {
  // Create SSE transport for legacy clients
  const transport = new SSEServerTransport('/messages', res);
  transports.sse[transport.sessionId] = transport;
  
  res.on("close", () => {
    delete transports.sse[transport.sessionId];
  });
  
  await server.connect(transport);
});

// Message endpoint for legacy clients
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

// Add health check endpoint
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

// Use existing error handling middleware
app.use(globalErrorHandler);

// Export app instance for startup script
module.exports = app;