const Order = require('../../Domain/entities/Order');

class OrderService {
    constructor(orderRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    async createOrder(userId, orderData) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        // Check if user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Prepare order data
        const newOrderData = {
            userId: parseInt(userId),
            status: orderData.status || 'Placed',
            date: orderData.date || new Date().toLocaleDateString('en-US'),
            items: orderData.lineItems ? orderData.lineItems.length : 0,
            total: 0,
            lineItems: orderData.lineItems || [],
            shipping: orderData.shipping
        };

        // Validate order
        const validation = Order.validate(newOrderData);
        if (!validation.isValid) {
            const error = new Error(validation.errors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        // Calculate total
        const order = new Order(newOrderData);
        newOrderData.total = orderData.total || order.calculateTotal();

        const createdOrder = await this.orderRepository.create(newOrderData);
        return createdOrder.toJSON();
    }

    async getOrdersByUserId(userId) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const orders = await this.orderRepository.findByUserId(userId);
        return orders.map(o => o.toJSON());
    }

    async getOrderById(orderId) {
        if (!orderId) {
            const error = new Error('Order ID is required');
            error.statusCode = 400;
            throw error;
        }

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        return order.toJSON();
    }

    async updateOrderStatus(orderId, status) {
        if (!orderId) {
            const error = new Error('Order ID is required');
            error.statusCode = 400;
            throw error;
        }

        if (!Order.validateStatus(status)) {
            const error = new Error(`Invalid status. Must be one of: ${Order.VALID_STATUSES.join(', ')}`);
            error.statusCode = 400;
            throw error;
        }

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        const updatedOrder = await this.orderRepository.updateStatus(orderId, status);
        return updatedOrder.toJSON();
    }

    async getAllOrders() {
        const orders = await this.orderRepository.getAll();
        return orders.map(o => o.toJSON());
    }

    async deleteOrder(orderId) {
        if (!orderId) {
            const error = new Error('Order ID is required');
            error.statusCode = 400;
            throw error;
        }

        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            throw new NotFoundError('Order not found');
        }

        await this.orderRepository.delete(orderId);
        return { message: 'Order deleted successfully' };
    }
}

module.exports = OrderService;
