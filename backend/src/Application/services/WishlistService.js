const Wishlist = require('../../Domain/entities/Wishlist');

class WishlistService {
    constructor(wishlistRepository, userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
    }

    async addToWishlist(userId, productData) {
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

        // Check if product already in wishlist
        const existingItem = await this.wishlistRepository.findByUserIdAndProductId(
            userId,
            productData.productId
        );

        if (existingItem) {
            const error = new Error('Product already in wishlist');
            error.statusCode = 409;
            throw error;
        }

        // Prepare wishlist data
        const wishlistData = {
            userId: parseInt(userId),
            productId: parseInt(productData.productId),
            title: productData.title,
            image: productData.image,
            price: parseFloat(productData.price)
        };

        // Validate wishlist data
        const validation = Wishlist.validate(wishlistData);
        if (!validation.isValid) {
            const error = new Error(validation.errors.join(', '));
            error.statusCode = 400;
            throw error;
        }

        const newWishlistItem = await this.wishlistRepository.create(wishlistData);
        return newWishlistItem.toJSON();
    }

    async getWishlistByUserId(userId) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const wishlist = await this.wishlistRepository.findByUserId(userId);
        return wishlist.map(w => w.toJSON());
    }

    async removeFromWishlist(wishlistId) {
        if (!wishlistId) {
            const error = new Error('Wishlist ID is required');
            error.statusCode = 400;
            throw error;
        }

        const wishlistItem = await this.wishlistRepository.findById(wishlistId);

        if (!wishlistItem) {
            const error = new Error('Wishlist item not found');
            error.statusCode = 404;
            throw error;
        }

        await this.wishlistRepository.delete(wishlistId);
        return { message: 'Item removed from wishlist successfully' };
    }

    async clearWishlist(userId) {
        if (!userId) {
            const error = new Error('User ID is required');
            error.statusCode = 400;
            throw error;
        }

        const wishlist = await this.wishlistRepository.findByUserId(userId);

        for (const item of wishlist) {
            await this.wishlistRepository.delete(item.id);
        }

        return { message: 'Wishlist cleared successfully' };
    }
}

module.exports = WishlistService;
