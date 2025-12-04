const IOrderRepository = require('../../Domain/repositories/IOrderRepository');
const Order = require('../../Domain/entities/Order');
const { getDatabase } = require('../database/database');

class OrderRepository extends IOrderRepository {
    constructor() {
        super();
        this.db = getDatabase();
        this.collectionName = 'orders';
    }

    async findById(id) {
        await this.db.initialize();
        const order = await this.db.findInCollection(this.collectionName, o => o.id === parseInt(id));
        return order ? new Order(order) : null;
    }

    async findByUserId(userId) {
        await this.db.initialize();
        const orders = await this.db.filterCollection(this.collectionName, o => o.userId === parseInt(userId));
        return orders.map(o => new Order(o));
    }

    async create(orderData) {
        await this.db.initialize();
        const newOrder = await this.db.addToCollection(this.collectionName, orderData);
        return new Order(newOrder);
    }

    async update(id, orderData) {
        await this.db.initialize();
        const updatedOrder = await this.db.updateInCollection(this.collectionName, parseInt(id), orderData);
        return updatedOrder ? new Order(updatedOrder) : null;
    }

    async updateStatus(id, status) {
        await this.db.initialize();
        const updatedOrder = await this.db.updateInCollection(this.collectionName, parseInt(id), { status });
        return updatedOrder ? new Order(updatedOrder) : null;
    }

    async delete(id) {
        await this.db.initialize();
        return await this.db.deleteFromCollection(this.collectionName, parseInt(id));
    }

    async getAll() {
        await this.db.initialize();
        const orders = this.db.getCollection(this.collectionName);
        return orders.map(o => new Order(o));
    }
}

module.exports = OrderRepository;
