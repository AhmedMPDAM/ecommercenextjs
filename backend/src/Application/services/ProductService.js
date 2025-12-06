
class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getAllProducts(filters = {}) {
        const products = await this.productRepository.getAll();

        let filteredProducts = [...products];

        // Apply category filter
        if (filters.category) {
            filteredProducts = filteredProducts.filter(
                p => p.category.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // Apply price range filter
        if (filters.minPrice !== undefined) {
            filteredProducts = filteredProducts.filter(
                p => p.price >= parseFloat(filters.minPrice)
            );
        }

        if (filters.maxPrice !== undefined) {
            filteredProducts = filteredProducts.filter(
                p => p.price <= parseFloat(filters.maxPrice)
            );
        }

        // Apply sorting
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price_asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filteredProducts.sort((a, b) =>
                        (b.rating?.rate || 0) - (a.rating?.rate || 0)
                    );
                    break;
                default:
                    break;
            }
        }

        return filteredProducts.map(p => p.toJSON());
    }

    async getProductById(id) {
        if (!id) {
            const error = new Error('Product ID is required');
            error.statusCode = 400;
            throw error;
        }

        const product = await this.productRepository.getById(id);

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        return product.toJSON();
    }

    async getProductsByCategory(category) {
        if (!category) {
            const error = new Error('Category is required');
            error.statusCode = 400;
            throw error;
        }

        const products = await this.productRepository.getByCategory(category);
        return products.map(p => p.toJSON());
    }

    async getCategories() {
        const categories = await this.productRepository.getCategories();
        return categories;
    }

    async searchProducts(query) {
        if (!query || query.trim().length === 0) {
            const error = new Error('Search query is required');
            error.statusCode = 400;
            throw error;
        }

        const allProducts = await this.productRepository.getAll();
        const searchTerm = query.toLowerCase();

        const results = allProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

        return results.map(p => p.toJSON());
    }

    async createProduct(productData) {
        // Validate required fields
        if (!productData.title || !productData.price || !productData.category) {
            const error = new Error('Missing required fields: title, price, and category are required');
            error.statusCode = 400;
            throw error;
        }

        // Validate price
        if (productData.price <= 0) {
            const error = new Error('Price must be greater than 0');
            error.statusCode = 400;
            throw error;
        }

        const product = await this.productRepository.create(productData);
        return product.toJSON();
    }

    async updateProduct(id, productData) {
        if (!id) {
            const error = new Error('Product ID is required');
            error.statusCode = 400;
            throw error;
        }

        // Validate price if provided
        if (productData.price !== undefined && productData.price <= 0) {
            const error = new Error('Price must be greater than 0');
            error.statusCode = 400;
            throw error;
        }

        const product = await this.productRepository.update(id, productData);

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        return product.toJSON();
    }

    async deleteProduct(id) {
        if (!id) {
            const error = new Error('Product ID is required');
            error.statusCode = 400;
            throw error;
        }

        const result = await this.productRepository.delete(id);

        if (!result) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        return { message: 'Product deleted successfully' };
    }

    async createCategory(categoryData) {
        if (!categoryData.name) {
            const error = new Error('Category name is required');
            error.statusCode = 400;
            throw error;
        }

        const category = await this.productRepository.createCategory(categoryData);
        return category;
    }

    async updateCategory(id, categoryData) {
        if (!id) {
            const error = new Error('Category ID is required');
            error.statusCode = 400;
            throw error;
        }

        const category = await this.productRepository.updateCategory(id, categoryData);

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        return category;
    }

    async deleteCategory(id) {
        if (!id) {
            const error = new Error('Category ID is required');
            error.statusCode = 400;
            throw error;
        }

        const result = await this.productRepository.deleteCategory(id);

        if (!result) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        return { message: 'Category deleted successfully' };
    }
}

module.exports = ProductService;
