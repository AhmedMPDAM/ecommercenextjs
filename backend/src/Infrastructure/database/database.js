const { getMongoClient } = require('./mongoClient');
const { COLLECTIONS } = require('./models');

class Database {
    constructor() {
        this.mongoClient = getMongoClient();
        this.db = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            const mongoUri = process.env.MONGODB_URI;
            if (!mongoUri) {
                throw new Error('MONGODB_URI environment variable is not set');
            }

            this.db = await this.mongoClient.connect(mongoUri);
            this.isInitialized = true;
            console.log('✅ Database initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize database:', error.message);
            throw error;
        }
    }

    getCollection(collectionName) {
        if (!this.isInitialized || !this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db.collection(collectionName);
    }

    async addToCollection(collectionName, item) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const collection = this.getCollection(collectionName);

        // Generate new ID
        const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray();
        const maxId = lastItem.length > 0 ? lastItem[0].id : 0;
        item.id = maxId + 1;

        await collection.insertOne(item);
        return item;
    }

    async updateInCollection(collectionName, id, updatedItem) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const collection = this.getCollection(collectionName);

        const result = await collection.findOneAndUpdate(
            { id: id },
            { $set: { ...updatedItem, id } },
            { returnDocument: 'after' }
        );

        return result;
    }

    async deleteFromCollection(collectionName, id) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const collection = this.getCollection(collectionName);
        const result = await collection.deleteOne({ id: id });

        return result.deletedCount > 0;
    }

    async findInCollection(collectionName, predicate) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const collection = this.getCollection(collectionName);

        const items = await collection.find().toArray();
        return items.find(predicate);
    }

    async filterCollection(collectionName, predicate) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const collection = this.getCollection(collectionName);

        const items = await collection.find().toArray();
        return items.filter(predicate);
    }

    async updateCollection(collectionName, items) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const collection = this.getCollection(collectionName);

        await collection.deleteMany({});
        if (items.length > 0) {
            await collection.insertMany(items);
        }
    }

    async close() {
        if (this.mongoClient) {
            await this.mongoClient.close();
            this.isInitialized = false;
        }
    }
}

let dbInstance = null;

function getDatabase() {
    if (!dbInstance) {
        dbInstance = new Database();
    }
    return dbInstance;
}

module.exports = { Database, getDatabase, COLLECTIONS };
