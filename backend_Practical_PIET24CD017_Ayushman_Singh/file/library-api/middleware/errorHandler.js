// 404 for unknown routes
function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// Simple error-handling middleware (4 arguments)
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Bad JSON body / invalid ObjectId / schema validation -> 400
  if (err.type === 'entity.parse.failed' || err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { notFound, errorHandler };
