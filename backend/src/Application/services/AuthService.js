const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Domain/entities/User');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(email, password) {
        // Validate input
        if (!email || !User.validateEmail(email)) {
            const error = new Error('Valid email is required');
            error.statusCode = 400;
            throw error;
        }

        if (!password || !User.validatePassword(password)) {
            const error = new Error('Password must be at least 6 characters');
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await this.userRepository.create({
            email,
            password: hashedPassword
        });

        // Generate token
        const token = this._generateToken(newUser);

        return {
            user: newUser.toSafeJSON(),
            token
        };
    }

    async login(email, password) {
        // Validate input
        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.statusCode = 400;
            throw error;
        }

        // Find user
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        // Generate token
        const token = this._generateToken(user);

        return {
            user: user.toSafeJSON(),
            token
        };
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-super-secret-change-me');
            const user = await this.userRepository.findById(decoded.id);

            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 401;
                throw error;
            }

            return user.toSafeJSON();
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                const err = new Error('Invalid or expired token');
                err.statusCode = 401;
                throw err;
            }
            throw error;
        }
    }

    _generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'dev-super-secret-change-me',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
    }
}

module.exports = AuthService;
