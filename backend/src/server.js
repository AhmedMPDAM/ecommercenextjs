require('dotenv').config();
const app = require('./app');
const { getDatabase } = require('./Infrastructure/database/database');
const { createIndexes } = require('./Infrastructure/database/models');
const { getMongoClient } = require('./Infrastructure/database/mongoClient');

// Configuration
const PORT = process.env.BACKEND_PORT || 5000;

// Initialize database
const initializeDatabase = async () => {
    try {
        const db = getDatabase();
        await db.initialize();

        // Create indexes for better query performance
        const mongoClient = getMongoClient();
        await createIndexes(mongoClient.getDatabase());

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize database:', error.message);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        await initializeDatabase();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log("✅ Started successfully");
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                console.log('HTTP server closed');

                try {
                    const db = getDatabase();
                    await db.close();
                    console.log('✅ Graceful shutdown completed');
                    process.exit(0);
                } catch (error) {
                    console.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Start the server
startServer();

