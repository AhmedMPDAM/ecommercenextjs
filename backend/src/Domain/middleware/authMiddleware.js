const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('No token provided');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-super-secret-change-me');

        // Add user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            const err = new Error('Invalid token');
            err.statusCode = 401;
            return next(err);
        }
        if (error.name === 'TokenExpiredError') {
            const err = new Error('Token expired');
            err.statusCode = 401;
            return next(err);
        }
        next(error);
    }
};

module.exports = authMiddleware;
