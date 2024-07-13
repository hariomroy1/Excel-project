const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    try {
      // Execute the request handler and handle any potential asynchronous errors
      Promise.resolve(requestHandler(req, res, next)).catch((error) => {
        // Pass the error to the next middleware in the Express middleware chain
        next(error);
      });
    } catch (error) {
      // Pass synchronous errors to the Express error handler middleware
      next(error);
    }
  };
};

export { asyncHandler };


