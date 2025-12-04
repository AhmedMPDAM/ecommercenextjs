const { MongoClient } = require('mongodb');

class MongoDBClient {
    constructor() {
        this.client = null;
        this.db = null;
        this.isConnected = false;
    }

    async connect(uri, dbName = 'ecommerce') {
        if (this.isConnected) {
            console.log('✅ Already connected to MongoDB');
            return this.db;
        }

        try {
            console.log('🔄 Connecting to MongoDB...');

            this.client = new MongoClient(uri, {
                maxPoolSize: 10,
                minPoolSize: 2,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            await this.client.connect();

            // Verify connection
            await this.client.db('admin').command({ ping: 1 });

            this.db = this.client.db(dbName);
            this.isConnected = true;

            console.log(`✅ Successfully connected to MongoDB database: ${dbName}`);
            return this.db;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error.message);
            throw new Error(`Failed to connect to MongoDB: ${error.message}`);
        }
    }

    getDatabase() {
        if (!this.isConnected || !this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db;
    }

    getCollection(collectionName) {
        return this.getDatabase().collection(collectionName);
    }

    async close() {
        if (this.client && this.isConnected) {
            await this.client.close();
            this.isConnected = false;
            console.log('✅ MongoDB connection closed');
        }
    }

    isHealthy() {
        return this.isConnected;
    }
}

// Singleton instance
let mongoClientInstance = null;

function getMongoClient() {
    if (!mongoClientInstance) {
        mongoClientInstance = new MongoDBClient();
    }
    return mongoClientInstance;
}

module.exports = { MongoDBClient, getMongoClient };
