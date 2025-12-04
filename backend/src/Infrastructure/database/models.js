// MongoDB Collection Names
const COLLECTIONS = {
    USERS: 'users',
    PROFILES: 'profiles',
    ORDERS: 'orders',
    WISHLISTS: 'wishlists',
    PRODUCTS: 'products',
    CATEGORIES: 'categories'
};

// Helper function to create indexes for collections
async function createIndexes(db) {
    try {
        // Users collection indexes
        await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
        await db.collection(COLLECTIONS.USERS).createIndex({ id: 1 }, { unique: true });

        // Profiles collection indexes
        await db.collection(COLLECTIONS.PROFILES).createIndex({ userId: 1 }, { unique: true });
        await db.collection(COLLECTIONS.PROFILES).createIndex({ id: 1 }, { unique: true });

        // Orders collection indexes
        await db.collection(COLLECTIONS.ORDERS).createIndex({ userId: 1 });
        await db.collection(COLLECTIONS.ORDERS).createIndex({ id: 1 }, { unique: true });
        await db.collection(COLLECTIONS.ORDERS).createIndex({ status: 1 });

        // Wishlists collection indexes
        await db.collection(COLLECTIONS.WISHLISTS).createIndex({ userId: 1 });
        await db.collection(COLLECTIONS.WISHLISTS).createIndex({ id: 1 }, { unique: true });
        await db.collection(COLLECTIONS.WISHLISTS).createIndex({ userId: 1, productId: 1 });

        // Products collection indexes
        await db.collection(COLLECTIONS.PRODUCTS).createIndex({ id: 1 }, { unique: true });
        await db.collection(COLLECTIONS.PRODUCTS).createIndex({ category: 1 });

        console.log('✅ Database indexes created successfully');
    } catch (error) {
        // Ignore duplicate key errors (indexes already exist)
        if (error.code !== 11000) {
            console.warn('⚠️ Warning creating indexes:', error.message);
        }
    }
}

module.exports = {
    COLLECTIONS,
    createIndexes
};
