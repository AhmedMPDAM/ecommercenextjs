/**
 * Profile Repository Interface
 * Defines the contract for profile data operations
 */
class IProfileRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findByUserId(userId) {
        throw new Error('Method not implemented');
    }

    async create(profileData) {
        throw new Error('Method not implemented');
    }

    async update(userId, profileData) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async getAll() {
        throw new Error('Method not implemented');
    }
}

module.exports = IProfileRepository;
