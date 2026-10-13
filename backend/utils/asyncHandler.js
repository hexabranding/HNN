/**
 * Higher-order utility to wrap async route handlers and controllers.
 * Eliminates repetitive try-catch blocks and passes rejections to Express error middleware.
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
