const express = require('express');
const ProductController = require('../controllers/ProductController');
const ProductService = require('../../Application/services/ProductService');
const ProductRepository = require('../../Infrastructure/repositories/ProductRepository');
const { getDatabase } = require('../../Infrastructure/database/database');

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

module.exports = router;
