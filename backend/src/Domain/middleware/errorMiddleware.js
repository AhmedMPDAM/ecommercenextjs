
const errorMiddleware = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', err);

    // Default error values
    let statusCode = err.statusCode || 500;
    let status = err.status || 'error';
    let message = err.message || 'Internal server error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        status = 'fail';
        message = err.message;
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        status = 'fail';
        message = 'Invalid data format';
    }

    // Send error response
    res.status(statusCode).json({
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorMiddleware;
