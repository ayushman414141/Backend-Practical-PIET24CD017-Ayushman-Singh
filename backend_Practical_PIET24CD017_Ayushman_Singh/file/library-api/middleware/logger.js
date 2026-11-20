// Logger middleware: prints the method and URL of every request
module.exports = function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
