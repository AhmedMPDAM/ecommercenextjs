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

    async create(productData) {
        try {
            await this.db.initialize();
            const collection = this.db.getCollection(this.collectionName);

            // Get the highest ID to generate next ID
            const products = await collection.find().sort({ id: -1 }).limit(1).toArray();
            const nextId = products.length > 0 ? products[0].id + 1 : 1;

            const newProduct = {
                id: nextId,
                ...productData,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await collection.insertOne(newProduct);
            this.clearCache(); // Clear cache after creation

            return new Product({ ...newProduct, _id: result.insertedId });
        } catch (error) {
            console.error('Error creating product:', error.message);
            throw new Error('Failed to create product');
        }
    }

    async update(id, productData) {
        try {
            await this.db.initialize();
            const collection = this.db.getCollection(this.collectionName);

            const updateData = {
                ...productData,
                updatedAt: new Date()
            };

            // Remove fields that shouldn't be updated
            delete updateData.id;
            delete updateData._id;
            delete updateData.createdAt;

            const result = await collection.findOneAndUpdate(
                { id: parseInt(id) },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!result) {
                return null;
            }

            this.clearCache(); // Clear cache after update
            return new Product(result);
        } catch (error) {
            console.error('Error updating product:', error.message);
            throw new Error('Failed to update product');
        }
    }

    async delete(id) {
        try {
            await this.db.initialize();
            const collection = this.db.getCollection(this.collectionName);

            const result = await collection.deleteOne({ id: parseInt(id) });

            if (result.deletedCount === 0) {
                return null;
            }

            this.clearCache(); // Clear cache after deletion
            return true;
        } catch (error) {
            console.error('Error deleting product:', error.message);
            throw new Error('Failed to delete product');
        }
    }

    async createCategory(categoryData) {
        try {
            await this.db.initialize();
            const categoriesCollection = this.db.getCollection('categories');

            // Check if category already exists
            const existing = await categoriesCollection.findOne({ name: categoryData.name });
            if (existing) {
                const error = new Error('Category already exists');
                error.statusCode = 409;
                throw error;
            }

            const newCategory = {
                ...categoryData,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await categoriesCollection.insertOne(newCategory);
            this.clearCache();

            return { ...newCategory, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating category:', error.message);
            throw error;
        }
    }

    async updateCategory(id, categoryData) {
        try {
            await this.db.initialize();
            const categoriesCollection = this.db.getCollection('categories');
            const { ObjectId } = require('mongodb');

            const updateData = {
                ...categoryData,
                updatedAt: new Date()
            };

            delete updateData._id;
            delete updateData.createdAt;

            const result = await categoriesCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!result) {
                return null;
            }

            this.clearCache();
            return result;
        } catch (error) {
            console.error('Error updating category:', error.message);
            throw new Error('Failed to update category');
        }
    }

    async deleteCategory(id) {
        try {
            await this.db.initialize();
            const categoriesCollection = this.db.getCollection('categories');
            const { ObjectId } = require('mongodb');

            const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return null;
            }

            this.clearCache();
            return true;
        } catch (error) {
            console.error('Error deleting category:', error.message);
            throw new Error('Failed to delete category');
        }
    }

    clearCache() {

        this.cache.clear();
    }
}

module.exports = ProductRepository;

