import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      500,
      error.message || "Internal Server Error"
    );
  }

  // Final response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    // optional (useful in development)
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default errorMiddleware;