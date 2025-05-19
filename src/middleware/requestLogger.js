const config = require('../config');

function requestLogger(req, res, next) {
  if (config.log.level === 'info' || config.log.level === 'debug') {
    const startTime = process.hrtime();
    console.log(`MCP Request IN <-- ${req.method} ${req.originalUrl} from ${req.ip}`);
    if (config.log.level === 'debug' && Object.keys(req.body).length > 0) {
        console.debug(`MCP Request Body: ${JSON.stringify(req.body)}`);
    }

    res.on('finish', () => {
      const diff = process.hrtime(startTime);
      const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3); // milliseconds
      console.log(`MCP Response OUT --> ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
  }
  next();
}

module.exports = requestLogger;