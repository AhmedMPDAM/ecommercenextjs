/**
 * Order Repository Interface
 * Defines the contract for order data operations
 */
class IOrderRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findByUserId(userId) {
        throw new Error('Method not implemented');
    }

    async create(orderData) {
        throw new Error('Method not implemented');
    }

    async update(id, orderData) {
        throw new Error('Method not implemented');
    }

    async updateStatus(id, status) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async getAll() {
        throw new Error('Method not implemented');
    }
}

module.exports = IOrderRepository;
