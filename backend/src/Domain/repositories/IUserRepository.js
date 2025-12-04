/**
 * User Repository Interface
 * Defines the contract for user data operations
 */
class IUserRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findByEmail(email) {
        throw new Error('Method not implemented');
    }

    async create(userData) {
        throw new Error('Method not implemented');
    }

    async update(id, userData) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async getAll() {
        throw new Error('Method not implemented');
    }
}

module.exports = IUserRepository;
