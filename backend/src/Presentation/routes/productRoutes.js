const express = require('express');
const ProductController = require('../controllers/ProductController');
const ProductService = require('../../Application/services/ProductService');
const ProductRepository = require('../../Infrastructure/repositories/ProductRepository');
const { getDatabase } = require('../../Infrastructure/database/database');
const authMiddleware = require('../../Domain/middleware/authMiddleware');

const router = express.Router();

// Initialize dependencies
const db = getDatabase();
const productRepository = new ProductRepository(db);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Routes (public - no authentication required)
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Protected routes (auth removed for testing)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Category management routes (auth removed for testing)
router.post('/categories', productController.createCategory);
router.put('/categories/:id', productController.updateCategory);
router.delete('/categories/:id', productController.deleteCategory);

module.exports = router;
