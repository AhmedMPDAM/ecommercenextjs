const express = require('express');
const OrderController = require('../controllers/OrderController');
const OrderService = require('../../Application/services/OrderService');
const OrderRepository = require('../../Infrastructure/repositories/OrderRepository');
const UserRepository = require('../../Infrastructure/repositories/UserRepository');
const authMiddleware = require('../../Domain/middleware/authMiddleware');

const router = express.Router();

// Initialize dependencies
const orderRepository = new OrderRepository();
const userRepository = new UserRepository();
const orderService = new OrderService(orderRepository, userRepository);
const orderController = new OrderController(orderService);

// Routes (all protected)
router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
