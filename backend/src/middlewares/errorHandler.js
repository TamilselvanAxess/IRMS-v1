import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'irms-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB duplicate key errors
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value for ${field}: ${value}. Please use another value.`;
  
  return new AppError(message, 400);
};

/**
 * Handle MongoDB validation errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => error.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  
  return new AppError(message, 400);
};

/**
 * Handle MongoDB cast errors
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  
  return new AppError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

/**
 * Handle JWT expiration errors
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Handle Joi validation errors
 */
const handleJoiValidationError = (err) => {
  const errors = err.details.map(detail => detail.message);
  const message = `Validation failed: ${errors.join('. ')}`;
  
  return new AppError(message, 400);
};

/**
 * Main error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  } else if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  } else if (err.name === 'CastError') {
    error = handleCastError(err);
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  } else if (err.isJoi) {
    error = handleJoiValidationError(err);
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Development error response (with stack trace)
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        stack: err.stack,
        ...(error.errors && { errors: error.errors })
      }
    });
  }

  // Production error response (without stack trace)
  if (error.isOperational) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        ...(error.errors && { errors: error.errors })
      }
    });
  }

  // Programming or unknown errors
  return res.status(500).json({
    success: false,
    error: {
      message: 'Something went wrong',
      statusCode: 500
    }
  });
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export default errorHandler;
  