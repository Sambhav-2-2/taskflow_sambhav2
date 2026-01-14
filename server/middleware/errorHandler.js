/**
 * Error handling middleware
 */

// Not found handler
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
    }

    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    }

    // SQLite constraint errors
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        statusCode = 409;
        message = 'A record with this value already exists';
    }

    if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        statusCode = 400;
        message = 'Invalid reference to related record';
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    });
};

module.exports = { notFound, errorHandler };
