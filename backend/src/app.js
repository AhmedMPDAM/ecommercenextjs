const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./Domain/middleware/errorMiddleware');

// Import routes
const authRoutes = require('./Presentation/routes/authRoutes');
const userRoutes = require('./Presentation/routes/userRoutes');
const profileRoutes = require('./Presentation/routes/profileRoutes');
const orderRoutes = require('./Presentation/routes/orderRoutes');
const wishlistRoutes = require('./Presentation/routes/wishlistRoutes');
const productRoutes = require('./Presentation/routes/productRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
