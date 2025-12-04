
/**
 * Validation middleware factory
 * @param {Function} validationFn - Function that validates the request data
 * @returns {Function} Express middleware
 */
const validate = (validationFn) => {
    return (req, res, next) => {
        try {
            const result = validationFn(req.body);

            if (!result.isValid) {
                const error = new Error(result.errors.join(', '));
                error.statusCode = 400;
                throw error;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Validate email format
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate required fields
 */
const validateRequiredFields = (data, fields) => {
    const errors = [];

    fields.forEach(field => {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim().length === 0)) {
            errors.push(`${field} is required`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validate,
    validateEmail,
    validateRequiredFields
};
