/**
 * Wishlist Repository Interface
 * Defines the contract for wishlist data operations
 */
class IWishlistRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findByUserId(userId) {
        throw new Error('Method not implemented');
    }

    async findByUserIdAndProductId(userId, productId) {
        throw new Error('Method not implemented');
    }

    async create(wishlistData) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async getAll() {
        throw new Error('Method not implemented');
    }
}

module.exports = IWishlistRepository;
