const Product = require('../../Domain/entities/Product');

class ProductRepository {
    constructor(database) {
        this.db = database;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.collectionName = 'products';
    }

    _getCacheKey(key) {
        return key;
    }

    _isCacheValid(cacheEntry) {
        if (!cacheEntry) return false;
        return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
    }

    _setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    _getCache(key) {
        const cacheEntry = this.cache.get(key);
        if (this._isCacheValid(cacheEntry)) {
            return cacheEntry.data;
        }
        this.cache.delete(key);
        return null;
    }

    async getAll() {
        const cacheKey = this._getCacheKey('all_products');
        const cached = this._getCache(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            await this.db.initialize();
            const collection = this.db.getCollection(this.collectionName);
            const productsData = await collection.find().toArray();
            const products = productsData.map(p => new Product(p));
            this._setCache(cacheKey, products);
            return products;
        } catch (error) {
            console.error('Error fetching products from database:', error.message);
            throw new Error('Failed to fetch products from database');
        }
    }

    async getById(id) {
        const cacheKey = this._getCacheKey(`product_${id}`);
        const cached = this._getCache(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            await this.db.initialize();
            const collection = this.db.getCollection(this.collectionName);
            const productData = await collection.findOne({ id: parseInt(id) });

            if (!productData) {
                return null;
            }

            const product = new Product(productData);
            this._setCache(cacheKey, product);
            return product;
        } catch (error) {
            console.error('Error fetching product from database:', error.message);
            throw new Error('Failed to fetch product from database');
        }
    }

    async getByCategory(category) {
        const cacheKey = this._getCacheKey(`category_${category}`);
        const cached = this._getCache(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            await this.db.initialize();
            const collection = this.db.getCollection(this.collectionName);
            const productsData = await collection.find({ category: category }).toArray();
            const products = productsData.map(p => new Product(p));
            this._setCache(cacheKey, products);
            return products;
        } catch (error) {
            console.error('Error fetching products by category from database:', error.message);
            throw new Error('Failed to fetch products by category from database');
        }
    }

    async getCategories() {
        const cacheKey = this._getCacheKey('categories');
        const cached = this._getCache(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            await this.db.initialize();
            const categoriesCollection = this.db.getCollection('categories');
            const categories = await categoriesCollection.find().toArray();
            this._setCache(cacheKey, categories);
            return categories;
        } catch (error) {
            console.error('Error fetching categories from database:', error.message);
            throw new Error('Failed to fetch categories from database');
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

module.exports = ProductRepository;

